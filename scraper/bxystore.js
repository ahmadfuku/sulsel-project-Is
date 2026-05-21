import axios from "axios";
import qs from "qs";

export class Bxystore {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.apiUrl = "https://api.bxystore.com";
    }

    async checkBalance() {
        try {
            const data = {
                api_key: this.apiKey
            };

            const response = await axios.post(`${this.apiUrl}/saldo`, data, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            return response.data;
        } catch (error) {
            console.error("Error checking balance:", error.message);
            throw error;
        }
    }

    async createOrder(serviceId, destination, referenceId, contact) {
        try {
            const data = {
                api_key: this.apiKey,
                service_id: serviceId,
                target: destination,
                kontak: contact,
                idtrx: referenceId
            };

            const response = await axios.post(`${this.apiUrl}/order`, data, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            return response.data;
        } catch (error) {
            console.error("Error creating order:", error.message);
            throw error;
        }
    }

    async checkOrderStatus(orderId) {
        try {
            const data = {
                api_key: this.apiKey,
                order_id: orderId
            };

            const response = await axios.post(`${this.apiUrl}/status`, data, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            return response.data;
        } catch (error) {
            console.error("Error checking order status:", error.message);
            throw error;
        }
    }

    async getServices() {
        try {
            const data = {
                api_key: this.apiKey
            };

            const response = await axios.post(`${this.apiUrl}/service`, data, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching services:", error.message);
            throw error;
        }
    }
}