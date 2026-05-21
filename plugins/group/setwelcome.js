let handler = async (m, { text }) => {
  let id = m.chat
  let data = global.db.data.chats[id]
  if (!data) return m.reply('Data grup tidak ditemukan')

  if (!text) return m.reply('Gunakan: .setwelcome teks welcome')

  data.sWelcome = text.trim()
  return m.reply('Teks welcome berhasil disimpan')
}

handler.help = ['setwelcome']
handler.tags = ['group']
handler.command = /^(setwelcome)$/i
handler.group = true
handler.admin = true

export default handler