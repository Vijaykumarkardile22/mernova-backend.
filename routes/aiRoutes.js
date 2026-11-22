const express = require("express");
const router = express.Router();

const { explainCode } = require("../controllers/aiController");

// AI code explanation route
router.post("/explain", explainCode);

module.exports = router;