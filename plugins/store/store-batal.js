import moment from "moment-timezone"

const handler = async (m, { text }) => {

  if (!text || !text.includes(",")) {
    return m.reply(`❗ Format salah!\n\nContoh:\n.gagal Pulsa 20K,Salah nomor`)
  }

  let [barang, alasan] = text.split(",").map(v => v.trim())
  if (!barang || !alasan) return m.reply("❗ Semua data wajib diisi!")

  let waktu = moment.tz("Asia/Jakarta").format("dddd, DD MMMM YYYY HH:mm")

  let msg = `
 *TRANSAKSI GAGAL*

🛍️ *Produk:* ${barang}
📄 *Alasan:* ${alasan}

🗓️ *Tanggal:* ${moment.tz("Asia/Jakarta").format("dddd, DD MMMM YYYY")}
⏰ *Waktu:* ${moment.tz("Asia/Jakarta").format("HH:mm")}

⚠️ Transaksi tidak dapat diproses.
Silakan hubungi admin untuk penyelesaian masalah.

Ketik *.owner* untuk kontak admin.
`.trim()

  m.reply(msg)
}

handler.help = ['batal <barang,alasan>']
handler.tags = ['store']
handler.command = /^batal$/i

export default handler