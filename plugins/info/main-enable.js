let handler = async (m, { fukusima, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
  const isEnable = /^(true|enable|(turn)?on|1)$/i.test(command)
  const chat = global.db.data.chats[m.chat]
  const user = global.db.data.users[m.sender]
  const settings = global.db.data.settings[fukusima.user.jid]
  let type = (args[0] || '').toLowerCase()
  let isAll = false
  let isUser = false

  switch (type) {
    case 'welcome':
      if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, fukusima)
      chat.welcome = isEnable
      break
    case 'detect':
      if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, fukusima)
      chat.detect = isEnable
      break
    case 'antidelete':
    case 'delete':
      if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, fukusima)
      chat.delete = isEnable
      break
    case 'autolevelup':
      isUser = true
      user.autolevelup = isEnable
      break
    case 'autoread':
      isAll = true
      if (!isOwner) return global.dfail('owner', m, fukusima)
      settings.autoread = isEnable
      break
    case 'public':
      isAll = true
      if (!isOwner) return global.dfail('owner', m, fukusima)
      settings.public = isEnable
      break
    case 'anticall':
      isAll = true
      if (!isOwner) return global.dfail('owner', m, fukusima)
      settings.anticall = isEnable
      break
    default:
  if (!/[01]/.test(command)) return m.reply(`
*Daftar opsi yang bisa diatur:*

*Untuk User:*
- autolevelup

*Untuk Admin Grup:*
- welcome
- detect
- antidelete
${isOwner ? `
*Untuk Owner Bot:*
- autoread
- self
- anticall
` : ''}
*Contoh penggunaan:*
- ${usedPrefix}enable welcome
- ${usedPrefix}disable welcome
`.trim())
  throw false

  }

  m.reply(`*${type}* berhasil di *${isEnable ? 'aktifkan' : 'nonaktifkan'}* ${isAll ? 'untuk bot' : isUser ? '' : 'untuk chat ini'}`)
}

handler.help = ['enable', 'disable']
handler.tags = ['main']
handler.command = /^((en|dis)able|(true|false)|(turn)?(on|off)|[01])$/i

export default handler
