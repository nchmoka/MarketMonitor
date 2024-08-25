// stocks.js
const express = require('express');
const router = express.Router();

// Import the controller function
const { getData } = require('../controllers/stocksController');

// Define the route and use the controller function
router.get('/', getData);

module.exports = router;

