import fs from "fs"

let handler = async (m, { args }) => {
try {

let chat = global.db.data.chats[m.chat] || (global.db.data.chats[m.chat] = {})

if (args[0] === "on") {
chat.antisticker = true
m.reply("Anti Sticker diaktifkan.")
} else if (args[0] === "off") {
chat.antisticker = false
m.reply("Anti Sticker dimatikan.")
} else {
m.reply("Gunakan:\nantisticker on\nantisticker off")
}

} catch (err) {
m.reply("Error command:\n" + err)
}
}

handler.before = async (m, { fukusima, isBotAdmin, isAdmin }) => {
try {

let chat = global.db.data.chats[m.chat]
if (!chat?.antisticker) return
if (!isBotAdmin) return
if (isAdmin) return

let isSticker = m.mtype === "stickerMessage" || m.msg?.mimetype === "image/webp"
if (!isSticker) return
await fukusima.sendMessage(m.chat, { delete: m.key })
let sticker = fs.readFileSync("./mods/resource_pack/assets/sticker.webp")
await fukusima.sendMessage(m.chat, {
sticker
})

} catch (err) {
console.log(err)
}

return true
}

handler.help = ["antisticker on","antisticker off"]
handler.tags = ["group"]
handler.command = ["antisticker"]
handler.admin = true
handler.group = true

export default handler