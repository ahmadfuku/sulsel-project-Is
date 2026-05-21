import fetch from "node-fetch"
import fs from "fs"
import { promisify } from "util"
import { exec } from "child_process"
const execAsync = promisify(exec)

let handler = async (m, { fukusima, text, command }) => {
  try {
    if (!text) return m.reply(`Contoh: .${command} <url>`)
    m.reply("Tunggu sebentar...")

    const api = `https://api.fukugpt.my.id/api/ytmp3?api=fukuxyz_bd912e&url=${encodeURIComponent(text)}`
    const res = await fetch(api)
    const json = await res.json()

    if (!json.status) throw new Error("Gagal mengambil audio")

    const audioUrl = json.result.download
    const title = (json.result.title || "ytmp3").replace(/[\\/:*?"<>|]/g, "")

    const inputFile = `.yt_${Date.now()}.mp4`
    const outputFile = `.yt_${Date.now()}.mp3`

    const audioRes = await fetch(audioUrl)
    const buffer = Buffer.from(await audioRes.arrayBuffer())
    fs.writeFileSync(inputFile, buffer)

    await execAsync(`ffmpeg -i "${inputFile}" -vn -ar 44100 -ac 2 -b:a 128k "${outputFile}"`)

    const mp3Buffer = fs.readFileSync(outputFile)

    await fukusima.sendMessage(
      m.chat,
      {
        audio: mp3Buffer,
        mimetype: "audio/mpeg",
        fileName: `${title}.mp3`
      },
      { quoted: m }
    )

    fs.unlinkSync(inputFile)
    fs.unlinkSync(outputFile)

  } catch (e) {
    m.reply("Gagal convert ke MP3")
  }
}

handler.command = ["ytmp3"]
handler.tags = ["downloader"]
handler.help = ["ytmp3 <url>"]
handler.register = true
handler.limit = true

export default handler