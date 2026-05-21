let handler = async (m, { fukusima, args }) => {
    let chat = global.db.data.chats[m.chat]

    if (args[0] === 'on') {
        chat.autogroup = true
        return m.reply("✅ Auto Tutup/Buka Grup *aktif* untuk grup ini.")
    }

    if (args[0] === 'off') {
        chat.autogroup = false
        return m.reply("❌ Auto Tutup/Buka Grup *dimatikan* untuk grup ini.")
    }

    m.reply("Gunakan:\n.autogroup on\n.autogroup off")
}

handler.command = /^autogroup$/i
handler.admin = true
handler.group = true

export default handler