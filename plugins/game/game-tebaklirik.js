import fs from "fs"

const gamewaktu = 60
const SESSION_TIMEOUT = gamewaktu * 1000
const DATA_PATH = "./data/tebaklirik.json"
const SESSION_PATH = "./data/tebaklirik-sesi.json"
const REWARD_LIMIT = 8

let tebakLirikTimeout = null

let handler = async (m, { fukusima }) => {
if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, JSON.stringify([], null, 2))
if (!fs.existsSync(SESSION_PATH)) fs.writeFileSync(SESSION_PATH, JSON.stringify({}, null, 2))

const data = JSON.parse(fs.readFileSync(DATA_PATH))
const sesi = JSON.parse(fs.readFileSync(SESSION_PATH))

if (sesi.global) return fukusima.sendMessage(m.chat, { text: "Masih ada sesi tebak lirik yang berjalan." })

const soal = data[Math.floor(Math.random() * data.length)]

sesi.global = {
soal: soal.soal,
jawaban: soal.jawaban.toLowerCase().trim(),
selesai: false
}

fs.writeFileSync(SESSION_PATH, JSON.stringify(sesi, null, 2))

await fukusima.sendMessage(m.chat, {
text: `*GAME TEBAK LIRIK*
Soal: ${soal.soal}
Petunjuk: ${soal.jawaban.replace(/[b|c|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z]/gi, '-')}
Waktu: ${gamewaktu} detik

`
})

tebakLirikTimeout = setTimeout(async () => {
const sesiNow = JSON.parse(fs.readFileSync(SESSION_PATH))
if (!sesiNow.global || sesiNow.global.selesai) return

sesiNow.global.selesai = true

await fukusima.sendMessage(m.chat, {
text: `*WAKTU HABIS!*
Jawaban dari soal:
${sesiNow.global.soal}

Adalah: ${sesiNow.global.jawaban}`
})

fs.writeFileSync(SESSION_PATH, JSON.stringify({}, null, 2))
tebakLirikTimeout = null
}, SESSION_TIMEOUT)
}

handler.before = async (m, { fukusima }) => {
if (!m.text) return false
if (!fs.existsSync(SESSION_PATH)) return false

const sesi = JSON.parse(fs.readFileSync(SESSION_PATH))
if (!sesi.global || sesi.global.selesai) return false

const jawabanUser = m.text.toLowerCase().trim()

if (jawabanUser === sesi.global.jawaban) {
if (tebakLirikTimeout) {
clearTimeout(tebakLirikTimeout)
tebakLirikTimeout = null
}

sesi.global.selesai = true

if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = { limit: 0 }
global.db.data.users[m.sender].limit += REWARD_LIMIT

await fukusima.sendMessage(m.chat, {
text: `🎯 JAWABAN BENAR

${sesi.global.jawaban}

+${REWARD_LIMIT} limit`
})

fs.writeFileSync(SESSION_PATH, JSON.stringify({}, null, 2))
return true
}

return true
}

handler.help = ["tebaklirik"]
handler.tags = ["game"]
handler.command = /^tebaklirik$/i
handler.register = true
handler.limit = true
export default handler