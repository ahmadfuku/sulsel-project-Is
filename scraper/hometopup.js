import axios from 'axios';

export class Hometopup {
    constructor(
        apiKey,
        token = "9876535345melpadigital",
        sandbox = false,
        webhook = null
    ) {
        this.apiKey = apiKey;
        this.baseUrl = "https://api.hometopup.id/api";
        this.sandbox = sandbox;
        this.token = token;
        this.webhook = webhook;
    }

    async getProfile() {
        try {
            const options = {
                method: "POST",
                url: `${this.baseUrl}/check-balance${
                    this.sandbox ? "?mode=sandbox" : ""
                }`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.apiKey}`,
                    "X-API-KEY": this.token,
                    ...(this.sandbox ? { "X-ENVIRONMENT": "sandbox" } : {})
                }
            };
            const { data } = await axios.request(options);

            return data;
        } catch (error) {
            throw error;
        }
    }

    async getProduct() {
        try {
            const options = {
                method: "POST",
                url: `${this.baseUrl}/product`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.apiKey}`,
                    "X-API-KEY": this.token
                }
            };
            const { data } = await axios.request(options);

            return data;
        } catch (error) {
            throw error;
        }
    }

    async createOrder(
        productCode,
        userId,
        serverId,
        trxId,
        phoneNumber,
        callbackUrl = ""
    ) {
        if (!productCode || !userId || !trxId || !phoneNumber) {
            throw new Error(
                "Parameter productCode, userId, trxId, dan phoneNumber wajib diisi."
            );
        }

        try {
            const body = {
                code: productCode,
                referenceNumber: trxId,
                data: serverId ? `${userId}|${serverId}` : userId,
                telp: phoneNumber,
                callback_url: callbackUrl
            };
            const options = {
                method: "POST",
                url: `${this.baseUrl}/order`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.apiKey}`,
                    "X-API-KEY": this.token
                },
                data: body
            };
            const { data } = await axios.request(options);

            return data;
        } catch (error) {
            throw error;
        }
    }

    async getInvoiceStatus(orderId) {
        try {
            if (!orderId) {
                throw new Error("Parameter orderId wajib diisi.");
            }

            const body = { order_id: orderId };
            const options = {
                method: "POST",
                url: `${this.baseUrl}/check-status`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.apiKey}`,
                    "X-API-KEY": this.token
                },
                data: body
            };
            const { data } = await axios.request(options);

            return data;
        } catch (error) {
            throw error;
        }
    }
}