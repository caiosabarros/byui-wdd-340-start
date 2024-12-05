// Needed Resources 
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Route for the path that will be sent when the "My Account" link is clicked.
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegistration));
// account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.deliverAccountManagement));
router.get('/update/:accountId', utilities.handleErrors(accountController.getUpdateAccountView));
router.post('/update', regValidate.updateRules(), regValidate.checkUpdateData, utilities.handleErrors(accountController.updateAccountView));
router.post('/password', regValidate.passwordRules(), regValidate.checkUpdatePassword, utilities.handleErrors(accountController.passwordUpdateHandler));

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(), //  The function containing the rules to be used in the validation process.
    regValidate.checkRegData, //  The call to run the validation and handle the errors, if any.
    utilities.handleErrors(accountController.registerAccount) // The call to the controller to handle the registration, if no errors occur in the validation process.
)
// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

module.exports = router;
