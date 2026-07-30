// ==========================================================
// app.js
// ==========================================================

require("dotenv").config();

const express = require("express");
const cron = require("node-cron");

const syncRoutes = require("./routes/sync.routes");
const syncService = require("./services/sync.service");

const app = express();

// ===========================================
// Middleware
// ===========================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===========================================
// Health Check
// ===========================================
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Service Request Sync API is Running"
    });
});

// ===========================================
// Routes
// ===========================================
app.use("/api/sync", syncRoutes);

// ===========================================
// Scheduler - Every 5 Minutes
// ===========================================
cron.schedule("*/30 * * * *", async () => {

    console.log("\n=======================================");
    console.log("SERVICE REQUEST SCHEDULER STARTED");
    console.log(`Time : ${new Date().toISOString()}`);
    console.log("=======================================\n");

    try {

        const result = await syncService.runSync();

        console.log("\n=======================================");
        console.log("SCHEDULER COMPLETED");
        console.log("=======================================");
        console.log(`Total   : ${result.total}`);
        console.log(`Success : ${result.successCount}`);
        console.log(`Failed  : ${result.failedCount}`);
        console.log("=======================================\n");

    } catch (error) {

        console.error("\n=======================================");
        console.error("SCHEDULER FAILED");
        console.error("=======================================");
        console.error(error.message);
        console.error("=======================================\n");

    }

});

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
    console.log("Scheduler : Every 5 Minutes");
    console.log("=======================================");

});