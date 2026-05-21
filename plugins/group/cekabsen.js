let handler = async (m, { fukusima }) => {
  let id = m.chat
  let chat = global.db.data.chats[id]
  if (!chat || !chat.absen) return m.reply('ʙᴇʟᴜᴍ ᴀᴅᴀ ᴅᴀᴛᴀ ᴀʙsᴇɴ')

  let today = new Date().toISOString().slice(0, 10)
  let list = chat.absen.today?.[today] || []

  if (list.length === 0) return m.reply('ʙᴇʟᴜᴍ ᴀᴅᴀ ʏᴀɴɢ ᴀʙsᴇɴ ʜᴀʀɪ ɪɴɪ')

  let teks = `- *ᴅᴀғᴛᴀʀ ᴀʙsᴇɴ ʜᴀʀɪ ɪɴɪ*\n\n`

  list.forEach((jid, i) => {
    let user = jid.split('@')[0]
    teks += `${i + 1}. @${user}\n`
  })

  await fukusima.sendMessage(m.chat, {
    text: teks.trim(),
    mentions: list
  }, { quoted: m })
}

handler.help = ['cekabsen']
handler.tags = ['group']
handler.command = /^(cekabsen)$/i
handler.group = true

export default handler