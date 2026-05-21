import axios from "axios"

let handler = async (m, { fukusima, text, command }) => {
  if (!text) return fukusima.sendMessage(m.chat, { text: `Contoh:\n.${command} username` }, { quoted: m })

  try {
    let url = `https://zelapioffciall.koyeb.app/stalk/tiktok?username=${encodeURIComponent(text)}`
    let { data } = await axios.get(url)

    if (!data.status || !data.result)
      return fukusima.sendMessage(m.chat, { text: "Akun tidak ditemukan." }, { quoted: m })

    let i = data.result

    let caption = `
🎵 *TIKTOK STALK*

👤 Username: ${i.username}
📛 Nickname: ${i.nickname}
✔️ Verified: ${i.verified ? "Ya" : "Tidak"}
🌍 Region: ${i.region || "-"}

📄 Bio:
${i.bio.text || "-"}

📊 Statistik:
• Followers: ${i.stats.followers}
• Following: ${i.stats.following}
• Likes: ${i.stats.likes}
• Videos: ${i.stats.videos}
• Diggs: ${i.stats.diggs}
• Est. Followback: ${i.stats.estimated_folback}

🆔 SecUID:
${i.profile.secUid}
`.trim()

    await fukusima.sendMessage(
      m.chat,
      {
        image: { url: i.profile.picture },
        caption
      },
      { quoted: m }
    )

  } catch (e) {
    await fukusima.sendMessage(m.chat, { text: "Gagal mengambil data TikTok." }, { quoted: m })
  }
}

handler.help = ["tiktokstalk <user>", "ttstalk <user>"]
handler.tags = ["stalk"]
handler.command = /^(tiktokstalk|ttstalk)$/i
handler.register = true

export default handler