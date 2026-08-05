// ======================================================
// services/sync.service.js
// ======================================================

const c4cService = require("./c4c.service");
const { postClient, API } = require("../config/axios");

class SyncService {

    // ==================================================
    // Main Sync Method
    // ==================================================
async runSync() {

    try {

        console.log("\n==========================================");
        console.log("SERVICE REQUEST SYNC STARTED");
        console.log("==========================================");

        // Get Completed Service Requests
        const completedRequests =
            await c4cService.getCompletedServiceRequests();

        if (!completedRequests.length) {

            return {
                success: true,
                message: "No Completed Service Requests",
                total: 0,
                successCount: 0,
                failedCount: 0
            };

        }

        console.log(`Completed Requests : ${completedRequests.length}`);

        // Get Service Request Items
        const requestItems =
            await c4cService.getServiceRequestItems();

        console.log(`Service Request Items : ${requestItems.length}`);

        let successCount = 0;
        let failedCount = 0;

        const successRecords = [];
        const failedRecords = [];

        // ==========================================
        // Process One Service Request
        // ==========================================

        for (const request of completedRequests) {

            const items = requestItems.filter(
                item => item.ServiceRequestID == request.ID
            );

            if (!items.length) {

                console.log(`No Items Found for Service Request ${request.ID}`);
                continue;

            }

            // ==========================================
            // Build Flat Payload
            // ==========================================

            const payload = [];

            for (const item of items) {

                // Skip Commercial Settlement
                // Post ONLY Commercial Settlement (CN)
// Post ONLY Settlement Mode 101
if (item.SettlementMode_KUT !== "101") {

    console.log(
        `Skipping Item ${item.ID} - Settlement Code ${item.SettlementMode_KUT}`
    );

    continue;

}
                payload.push({

                    Requestno: request.ID,

                    // Line Item ID
                    SeqNo: item.ID,

                    Bp: request.BuyerPartyID,

                    TotalAmount: request.GrandTotalContent_KUT,

                    TotCurrency: request.GrandTotalcurrencyCode_KUT,

                    DistriChannel: request.DistributionChannelCode,

                    Division: request.DivisionCode,

                    CreationDate: request.CreationDateTime,

                    ChangedDate: request.LastChangeDateTime,

                    Plant: request.ServiceExecutionTeamPartyID.replace("PLANT_", ""),

                    SalesOrg: request.SalesOrganisationID.replace("SO_", ""),

                    Product: item.ProductID,

                    Description: item.Description,

                    Settlement: item.SettlementMode_KUTText,

                    Amount: item.TotalAmountContent_KUT,

                    Currency: item.TotalAmountcurrencyCode_KUT

                });

            }

            // Skip if all items were Commercial Settlement
            if (payload.length === 0) {

                console.log(
                    `No Valid Items Found for Service Request ${request.ID}`
                );

                continue;

            }

            console.log("\n====================================");
            console.log(`POSTING SERVICE REQUEST : ${request.ID}`);
            console.log("====================================");
            console.log(JSON.stringify(payload, null, 2));

            try {

               const response = await postClient.post(
    API.POST_SERVICE_REQUEST,
    {
        ToServiceRequestID: payload
    }
);
                successCount++;

                successRecords.push({

                    ServiceRequestID: request.ID,
                    Status: "SUCCESS",
                    Response: response.data

                });

                console.log(`SUCCESS : ${request.ID}`);

            } catch (error) {

                failedCount++;

                failedRecords.push({

                    ServiceRequestID: request.ID,
                    Status: "FAILED",
                    Error: error.response?.data || error.message

                });

                console.log(`FAILED : ${request.ID}`);

                console.error(
                    error.response?.data || error.message
                );

            }

        }

        console.log("\n====================================");
        console.log("SYNC COMPLETED");
        console.log("====================================");
        console.log(`Success Count : ${successCount}`);
        console.log(`Failed Count  : ${failedCount}`);

        return {

            success: true,
            message: "Service Request Sync Completed",
            successCount,
            failedCount

        };

    } catch (error) {

        console.log("\n====================================");
        console.log("SYNC FAILED");
        console.log("====================================");

        console.error(
            error.response?.data || error.message
        );

        throw error;

    }

}
// ==================================================
// Build Payload Only (No POST)
// ==================================================
// ==================================================
// Build Payload Only (No POST)
// ==================================================
async buildPayloads() {

    const completedRequests =
        await c4cService.getCompletedServiceRequests();

    if (!completedRequests.length) {

        console.log("==========================================");
        console.log("NO COMPLETED SERVICE REQUESTS");
        console.log("==========================================");

        return [];

    }

    const requestItems =
        await c4cService.getServiceRequestItems();

    const payloads = [];

    // ==========================================
    // Build Flat Payload
    // ==========================================

    for (const request of completedRequests) {

        const items = requestItems.filter(
            item => item.ServiceRequestID == request.ID
        );

        if (!items.length) {
            continue;
        }

        for (const item of items) {

            // Skip Commercial Settlement
          // Post ONLY Commercial Settlement (CN)
// Post ONLY Settlement Mode 101
if (item.SettlementMode_KUT !== "101") {

    console.log(
        `Skipping Item ${item.ID} - Settlement Code ${item.SettlementMode_KUT}`
    );

    continue;

}

            payloads.push({

                Requestno: request.ID,

                // Line Item ID
                SeqNo: item.ID,

                Bp: request.BuyerPartyID,

                TotalAmount: request.GrandTotalContent_KUT,

                TotCurrency: request.GrandTotalcurrencyCode_KUT,

                DistriChannel: request.DistributionChannelCode,

                Division: request.DivisionCode,

                CreationDate: request.CreationDateTime,

                ChangedDate: request.LastChangeDateTime,

                Plant: request.ServiceExecutionTeamPartyID.replace("PLANT_", ""),

                SalesOrg: request.SalesOrganisationID.replace("SO_", ""),

                Product: item.ProductID,

                Description: item.Description,

                Settlement: item.SettlementMode_KUTText,

                Amount: item.TotalAmountContent_KUT,

                Currency: item.TotalAmountcurrencyCode_KUT

            });

        }

    }

    return payloads;

}
// ==================================================
// Test Sync (No Date Filter)
// ==================================================
async testRunSync() {

    try {

        console.log("==========================================");
        console.log("TEST SYNC STARTED");
        console.log("==========================================");

        // Fetch ALL completed Service Requests
        const completedRequests =
            await c4cService.getAllCompletedServiceRequests();

        if (!completedRequests.length) {

            return {
                success: true,
                message: "No Completed Service Requests Found",
                total: 0
            };

        }

        // Fetch all Service Request Items
        const requestItems =
            await c4cService.getServiceRequestItems();

        let request = null;
        let payload = [];

        // ==========================================
        // Find FIRST Service Request having valid items
        // ==========================================

        for (const req of completedRequests) {

            console.log(`Checking Service Request : ${req.ID}`);

            const items = requestItems.filter(
                item => item.ServiceRequestID == req.ID
            );

            if (!items.length) {

                console.log(`No Items Found for ${req.ID}`);
                continue;

            }

            const tempPayload = [];

            for (const item of items) {

                // Skip Commercial Settlement
                // Post ONLY Commercial Settlement (CN)
// Post ONLY Settlement Mode 101
if (item.SettlementMode_KUT !== "101") {

    console.log(
        `Skipping Item ${item.ID} - Settlement Code ${item.SettlementMode_KUT}`
    );

    continue;

}

                tempPayload.push({

                    Requestno: req.ID,

                    SeqNo: item.ID,

                    Bp: req.BuyerPartyID,

                    TotalAmount: req.GrandTotalContent_KUT,

                    TotCurrency: req.GrandTotalcurrencyCode_KUT,

                    DistriChannel: req.DistributionChannelCode,

                    Division: req.DivisionCode,

                    CreationDate: req.CreationDateTime,

                    ChangedDate: req.LastChangeDateTime,

                    Plant: req.ServiceExecutionTeamPartyID.replace("PLANT_", ""),

                    SalesOrg: req.SalesOrganisationID.replace("SO_", ""),

                    Product: item.ProductID,

                    Description: item.Description,

                    Settlement: item.SettlementMode_KUTText,

                    Amount: item.TotalAmountContent_KUT,

                    Currency: item.TotalAmountcurrencyCode_KUT

                });

            }

            // If at least one valid item exists, stop here
            if (tempPayload.length > 0) {

                request = req;
                payload = tempPayload;
                break;

            }

            console.log(
                `All Items are Commercial Settlement for ${req.ID}`
            );

        }

        if (!request) {

            return {
                success: false,
                message: "No Valid Service Request Found."
            };

        }

        console.log("\n====================================");
        console.log(`POSTING SERVICE REQUEST : ${request.ID}`);
        console.log("====================================");
        console.log(JSON.stringify(payload, null, 2));

 const response = await postClient.post(
    API.POST_SERVICE_REQUEST,
    {
        ToServiceRequestID: payload
    }
);

        console.log("\n====================================");
        console.log("POST SUCCESS");
        console.log("====================================");

        return {

            success: true,

            message: "Test Sync Completed",

            requestNo: request.ID,

            totalItems: payload.length,

            response: response.data

        };

    } catch (error) {

        console.log("\n====================================");
        console.log("TEST SYNC FAILED");
        console.log("====================================");

        console.error(
            error.response?.data || error.message
        );

        throw error;

    }

}
}
module.exports = new SyncService();