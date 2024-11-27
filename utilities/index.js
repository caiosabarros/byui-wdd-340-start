const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

function formatToDolar(amount) {
  return `${amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`
}

function formatToMileage(amount) {
  return `${amount.toLocaleString('en-US', { style: 'unit', unit: 'mile' })}`
}

/* **************************************
* Build the account login form view HTML
* ************************************ */
Util.buildLoginFormView = async function (onSubmit) {
  let form = ''
  form =
    `
    <form id="login-form" onsubmit="${onSubmit}">
      <label for="account_email">Email</label>
      <input required name="account_email" type="email" required>
      <label for="account_password">Password</label>
      <small>There must be at least 12 characters, one must be a number, one must be a lowercase letter, one must be a capital letter, and one must be a non-alphanumeric character.</small>
      <input required pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$" name="account_password" type="password" required>
      <input type="submit" value="Login"/>
      <p>Don't have an account? <a href="/account/register">Sign Up</a></p>
    </form>
    `
  return form
}

/* **************************************
* Build the account register form view HTML
* ************************************ */
Util.buildRegistrationFormView = async function () {
  let form = ''
  form =
    `
    <form id="register-form" action="/account/register" method="post">
      <label for="account_firstname">First Name</label>
      <input required id="account_firstname" type="text" name="account_firstname" />
      <label for="account_lastname">Last Name</label>
      <input required id="account_lastname" name="account_lastname" type="text"/>
      <label for="account_email">Email</label>
      <input required id="account_email" name="account_email" type="email">
      <label for="account_password">Password</label>
      <small id="invalid-input">There must be at least 12 characters, one must be a number, one must be a lowercase letter, one must be a capital letter, and one must be a non-alphanumeric character.</small>
      <input required pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$" name="account_password" type="password" minlength="12">
      <input id="register-submit" type="submit" value="Register"/>
      <p>Already have an account? <a href="/account/login">LogIn</a></p>
    </form>
    `
  return form
}


/* **************************************
* Build the inventory detail view HTML
* ************************************ */
Util.buildItemDetailView = async function (data) {
  let card = ''
  if (data) {
    // The make, model, year and price should be prominent in the view. All descriptive data must also be displayed.
    card =
      `
      <div class="inv">
       <img id="inv-img" src="${data.inv_image}" alt="${data.inv_make} ${data.inv_model}">
       <div id="inv-display-detail">
        <h2>${data.inv_make} ${data.inv_model}</h2>
        <p id="inv-year"><strong>Year:</strong> ${data.inv_year}</p>
        <p id="inv-miles"><strong>Miles:</strong> ${formatToMileage(data.inv_miles)}</p>
        <p id="inv-color"><strong>Color:</strong> ${data.inv_color}</p>
        <p id="inv-price"><strong>Price:</strong> ${formatToDolar(parseInt(data.inv_price))}</p>
        <p id="inv-description">${data.inv_description}</p>
       </div>
      </div>
      `
  } else {
    card = '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return card
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id
        + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + 'details"><img src="' + vehicle.inv_thumbnail
        + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + ' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$'
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
