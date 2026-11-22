const express = require("express");
const router = express.Router();

const {
    createProject,
    getAllProjects,
    updateProjectStatus
} = require("../controllers/projectController");

// Create project
router.post("/", createProject);

// Get all projects
router.get("/", getAllProjects);

// Update project status
router.put("/:id/status", updateProjectStatus);

module.exports = router;