import fetch from "node-fetch"

let handler = async (m, { fukusima }) => {
  try {
    let userRes = await fetch(global.domain + "/api/application/users", {
      headers: {
        "Authorization": "Bearer " + global.apikey,
        "Content-Type": "application/json"
      }
    })
    let userData = await userRes.json()
    if (!userData.data) return m.reply("Tidak ada user ditemukan.")

    let txt = `
👥 *${global.namebot} USER LIST*
━━━━━━━━━━━━━━━━━━━
Total User: ${userData.data.length}
━━━━━━━━━━━━━━━━━━━
`.trim()

    for (let i = 0; i < userData.data.length; i++) {
      let u = userData.data[i].attributes
      txt += `
${i + 1}. *${u.username}*
┗ 📧 Email: ${u.email}
┗ 🆔 ID: ${u.id}
━━━━━━━━━━━━━━━━━━━`
    }

    await fukusima.sendMessage(m.chat, { text: txt })
  } catch (e) {
    m.reply(" Error: " + e.message)
  }
}

handler.help = ['listusr','listuser']
handler.tags = ['panel']
handler.command = /^(listusr|listuser)$/i
handler.premium = true

export default handler