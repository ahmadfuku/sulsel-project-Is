let handler = async (m, { text }) => {
  let id = m.chat
  let data = global.db.data.chats[id]
  if (!data) return m.reply('Data grup tidak ditemukan')

  if (!text) return m.reply('Gunakan: .welcome on / .welcome off')

  text = text.toLowerCase()

  if (text === 'on') {
    data.welcome = true
    return m.reply('Welcome berhasil diaktifkan')
  }

  if (text === 'off') {
    data.welcome = false
    return m.reply('Welcome berhasil dimatikan')
  }

  return m.reply('Gunakan: .welcome on / .welcome off')
}

handler.help = ['welcome on', 'welcome off']
handler.tags = ['group']
handler.command = /^(welcome)$/i
handler.group = true
handler.admin = true

export default handler