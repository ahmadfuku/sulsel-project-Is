import fetch from "node-fetch"

async function youtubeSearch(query, apikey) {
  try {
    const response = await fetch(`https://anabot.my.id/api/search/ytSearch?query=${encodeURIComponent(query)}&apikey=freeApikey`)
    const data = await response.json()
    return data
  } catch (e) {
    return { success: false }
  }
}

let handler = async (m, { fukusima, text, command, usedPrefix }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix + command} indonesia raya`)

  const api = await youtubeSearch(text, "freeApikey")
  if (!api?.success) return m.reply("Gagal ambil data")

  const vid = api.data.result[0]
  if (!vid) return m.reply("Tidak ditemukan")

  const caption = `
🎵 *YouTube Search*

📌 *Title:* ${vid.title}
⏱️ *Durasi:* ${vid.duration}
👁️ *Views:* ${vid.views}
📅 *Upload:* ${vid.uploaded}
👤 *Channel:* ${vid.author?.name || "-"}

🔗 ${vid.url}
`.trim()

  const buttons = [
    {
      buttonId: `.ytmp3 ${vid.url}`,
      buttonText: { displayText: "🎧 Audio" },
      type: 1
    },
    {
      buttonId: `.ytmp4 ${vid.url}`,
      buttonText: { displayText: "🎥 Video" },
      type: 1
    }
  ]

  await fukusima.sendMessage(m.chat, {
    image: { url: vid.thumbnail },
    caption,
    footer: "Youtube Player",
    buttons,
    headerType: 4,
    contextInfo: {
      externalAdReply: {
        title: vid.title,
        body: vid.author?.name || "YouTube",
        thumbnailUrl: vid.thumbnail,
        mediaType: 1,
        renderLargerThumbnail: true,
        sourceUrl: vid.url
      }
    }
  }, { quoted: m })
}

handler.help = ["play", "yts", "youtubesearch"]
handler.tags = ["downloader"]
handler.command = /^(play|yts|youtubesearch)$/i

export default handler