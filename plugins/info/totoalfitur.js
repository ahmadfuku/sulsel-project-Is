let handler = async (m, { fukusima }) => {
  let total = 0

  for (let plugin of Object.values(global.plugins)) {
    if (plugin.help && Array.isArray(plugin.help)) {
      total += plugin.help.length
    }
  }

  fukusima.reply(
    m.chat,
    `🤖 *Total Fitur Bot Saat Ini:* ${total}`,
    m
  )
}

handler.help = ['totalfitur']
handler.tags = ['info']
handler.command = ['totalfitur']

export default handler