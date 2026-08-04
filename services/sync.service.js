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
                if (item.SettlementMode_KUTText === "Commercial Settlement (CN)") {

                    console.log(
                        `Skipping Item ${item.ID} - Commercial Settlement (CN)`
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
                    payload
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
            if (item.SettlementMode_KUTText === "Commercial Settlement (CN)") {

                console.log(
                    `Skipping Item ${item.ID} - Commercial Settlement (CN)`
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
}
module.exports = new SyncService();