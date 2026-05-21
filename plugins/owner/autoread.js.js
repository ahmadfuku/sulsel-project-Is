let handler = async (m, { args }) => {
    if (!args[0]) return m.reply("pilih on/off")

    if (args[0].toLowerCase() === "on") {
        global.bacotAuto = true
        m.reply("Autoread Aktif")
    } else if (args[0].toLowerCase() === "off") {
        global.bacotAuto = false
        m.reply("Autoread Nonaktif")
    } else {
        m.reply("pake: .autoread on / off")
    }
}

handler.command = ['autoread']
handler.tags = ['tools']
handler.help = ['autoread on/off']
handler.owner = true

export default handler