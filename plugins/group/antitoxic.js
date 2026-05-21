let handler = async (m, { args }) => {
try {

let chat = global.db.data.chats[m.chat] || (global.db.data.chats[m.chat] = {})

if (args[0] === "on") {
chat.antitoxic = true
m.reply("Anti Toxic diaktifkan.")
} else if (args[0] === "off") {
chat.antitoxic = false
m.reply("Anti Toxic dimatikan.")
} else {
m.reply("Gunakan:\nantitoxic on\nantitoxic off")
}

} catch (err) {
m.reply("Error command:\n" + err)
}
}

handler.before = async (m, { fukusima, isBotAdmin, isAdmin }) => {
try {

let chat = global.db.data.chats[m.chat]
if (!chat?.antitoxic) return
if (!isBotAdmin) return
if (isAdmin) return

let text = (m.text || m.caption || "").toLowerCase()

const toxicWords = [
"anjing","anjg","anj","ajg","bangsat","bgst","bgsd",
"kontol","kntl","memek","mmk","ngentot","ngntt",
"bajingan","tolol","goblok","bodoh","idiot","dongo",
"asu","kampret","setan","tai","babi","keparat",
"mati aja","bunuh diri","suicide","die","kill yourself",
"fuck","shit","bitch","asshole","retard","nigger",
"pedo","pedofil","rape","pemerkosa"
]

let detected = toxicWords.some(word => text.includes(word))
if (!detected) return

await fukusima.sendMessage(m.chat, { delete: m.key })

} catch (err) {
console.log(err)
}

return true
}

handler.help = ["antitoxic on", "antitoxic off"]
handler.tags = ["group"]
handler.command = ["antitoxic"]
handler.admin = true
handler.group = true

export default handler