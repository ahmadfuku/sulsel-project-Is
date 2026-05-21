let handler = async (m, { fukusima, command, text }) => {
  try {
    if (!text) return m.reply(`*Example :* .${command} Takamura Sakamoto Days,4`)
    const [q, c] = text.split(',')
    const count = c || '3'
    const res = await fetch('https://www.tikwm.com/api/feed/search', {
      method: 'POST',
      body: new URLSearchParams({
        keywords: q,
        count,
        cursor: '0',
        web: '1',
        hd: '1'
      })
    })
    const json = await res.json()
    for (let i of json.data.videos) {
      await fukusima.sendMessage(m.chat, { video: { url: 'https://www.tikwm.com' + i.play } }, { quoted: m })
    }
  } catch (e) {
    m.reply(e.message)
  }
}
handler.help = ['ttsearch']
handler.command = /^(ttsearch|tiktoksearch|tt-s)$/i
handler.tags = ['down']
export default handler