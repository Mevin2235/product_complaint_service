// config/axios.js

const axios = require("axios");
require("dotenv").config();

// ==========================================
// C4C Axios Client
// ==========================================
const c4cClient = axios.create({
    baseURL: "https://my344191.crm.ondemand.com/sap/c4c/odata/v1/c4codataapi",
    timeout: 60000,
    auth: {
        username: process.env.C4C_USERNAME,
        password: process.env.C4C_PASSWORD,
    },
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

// ==========================================
// Destination API Axios Client
// ==========================================
const postClient = axios.create({
    baseURL: "https://e500034-iflmap.hcisbt.eu3.hana.ondemand.com",
    timeout: 60000,
    auth: {
        username: process.env.POST_USERNAME,
        password: process.env.POST_PASSWORD,
    },
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

// ==========================================
// API Endpoints
// ==========================================
const API = {

    SERVICE_REQUEST:
        "/ServiceRequestCollection",

    SERVICE_REQUEST_ITEM:
        "/ServiceRequestItemCollection",

    POST_SERVICE_REQUEST:
        "/http/srv/request/cn"

};

module.exports = {
    c4cClient,
    postClient,
    API,
};