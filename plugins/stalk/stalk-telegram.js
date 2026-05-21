import axios from "axios"

let handler = async (m, { fukusima, text, command }) => {
  if (!text) return fukusima.sendMessage(m.chat, { text: `Contoh:\n.${command} username` }, { quoted: m })

  try {
    let url = `https://zelapioffciall.koyeb.app/stalk/telegram?username=${encodeURIComponent(text)}`
    let { data } = await axios.get(url)

    if (!data.status || !data.result)
      return fukusima.sendMessage(m.chat, { text: "Akun tidak ditemukan." }, { quoted: m })

    let i = data.result

    let caption = `
📨 *TELEGRAM STALK*

👤 Username: ${i.username}
📛 Title: ${i.title}
📄 Bio: ${i.bio}

🔗 Link Profil:
${i.link}
`.trim()

    await fukusima.sendMessage(
      m.chat,
      {
        image: { url: i.profile_picture },
        caption
      },
      { quoted: m }
    )

  } catch {
    await fukusima.sendMessage(m.chat, { text: "Gagal mengambil data Telegram." }, { quoted: m })
  }
}

handler.help = ["telegramstalk <user>", "telestalk <user>"]
handler.tags = ["stalk"]
handler.command = /^(telegramstalk|telestalk)$/i
handler.register = true

export default handler