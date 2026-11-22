
const express = require("express");
const router = express.Router();

const {
    visualizeArchitecture
} = require("../controllers/architectureController");

// Generate code architecture
router.post("/", visualizeArchitecture);

module.exports = router;
