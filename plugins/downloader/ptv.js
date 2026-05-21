import fetch from 'node-fetch'

let handler = async (m, { fukusima, command, text }) => {
  try {
    if (!text) return m.reply(`*Example:* .${command} Obito Uchiha`)
    const q = text.trim()
    const res = await fetch('https://www.tikwm.com/api/feed/search', {
      method: 'POST',
      body: new URLSearchParams({ keywords: q, count: '1', cursor: '0', web: '1', hd: '1' })
    })
    const json = await res.json()
    if (!json.data?.videos?.length) return m.reply('Tidak ada video TikTok ditemukan.')
    
    const video = 'https://www.tikwm.com' + json.data.videos[0].play
    
    await fukusima.sendMessage(m.chat, {
      video: { url: video },
      mimetype: 'video/mp4',
      ptv: true
    })
  } catch (e) {
    m.reply(e.message)
  }
}

handler.help = ['ptv']
handler.tags = ['down']
handler.command = /^(ptv)$/i
export default handler