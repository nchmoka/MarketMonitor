const express = require("express");

const router = express.Router();

// controller functions
const { contactUs } = require("../controllers/contactUsController");

// contactUs route
router.post("/", contactUs);


module.exports = router;
