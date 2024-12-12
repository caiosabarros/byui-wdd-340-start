const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { localsName } = require("ejs")
require("dotenv").config()
accountController = {}

accountController.buildAdminManagement = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        // get all the accounts
        const accounts = await accountModel.getAllAccounts()
        res.render("./account/admin", {
            title: "Admin Accounts Management",
            nav,
            accounts,
            errors: null,
        })
    } catch (error) {
        console.error("Error ", error.message)
        next(error)
    }
}

accountController.deleteAccount = async function (req, res, next) {
    try {
        let accountId = parseInt(req.params.accountId)
        let nav = await utilities.getNav()
        // delete account
        const accountDeleted = await accountModel.deleteAccount(accountId)
        // get all the accounts less the deleted
        const accounts = await accountModel.getAllAccounts()
        req.flash("success", `Account for ${accountDeleted.account_firstname + ' ' + accountDeleted.account_lastname} was successfully deleted.`)
        res.render("./account/admin", {
            title: "Admin Accounts Management",
            nav,
            accounts,
            errors: null,
        })
    } catch (error) {
        next(error)
    }
}

/* ****************************************
*  Deliver login view
* *************************************** */
accountController.buildLogin = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}


accountController.logOutUser = async function (req, res, next) {
    if (req.cookies.jwt) {
        res.clearCookie("jwt")
        // clear account info from the server
        res.locals.accountData = {}
        res.locals.loggedin = 0
        return res.redirect("/account/login")
    }
}

/* ****************************************
 *  Process login request
 * ************************************ */
accountController.deliverAccountManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/management", {
        title: 'Logged In',
        nav,
        errors: null
    })
}

accountController.getUpdateAccountView = async function (req, res, next) {
    let nav = await utilities.getNav()
    // get account info by its id
    try {
        const account_id = parseInt(req.params.accountId)
        let accountData = await accountModel.getAccountById(account_id)
        res.locals.accountData = accountData

        res.render("account/update", {
            title: "Update Account Information",
            nav,
            accountData,
            errors: null
        })
    } catch (error) {
        next(error)
    }

}

/* ***************************
 *  Update Account Data
 * ************************** */
accountController.updateAccountView = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {
        account_firstname,
        account_lastname,
        account_email,
        account_id
    } = req.body

    // updateResult already has updated data due to RETURNING * statement, so we don't need to fetch it again
    const updateResult = await accountModel.updateAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_id
    )
    if (updateResult) {
        res.locals.accountData = updateResult
        req.flash("success", `Information for ${updateResult.account_firstname + ' ' + updateResult.account_lastname} was successfully updated.`)
        res.render("account/management", { title: 'Updated Information', errors: null, nav })
    } else {
        const accountData = await accountModel.getAccountByEmail(account_email)
        if (!accountData) {
            req.flash("notice", "Sorry, the updating your account failed.")
            res.status(500).render("account/login", {
                title: "Update Account",
                nav,
                errors: null,
                account_email,
            })
            return
        }
    }
}

accountController.buildRegistration = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Sign Up",
        nav,
        errors: null,
    })
}


/* ***************************
 *  Update Account Password
 * ************************** */
accountController.passwordUpdateHandler = async function (req, res, next) {
    let nav = await utilities.getNav()
    const { account_id, account_password } = req.body
    // fetch account info here to handle success or failure
    let accountData = await accountModel.getAccountById(account_id)

    // Hash the password before storing
    let hashedPassword = ''
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        res.locals.accountData = accountData
        req.flash("notice", 'Sorry, there was an error updating the password.')
        res.status(500).render("account/management", {
            title: "Update Information",
            nav,
            errors: null,
        })
    }

    // make actual change
    try {
        accountData = await accountModel.updatePassword(account_id, account_password)
        console.log("accou", accountData)
    } catch (error) {
        console.error('error ' + error)
    }

    res.locals.accountData = accountData
    if (accountData) {
        req.flash(
            "success",
            `Congratulations, your password has been changed!`
        )

        res.status(201).render("account/management", {
            title: "Update Information",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, the update of the password failed.")
        res.status(501).render("account/management", {
            title: "Update Information",
            nav
        })
    }
}

/* ****************************************
*  Process Registration
* *************************************** */
accountController.registerAccount = async function (req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    // Hash the password before storing
    let hashedPassword = ''
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )


    if (regResult) {
        req.flash(
            "success",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )

        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav
        })
    }
}

/* ****************************************
 *  Process login request
 * ************************************ */
accountController.accountLogin = async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
            if (process.env.NODE_ENV === 'development') {
                // a new cookie is created, named "jwt", the JWT token is stored in the cookie, and the options of "httpOnly: true" and "maxAge: 3600 * 1000" are set. This means that the cookie can only be passed through the HTTP protocol and cannot be accessed by client-side JavaScript. It will also expire in 1 hour.
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }
            return res.redirect("/account/")
        }
        else {
            req.flash("message notice", "Please check your credentials and try again.")
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
            })
        }
    } catch (error) {
        throw new Error('Access Forbidden')
    }
}

module.exports = accountController;