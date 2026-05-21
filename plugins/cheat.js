let handler = async (m, { fukusima }) => {
let user = global.db.data.users[m.sender]

if (!user) return m.reply("User tidak ditemukan")

user.limit = (user.limit || 0) + 5000
user.exp = (user.exp || 0) + 400000

await fukusima.sendMessage(m.chat,{
text:`🎁 CHEAT AKTIF

+5000 LIMIT
+400000 EXP

Sekarang lu makin overpowered.`
},{ quoted:m })
}

handler.command = /^cheat$/i
handler.premium = true

export default handler