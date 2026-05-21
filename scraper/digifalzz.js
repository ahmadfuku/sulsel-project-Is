import axios from "axios";
import crypto from "crypto";

export class Digiflazz {
    constructor(username, key, webhook = null) {
        this._user = username;
        this._key = key;
        this._keyWebhooks = webhook;
        this._endpoint = "https://api.digiflazz.com/v1";
    }

    async balance() {
        const options = {
            method: "POST",
            url: `${this._endpoint}/cek-saldo`,
            data: {
                cmd: "deposit",
                username: this._user,
                sign: crypto.createHash("md5").update(`${this._user}${this._key}depo`).digest("hex")
            },
            headers: { "Content-Type": "application/json" }
        };
        const response = await axios(options);
        return response.data.data;
    }

    async checkPLN(customerNo) {
        const options = {
            method: "POST",
            url: `${this._endpoint}/transaction`,
            data: {
                commands: "pln-subscribe",
                customer_no: customerNo
            },
            headers: { "Content-Type": "application/json" }
        };
        const response = await axios(options);
        return response.data.data;
    }

    async deposit(amount, bank, name) {
        const options = {
            method: "POST",
            url: `${this._endpoint}/deposit`,
            data: {
                username: this._user,
                amount,
                Bank: bank,
                owner_name: name,
                sign: crypto.createHash("md5").update(`${this._user}${this._key}deposit`).digest("hex")
            },
            headers: { "Content-Type": "application/json" }
        };
        const response = await axios(options);
        return response.data.data;
    }

    async price(productType = "prepaid") {
        const options = {
            method: "POST",
            url: `${this._endpoint}/price-list`,
            data: {
                cmd: productType,
                username: this._user,
                sign: crypto.createHash("md5").update(`${this._user}${this._key}pricelist`).digest("hex")
            },
            headers: { "Content-Type": "application/json" }
        };
        const response = await axios(options);
        return response.data.data;
    }

    async transaction(code, customer, refID, cmd = null, msg = null) {
        const options = {
            method: "POST",
            url: `${this._endpoint}/transaction`,
            data: {
                username: this._user,
                buyer_sku_code: code,
                customer_no: customer,
                ref_id: refID,
                msg,
                sign: crypto.createHash("md5").update(`${this._user}${this._key}${refID}`).digest("hex")
            },
            headers: { "Content-Type": "application/json" }
        };
        if (cmd === "CEK") options.data.commands = "inq-pasca";
        if (cmd === "BAYAR") options.data.commands = "pay-pasca";
        if (cmd === "STATUS") options.data.commands = "status-pasca";

        const response = await axios(options);
        return response.data.data;
    }

    static webhook(middle) {
        return function middleHandler(req, res, next) {
            middle.onWebhook(req, res, next);
            next();
        };
    }

    onWebhook(req, res, next) {
        const hmac = "sha1=" + crypto.createHmac("sha1", this._keyWebhooks).update(JSON.stringify(req.body)).digest("hex");
        if (req.headers["x-hub-signature"] === hmac) {
            req.digiwebhooks = {
                event: req.headers["x-digiflazz-event"],
                delivery: req.headers["x-digiflazz-delivery"],
                data: req.body.data
            };
        }
        res.json({ msg: "received" });
    }
}