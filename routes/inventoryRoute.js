// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// Route to build each item view 
router.get("/detail/:itemId", utilities.handleErrors(invController.buildInventoryItem));
//
router.get("/management", utilities.handleErrors(invController.buildManagement));
// Route to add classification 
// TODO: bring fn from controller that inserts classification into the db through the model
// TODO: bring fn from utilities that validate what's being received.
router.post("/classification", invValidate.addClassificationRules(), invValidate.checkClassificationData, utilities.handleErrors(invController.addNewClassification));
router.get("/add-classification", utilities.handleErrors(invController.buildClassificationForm));


module.exports = router;
