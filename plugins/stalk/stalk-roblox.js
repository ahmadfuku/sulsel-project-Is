import axios from "axios"

let handler = async (m, { fukusima, text, command }) => {
  if (!text)
    return fukusima.sendMessage(m.chat, { text: `Contoh:\n.${command} username` }, { quoted: m })

  try {
    let url = `https://zelapioffciall.koyeb.app/stalk/roblox?user=${encodeURIComponent(text)}`
    let { data } = await axios.get(url)

    if (!data.status || !data.result)
      return fukusima.sendMessage(m.chat, { text: "User Roblox tidak ditemukan." }, { quoted: m })

    let i = data.result

    let basic = i.basic
    let presence = i.presence.userPresences[0]
    let social = i.social
    let avatar = i.avatar

    let headshot = avatar.headshot.data[0]?.imageUrl
    let badge = i.achievements.robloxBadges?.[0]

    let caption = `
🎮 *ROBLOX STALK*

👤 *Username:* ${basic.name}
🏷️ *Display Name:* ${basic.displayName}
🆔 *User ID:* ${i.user_id}

📅 *Akun Dibuat:* ${basic.created}
🔒 *Status Ban:* ${basic.isBanned ? "Banned" : "Aman"}

🌐 *Presence:* 
• Online di: ${presence.lastLocation}

👥 *Sosial:* 
• Friends: ${social.friends.count}
• Following: ${social.following.count}

🏅 *Badge Roblox:* 
${badge ? `• ${badge.name}\n${badge.description}` : "• Tidak ada badge"}

🔗 *Avatar Fullbody:* 
${avatar.fullBody.data[0]?.imageUrl}

🔗 *Profil Roblox:* 
https://www.roblox.com/users/${i.user_id}/profile
`.trim()

    await fukusima.sendMessage(
      m.chat,
      {
        image: { url: headshot },
        caption
      },
      { quoted: m }
    )

  } catch {
    await fukusima.sendMessage(m.chat, { text: "Gagal mengambil data Roblox." }, { quoted: m })
  }
}

handler.help = ["robloxstalk <user>", "rbxstalk <user>"]
handler.tags = ["stalk"]
handler.command = /^(robloxstalk|rbxstalk)$/i
handler.register = true

export default handler