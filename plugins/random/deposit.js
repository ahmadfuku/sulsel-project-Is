import axios from "axios"
import QRCode from "qrcode"

let handler = async (m, { fukusima, text }) => {
  if (!text) return m.reply("Format:\n.deposit jumlah\n\nContoh:\n.deposit 10000")
  if (isNaN(text)) return m.reply("Jumlah harus berupa angka.")

  const jumlah = parseInt(text)
  const user = global.db.data.users[m.sender]
  if (!user.deposit) user.deposit = 0

  try {
    const create = await axios.get(`https://www.fuku-api.my.id/api/gateaway?harga=${jumlah}`)
    if (!create.data.status) return m.reply("Gagal membuat transaksi.")

    const { qr_string, transactionId, totalAmount, expiredAt } = create.data
    const qrBuffer = await QRCode.toBuffer(qr_string, { type: "png", width: 400 })

    await fukusima.sendMessage(m.chat, {
      image: qrBuffer,
      caption:
        `DEPOSIT PEMBAYARAN\n\n` +
        `Total: Rp${totalAmount}\n` +
        `Transaction ID: ${transactionId}\n` +
        `Berlaku sampai: ${new Date(expiredAt).toLocaleTimeString()}\n\n` +
        `Silakan lakukan pembayaran sebelum waktu habis.`
    })

    let finished = false

    const cek = setInterval(async () => {
      try {
        const res = await axios.get(`https://www.fuku-api.my.id/api/gatcheck?transactionId=${transactionId}`)
        const data = res.data

        if (data.status && data.paymentStatus === "paid") {
          clearInterval(cek)
          finished = true

          user.deposit += data.amount

          await fukusima.sendMessage(m.chat, {
            text:
              `Pembayaran Berhasil\n\n` +
              `Jumlah: Rp${data.amount}\n` +
              `Transaction ID: ${transactionId}\n` +
              `Total Deposit Anda: Rp${user.deposit}`
          })

          const devNumber = "6281527100923@s.whatsapp.net"
          await fukusima.sendMessage(devNumber, {
            text:
              `DEPOSIT MASUK\n\n` +
              `User: ${m.sender}\n` +
              `Jumlah: Rp${data.amount}\n` +
              `Transaction ID: ${transactionId}`
          })
        }
      } catch { }
    }, 5000)

    setTimeout(async () => {
      if (!finished) m.reply("Transaksi dibatalkan karena pembayaran tidak diterima dalam 15 menit.")
      clearInterval(cek)
    }, 15 * 60 * 1000)

  } catch {
    m.reply("Terjadi kesalahan saat membuat transaksi.")
  }
}

handler.help = ["deposit"]
handler.tags = ["payment"]
handler.command = /^deposit$/i
handler.register = true

export default handler