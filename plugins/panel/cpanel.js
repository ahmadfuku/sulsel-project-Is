import fs from "fs"
import crypto from "crypto"
import fetch from "node-fetch"

let handler = async (m, { fukusima, command, text }) => {
    if (!text) return m.reply(`Format:\n${command} username,nomor`)

    let t = text.split(',').map(v => v.trim())
    if (t.length < 2) return m.reply(`Format:\n${command} username,nomor`)

    let ram = null, disknya = null, cpu = null

    switch (command.toLowerCase()) {
        case "1gb": ram = 1000; disknya = 1000; cpu = 40; break
        case "2gb": ram = 2000; disknya = 1000; cpu = 60; break
        case "3gb": ram = 3000; disknya = 2000; cpu = 80; break
        case "4gb": ram = 4000; disknya = 2000; cpu = 100; break
        case "5gb": ram = 5000; disknya = 3000; cpu = 120; break
        case "6gb": ram = 6000; disknya = 3000; cpu = 140; break
        case "7gb": ram = 7000; disknya = 4000; cpu = 160; break
        case "8gb": ram = 8000; disknya = 4000; cpu = 180; break
        case "9gb": ram = 9000; disknya = 5000; cpu = 200; break
        case "10gb": ram = 10000; disknya = 5000; cpu = 220; break
        case "unli":
        case "unlimited":
            ram = 0; disknya = 0; cpu = 0
            break
    }

    if (ram === null) return m.reply("Paket tidak ditemukan")

    let username = t[0]
    let nomor = t[1].replace(/[^0-9]/g, '')
    if (!nomor) return m.reply("Nomor tidak valid")

    let u = nomor + "@s.whatsapp.net"

    if (u === fukusima.user.id)
        return m.reply("❌ Nomor tujuan tidak boleh nomor bot")

    try {
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
                last_name: "Server",
                language: "en",
                password
            })
        })

        let userData = await userRes.json()
        if (userData.errors) return m.reply(JSON.stringify(userData.errors[0], null, 2))

        let usr_id = userData.attributes.id

        let eggData = await (await fetch(
            `${global.domain}/api/application/nests/${global.nestid}/eggs/${global.egg}`,
            { headers: { "Authorization": "Bearer " + global.apikey } }
        )).json()

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
                startup: eggData.attributes.startup,
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
                    cpu
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
        if (serverData.errors) return m.reply(JSON.stringify(serverData.errors[0], null, 2))

        let panelInfo = `
🟢 PANEL BERHASIL DIBUAT

👤 Username: ${username}
🔑 Password: ${password}
🆔 Server ID: ${serverData.attributes.id}

💾 RAM: ${ram === 0 ? "Unlimited" : ram / 1000 + " GB"}
⚡ CPU: ${cpu === 0 ? "Unlimited" : cpu + "%"}
💿 Disk: ${disknya === 0 ? "Unlimited" : disknya / 1000 + " GB"}

🌐 ${global.domain}
        `.trim()

        await fukusima.sendMessage(u, { text: panelInfo })
        m.reply("✅ Panel berhasil dibuat & dikirim ke user")

    } catch (e) {
        m.reply("❌ Error: " + e.message)
    }
}

handler.help = ['1gb','2gb','3gb','4gb','5gb','6gb','7gb','8gb','9gb','10gb','unli','unlimited']
handler.tags = ['panel']
handler.command = /^(1gb|2gb|3gb|4gb|5gb|6gb|7gb|8gb|9gb|10gb|unli|unlimited)$/i
handler.premium = true
handler.register = true

export default handler