import fetch from "node-fetch"

let handler = async (m, { fukusima, text, command, usedPrefix }) => {
  if (!text) return m.reply(`Contoh: ${usedPrefix + command} ID`)

  try {
    let userID = text.trim()

    let delRes = await fetch(global.domain + `/api/application/users/${userID}`, {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + global.apikey,
        "Content-Type": "application/json"
      }
    })

    if (delRes.status === 404) return m.reply("User tidak ditemukan.")
    if (!delRes.ok) return m.reply("Gagal menghapus user.")

    m.reply(`🗑️ User *${userID}* berhasil dihapus dari panel.`)
  } catch (e) {
    m.reply("Error: " + e.message)
  }
}

handler.help = ['delusr','deleteuser']
handler.tags = ['panel']
handler.command = /^(delusr|deleteuser)$/i
handler.premium = true

export default handler