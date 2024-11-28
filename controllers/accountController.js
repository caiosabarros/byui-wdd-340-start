const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
accountController = {}
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

accountController.buildRegistration = async function (req, res, next) {
    let nav = await utilities.getNav()
    let form = await utilities.buildRegistrationFormView()
    res.render("account/register", {
        title: "Sign Up",
        nav,
        form,
        errors: null,
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
accountController.registerAccount = async function (req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    console.log("DEBUG", "registerAccount")
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
    console.log("DEBUG hashedPassword", hashedPassword)

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    console.log("DEBUG regResult", regResult)

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

module.exports = accountController;