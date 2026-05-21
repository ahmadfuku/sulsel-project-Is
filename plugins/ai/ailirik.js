let handler = async (m, { text, fukusima, command }) => {
    if (!text) return m.reply('judul lagu?')

    let q = encodeURIComponent(text)
    let url = `https://api.fukugpt.my.id/api/lirik?api=${global.apifuku}&judul=${q}`

    try {
        let res = await fetch(url)
        let json = await res.json()

        if (!json.status) return m.reply('lirik tidak ditemukan')

        let data = json.result?.[0]
        if (!data) return m.reply('gagal ambil lirik')

        let hasil = `🎵 *${data.title}*\n\n${data.text}`

        await fukusima.sendMessage(m.chat, {
            text: hasil,
            contextInfo: {
                externalAdReply: {
                    title: data.title,
                    body: "AI Lyrics Maker",
                    thumbnailUrl: "https://files.catbox.moe/5f2n8m.jpg",
                    sourceUrl: url,
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    showAdAttribution: false
                }
            }
        }, { quoted: m })

    } catch (e) {
        m.reply('error bang')
        console.log(e)
    }
}

handler.help = ['lirikai','ailirik','aimakerlirik']
handler.tags = ['ai']
handler.command = /^(lirikai|ailirik|aimakerlirik)$/i
handler.register = true
handler.limit = true
export default handler