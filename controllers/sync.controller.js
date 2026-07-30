// controllers/sync.controller.js

const syncService = require("../services/sync.service");

// ===========================================
// Run Complete Sync
// POST /api/sync
// ===========================================
const runSync = async (req, res) => {
    try {

        console.log("========================================");
        console.log("SERVICE REQUEST SYNC STARTED");
        console.log("========================================");

        const result = await syncService.runSync();

        return res.status(200).json({
            success: true,
            message: "Service Request Sync Completed Successfully",
            data: result,
        });

    } catch (error) {

        console.error("========================================");
        console.error("SYNC ERROR");
        console.error(error.message);
        console.error("========================================");

        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });

    }
};

// ===========================================
// Preview Payload Only
// GET /api/sync/payload
// ===========================================
const getPayload = async (req, res) => {

    try {

        const payload = await syncService.buildPayloads();

        return res.status(200).json({
            success: true,
            total: payload.length,
            payload
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });

    }

};

module.exports = {
    runSync,
    getPayload
};