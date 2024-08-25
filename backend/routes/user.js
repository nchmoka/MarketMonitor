const express = require("express");

const router = express.Router();

// controller functions
const { signupUser, loginUser, verifyUser } = require("../controllers/userController");

// login route
router.post("/login", loginUser);

// register route
router.post("/signup", signupUser);

// verify route
router.get("/verify", verifyUser);

module.exports = router;
