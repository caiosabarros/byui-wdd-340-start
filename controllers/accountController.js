const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
accountController = {}
/* ****************************************
*  Deliver login view
* *************************************** */
accountController.buildLogin = async function (req, res, next) {
    let nav = await utilities.getNav()
    let form = await utilities.buildLoginFormView()
    res.render("account/login", {
        title: "Login",
        nav,
        form
    })
}

accountController.buildRegistration = async function (req, res, next) {
    let nav = await utilities.getNav()
    let form = await utilities.buildRegistrationFormView()
    res.render("account/register", {
        title: "Sign Up",
        nav,
        form
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
accountController.registerAccount = async function (req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )

        const form = await utilities.buildLoginFormView();
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            form
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
        })
    }
}

module.exports = accountController;