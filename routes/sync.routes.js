// routes/sync.routes.js

const express = require("express");
const router = express.Router();

const syncController = require("../controllers/sync.controller");
router.post("/test", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Hello Cron Job"
    });

});
// Test All Completed Requests (No Date Filter)
router.post("/test-all", syncController.testAllSync);

// ==========================================================
// Service Request Sync
// ==========================================================

// ===========================================
// Background Sync (For Cron Job)
// POST /api/sync/cron
// Returns immediately and runs sync in background
// ===========================================
router.post("/cron", syncController.runCronSync);

// ===========================================
// Run Complete Synchronization
// POST /api/sync
// Waits until sync is completed
// ===========================================
router.post("/", syncController.runSync);

// ===========================================
// Health Check
// GET /api/sync/health
// ===========================================
router.get("/health", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Service Request Sync API is Healthy",
        timestamp: new Date().toISOString(),
    });

});

// ===========================================
// Preview Payload (No POST)
// GET /api/sync/payload
// ===========================================
router.get("/payload", syncController.getPayload);

module.exports = router;