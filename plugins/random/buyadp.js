import fs from "fs"
import crypto from "crypto"
import fetch from "node-fetch"
import axios from "axios"

let handler = async (m, { fukusima, text, command }) => {
    if (!text) return m.reply(`Format:\n.${command} username,62xxxx`)

    let t = text.split(',')
    if (t.length < 2) return m.reply(`Format:\n.${command} username,62xxxx`)

    let username = t[0].trim()
    let nomor = t[1].replace(/[^0-9]/g, '')
    let u = nomor + "@s.whatsapp.net"

    const HARGA = 13000

    const userdb = global.db.data.users[m.sender]
    if (!userdb.deposit) userdb.deposit = 0

    async function makeAdminPanel() {
        let password = username + crypto.randomBytes(2).toString("hex")
        let email = username + "@adminpanel.ai"

        let res = await fetch(global.domain + "/api/application/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + global.apikey
            },
            body: JSON.stringify({
                email,
                username,
                first_name: username,
                last_name: "Admin",
                language: "en",
                password,
                root_admin: true
            })
        })

        let data = await res.json()
        if (data.errors) throw new Error(data.errors[0].detail)

        await fukusima.sendMessage(u, {
            text:
`🛠️ *ADMIN PANEL BERHASIL DIBUAT*

👤 Username: ${username}
📧 Email: ${email}
🔑 Password: ${password}

🛡️ Level: Administrator
🌐 Panel: ${global.domain}`
        })

        m.reply("✅ Admin panel berhasil dibuat & dikirim ke user")
    }

    if (userdb.deposit >= HARGA) {
        userdb.deposit -= HARGA
        await makeAdminPanel()
        return
    }

    try {
        const create = await axios.get(
            `https://www.fuku-api.my.id/api/gateaway?harga=${HARGA}`
        )

        if (!create.data.status) return m.reply("Gagal membuat transaksi.")

        const { qr_string, transactionId, totalAmount, expiredAt } = create.data

        const qrUrl =
          `https://larabert-qrgen.hf.space/v1/create-qr-code` +
          `?size=500x500&style=2&color=7c3aed&data=${encodeURIComponent(qr_string)}`

        await fukusima.sendMessage(m.chat, {
            image: { url: qrUrl },
            caption:
`🧾 *PEMBAYARAN ADMIN PANEL*

👑 Produk: *Admin Panel*
💵 Harga: *Rp${HARGA}*
💳 Total: *Rp${totalAmount}*

🆔 Transaction ID:
${transactionId}

⏳ Expired:
${new Date(expiredAt).toLocaleTimeString()}

📌 Scan QR sebelum waktu habis`
        })

        let selesai = false

        const cek = setInterval(async () => {
            try {
                const res = await axios.get(
                    `https://www.fuku-api.my.id/api/gatcheck?transactionId=${transactionId}`
                )

                if (res.data.status && res.data.paymentStatus === "paid") {
                    clearInterval(cek)
                    selesai = true

                    await fukusima.sendMessage(m.chat, {
                        text: "💰 Pembayaran diterima.\n⚙️ Admin panel sedang dibuat..."
                    })

                    await makeAdminPanel()
                }
            } catch {}
        }, 5000)

        setTimeout(() => {
            if (!selesai) m.reply("⏰ Transaksi kadaluarsa.")
            clearInterval(cek)
        }, 15 * 60 * 1000)

    } catch (e) {
        m.reply("❌ Gagal membuat transaksi.")
    }
}

handler.help = ["buyadp"]
handler.tags = ["payment", "panel", "store"]
handler.command = /^buyadp$/i
handler.register = true

export default handler