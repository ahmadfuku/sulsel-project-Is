import crypto from "crypto"
import fetch from "node-fetch"

let handler = async (m, { fukusima, command, text }) => {
    if (!text) return m.reply(`Format:\n${command} username,nomor`)
    let t = text.split(',')
    if (t.length < 2) return m.reply(`Format salah!\n${command} username,nomor`)

    let username = t[0]
    let u = m.quoted
        ? m.quoted.sender
        : t[1]
            ? t[1].replace(/[^0-9]/g, '') + '@s.whatsapp.net'
            : m.mentionedJid && m.mentionedJid[0]

    if (!u) return m.reply("Nomor tujuan tidak valid")

    try {
        let password = username + crypto.randomBytes(2).toString('hex')
        let email = username + "@adminpanel.ai"
        let name = username

        let makeAdmin = await fetch(global.domain + "/api/application/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + global.apikey
            },
            body: JSON.stringify({
                email,
                username,
                first_name: name,
                last_name: "Admin",
                language: "en",
                password,
                root_admin: true
            })
        })

        let res = await makeAdmin.json()
        if (res.errors) return m.reply(JSON.stringify(res.errors[0], null, 2))

        let info = `
🛠️ *ADMIN PANEL BERHASIL DIBUAT*

👤 *Username:* ${username}
📧 *Email:* ${email}
🔑 *Password:* ${password}

🛡️ *Level:* Administrator
🌐 *Panel:* ${global.domain}
        `.trim()

        await fukusima.sendMessage(u, { text: info })
        m.reply("✅ Admin panel berhasil dibuat & dikirim ke user")

    } catch (err) {
        m.reply("❌ Gagal: " + err.message)
    }
}

handler.help = ['cadmin', 'cadp']
handler.tags = ['panel']
handler.command = /^(cadmin|cadp)$/i
handler.owner = true

export default handler