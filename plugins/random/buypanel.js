import fs from "fs"
import crypto from "crypto"
import fetch from "node-fetch"
import axios from "axios"

let handler = async (m, { fukusima, text }) => {
    if (!text) return m.reply("Format:\n.buypanel username,62xxxx,1gb")

    let t = text.split(',')
    if (t.length < 3) return m.reply("Format:\n.buypanel username,62xxxx,1gb")

    let username = t[0].trim()
    let nomor = t[1].replace(/[^0-9]/g, '')
    let paket = t[2].toLowerCase()

    let harga = {
        "1gb": 1000,
        "2gb": 2000,
        "3gb": 3000,
        "4gb": 4000,
        "5gb": 5500,
        "6gb": 6700,
        "8gb": 8900,
        "unli": 10000,
        "unlimited": 10000
    }[paket]

    if (!harga) return m.reply("Paket tidak ditemukan")

    const userdb = global.db.data.users[m.sender]
    if (!userdb.deposit) userdb.deposit = 0

    async function makePanel() {
        let ram = {
            "1gb": 1000,
            "2gb": 2000,
            "3gb": 3000,
            "4gb": 4000,
            "5gb": 5000,
            "6gb": 6000,
            "8gb": 8000,
            "unli": 0,
            "unlimited": 0
        }[paket]

        let disknya = ram === 0 ? 0 : 2000
        let cpu = ram === 0 ? 0 : 120

        let u = nomor + "@s.whatsapp.net"
        let password = username + crypto.randomBytes(2).toString("hex")
        let email = username + "@fukuxtrem.ai"

        let userRes = await fetch(global.domain + "/api/application/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + global.apikey
            },
            body: JSON.stringify({
                email,
                username,
                first_name: username,
                last_name: "Panel",
                language: "en",
                password
            })
        })

        let userData = await userRes.json()
        if (userData.errors) return m.reply(JSON.stringify(userData.errors[0]))

        let usr_id = userData.attributes.id
        let egg = await (await fetch(global.domain + `/api/application/nests/${global.nestid}/eggs/${global.egg}`, {
            headers: { "Authorization": "Bearer " + global.apikey }
        })).json()

        let serverRes = await fetch(global.domain + "/api/application/servers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + global.apikey
            },
            body: JSON.stringify({
                name: username,
                description: global.namabot,
                user: usr_id,
                egg: parseInt(global.egg),
                docker_image: "ghcr.io/parkervcp/yolks:nodejs_18",
                startup: egg.attributes.startup,
                environment: {
                    INST: "npm",
                    USER_UPLOAD: "0",
                    AUTO_UPDATE: "0",
                    JS_FILE: "index.js",
                    CMD_RUN: "npm start"
                },
                limits: {
                    memory: ram,
                    swap: 0,
                    disk: disknya,
                    io: 500,
                    cpu: cpu
                },
                feature_limits: {
                    databases: 5,
                    backups: 5,
                    allocations: 5
                },
                deploy: {
                    locations: [parseInt(global.loc)],
                    dedicated_ip: false,
                    port_range: []
                }
            })
        })

        let serverData = await serverRes.json()
        if (serverData.errors) return m.reply(JSON.stringify(serverData.errors[0]))

        await fukusima.sendMessage(u, {
            text:
`🟢 PANEL SIAP DIGUNAKAN

Username: ${username}
Password: ${password}

RAM: ${ram === 0 ? "Unlimited" : ram / 1000 + "GB"}
CPU: ${cpu === 0 ? "Unlimited" : cpu + "%"}
Disk: ${disknya === 0 ? "Unlimited" : disknya / 1000 + "GB"}

Domain: ${global.domain}`
        })

        m.reply("Berhasil membuat panel, info login telah dikirim ke user.")
    }

    if (userdb.deposit >= harga) {
        userdb.deposit -= harga
        await makePanel()
        return
    }

    try {
        const create = await axios.get(`https://www.fuku-api.my.id/api/gateaway?harga=${harga}`)
        if (!create.data.status) return m.reply("Gagal membuat transaksi.")

        const { qr_string, transactionId, totalAmount, expiredAt } = create.data

        const qrUrl =
          `https://larabert-qrgen.hf.space/v1/create-qr-code` +
          `?size=500x500&style=2&color=ea580c&data=${encodeURIComponent(qr_string)}`

        await fukusima.sendMessage(m.chat, {
            image: { url: qrUrl },
            caption:
`🧾 *PEMBAYARAN PANEL*

📦 Paket: *${paket}*
💵 Harga: *Rp${harga}*
💳 Total: *Rp${totalAmount}*

🆔 Transaction ID:
${transactionId}

⏳ Expired:
${new Date(expiredAt).toLocaleTimeString()}

📌 Scan QR di atas sebelum waktu habis`
        })

        let selesai = false

        const cek = setInterval(async () => {
            try {
                const res = await axios.get(`https://www.fuku-api.my.id/api/gatcheck?transactionId=${transactionId}`)
                const data = res.data

                if (data.status && data.paymentStatus === "paid") {
                    clearInterval(cek)
                    selesai = true

                    await fukusima.sendMessage(m.chat, {
                        text: "💰 Pembayaran diterima.\n⚙️ Panel sedang dibuat, mohon tunggu..."
                    })

                    await makePanel()
                }
            } catch {}
        }, 5000)

        setTimeout(() => {
            if (!selesai) m.reply("⏰ Transaksi kadaluarsa.")
            clearInterval(cek)
        }, 15 * 60 * 1000)

    } catch {
        m.reply("Gagal membuat transaksi.")
    }
}

handler.help = ["buypanel"]
handler.tags = ["payment", "panel", "store"]
handler.command = /^buypanel$/i
handler.register = true

export default handler