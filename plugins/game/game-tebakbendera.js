import fs from "fs"

const sesiBerakhir = 60000
const dataSoal = "./data/tebakbendera.json"
const jawabanData = "./data/tebakbendera-sesi.json"
const hadiahLimit = 8

let tebakBenderaTimeout = null

let handler = async (m, { fukusima }) => {
if (!fs.existsSync(dataSoal)) fs.writeFileSync(dataSoal, JSON.stringify([], null, 2))
if (!fs.existsSync(jawabanData)) fs.writeFileSync(jawabanData, JSON.stringify({}, null, 2))

const data = JSON.parse(fs.readFileSync(dataSoal))
const sesi = JSON.parse(fs.readFileSync(jawabanData))

const fl = {
key: {
fromMe: false,
participant: m.sender,
...(m.chat ? { remoteJid: m.sender } : {})
},
message: {
newsletterAdminInviteMessage: {
newsletterJid: "120363338102578213@newsletter",
newsletterName: "Tebak Bendera",
caption: ".tebakbendera"
}
}
}

if (sesi.global) {
return fukusima.sendMessage(
m.chat,
{ text: "Masih ada sesi tebak bendera yang sedang berjalan." },
{ quoted: fl }
)
}

const soal = data[Math.floor(Math.random() * data.length)]

sesi.global = {
soal: soal.soal,
jawaban: soal.jawaban.toLowerCase().trim(),
selesai: false
}

fs.writeFileSync(jawabanData, JSON.stringify(sesi, null, 2))

await fukusima.sendMessage(
m.chat,
{
text: `
🚩 TEBAK BENDERA 🚩

❓ Bendera Negara Apa Ini?
${soal.soal}

⏳ Waktu: 60 detik
🎁 Hadiah: +${hadiahLimit} limit
`
},
{ quoted: fl }
)

tebakBenderaTimeout = setTimeout(async () => {
const sesiNow = JSON.parse(fs.readFileSync(jawabanData))
if (!sesiNow.global || sesiNow.global.selesai) return

sesiNow.global.selesai = true

await fukusima.sendMessage(
m.chat,
{
text: `⏰ WAKTU HABIS

🚩 Bendera:
${sesiNow.global.soal}

✅ Jawaban:
${sesiNow.global.jawaban}`
},
{ quoted: fl }
)

fs.writeFileSync(jawabanData, JSON.stringify({}, null, 2))
tebakBenderaTimeout = null
}, sesiBerakhir)
}

handler.before = async (m, { fukusima }) => {
if (!m.text) return false
if (!fs.existsSync(jawabanData)) return false

const sesi = JSON.parse(fs.readFileSync(jawabanData))
if (!sesi.global || sesi.global.selesai) return false

const jawabanUser = m.text.toLowerCase().trim()

if (jawabanUser === sesi.global.jawaban) {
if (tebakBenderaTimeout) {
clearTimeout(tebakBenderaTimeout)
tebakBenderaTimeout = null
}

sesi.global.selesai = true

if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = { limit: 0 }
global.db.data.users[m.sender].limit += hadiahLimit

await fukusima.sendMessage(
m.chat,
{ react: { text: "🚩", key: m.key } }
)

await fukusima.sendMessage(
m.chat,
{
text: `🎯 JAWABAN BENAR

✅ ${sesi.global.jawaban}

🎁 +${hadiahLimit} limit`
}
)

fs.writeFileSync(jawabanData, JSON.stringify({}, null, 2))
return true
}

await fukusima.sendMessage(
m.chat,
{ react: { text: "😅", key: m.key } }
)

return true
}

handler.help = ["tebakbendera"]
handler.tags = ["game"]
handler.command = /^tebakbendera$/i
handler.register = true
handler.limit = true
export default handler