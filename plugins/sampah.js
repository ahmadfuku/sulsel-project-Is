import fs from "fs"
import path from "path"

let handler = async (m, { fukusima }) => {

  const root = "./"
  const fuku = "./fuku"

  const extRoot = [".mp4", ".mp3", ".jpg", ".jpeg", ".png", ".txt"]
  const extFuku = [".jpg", ".jpeg", ".png", ".txt", ".mp4"]

  let total = 0
  let deletedList = []

  function scanDelete(folder, exts) {
    if (!fs.existsSync(folder)) return
    const files = fs.readdirSync(folder)

    for (let file of files) {
      const full = path.join(folder, file)
      if (!fs.existsSync(full)) continue

      const stat = fs.statSync(full)
      if (stat.isFile()) {
        const ext = path.extname(file).toLowerCase()
        if (exts.includes(ext)) {
          try {
            fs.unlinkSync(full)
            total++
            deletedList.push(file)
          } catch {}
        }
      }
    }
  }

  await m.reply("🧹 scanning sampah...")

  scanDelete(root, extRoot)
  scanDelete(fuku, extFuku)

  const teks = `🗑️ *Trash Cleaner*

Total sampah dihapus: *${total} file*

${total === 0 ? "Folder bersih, gak ada sampah." : "Pembersihan selesai."}`

  await fukusima.sendMessage(m.chat, {
    video: { url: "https://uploader.fuku-cloud.my.id/uploader/aa83270ca394.mp4" }, 
    gifPlayback: true,
    caption: teks
  }, { quoted: m })
}

handler.help = ["trash","clean","sampah"]
handler.tags = ["tools"]
handler.command = /^(trash|clean|sampah)$/i
handler.owner = true

export default handler