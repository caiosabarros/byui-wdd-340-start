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
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));
router.get("/edit/:itemId", utilities.handleErrors(invController.buildInventoryItemForEdit));
router.get("/delete/:itemId", utilities.handleErrors(invController.deleteInventoryItemView));
router.post("/delete/:itemId", utilities.handleErrors(invController.deleteInventoryItemHandler));

// Route to add classification 
router.post("/classification", invValidate.addClassificationRules(), invValidate.checkClassificationData, utilities.handleErrors(invController.addNewClassification));
router.get("/add-classification", utilities.handleErrors(invController.buildClassificationForm));
router.get("/add-inventory", utilities.handleErrors(invController.buildInventoryForm));
router.post("/add-inventory", invValidate.addInventoryRules(), invValidate.checkInventoryData, utilities.handleErrors(invController.addNewInventory));
router.post("/update/", invValidate.addInventoryRules(), invValidate.checkUpdateData, invController.updateInventory)

module.exports = router;
