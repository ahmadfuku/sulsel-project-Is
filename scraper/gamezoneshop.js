import axios from 'axios';

export class GameZoneShop {
    constructor(apiKey) {
        this._apiKey = apiKey;
        this._endpoint = "https://gamezoneshop.id/api";
    }

    async balance() {
        try {
            const params = new URLSearchParams();
            params.append("api_key", this._apiKey);

            const { data } = await axios.post(
                `${this._endpoint}/saldo`,
                params.toString(),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            );

            return data;
        } catch (error) {
            throw error;
        }
    }

    async order(
        serviceId,
        userId,
        serverId,
        trxId,
        phoneNumber,
        callbackUrl = ""
    ) {
        if (!serviceId || !userId || !trxId || !phoneNumber) {
            throw new Error(
                "Parameter serviceId, userId, trxId, dan phoneNumber wajib diisi."
            );
        }

        try {
            const targetData = serverId ? `${userId}|${serverId}` : userId;
            const params = new URLSearchParams();
            params.append("api_key", this._apiKey);
            params.append("action", "order");
            params.append("service_id", serviceId);
            params.append("target", targetData);
            params.append("kontak", phoneNumber);
            params.append("partner_id", trxId);
            params.append("callback", callbackUrl);

            const { data } = await axios.post(
                `${this._endpoint}/order`,
                params.toString(),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            );

            return data;
        } catch (error) {
            throw error;
        }
    }

    async service() {
        try {
            const params = new URLSearchParams();
            params.append("api_key", this._apiKey);

            const { data } = await axios.post(
                `${this._endpoint}/service`,
                params.toString(),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            );

            return data;
        } catch (error) {
            throw error;
        }
    }

    async status(orderId) {
        try {
            const params = new URLSearchParams();
            params.append("api_key", this._apiKey);
            params.append("action", "status");
            params.append("order_id", orderId);

            const { data } = await axios.post(
                `${this._endpoint}/status`,
                params.toString(),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            );

            return data;
        } catch (error) {
            throw error;
        }
    }
}