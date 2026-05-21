import fetch from "node-fetch"

let handler = async (m, { fukusima, text }) => {
  if (!text) return m.reply("Format:\n.deleteserver ID")

  try {
    let srvID = text.trim()

    let delRes = await fetch(global.domain + `/api/application/servers/${srvID}`, {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + global.apikey,
        "Content-Type": "application/json"
      }
    })

    if (delRes.status === 404) return m.reply("Server tidak ditemukan.")
    if (!delRes.ok) return m.reply("Gagal menghapus server.")

    m.reply(`🗑️ Server *${srvID}* berhasil dihapus dari panel.`)
  } catch (e) {
    m.reply("Error: " + e.message)
  }
}

handler.help = ['delsrv','deleteserver']
handler.tags = ['panel']
handler.command = /^(delsrv|deleteserver)$/i
handler.premium = true

export default handler