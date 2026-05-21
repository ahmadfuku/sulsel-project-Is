import { createCanvas, loadImage } from "canvas"
import moment from "moment-timezone"

let handler = async (m, { fukusima }) => {
try {

let chat = global.db.data.chats[m.chat]
if (!chat || !chat.totalUserBot)
return m.reply("ᴅᴀᴛᴀ ᴄʜᴀᴛ ʙᴇʟᴜᴍ ᴛᴇʀsᴇᴅɪᴀ")

let totalUser = chat.totalUserBot

let sortedUsers = Object.entries(totalUser)
.sort((a, b) => b[1] - a[1])

let topUsers = sortedUsers.slice(0, 10)

const template = "https://cloud-fukushima.vercel.app/uploader/j2f6vqk5ih.jpg"

const date = moment().tz("Asia/Jakarta").format("DD MMMM YYYY HH:mm")

let groupMetadata = await fukusima.groupMetadata(m.chat)
let groupName = groupMetadata.subject || "Nama Grup"

const img = await loadImage(template)

const canvas = createCanvas(img.width, img.height)
const ctx = canvas.getContext("2d")

ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

ctx.fillStyle = "#000000"

ctx.font = "17px Arial"
ctx.textAlign = "left"
ctx.fillText(date, 140, 240)
ctx.fillText(groupName, 420, 240)

ctx.font = "20px Arial"
ctx.textAlign = "center"

let startY = 360
let lineHeight = 43

for (let i = 0; i < topUsers.length; i++) {

let [userJid, total] = topUsers[i]
let number = userJid.split("@")[0]

let user = global.db.data.users[userJid] || {}

let terdaftar = user.registered ? "Ya" : "Tidak"
let premium = user.premium ? "Ya" : "Tidak"

let y = startY + (i * lineHeight)


ctx.fillText(number, 310, y)     // Number
ctx.fillText(terdaftar, 520, y)  // Terdaftar
ctx.fillText(premium, 630, y)    // Premium
ctx.fillText(total, 740, y)      // Chat

}

const buffer = canvas.toBuffer("image/png")

await fukusima.sendMessage(m.chat,{
image: buffer,
caption: `📊 *Laporan User Teraktif*\n📌 Grup: ${groupName}`
},{ quoted:m })

} catch (err) {

m.reply(JSON.stringify({
status:false,
error:err.message
},null,2))

}
}

handler.help = ['totalchat','totalpesan']
handler.tags = ['group']
handler.command = /^(totalchat|totalpesan|topchat)$/i
handler.group = true

export default handler