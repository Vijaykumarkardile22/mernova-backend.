
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const projectRoutes = require("./routes/projectRoutes");
app.use("/api/projects", projectRoutes);

const analysisRoutes = require("./routes/analysisRoutes");
app.use("/api/analyze", analysisRoutes);

const aiRoutes = require("./routes/aiRoutes");
const architectureRoutes = require("./routes/architectureRoutes");
const impactRoutes = require("./routes/impactRoutes");
app.use("/api/impact", impactRoutes);
app.use("/api/architecture", architectureRoutes);
app.use("/api/ai", aiRoutes);

// Connect MongoDB
connectDB();

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to CodeExplain AI Backend!",
        status: "Server is running successfully"
    });
});

// Server port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`CodeExplain AI server running on port ${PORT}`);
});
