let handler = async (m) => {
  let id = m.chat
  let data = global.db.data.chats[id]
  if (!data) return m.reply('ᴅᴀᴛᴀ ɢʀᴜᴘ ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ')

  data.isBanned = false
  return m.reply('ɢʀᴜᴘ ɪɴɪ ʙᴇʀʜᴀsɪʟ ᴅɪᴍᴀsᴜᴋᴋᴀɴ ᴋᴇ ᴡʜɪᴛᴇʟɪsᴛ')
}

handler.help = ['addwl']
handler.tags = ['owner']
handler.command = /^(addwl)$/i
handler.group = true
handler.owner = true

export default handler