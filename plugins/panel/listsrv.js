import fetch from "node-fetch"

let handler = async (m, { fukusima }) => {
  try {
    let serverRes = await fetch(global.domain + "/api/application/servers", {
      headers: {
        "Authorization": "Bearer " + global.apikey,
        "Content-Type": "application/json"
      }
    })
    let serverData = await serverRes.json()
    if (!serverData.data) return m.reply("❌ Tidak ada server ditemukan.")

    let list = `
🌐 *${global.namabot} CLOUD - ALL SERVER LIST*
━━━━━━━━━━━━━━━━━━━
Total Server: ${serverData.data.length}
━━━━━━━━━━━━━━━━━━━
`.trim()

    for (let i = 0; i < serverData.data.length; i++) {
      let s = serverData.data[i].attributes
      list += `
${i + 1}. *${s.name}*
┗ 🆔 ID: ${s.id}
┗ 👤 User ID: ${s.user}
┗ ⚡ Status: ${s.status || 'Unknown'}
┗ 💾 RAM: ${s.limits.memory === 0 ? "Unlimited" : s.limits.memory + " MB"}
┗ 💿 Disk: ${s.limits.disk === 0 ? "Unlimited" : s.limits.disk + " MB"}
┗ ⚙️ CPU: ${s.limits.cpu === 0 ? "Unlimited" : s.limits.cpu + "%"}
┗ 🌍 Egg: ${s.egg}
┗ 📅 Dibuat: ${new Date(s.created_at).toLocaleString("id-ID")}
━━━━━━━━━━━━━━━━━━━`
    }

    await fukusima.sendMessage(m.chat, { text: list })
  } catch (e) {
    m.reply("❌ Error: " + e.message)
  }
}

handler.help = ['listsrv','listserver']
handler.tags = ['tools']
handler.command = /^(listsrv|listserver)$/i
handler.premium = true

export default handler