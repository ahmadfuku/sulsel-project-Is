let handler = async (m) => {
  let id = m.chat
  let data = global.db.data.chats[id]
  if (!data) return m.reply('ᴅᴀᴛᴀ ɢʀᴜᴘ ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ')

  data.isBanned = true
  return m.reply('ɢʀᴜᴘ ɪɴɪ ʙᴇʀʜᴀsɪʟ ᴅɪᴍᴀsᴜᴋᴋᴀɴ ᴋᴇ ʙʟᴀᴄᴋʟɪsᴛ')
}

handler.help = ['addbl']
handler.tags = ['owner']
handler.command = /^(addbl)$/i
handler.group = true
handler.owner = true

export default handler