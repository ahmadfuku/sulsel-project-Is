import fs from "fs"

const SESSION_TIMEOUT = 60000
const DATA_PATH = "./data/gamepuasa.json"
const SESSION_PATH = "./data/gamepuasa-sesi.json"
const REWARD_LIMIT = 10

let timeout = null

let handler = async (m, { command }) => {
 if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, JSON.stringify([], null, 2))
 if (!fs.existsSync(SESSION_PATH)) fs.writeFileSync(SESSION_PATH, JSON.stringify({}, null, 2))

 const data = JSON.parse(fs.readFileSync(DATA_PATH))
 const sesi = JSON.parse(fs.readFileSync(SESSION_PATH))

 if (sesi.game) return m.reply("Masih ada game berjalan")

 const soalCmd = data.filter(v => v.cmd === command)
 if (!soalCmd.length) return m.reply("Soal belum ada di JSON")

 const pick = soalCmd[Math.floor(Math.random() * soalCmd.length)]

 sesi.game = {
  soal: pick.soal,
  jawaban: pick.jawaban.toLowerCase().trim(),
  selesai: false
 }

 fs.writeFileSync(SESSION_PATH, JSON.stringify(sesi, null, 2))

 await m.reply(
`🌙 GAME RAMADHAN

❓ ${pick.soal}

⏳ 60 detik
🎁 +${REWARD_LIMIT} limit`
 )

 timeout = setTimeout(async () => {
  const s = JSON.parse(fs.readFileSync(SESSION_PATH))
  if (!s.game || s.game.selesai) return

  s.game.selesai = true

  await m.reply(
`⏰ Waktu habis
Jawaban: ${s.game.jawaban}`
  )

  fs.writeFileSync(SESSION_PATH, JSON.stringify({}, null, 2))
  timeout = null
 }, SESSION_TIMEOUT)
}

handler.before = async (m) => {
 if (!m.text) return false
 if (!fs.existsSync(SESSION_PATH)) return false

 const sesi = JSON.parse(fs.readFileSync(SESSION_PATH))
 if (!sesi.game || sesi.game.selesai) return false

 const jawab = m.text.toLowerCase().trim()

 if (jawab === sesi.game.jawaban) {
  if (timeout) clearTimeout(timeout)

  sesi.game.selesai = true

  if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = { limit: 0 }
  global.db.data.users[m.sender].limit += REWARD_LIMIT

  await m.reply(`🎯 BENAR\n+${REWARD_LIMIT} limit`)

  fs.writeFileSync(SESSION_PATH, JSON.stringify({}, null, 2))
  return true
 }

 return false
}

handler.help = [
"tebakpuasa","tebaksahur","tebaktakjil","tebakislami","tebakmasjid",
"tebakkurma","tebakayat","tebakimam","tebakngaji","tebakdoa",
"tebakramadhan","tebaktarawih","tebakadhan","tebakwaktu","tebakfiqih",
"tebakislam","tebakkitab","tebaknabi","tebakrasul","tebaksurat",
"tebakjuz","tebakarab","tebakkota","tebaknegara","tebaksejarah",
"tebakkhalifah","tebakulama","tebakkisah","tebakmakanan","tebakminuman",
"tebaksunnah","tebakwudhu","tebakniat","tebakzakat","tebakhadits",
"tebakrandom","ramadhanquiz","islamquiz","quizislami","quizpuasa",
"quizramadhan","quiztakjil","quizsahur","quiztarawih","quizngaji",
"quizmasjid","quizadhan","quizdoa","quizayat","quizhadits",
"quiznabi","quizrasul","quizfiqih","quiziman","quizislam",
"quizjuz","quizsurat","quizarab","quizulama","quizsejarah",
"quizkota","quiznegara","quizmakanan","quizminuman"
]

handler.tags = ["game","ramadhan"]
handler.command = [
"tebakpuasa","tebaksahur","tebaktakjil","tebakislami","tebakmasjid",
"tebakkurma","tebakayat","tebakimam","tebakngaji","tebakdoa",
"tebakramadhan","tebaktarawih","tebakadhan","tebakwaktu","tebakfiqih",
"tebakislam","tebakkitab","tebaknabi","tebakrasul","tebaksurat",
"tebakjuz","tebakarab","tebakkota","tebaknegara","tebaksejarah",
"tebakkhalifah","tebakulama","tebakkisah","tebakmakanan","tebakminuman",
"tebaksunnah","tebakwudhu","tebakniat","tebakzakat","tebakhadits",
"tebakrandom","ramadhanquiz","islamquiz","quizislami","quizpuasa",
"quizramadhan","quiztakjil","quizsahur","quiztarawih","quizngaji",
"quizmasjid","quizadhan","quizdoa","quizayat","quizhadits",
"quiznabi","quizrasul","quizfiqih","quiziman","quizislam",
"quizjuz","quizsurat","quizarab","quizulama","quizsejarah",
"quizkota","quiznegara","quizmakanan","quizminuman"
]
handler.limit = true
handler.register = true

export default handler