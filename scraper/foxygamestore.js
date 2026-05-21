import axios from 'axios';

export class Foxygamestore {
    constructor(apiKey, webhook = null) {
        this.apiKey = apiKey;
        this.baseUrl = "https://api.foxygamestore.com/v1";
        this.webhook = webhook;
    }

    async getProfile() {
        try {
            const response = await axios.get(`${this.baseUrl}/user`, {
                headers: {
                    Authorization: this.apiKey,
                    "Content-Type": "application/json"
                }
            });

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getProduct() {
        try {
            const response = await axios.get(`${this.baseUrl}/products`, {
                headers: {
                    Authorization: this.apiKey,
                    "Content-Type": "application/json"
                }
            });

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getCategory() {
        try {
            const response = await axios.get(`${this.baseUrl}/category`, {
                headers: {
                    Authorization: this.apiKey,
                    "Content-Type": "application/json"
                }
            });

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getProductByCategory(categoryId) {
        try {
            const response = await axios.get(
                `${this.baseUrl}/products?category_id=${encodeURIComponent(
                    categoryId
                )}`,
                {
                    headers: {
                        Authorization: this.apiKey,
                        "Content-Type": "application/json"
                    }
                }
            );

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getProductDetail(productCode) {
        try {
            const response = await axios.get(
                `${this.baseUrl}/product?product_code=${encodeURIComponent(
                    productCode
                )}`,
                {
                    headers: {
                        Authorization: this.apiKey,
                        "Content-Type": "application/json"
                    }
                }
            );

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getProductDetailById(productId) {
        try {
            const response = await axios.get(
                `${this.baseUrl}/product?product_id=${encodeURIComponent(
                    productId
                )}`,
                {
                    headers: {
                        Authorization: this.apiKey,
                        "Content-Type": "application/json"
                    }
                }
            );

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async createOrder(
        productCode,
        userId,
        serverId,
        trxId,
        callbackUrl = null
    ) {
        const body = {
            product_code: productCode,
            user_id: userId,
            server_id: serverId,
            trx_id: trxId
        };

        if (callbackUrl) {
            body.callback_url = callbackUrl;
        }

        try {
            const response = await axios.post(`${this.baseUrl}/order`, body, {
                headers: {
                    Authorization: this.apiKey,
                    "Content-Type": "application/json"
                }
            });

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async createOrderV2(
        productCode,
        userId,
        serverId,
        trxId,
        callbackUrl = null
    ) {
        const url = "https://api.x-onetopup.com/v2/order";

        const body = {
            product_code: productCode,
            user_id: userId,
            server_id: serverId,
            trx_id: trxId
        };

        if (callbackUrl) {
            body.callback_url = callbackUrl;
        }

        try {
            const response = await axios.post(url, body, {
                headers: {
                    Authorization: this.apiKey,
                    "Content-Type": "application/json"
                }
            });

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getInvoiceStatus(invoiceNumber) {
        try {
            const response = await axios.get(
                `${this.baseUrl}/status/${encodeURIComponent(invoiceNumber)}`,
                {
                    headers: {
                        Authorization: this.apiKey,
                        "Content-Type": "application/json"
                    }
                }
            );

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getInvoiceStatusByTrxId(trxId) {
        try {
            const response = await axios.get(
                `${this.baseUrl}/status/trx-id/${encodeURIComponent(trxId)}`,
                {
                    headers: {
                        Authorization: this.apiKey,
                        "Content-Type": "application/json"
                    }
                }
            );

            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

// Cuma named export