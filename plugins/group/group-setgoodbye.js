let handler = async (m, { text }) => {
  let id = m.chat
  let data = global.db.data.chats[id]
  if (!data) return m.reply('Data grup tidak ditemukan')

  if (!text) return m.reply('Gunakan: .setgoodbye teks goodbye')

  data.sBye = text.trim()
  return m.reply('Teks goodbye berhasil disimpan')
}

handler.help = ['setgoodbye']
handler.tags = ['group']
handler.command = /^(setgoodbye)$/i
handler.group = true
handler.admin = true

export default handler