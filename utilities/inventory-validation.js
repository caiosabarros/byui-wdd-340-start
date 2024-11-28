const utilities = require(".")
const inventoryModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")
const validate = {}


/*  *****************************************
  *  Add Classification Data Validation Rules
  * ***************************************** */
validate.addClassificationRules = () => {
    return [
        // classification_name is required and must be an alphanumeric string
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .matches(/^[a-zA-Z0-9\s]*$/) // enforce the pattern on the server-side as well
            .withMessage("Please provide an alphanumeric classification name"), // on error this message is sent.
    ]
}

/*  **********************************
  *  Login Data Validation Rules
  * ********************************* */
validate.loginRules = () => {
    return [
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("Please, input a valid email"),

        // password is required and must be strong password
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ]
}

/* ******************************
 * Check data and return errors or continue to adding classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    //  calls the express-validator "validationResult" function and sends the request object (containing all the incoming data) as a parameter. 
    // All errors, if any, will be stored into the errors array.
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inv/classification", {
            errors,
            title: "Registration",
            nav,
            classification_name,
        })
        return
    }
    next()
}

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    //  calls the express-validator "validationResult" function and sends the request object (containing all the incoming data) as a parameter. 
    // All errors, if any, will be stored into the errors array.
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email, // stick this
        })
        return
    }
    next()
}


module.exports = validate