let handler = async (m, { args }) => {
try {

let chat = global.db.data.chats[m.chat] || (global.db.data.chats[m.chat] = {})

if (args[0] === "on") {
chat.antitagsw = true
m.reply("Anti Tag SW diaktifkan.")
} else if (args[0] === "off") {
chat.antitagsw = false
m.reply("Anti Tag SW dimatikan.")
} else {
m.reply("Gunakan:\nantitagsw on\nantitagsw off")
}

} catch (err) {
m.reply("Error command:\n" + err)
}
}

handler.before = async (m, { fukusima, isBotAdmin }) => {
try {

let chat = global.db.data.chats[m.chat]
if (!chat?.antitagsw) return

let msg = m.msg || {}

let isStatus =
m.mtype === "protocolMessage" ||
m.mtype === "groupStatusMentionMessage" ||
m.mtype === "groupStatusMessageV2" ||
msg?.annotations ||
msg?.newsletter ||
msg?.matchedText

if (!isStatus) return

await fukusima.sendMessage(m.chat,{ delete: m.key })

} catch (err) {
console.log(err)
}

return true
}

handler.help = ["antitagsw on","antitagsw off"]
handler.tags = ["group"]
handler.command = ["antitagsw"]
handler.admin = true
handler.group = true

export default handler