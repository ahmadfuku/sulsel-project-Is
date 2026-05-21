let handler = async (m) => {
  let id = m.chat
  let chat = global.db.data.chats[id]
  if (!chat) return m.reply('ᴅᴀᴛᴀ ɢʀᴜᴘ ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ')

  if (!chat.absen) chat.absen = { today: {}, streak: {}, total: {} }

  let today = new Date().toISOString().slice(0, 10)
  if (!chat.absen.today[today]) chat.absen.today[today] = []

  let user = m.sender

  if (chat.absen.today[today].includes(user)) {
    return m.reply('ᴋᴀᴍᴜ sᴜᴅᴀʜ ᴀʙsᴇɴ ʜᴀʀɪ ɪɴɪ')
  }

  chat.absen.today[today].push(user)

  if (!chat.absen.total[user]) chat.absen.total[user] = 0
  chat.absen.total[user]++

  if (!chat.absen.streak[user]) chat.absen.streak[user] = 0

  if (chat.absen.today[today].length > 1) {
    chat.absen.streak[user]++
  }

  return m.reply('ᴀʙsᴇɴ ʙᴇʀʜᴀsɪʟ')
}

handler.help = ['absen']
handler.tags = ['group']
handler.command = /^(absen)$/i
handler.group = true

export default handler