const express = require("express");
const router = express.Router();

const { analyzeCode } = require("../controllers/analysisController");

// Analyze Python code
router.post("/", analyzeCode);

module.exports = router;