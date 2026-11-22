
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        projectName: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        programmingLanguage: {
            type: String,
            required: true
        },

        fileName: {
            type: String,
            default: ""
        },

        analysisStatus: {
            type: String,
            enum: ["Pending", "Processing", "Completed", "Failed"],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
