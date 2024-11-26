/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const expressLayouts = require("express-ejs-layouts")
const baseController = require("./controllers/baseController")
const accountRoute = require("./routes/accountRoute")
const inventoryRoute = require("./routes/inventoryRoute")
const internalErrorRoute = require("./routes/internalErrorRoute")
const utilities = require("./utilities");
const session = require("express-session")
const pool = require('./database/')

/* ***********************
  * Middleware
  * ************************/
// Recall that app.use() applies whatever is being invoked throughout the entire application.
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true, // true because it's flash messages
  saveUninitialized: true,
  name: 'sessionId', // In order to maintain "state", 
  // the session id will be stored into a cookie and 
  // passed back and forth from the server to the browser.
  // We will not create the cookie, the session package will do so.The only item it will contain is the name "sessionId" and the actual value of the ID.
}))

// Express Messages Middleware
app.use(require('connect-flash')())
/**
 *  The express-messages package is required as a function. The function accepts the request and response objects as parameters. The functionality of the this function is assigned to the response object, using the "locals" option and a name of "messages". This allows any message to be stored into the response, making it available in a view.
 */
app.use(function (req, res, next) {
  // Ultimately, this allows messages to be set, then pass on to the next process. Eventually, when a view is built, the message can be displayed in it.
  res.locals.messages = require('express-messages')(req, res)
  next()
})

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)

// Inventory routes
app.use("/inv", inventoryRoute)

// Account routes
app.use("/account", accountRoute)

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))

// Error route
app.use("/error", internalErrorRoute)

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' })
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if (err.status == 404) { message = err.message } else { message = 'Oh no! There was a crash. Maybe try a different route?' }
  if (err.status == 500 || !err.status) { message = 'Oh no! We could not determine what happened :/'; err.status = 500; }
  res.render("errors/error", {
    title: err.status == 500 ? 'Server Error' : err.status,
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
