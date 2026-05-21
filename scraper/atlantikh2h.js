import axios from "axios";

export class AtlanticPedia {
    constructor(apiKey) {
        this._apiKey = apiKey;
        this._endpoint = "https://atlantich2h.com";
    }

    async getProfile() {
        try {
            const params = new URLSearchParams();
            params.append("api_key", this._apiKey);

            const response = await axios.post(
                `${this._endpoint}/get_profile`,
                params.toString(),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            );

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async createTransaction(code, refId, target) {
        try {
            const params = new URLSearchParams();
            params.append("api_key", this._apiKey);
            params.append("code", code);
            params.append("reff_id", refId);
            params.append("target", target);

            const response = await axios.post(
                `${this._endpoint}/transaksi/create`,
                params.toString(),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            );

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async checkTransactionStatus(id, type) {
        try {
            const params = new URLSearchParams();
            params.append("api_key", this._apiKey);
            params.append("id", id);
            params.append("type", type);

            const response = await axios.post(
                `${this._endpoint}/transaksi/status`,
                params.toString(),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            );

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getPriceList(type, code = null) {
        try {
            const params = new URLSearchParams();
            params.append("api_key", this._apiKey);
            params.append("type", type);

            if (code) {
                params.append("code", code);
            }

            const response = await axios.post(
                `${this._endpoint}/layanan/price_list`,
                params.toString(),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            );

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async createDeposit(reffId, nominal, type, method) {
        try {
            const params = new URLSearchParams();
            params.append("api_key", this._apiKey);
            params.append("reff_id", reffId);
            params.append("nominal", nominal);
            params.append("type", type);
            params.append("metode", method);

            const response = await axios.post(
                `${this._endpoint}/deposit/create`,
                params.toString(),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            );

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async cancelDeposit(id) {
        try {
            const params = new URLSearchParams();
            params.append("api_key", this._apiKey);
            params.append("id", id);

            const response = await axios.post(
                `${this._endpoint}/deposit/cancel`,
                params.toString(),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            );

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async checkDepositStatus(id) {
        try {
            const params = new URLSearchParams();
            params.append("api_key", this._apiKey);
            params.append("id", id);

            const response = await axios.post(
                `${this._endpoint}/deposit/status`,
                params.toString(),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            );

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getDepositMethods(type = null, method = null) {
        try {
            const params = new URLSearchParams();
            params.append("api_key", this._apiKey);

            if (type) {
                params.append("type", type);
            }

            if (method) {
                params.append("metode", method);
            }

            const response = await axios.post(
                `${this._endpoint}/deposit/metode`,
                params.toString(),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            );

            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

// Cuma named export saja, tanpa default export