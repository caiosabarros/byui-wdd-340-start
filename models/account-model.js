const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
        console.error(error.message)
        return error.message
    }
}

async function deleteAccount(account_id) {
    try {
        const sql = "DELETE FROM account WHERE account_id = $1 RETURNING *"
        const data = await pool.query(sql, [account_id])
        return data.rows[0]
    } catch (error) {
        console.error(error.message)
        return error.message
    }
}

/* *****************************
*   Get all accounts
* *************************** */
async function getAllAccounts() {
    try {
        const sql = "SELECT * FROM account ORDER BY account_firstname ASC;"
        const data = await pool.query(sql)
        return data.rows
    } catch (err) {

    }
}

/* **********************
 *   Check for existing email
    PS: it consistently returns whether someone else is using the email.
 * ********************* */
async function checkExistingEmail(account_email, account_id = null) {
    try {
        const sql = "SELECT * FROM account WHERE account_email = $1"
        const email = await pool.query(sql, [account_email])
        if (account_id) {

            // the below is: is the account_id the only account with that email?
            return !(email.rows.length > 0 && email.rows[0].account_id == parseInt(account_id))
            // in the above, rows[0] is used because we assume no possible way to getting to accounts
            // to use the same email since this fn will always be used.
        }
        return email.rowCount > 0
    } catch (error) {
        return error.message
    }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail(account_email) {
    try {
        const result = await pool.query(
            'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
            [account_email])
        return result.rows[0]
    } catch (error) {
        return new Error("No matching email found")
    }
}

async function updateAccount(account_firstname,
    account_lastname,
    account_email,
    account_id) {
    try {
        const data = await pool.query(
            "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *",
            [account_firstname, account_lastname, account_email, account_id]
        )
        return data.rows[0]
    } catch (error) {
        console.error("model error: " + error)
    }
}

async function updatePassword(account_id, account_password) {
    try {
        const data = await pool.query(
            "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *",
            [account_password, account_id]
        )
        return data.rows[0]
    } catch (error) {
        console.error("model error: " + error)
    }
}

async function getAccountById(account_id) {
    try {
        const data = await pool.query(
            "SELECT * FROM account WHERE account_id = $1",
            [account_id]
        )
        return data.rows[0]
    } catch (error) {
        console.error("account model error " + error)
    }
}

module.exports = { registerAccount, checkExistingEmail, updatePassword, getAccountByEmail, updateAccount, getAccountById, getAllAccounts, deleteAccount };