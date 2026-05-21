let handler = async (m, { text, fukusima }) => {
    if (!text) return m.reply('tanya apa ke ai?')

    let prompt = encodeURIComponent(text)
    let url = `https://api.fukugpt.my.id/api/chatgptfree?api=${global.apifuku}&prompt=${prompt}`

    try {
        let res = await fetch(url)
        let json = await res.json()

        if (!json.status) return m.reply('ai error')

        let hasil = json.result || 'tidak ada respon'

        await fukusima.sendMessage(m.chat, {
            text: hasil
        }, { quoted: m })

    } catch (e) {
        console.log(e)
        m.reply('error bang')
    }
}

handler.help = ['chatgptfree']
handler.tags = ['ai']
handler.command = /^(chatgptfree|aichat|gptfree)$/i
handler.register = true
handler.limit = true
export default handler