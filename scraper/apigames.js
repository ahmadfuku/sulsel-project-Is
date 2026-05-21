import axios from "axios";
import crypto from "crypto";

export class ApiGames {
    constructor(merchantId, secretKey) {
        this.merchantId = merchantId;
        this.secretKey = secretKey;
        this.baseUrl = "https://v1.apigames.id/";
    }

    async getMerchantData() {
        const rawSignature = `${this.merchantId}:${this.secretKey}`;
        const signature = crypto
            .createHash("md5")
            .update(rawSignature)
            .digest("hex");
        const url = `${this.baseUrl}merchant/${this.merchantId}?signature=${signature}`;

        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error("Error fetching merchant data:", error.message);
            return null;
        }
    }
    // place other function
}