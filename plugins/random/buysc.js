import axios from "axios"

let handler = async (m, { fukusima }) => {
  const harga = 75000
  try {
    const create = await axios.get(
      `https://www.fuku-api.my.id/api/gateaway?harga=${harga}`
    )

    if (!create.data.status) return m.reply("Gagal membuat transaksi.")

    const { qr_string, transactionId, totalAmount, expiredAt } = create.data

    const qrUrl =
      `https://larabert-qrgen.hf.space/v1/create-qr-code` +
      `?size=500x500&style=2&color=ea580c&data=${encodeURIComponent(qr_string)}`

    await fukusima.sendMessage(m.chat, {
      image: { url: qrUrl },
      caption:
        `🧾 *PEMBAYARAN SCRIPT*\n\n` +
        `💳 Total: *Rp${totalAmount}*\n` +
        `🆔 Transaction ID:\n${transactionId}\n\n` +
        `⏳ Berlaku sampai:\n${new Date(expiredAt).toLocaleTimeString()}\n\n` +
        `📌 Scan QR di atas untuk melanjutkan pembayaran`
    })

    const cek = setInterval(async () => {
      try {
        const res = await axios.get(
          `https://www.fuku-api.my.id/api/gatcheck?transactionId=${transactionId}`
        )

        const data = res.data

        if (data.status && data.paymentStatus === "paid") {
          clearInterval(cek)

          await fukusima.sendMessage(m.chat, {
            text: "✅ *Pembayaran diterima!*\nPermintaan anda sedang diproses."
          })

          const devNumber = "6281527100923@s.whatsapp.net"
          const text =
            `💰 *PEMBAYARAN MASUK*\n\n` +
            `👤 User: ${m.sender}\n` +
            `💵 Total: Rp${data.amount}\n` +
            `🆔 Transaction ID:\n${transactionId}`

          await fukusima.sendMessage(devNumber, { text })
        }
      } catch (e) {
        console.error(e)
      }
    }, 5000)

    setTimeout(async () => {
      clearInterval(cek)
      await m.reply("⏰ Transaksi dibatalkan, pembayaran tidak diterima dalam 15 menit.")
    }, 15 * 60 * 1000)

  } catch (e) {
    console.error(e)
    m.reply("Terjadi kesalahan saat membuat transaksi.")
  }
}

handler.help = ["buysc"]
handler.tags = ["store"]
handler.command = /^buysc|buyscript$/i
handler.register = true

export default handler