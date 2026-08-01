// ==========================================================
// app.js
// ==========================================================

require("dotenv").config();

const express = require("express");

const syncRoutes = require("./routes/sync.routes");
const authMiddleware = require("./middleware/auth.middleware");

const app = express();

// ===========================================
// Middleware
// ===========================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===========================================
// Health Check (Public)
// ===========================================
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Service Request Sync API is Running"
    });
});

// ===========================================
// Protect ALL API Routes
// ===========================================
app.use("/api", authMiddleware);

// ===========================================
// Routes
// ===========================================
app.use("/api/sync", syncRoutes);

// ===========================================
// 404 Handler
// ===========================================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found"
    });
});

// ===========================================
// Global Error Handler
// ===========================================
app.use((err, req, res, next) => {

    console.error(err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });

});

// ===========================================
// Start Server
// ===========================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("=======================================");
    console.log(`🚀 Server Started on Port ${PORT}`);
    console.log("=======================================");

});