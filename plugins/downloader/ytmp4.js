import axios from "axios"

let handler = async (m, { text, fukusima }) => {
  if (!text) return m.reply("url mana")

  try {
    await m.reply("⏳ sedang mengambil video...")

    const api = `https://api.fukugpt.my.id/api/ytmp4?api=${global.apifuku}&url=${encodeURIComponent(text)}`
    const { data } = await axios.get(api)

    if (!data.status) return m.reply("gagal ambil video")

    const v = data.result
    const url = v.download

    let sizeMB = 0

    try {
      const head = await axios.head(url)
      const bytes = head.headers["content-length"]
      if (bytes) sizeMB = bytes / 1024 / 1024
    } catch {
      sizeMB = 0
    }

    const caption = `*${v.title}*\n\nDurasi: ${v.duration}\nQuality: ${v.quality}\nExt: ${v.ext}`

    if (sizeMB > 100) {
      await m.reply("📦 File besar terdeteksi, kirim sebagai document...")

      await fukusima.sendMessage(m.chat, {
        document: { url },
        mimetype: "video/mp4",
        fileName: v.filename || "video.mp4",
        caption,
        contextInfo: {
          externalAdReply: {
            title: v.title,
            body: "Youtube Downloader",
            thumbnailUrl: v.thumbnail,
            sourceUrl: text,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m })

    } else {
      await fukusima.sendMessage(m.chat, {
        video: { url },
        caption,
        contextInfo: {
          externalAdReply: {
            title: v.title,
            body: "Youtube Downloader",
            thumbnailUrl: v.thumbnail,
            sourceUrl: text,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m })
    }

  } catch (e) {
    console.log(e)
    m.reply("error bang")
  }
}

handler.help = ["ytmp4","ytvideo"]
handler.tags = ["downloader"]
handler.command = /^(ytmp4|ytvideo)$/i
handler.limit = true
handler.register = true
export default handler