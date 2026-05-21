import fs from "fs"
import moment from "moment-timezone"

const dbFile = "./data/proses.json"
if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, "{}")

let handler = async (m, { command, text, fukusima, quoted }) => {
    const timezone = "Asia/Jakarta"
    let db = JSON.parse(fs.readFileSync(dbFile))

    if (command === "proses") {
        if (!text) return m.reply("Contoh:\n.proses Nama Barang|Harga")
        let [item, price] = text.split("|")
        if (!item || !price) return m.reply("Format salah! Gunakan: Nama Barang|Harga")

        let id = Math.floor(Math.random() * 1000000).toString()
        db[id] = {
            item,
            price,
            status: false,
            time: moment().tz(timezone).format("YYYY-MM-DD HH:mm:ss")
        }

        fs.writeFileSync(dbFile, JSON.stringify(db, null, 2))

        m.reply(
            `✅ Transaksi diproses\n\n` +
            `Nama Barang: ${item}\n` +
            `Harga: ${price}\n` +
            `Id Transaksi: ${id}\n` +
            `Status: Proses\n` +
            `Waktu: ${db[id].time}`
        )
    }

    if (command === "done" || command === "udah") {
        let id = text || (quoted && quoted.text)
        if (!id) return m.reply("Kirim .done IdTransaksi atau reply chat .done")

        let tr = db[id]
        if (!tr) return m.reply("Id Transaksi tidak ditemukan!")

        tr.status = true
        tr.time = moment().tz(timezone).format("YYYY-MM-DD HH:mm:ss")
        fs.writeFileSync(dbFile, JSON.stringify(db, null, 2))

        let caption =
            `✅ Status Pembelian Berhasil\n\n` +
            `Nama Barang: ${tr.item}\n` +
            `Harga: ${tr.price}\n` +
            `Id Transaksi: ${id}\n` +
            `Status: Selesai\n` +
            `Waktu: ${tr.time}`

        await fukusima.sendMessage(m.chat, { text: caption }, { quoted: m })
    }
}

handler.command = /^(proses|done|udah)$/i
handler.tags = ["store"]
handler.help = ["proses <Nama|Harga>", "done <IdTransaksi>", "udah <IdTransaksi>"]
handler.register = true

export default handler