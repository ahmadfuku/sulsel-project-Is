import axios from "axios";

const base = "https://api.cloudflare.com";

export class Cloudflare {
    constructor({ zone, token, domain }) {
        this.zone = zone;
        this.token = token;
        this.domain = domain;

        if (!this.zone) throw new Error("Zone not found");
        if (!this.token) throw new Error("Token not found");
        if (!this.domain) throw new Error("Domain not found");
    }

    async createSubdomain(host, ip) {
        try {
            const response = await axios.post(
                `${base}/client/v4/zones/${this.zone}/dns_records`,
                {
                    type: "A",
                    name: `${host.replace(/[^a-z0-9.-]/gi, "")}.${this.domain}`,
                    content: ip.replace(/[^0-9.]/gi, ""),
                    ttl: 3600,
                    priority: 10,
                    proxied: true
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const res = response.data;

            if (res.success) {
                return {
                    success: true,
                    zone: res.result?.zone_name,
                    name: res.result?.name,
                    ip: res.result?.content
                };
            } else {
                return {
                    success: false,
                    error: res.errors || "Unknown error"
                };
            }
        } catch (err) {
            return {
                success: false,
                error: String(err.response?.data || err)
            };
        }
    }

    async listSubdomains() {
        try {
            const response = await axios.get(
                `${base}/client/v4/zones/${this.zone}/dns_records`,
                {
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const result = response.data.result.map(record => ({
                id: record.id,
                zone_id: record.zone_id,
                zone_name: record.zone_name,
                name: record.name,
                type: record.type,
                content: record.content,
                proxiable: record.proxiable,
                proxied: record.proxied,
                ttl: record.ttl,
                locked: record.locked
            }));

            return {
                success: true,
                data: result
            };
        } catch (err) {
            return {
                success: false,
                error: err
            };
        }
    }

    async deleteSubdomain(dnsRecordId) {
        try {
            const response = await axios.delete(
                `${base}/client/v4/zones/${this.zone}/dns_records/${dnsRecordId}`,
                {
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            return {
                success: true,
                data: response.data
            };
        } catch (err) {
            return {
                success: false,
                error: err
            };
        }
    }

    async getSubdomainDetails(dnsRecordId) {
        try {
            const response = await axios.get(
                `${base}/client/v4/zones/${this.zone}/dns_records/${dnsRecordId}`,
                {
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            return {
                success: true,
                data: response.data
            };
        } catch (err) {
            return {
                success: false,
                error: err
            };
        }
    }
}