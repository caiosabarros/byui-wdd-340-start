const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory item detail view
 * ************************** */
invCont.buildInventoryItem = async function (req, res, next) {
  try {
    const item_id = req.params.itemId
    // the below returns the data.rows
    const item = await invModel.getInventoryItemDetail(item_id)
    // build page for itemId
    const card = await utilities.buildItemDetailView(item[0])
    // maintain the same nav though we need to make another call to db
    let nav = await utilities.getNav()
    const className = item[0].inv_make + " " + item[0].inv_model
    res.render("./inventory/item", {
      title: className + " vehicle",
      nav,
      card,
    })
  } catch (error) {
    console.error("Error ", error.message)
    next(error)
  }
}

module.exports = invCont
