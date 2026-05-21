import fs from "fs"

const sesiWaktu = 60000
const kumpulanData = "./data/susunkata.json"
const penyimpanan = "./data/susunkata-sesi.json"
const hadiahL = 8

let susunKataTimeout = null

let handler = async (m, { fukusima }) => {
if (!fs.existsSync(kumpulanData)) fs.writeFileSync(kumpulanData, JSON.stringify([], null, 2))
if (!fs.existsSync(penyimpanan)) fs.writeFileSync(penyimpanan, JSON.stringify({}, null, 2))

const data = JSON.parse(fs.readFileSync(kumpulanData))
const sesi = JSON.parse(fs.readFileSync(penyimpanan))

const fl = {
key: {
fromMe: false,
participant: m.sender,
...(m.chat ? { remoteJid: m.sender } : {})
},
message: {
newsletterAdminInviteMessage: {
newsletterJid: "120363338102578213@newsletter",
newsletterName: "Susun Kata",
caption: ".susunkata"
}
}
}

if (sesi.global) {
return fukusima.sendMessage(
m.chat,
{ text: "Masih ada sesi susun kata yang sedang berjalan." },
{ quoted: fl }
)
}

const soal = data[Math.floor(Math.random() * data.length)]

sesi.global = {
soal: soal.soal,
tipe: soal.tipe,
jawaban: soal.jawaban.toLowerCase().trim(),
selesai: false
}

fs.writeFileSync(penyimpanan, JSON.stringify(sesi, null, 2))

await fukusima.sendMessage(
m.chat,
{
text: `
🔤 SUSUN KATA 🔤

Huruf Acak:
${soal.soal}

Petunjuk: ${soal.tipe}

⏳ Waktu: 60 detik
🎁 Hadiah: +${hadiahL} limit
`
},
{ quoted: fl }
)

susunKataTimeout = setTimeout(async () => {
const sesiNow = JSON.parse(fs.readFileSync(penyimpanan))
if (!sesiNow.global || sesiNow.global.selesai) return

sesiNow.global.selesai = true

await fukusima.sendMessage(
m.chat,
{
text: `⏰ WAKTU HABIS

🔤 Huruf:
${sesiNow.global.soal}

✅ Jawaban:
${sesiNow.global.jawaban}`
},
{ quoted: fl }
)

fs.writeFileSync(penyimpanan, JSON.stringify({}, null, 2))
susunKataTimeout = null
}, sesiWaktu)
}

handler.before = async (m, { fukusima }) => {
if (!m.text) return false
if (!fs.existsSync(penyimpanan)) return false

const sesi = JSON.parse(fs.readFileSync(penyimpanan))
if (!sesi.global || sesi.global.selesai) return false

const jawabanUser = m.text.toLowerCase().trim()

if (jawabanUser === sesi.global.jawaban) {
if (susunKataTimeout) {
clearTimeout(susunKataTimeout)
susunKataTimeout = null
}

sesi.global.selesai = true

if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = { limit: 0 }
global.db.data.users[m.sender].limit += hadiahL

await fukusima.sendMessage(
m.chat,
{ react: { text: "🔤", key: m.key } }
)

await fukusima.sendMessage(
m.chat,
{
text: `🎯 JAWABAN BENAR

✅ ${sesi.global.jawaban}

🎁 +${hadiahL} limit`
}
)

fs.writeFileSync(penyimpanan, JSON.stringify({}, null, 2))
return true
}

await fukusima.sendMessage(
m.chat,
{ react: { text: "😅", key: m.key } }
)

return true
}

handler.help = ["susunkata"]
handler.tags = ["game"]
handler.command = /^susunkata$/i
handler.register = true
handler.limit = true
export default handler