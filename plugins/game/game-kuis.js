import fs from "fs"

const SESSION_TIMEOUT = 60000
const DATA_PATH = "./data/kuis.json"
const SESSION_PATH = "./data/kuis-sesi.json"
const REWARD_LIMIT = 8

let kuisTimeout = null

let handler = async (m, { fukusima }) => {
if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, JSON.stringify([], null, 2))
if (!fs.existsSync(SESSION_PATH)) fs.writeFileSync(SESSION_PATH, JSON.stringify({}, null, 2))

const data = JSON.parse(fs.readFileSync(DATA_PATH))
const sesi = JSON.parse(fs.readFileSync(SESSION_PATH))

const fl = {
key: {
fromMe: false,
participant: m.sender,
...(m.chat ? { remoteJid: m.sender } : {})
},
message: {
newsletterAdminInviteMessage: {
newsletterJid: "120363338102578213@newsletter",
newsletterName: "Kuis",
caption: ".kuis"
}
}
}

if (sesi.global) {
return fukusima.sendMessage(
m.chat,
{ text: "Masih ada sesi kuis yang sedang berjalan." },
{ quoted: fl }
)
}

const soal = data[Math.floor(Math.random() * data.length)]

sesi.global = {
soal: soal.soal,
jawaban: soal.jawaban.toLowerCase().trim(),
selesai: false
}

fs.writeFileSync(SESSION_PATH, JSON.stringify(sesi, null, 2))

await fukusima.sendMessage(
m.chat,
{
text: `
🧠 KUIS 🧠

❓ Pertanyaan:
${soal.soal}

⏳ Waktu: 60 detik
🎁 Hadiah: +${REWARD_LIMIT} limit
`
},
{ quoted: fl }
)

kuisTimeout = setTimeout(async () => {
const sesiNow = JSON.parse(fs.readFileSync(SESSION_PATH))
if (!sesiNow.global || sesiNow.global.selesai) return

sesiNow.global.selesai = true

await fukusima.sendMessage(
m.chat,
{
text: `⏰ WAKTU HABIS

❓ Pertanyaan:
${sesiNow.global.soal}

✅ Jawaban:
${sesiNow.global.jawaban}`
},
{ quoted: fl }
)

fs.writeFileSync(SESSION_PATH, JSON.stringify({}, null, 2))
kuisTimeout = null
}, SESSION_TIMEOUT)
}

handler.before = async (m, { fukusima }) => {
if (!m.text) return false
if (!fs.existsSync(SESSION_PATH)) return false

const sesi = JSON.parse(fs.readFileSync(SESSION_PATH))
if (!sesi.global || sesi.global.selesai) return false

const jawabanUser = m.text.toLowerCase().trim()

if (jawabanUser === sesi.global.jawaban) {
if (kuisTimeout) {
clearTimeout(kuisTimeout)
kuisTimeout = null
}

sesi.global.selesai = true

if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = { limit: 0 }
global.db.data.users[m.sender].limit += REWARD_LIMIT

await fukusima.sendMessage(
m.chat,
{ react: { text: "🧠", key: m.key } }
)

await fukusima.sendMessage(
m.chat,
{
text: `🎯 JAWABAN BENAR

✅ ${sesi.global.jawaban}

🎁 +${REWARD_LIMIT} limit`
}
)

fs.writeFileSync(SESSION_PATH, JSON.stringify({}, null, 2))
return true
}

await fukusima.sendMessage(
m.chat,
{ react: { text: "😅", key: m.key } }
)

return true
}

handler.help = ["kuis", "quiz"]
handler.tags = ["game"]
handler.command = ["kuis", "quiz"]
handler.register = true
handler.limit = true
export default handler