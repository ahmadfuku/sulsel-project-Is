let handler = async (m, { text, fukusima }) => {
    if (!text) return m.reply('judul lagu?')

    let q = encodeURIComponent(text)
    let url = `https://api.fukugpt.my.id/api/liriksearch?api=${global.apifuku}&query=${q}`

    try {
        let res = await fetch(url)
        let json = await res.json()

        if (!json.status) return m.reply('tidak ditemukan')

        let d = json.result?.[0]
        if (!d) return m.reply('kosong')

        let cap = `🎵 *${d.trackName}*\n👤 ${d.artistName}\n💿 ${d.albumName}\n⏱️ ${Math.floor(d.duration)}s\n\n${d.plainLyrics}`

        await fukusima.sendMessage(m.chat, {
            text: cap
        }, { quoted: m })

    } catch (e) {
        console.log(e)
        m.reply('error bang')
    }
}

handler.help = ['liriksearch']
handler.tags = ['search']
handler.command = /^(liriksearch|carilirik)$/i
handler.register = true
handler.limit = true
export default handler