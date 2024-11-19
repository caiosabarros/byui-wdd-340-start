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
        <h4 id="inv-year">Year: ${data.inv_year}</h4>
        <h4 id="inv-miles">Miles: ${data.inv_price}</h4>
        <h4 id="inv-color">Color: ${data.inv_color}</h4>
        <h4 id="inv-price">Price: ${formatToDolar(parseInt(data.inv_price))}</h4>
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
