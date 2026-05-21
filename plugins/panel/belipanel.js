import fetch from "node-fetch"
import QRCode from "qrcode"

const hargaMap = {
  "1gb": 300,
  "2gb": 1000,
  "3gb": 1002,
  "4gb": 2000,
  "5gb": 3000,
  "6gb": 4000,
  "7gb": 5000,
  "8gb": 5500,
  "unli": 10000,
  "unlimited": 10000
}

let handler = async (m, { text, fukusima }) => {
  if (!text) return m.reply("Format: .belipanel username,paket,nomor")

  let t = text.split(',').map(v => v.trim())
  if (t.length < 3) return m.reply("Format salah")

  let username = t[0]
  let paket = t[1].toLowerCase()
  let nomor = t[2].replace(/[^0-9]/g, '')

  if (!hargaMap[paket]) return m.reply("Paket tidak ditemukan")

  let amount = hargaMap[paket]
  let order_id = "INV" + Date.now()

  // CREATE QRIS
  let res = await fetch("https://app.pakasir.com/api/transactioncreate/qris", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      project: "fukusimaxyz",
      order_id,
      amount,
      api_key: global.pakasirKey
    })
  })

  let data = await res.json()

  if (!data || !data.payment || !data.payment.payment_number) {
    return m.reply("❌ Gagal membuat QRIS\n" + JSON.stringify(data, null, 2))
  }

  let qrString = data.payment.payment_number
  let qrImage = await QRCode.toDataURL(qrString)

  // simpan transaksi
  if (!global.db.data.trx) global.db.data.trx = {}
  global.db.data.trx[order_id] = {
    username,
    paket,
    nomor,
    amount,
    status: "pending"
  }

  await m.reply(`💳 PEMBAYARAN PANEL

User: ${username}
Paket: ${paket}
Total: Rp${data.payment.total_payment}
Expired: ${data.payment.expired_at}

Scan QR di bawah untuk bayar`)

  // kirim qr buffer
  let base64 = qrImage.split(',')[1]
  let buffer = Buffer.from(base64, 'base64')

  await fukusima.sendMessage(m.chat, { image: buffer })

  // polling status
  let start = Date.now()

  let interval = setInterval(async () => {
    try {
      // stop kalau 5 menit
      if (Date.now() - start > 5 * 60 * 1000) {
        clearInterval(interval)
        m.reply("❌ Pembayaran expired / tidak ditemukan.")
        return
      }

      let cek = await fetch(`https://app.pakasir.com/api/transactiondetail?project=fukusimaxyz&amount=${amount}&order_id=${order_id}&api_key=${global.pakasirKey}`)
      let cekData = await cek.json()

      if (cekData.transaction?.status === "completed") {
        clearInterval(interval)

        m.reply("✅ Pembayaran berhasil. Panel sedang dibuat...")

        global.db.data.trx[order_id].status = "paid"

        // panggil function panel lu
        await buatPanel(username, paket, nomor)

        m.reply("🎉 Panel berhasil dibuat & dikirim ke user")
      }

      if (cekData.transaction?.status === "canceled") {
        clearInterval(interval)
        m.reply("❌ Transaksi dibatalkan")
      }

    } catch (e) {
      clearInterval(interval)
      m.reply("❌ Error cek pembayaran: " + e.message)
    }

  }, 15000) // cek tiap 15 detik
}

handler.command = ["belipanel"]
export default handler