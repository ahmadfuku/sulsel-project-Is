import fs from "fs"
import { exec } from "child_process"

let handler = async (m, { fukusima, command }) => {
  try {
    const ownerNumbers = global.owner || []
    if (!ownerNumbers.length) return
    await fukusima.reply(m.chat, "Sedang membuat backup file...", m)

    const output = `Fuku GEN-${global.versi}.zip` // nama file tetap
    const zipCmd = `zip -r "${output}" . \
      -x "node_modules/*" ".git/*" ".npm/*" ".cache/*" \
      "temp/*" "sessions/*" "*.zip" "package-lock.json"`

    exec(zipCmd, async (err) => {
      if (err) {
        console.log(err)
        return fukusima.reply(m.chat, "Gagal membuat file backup", m)
      }

      const buffer = fs.readFileSync(output)
      for (let owner of ownerNumbers) {
        let jid = owner[0] + "@s.whatsapp.net" // pastikan format WA JID
        await fukusima.sendMessage(
          jid,
          {
            document: buffer,
            fileName: output,
            mimetype: "application/zip"
          }
        )
      }

      fs.unlinkSync(output)
      fukusima.reply(m.chat, "Backup berhasil dikirim ke owner ✅", m)
    })
  } catch (err) {
    console.log(err)
    fukusima.reply(m.chat, "Terjadi kesalahan saat backup", m)
  }
}

handler.help = ["backup", "bk"]
handler.tags = ["owner"]
handler.command = /^bk$/i
handler.owner = true

export default handler