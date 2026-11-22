
const Project = require("../models/Project");

// Create a new project
const createProject = async (req, res) => {
    try {
        const { projectName, description, programmingLanguage, fileName } = req.body;

        const project = await Project.create({
            projectName,
            description,
            programmingLanguage,
            fileName
        });

        res.status(201).json({
            message: "Project created successfully!",
            project
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create project",
            error: error.message
        });
    }
};

// Get all projects
const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });

        res.status(200).json({
            message: "Projects retrieved successfully!",
            totalProjects: projects.length,
            projects
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve projects",
            error: error.message
        });
    }
};
// Update project analysis status
const updateProjectStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { analysisStatus: status },
            { new: true, runValidators: true }
        );

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.status(200).json({
            message: "Project status updated successfully!",
            project
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update project status",
            error: error.message
        });
    }
};
module.exports = {
    createProject,
    getAllProjects,
    updateProjectStatus
};
