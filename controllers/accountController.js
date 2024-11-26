const utilities = require("../utilities/")
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


module.exports = accountController