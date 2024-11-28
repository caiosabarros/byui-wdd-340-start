const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Insert a new  classification
 * ************************** */
async function insertClassification(classification_name) {
  const query = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
  return await pool.query(query, [classification_name])
}


/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get an inventory item detail data
 * ************************** */
async function getInventoryItemDetail(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inv_id])
    return data.rows
  } catch (error) {
    console.error("getInvItemDetail error " + error)
  }
}

module.exports = { getClassifications, getInventoryByClassificationId, getInventoryItemDetail, insertClassification };
