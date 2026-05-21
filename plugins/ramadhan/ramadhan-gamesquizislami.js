import fs from "fs"

const SESSION_TIMEOUT = 60000
const DATA_PATH = "./data/islamiquiz.json"
const SESSION_PATH = "./data/islamiquizsesi.json"
const REWARD_LIMIT = 10

let timeout = null

let handler = async (m, { command }) => {
 if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, JSON.stringify([], null, 2))
 if (!fs.existsSync(SESSION_PATH)) fs.writeFileSync(SESSION_PATH, JSON.stringify({}, null, 2))

 const data = JSON.parse(fs.readFileSync(DATA_PATH))
 const sesi = JSON.parse(fs.readFileSync(SESSION_PATH))

 if (sesi.game) return m.reply("Masih ada kuis berjalan")

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
`🕌 QUIZ ISLAMI

❓ ${pick.soal}

⏳ 60 detik
🎁 +${REWARD_LIMIT} limit`
 )

 timeout = setTimeout(async () => {
  const s = JSON.parse(fs.readFileSync(SESSION_PATH))
  if (!s.game || s.game.selesai) return

  s.game.selesai = true

  await m.reply(`⏰ Waktu habis\nJawaban: ${s.game.jawaban}`)

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
 } else {
  await m.reply("Salah cuy coba lagi")
  return true
 }
}

handler.help = [
"islam1","islam2","islam3","islam4","islam5","islam6","islam7","islam8","islam9","islam10",
"islam11","islam12","islam13","islam14","islam15","islam16","islam17","islam18","islam19","islam20",
"islam21","islam22","islam23","islam24","islam25","islam26","islam27","islam28","islam29","islam30",
"islam31","islam32","islam33","islam34","islam35","islam36","islam37","islam38","islam39","islam40",
"islam41","islam42","islam43","islam44","islam45","islam46","islam47","islam48","islam49","islam50",
"nabi1","nabi2","nabi3","nabi4","nabi5","nabi6","nabi7","nabi8","nabi9","nabi10",
"nabi11","nabi12","nabi13","nabi14","nabi15","nabi16","nabi17","nabi18","nabi19","nabi20",
"nabi21","nabi22","nabi23","nabi24","nabi25","nabi26","nabi27","nabi28","nabi29","nabi30",
"nabi31","nabi32","nabi33","nabi34","nabi35","nabi36","nabi37","nabi38","nabi39","nabi40",
"nabi41","nabi42","nabi43","nabi44","nabi45","nabi46","nabi47","nabi48","nabi49","nabi50",
"ramadhan1","ramadhan2","ramadhan3","ramadhan4","ramadhan5","ramadhan6","ramadhan7","ramadhan8","ramadhan9","ramadhan10",
"ramadhan11","ramadhan12","ramadhan13","ramadhan14","ramadhan15","ramadhan16","ramadhan17","ramadhan18","ramadhan19","ramadhan20",
"ramadhan21","ramadhan22","ramadhan23","ramadhan24","ramadhan25","ramadhan26","ramadhan27","ramadhan28","ramadhan29","ramadhan30",
"ramadhan31","ramadhan32","ramadhan33","ramadhan34","ramadhan35","ramadhan36","ramadhan37","ramadhan38","ramadhan39","ramadhan40",
"ramadhan41","ramadhan42","ramadhan43","ramadhan44","ramadhan45","ramadhan46","ramadhan47","ramadhan48","ramadhan49","ramadhan50",
"hadits1","hadits2","hadits3","hadits4","hadits5","hadits6","hadits7","hadits8","hadits9","hadits10",
"hadits11","hadits12","hadits13","hadits14","hadits15","hadits16","hadits17","hadits18","hadits19","hadits20",
"hadits21","hadits22","hadits23","hadits24","hadits25","hadits26","hadits27","hadits28","hadits29","hadits30",
"hadits31","hadits32","hadits33","hadits34","hadits35","hadits36","hadits37","hadits38","hadits39","hadits40",
"hadits41","hadits42","hadits43","hadits44","hadits45","hadits46","hadits47","hadits48","hadits49","hadits50",
"fiqih1","fiqih2","fiqih3","fiqih4","fiqih5","fiqih6","fiqih7","fiqih8","fiqih9","fiqih10",
"fiqih11","fiqih12","fiqih13","fiqih14","fiqih15","fiqih16","fiqih17","fiqih18","fiqih19","fiqih20",
"fiqih21","fiqih22","fiqih23","fiqih24","fiqih25","fiqih26","fiqih27","fiqih28","fiqih29","fiqih30",
"fiqih31","fiqih32","fiqih33","fiqih34","fiqih35","fiqih36","fiqih37","fiqih38","fiqih39","fiqih40",
"fiqih41","fiqih42","fiqih43","fiqih44","fiqih45","fiqih46","fiqih47","fiqih48","fiqih49","fiqih50",
"iman1","iman2","iman3","iman4","iman5","iman6","iman7","iman8","iman9","iman10",
"iman11","iman12","iman13","iman14","iman15","iman16","iman17","iman18","iman19","iman20",
"iman21","iman22","iman23","iman24","iman25","iman26","iman27","iman28","iman29","iman30",
"iman31","iman32","iman33","iman34","iman35","iman36","iman37","iman38","iman39","iman40",
"iman41","iman42","iman43","iman44","iman45","iman46","iman47","iman48","iman49","iman50"
]

handler.tags = ["game","ramadhan"]
handler.command = new RegExp(`^(${handler.help.join("|")})$`, "i")
handler.limit = true
handler.register = true

export default handler

