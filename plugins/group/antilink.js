let handler = async (m, { args }) => {
try {

let chat = global.db.data.chats[m.chat] || (global.db.data.chats[m.chat] = {})

if (args[0] === "on") {
chat.antilink = true
m.reply("Anti Link diaktifkan.")
} else if (args[0] === "off") {
chat.antilink = false
m.reply("Anti Link dimatikan.")
} else {
m.reply("Gunakan:\nantilink on\nantilink off")
}

} catch (err) {
m.reply("Error command:\n" + err)
}
}

handler.before = async (m, { fukusima, isBotAdmin, isAdmin }) => {
try {

let chat = global.db.data.chats[m.chat]
if (!chat?.antilink) return
if (!isBotAdmin) return
if (isAdmin) return

let text = m.text || m.caption || ""

let linkRegex = /(https?:\/\/|www\.|chat\.whatsapp\.com|t\.me|discord\.gg|bit\.ly)/gi

if (!linkRegex.test(text)) return

await fukusima.sendMessage(m.chat, { delete: m.key })

} catch (err) {
console.log(err)
}

return true
}

handler.help = ["antilink on", "antilink off"]
handler.tags = ["group"]
handler.command = ["antilink"]
handler.admin = true
handler.group = true

export default handler