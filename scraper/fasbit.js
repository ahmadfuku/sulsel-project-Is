import fetch from 'node-fetch';

export class Fastbit {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = "https://fastbit.tech/api";
    }

    async getCountries(applicationId) {
        try {
            const url = `${this.baseUrl}/services/countries?application_id=${applicationId}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "X-API-KEY": this.apiKey,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            throw error;
        }
    }

    async getUserProfile() {
        try {
            const response = await fetch(`${this.baseUrl}/profile`, {
                method: "GET",
                headers: {
                    "X-API-KEY": this.apiKey,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            throw error;
        }
    }

    async getServices() {
        try {
            const response = await fetch(`${this.baseUrl}/services`, {
                method: "GET",
                headers: {
                    "X-API-KEY": this.apiKey,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            throw error;
        }
    }

    async getOtpServices(serviceId, countryId) {
        try {
            const url = `${this.baseUrl}/otp-services?service_id=${serviceId}&country_id=${countryId}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "X-API-KEY": this.apiKey,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok)
                throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();

            return data;
        } catch (error) {
            throw error;
        }
    }

    async generateOrder(otpServiceId, quantity = 1) {
        try {
            const url = `${this.baseUrl}/generate-order?otp_service_id=${otpServiceId}&quantity=${quantity}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "X-API-KEY": this.apiKey,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok)
                throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();

            return data;
        } catch (error) {
            throw error;
        }
    }

    async getActiveOrders() {
        try {
            const url = `${this.baseUrl}/virtual-number/orders/active`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "X-API-KEY": this.apiKey,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            throw error;
        }
    }

    async getOrderDetails(orderUuid) {
        try {
            const url = `${this.baseUrl}/virtual-number/orders/${orderUuid}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "X-API-KEY": this.apiKey,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            throw error;
        }
    }

    async cancelOrder(orderUuid) {
        try {
            const url = `${this.baseUrl}/virtual-number/orders/${orderUuid}/cancel`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "X-API-KEY": this.apiKey,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            throw error;
        }
    }

    async finishOrder(orderUuid) {
        try {
            const url = `${this.baseUrl}/virtual-number/orders/${orderUuid}/finish`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "X-API-KEY": this.apiKey,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            throw error;
        }
    }
}

// Named export saja