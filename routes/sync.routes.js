// routes/sync.routes.js

const express = require("express");
const router = express.Router();

const syncController = require("../controllers/sync.controller");

// ==========================================================
// Service Request Sync
// ==========================================================

// Run Complete Synchronization
// POST http://localhost:3000/api/sync
router.post("/", syncController.runSync);

// Health Check
// GET http://localhost:3000/api/sync/health
router.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Service Request Sync API is Healthy",
        timestamp: new Date().toISOString(),
    });
});
// Preview Payload (No POST)
router.get("/payload", syncController.getPayload);

module.exports = router;