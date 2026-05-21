let handler = async (m, { fukusima }) => {
  let user = global.db.data.users[m.sender]

  let cooldown = 1000 * 60 * 30
  if (new Date - user.lastberbru < cooldown) {
    let sisa = cooldown - (new Date - user.lastberbru)
    return fukusima.reply(
      m.chat,
      `⏳ Tunggu ${Math.ceil(sisa / 60000)} menit untuk berburu lagi`,
      m
    )
  }

  let hasil = Math.floor(Math.random() * 28) + 40

  let hewan = [
    'banteng','harimau','gajah','kambing','panda','buaya','kerbau',
    'sapi','monyet','babihutan','babi','ayam'
  ]

  let delay = ms => new Promise(res => setTimeout(res, ms))

  await fukusima.reply(m.chat, '🏹 Kamu memasuki hutan...', m)
  await delay(1200)

  await fukusima.reply(m.chat, '👣 Mencari jejak hewan...', m)
  await delay(1200)

  await fukusima.reply(m.chat, '🎯 Mengunci target...', m)
  await delay(1200)

  await fukusima.reply(m.chat, '💥 SERANGAN DILAKUKAN!', m)
  await delay(1500)

  let teks = '🧺 *HASIL BERBURU*\n\n'

  for (let h of hewan) {
    user[h] = (user[h] || 0) + hasil
    teks += `• ${h}: +${hasil}\n`
    await delay(300)
  }

  user.lastberbru = new Date * 1

  await delay(800)
  fukusima.reply(m.chat, teks.trim(), m)
}

handler.help = ['berburu','memburu']
handler.tags = ['rpg']
handler.command = ['berburu','memburu']

export default handler