let handler = async (m, { fukusima }) => {
  let id = m.chat
  let chat = global.db.data.chats[id]
  if (!chat || !chat.absen || !chat.absen.total) return m.reply('ʙᴇʟᴜᴍ ᴀᴅᴀ ᴅᴀᴛᴀ ᴀʙsᴇɴ')

  let entries = Object.entries(chat.absen.total)
  if (entries.length === 0) return m.reply('ʙᴇʟᴜᴍ ᴀᴅᴀ ᴅᴀᴛᴀ ᴀʙsᴇɴ')

  entries.sort((a, b) => b[1] - a[1])

  let teks = `- *ᴘᴀᴘᴀɴ ᴀʙsᴇɴ ᴋᴇsᴇʟᴜʀᴜʜᴀɴ*\n\n`
  let mentions = []

  entries.forEach(([jid, total], i) => {
    let streak = chat.absen.streak?.[jid] || 0
    let user = jid.split('@')[0]
    mentions.push(jid)
    teks += `${i + 1}. @${user}\n`
    teks += `   • ᴛᴏᴛᴀʟ: ${total}\n`
    teks += `   • sᴛʀᴇᴀᴋ: ${streak}\n`
  })

  await fukusima.sendMessage(m.chat, {
    text: teks.trim(),
    mentions
  }, { quoted: m })
}

handler.help = ['papanabsen']
handler.tags = ['group']
handler.command = /^(papanabsen)$/i
handler.group = true

export default handler