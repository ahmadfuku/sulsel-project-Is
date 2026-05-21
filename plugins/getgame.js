import axios from "axios"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

let handler = async (m, { text, fukusima }) => {

  let keySakti = "8B1hLF2EdWV9AvR3KZAzIFQljKgWUGS0WWjaRJ9K5IIe1JawkQNq90X7KVD2gA9t"
  let signJadi = "6353843c64d39649b484709436f5f663"

  let __dirname = path.dirname(fileURLToPath(import.meta.url))
  let folderNgaco = path.join(__dirname, "./games")
  let fileNgaco = path.join(folderNgaco, "games.json")

  try {

    if (!fs.existsSync(folderNgaco)) fs.mkdirSync(folderNgaco, { recursive: true })
    if (!fs.existsSync(fileNgaco)) fs.writeFileSync(fileNgaco, JSON.stringify([]))

    let filterGameNgawur = ""
    let filterStatusNgawur = ""

    if (text) {
      let pecahNgaco = text.split("|")
      filterGameNgawur = pecahNgaco[0] || ""
      filterStatusNgawur = pecahNgaco[1] || ""
    }

    let bodyNgawur = new URLSearchParams()
    bodyNgawur.append("key", keySakti)
    bodyNgawur.append("sign", signJadi)
    bodyNgawur.append("type", "services")

    if (filterGameNgawur) bodyNgawur.append("filter_game", filterGameNgawur)
    if (filterStatusNgawur) bodyNgawur.append("filter_status", filterStatusNgawur)

    let { data } = await axios.post(
      "https://vip-reseller.co.id/api/game-feature",
      bodyNgawur.toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    )

    if (!data.result) return fukusima.sendMessage(m.chat, { text: "gagal ambil data: " + data.message }, { quoted: m })

    let dbLama = JSON.parse(fs.readFileSync(fileNgaco))
    let dbBaru = data.data

    if (JSON.stringify(dbLama) !== JSON.stringify(dbBaru)) {
      fs.writeFileSync(fileNgaco, JSON.stringify(dbBaru, null, 2))
    }

    let teks = `┏━━━〔 LIST GAME FEATURE 〕━━━┓\n\n`

    for (let item of dbBaru) {

      teks += `Game     : ${item.game}\n`
      teks += `Produk   : ${item.name}\n`
      teks += `Kode     : ${item.code}\n`
      teks += `Harga    : Rp${item.price.special}\n`
      teks += `Status   : ${item.status === "available" ? "✅ Ready" : "❌ Kosong"}\n\n`
    }

    teks += `┗━━━━━━━━━━━━━━━━━━━━━━━┛`

    await fukusima.sendMessage(m.chat, {
      text: teks
    }, { quoted: m })

  } catch (e) {
    await fukusima.sendMessage(m.chat, {
      text: "error: " + e.message
    }, { quoted: m })
  }
}

handler.command = /^getgame$/i
export default handler