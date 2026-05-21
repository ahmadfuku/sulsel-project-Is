let handler = async (m) => {
  let id = m.chat
  let data = global.db.data.chats[id]
  if (!data) return m.reply('Data grup tidak ditemukan')

  let totalUserBot = data.totalUserBot ? Object.keys(data.totalUserBot).length : 0
  let lastReset = data.lastResetUserBot ? new Date(data.lastResetUserBot).toLocaleString('id-ID') : '-'

  let teks = `
𝗜𝗡𝗙𝗢 𝗚𝗥𝗨𝗣 𝗕𝗢𝗧

𝗜𝗗 𝗚𝗿𝘂𝗽
${id}

𝗦𝘁𝗮𝘁𝘂𝘀
• Banned: ${data.isBanned}
• Welcome: ${data.welcome}
• Detect: ${data.detect}
• Delete: ${data.delete}

𝗧𝗲𝗺𝗽𝗹𝗮𝘁𝗲
• Welcome: ${data.sWelcome || '-'}
• Bye: ${data.sBye || '-'}
• Promote: ${data.sPromote || '-'}
• Demote: ${data.sDemote || '-'}

𝗦𝘁𝗮𝘁𝗶𝘀𝘁𝗶𝗸 𝗨𝘀𝗲𝗿 𝗕𝗼𝘁
• Total User: ${totalUserBot}
• Last Reset: ${lastReset}
`.trim()

  await fukusima.sendMessage(m.chat, {
    image: { url: global.thumb },
    caption: teks
  }, { quoted: m })
}

handler.help = ['infogrup']
handler.tags = ['group']
handler.command = /^(infogrup|groupinfo)$/i
handler.group = true

export default handler