// ==========================================================
// services/c4c.service.js
// ==========================================================

const { c4cClient, API } = require("../config/axios");

class C4CService {

    // ==========================================================
    // Generic Method - Read ALL Pages from OData
    // ==========================================================
    // ==========================================================
// Generic Method - Read ALL Pages from OData
// ==========================================================
async getAllPages(apiUrl) {

    let results = [];
    let nextUrl = apiUrl;
    let page = 1;

    console.log("==========================================");
    console.log(`START FETCHING : ${apiUrl}`);
    console.log("==========================================");

    while (nextUrl) {

        console.log(`\n--------------- PAGE ${page} ---------------`);
        console.log(`URL : ${nextUrl}`);

        const response = await c4cClient.get(nextUrl);
        const pageResults =
            response.data?.d?.results ||
            response.data?.d?.entries ||
            response.data?.value ||
            [];

        console.log(`Records in Page ${page} : ${pageResults.length}`);

        results.push(...pageResults);

        console.log(`Total Records So Far : ${results.length}`);

        // Next Page
        nextUrl = response.data?.d?.__next || null;

        if (nextUrl) {

            console.log(`Next Page Found`);

            // Remove Base URL if present
            nextUrl = nextUrl.replace(
                c4cClient.defaults.baseURL,
                ""
            );

            page++;

        } else {

            console.log("No More Pages");

        }

    }

    console.log("\n==========================================");
    console.log(`FINISHED : ${apiUrl}`);
    console.log(`Total Pages Read : ${page}`);
    console.log(`Total Records : ${results.length}`);
    console.log("==========================================");

    return results;

}

    // ==========================================================
    // Get All Completed Service Requests
    // ==========================================================
// ==========================================================
// Get Newly Completed Service Requests
// ==========================================================
// ==========================================================
// Get Newly Completed Service Requests
// ==========================================================
async getCompletedServiceRequests() {

    try {

        console.log("==========================================");
        console.log("FETCHING SERVICE REQUESTS...");
        console.log("==========================================");

        const now = new Date();
        const thirtyMinutesAgo = new Date(now.getTime() - (30 * 60 * 1000));

        // Remove milliseconds and keep UTC Z
        const from =
            thirtyMinutesAgo.toISOString().split(".")[0] + "Z";

        console.log(`From Time : ${from}`);
        console.log(`Current   : ${now.toISOString()}`);

        // OData Filter
        const url =
            `${API.SERVICE_REQUEST}` +
            `?$format=json` +
            `&$filter=ServiceRequestLifeCycleStatusCode eq '3'` +
            ` and LastChangeDateTime ge datetimeoffset'${from}'`;

        console.log("------------------------------------------");
        console.log("FILTER URL");
        console.log(url);
        console.log("------------------------------------------");

        const results = await this.getAllPages(url);

        console.log(
            `Completed Requests Returned By C4C : ${results.length}`
        );

        return results;

    } catch (error) {

        console.error("==========================================");
        console.error("ERROR FETCHING SERVICE REQUESTS");
        console.error(error.response?.data || error.message);
        console.error("==========================================");

        throw error;

    }

}
    // ==========================================================
    // Get Only Completed IDs
    // ==========================================================
async getCompletedServiceRequestIds() {

    const requests = await this.getCompletedServiceRequests();

    return requests.map(item => item.ID);

}
    // ==========================================================
    // Get All Service Request Items
    // ==========================================================
    async getServiceRequestItems() {

        try {

            console.log("==========================================");
            console.log("FETCHING SERVICE REQUEST ITEMS...");
            console.log("==========================================");

            const results =
                await this.getAllPages(API.SERVICE_REQUEST_ITEM);

            console.log(`Items Found : ${results.length}`);

            return results;

        } catch (error) {

            console.error("==========================================");
            console.error("ERROR FETCHING ITEMS");
            console.error(error.response?.data || error.message);
            console.error("==========================================");

            throw error;

        }

    }

    // ==========================================================
    // Match Items With Completed Requests
    // ==========================================================
// ==========================================================
// Match Items With Newly Completed Requests
// ==========================================================
async getMatchedItems() {

    const completedIds =
        await this.getCompletedServiceRequestIds();

    const items =
        await this.getServiceRequestItems();

    const matchedItems = items.filter(item =>
        completedIds.includes(item.ServiceRequestID)
    );

    console.log("==========================================");
    console.log(`Matched Items : ${matchedItems.length}`);
    console.log("==========================================");

    return matchedItems;

}

    // ==========================================================
    // Build Payload
    // ==========================================================
// ==========================================================
// Build Payload
// ==========================================================
async getPayloadData() {

    const matchedItems =
        await this.getMatchedItems();

    return matchedItems.map(item => ({
        ServiceRequestID: item.ServiceRequestID,
        ProductID: item.ProductID,
        Description: item.Description,
        SettlementMode_KUTText: item.SettlementMode_KUTText,
        TotalAmountContent_KUT: item.TotalAmountContent_KUT,
        TotalAmountcurrencyCode_KUT: item.TotalAmountcurrencyCode_KUT
    }));

}

}

module.exports = new C4CService();