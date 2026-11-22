
const express = require("express");
const router = express.Router();

const {
    analyzeCodeImpact
} = require("../controllers/impactController");

router.post("/", analyzeCodeImpact);

module.exports = router;
