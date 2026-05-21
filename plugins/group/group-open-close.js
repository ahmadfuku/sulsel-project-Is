let handler = async (m, { fukusima, args }) => {
    if (!m.isGroup) return m.reply("Khusus grup.")
    if (!m.isAdmin) return m.reply("Khusus admin grup!")

    let chat = global.db.data.chats[m.chat]
    if (!args[0]) return m.reply("Ketik *autogroup on* atau *autogroup off*")

    if (args[0] === "on") {
        chat.autogroup = true
        m.reply("✅ Auto tutup/buka grup telah *AKTIF* untuk grup ini.")
    } else if (args[0] === "off") {
        chat.autogroup = false
        m.reply("❌ Auto tutup/buka grup telah *NONAKTIF* untuk grup ini.")
    } else {
        m.reply("Format salah.\nContoh: *.autogroup on*")
    }
}

handler.help = ['autogroup on/off']
handler.tags = ['group']
handler.command = /^autogroup$/i

export default handler