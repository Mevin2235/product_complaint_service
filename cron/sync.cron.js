const cron = require("node-cron");
const syncService = require("../services/sync.service");

// Every 30 minutes
cron.schedule("*/30 * * * *", async () => {

    console.log("\n========================================");
    console.log("CRON STARTED :", new Date().toISOString());
    console.log("========================================");

    try {

        const result = await syncService.runSync();

        console.log("========================================");
        console.log("CRON COMPLETED");
        console.log(result);
        console.log("========================================");

    } catch (error) {

        console.error("========================================");
        console.error("CRON FAILED");
        console.error(error.message);
        console.error("========================================");

    }

});