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
        // Process ONE Service Request at a time
        // ==========================================

        for (const request of completedRequests) {

            // Find matching items
            const items = requestItems.filter(
                item => item.ServiceRequestID == request.ID
            );

            if (!items.length) {
                console.log(`No Items Found for Service Request ${request.ID}`);
                continue;
            }

            // ==========================================
            // Build Payload
            // ==========================================

            const payload = {

                // -----------------------
                // Header
                // -----------------------
                ID: request.ID,
                BuyerPartyID: request.BuyerPartyID,
                BuyerPartyName: request.BuyerPartyName,
                SalesOrganisationID: request.SalesOrganisationID,
                DivisionCode: request.DivisionCode,
                DistributionChannelCode: request.DistributionChannelCode,
                ServiceExecutionTeamPartyID: request.ServiceExecutionTeamPartyID,
                CreationDateTime: request.CreationDateTime,
                LastChangeDateTime: request.LastChangeDateTime,

                // -----------------------
                // Child Records
                // -----------------------
                ToServiceRequestItems: items.map(item => ({
                    ServiceRequestID: request.ID,

                    ProductID: item.ProductID,

                    Description: item.Description,

                    SettlementMode_KUTText:
                        item.SettlementMode_KUTText,

                    TotalAmountContent_KUT:
                        item.TotalAmountContent_KUT,

                    TotalAmountcurrencyCode_KUT:
                        item.TotalAmountcurrencyCode_KUT

                }))

            };

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

        console.log(`Total Requests : ${completedRequests.length}`);
        console.log(`Success Count  : ${successCount}`);
        console.log(`Failed Count   : ${failedCount}`);

        return {

            success: true,

            message: "Service Request Sync Completed",

            total: completedRequests.length,

            successCount,

            failedCount,
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

    // STOP HERE
    if (!completedRequests.length) {

        console.log("==========================================");
        console.log("NO COMPLETED SERVICE REQUESTS");
        console.log("SKIPPING SERVICE REQUEST ITEMS");
        console.log("==========================================");

        return [];

    }

    const requestItems =
        await c4cService.getServiceRequestItems();

    const payloads = [];

    for (const request of completedRequests) {

        const items = requestItems.filter(
            item => item.ServiceRequestID == request.ID
        );

        if (!items.length) {
            continue;
        }

        payloads.push({

            ID: request.ID,
            BuyerPartyID: request.BuyerPartyID,
            BuyerPartyName: request.BuyerPartyName,
            SalesOrganisationID: request.SalesOrganisationID,
            DivisionCode: request.DivisionCode,
            DistributionChannelCode: request.DistributionChannelCode,
            CreationDateTime: request.CreationDateTime,
            ServiceExecutionTeamPartyID: request.ServiceExecutionTeamPartyID,
            LastChangeDateTime: request.LastChangeDateTime,

            ToServiceRequestItems: items.map(item => ({
                ServiceRequestID: request.ID,
                ProductID: item.ProductID,
                Description: item.Description,
                SettlementMode_KUTText: item.SettlementMode_KUTText,
                TotalAmountContent_KUT: item.TotalAmountContent_KUT,
                TotalAmountcurrencyCode_KUT:
                    item.TotalAmountcurrencyCode_KUT
            }))

        });

    }

    return payloads;
}
}
module.exports = new SyncService();