let handler = async (m, { text, fukusima }) => {
    if (!text) return m.reply('judul dramabox?')

    let q = encodeURIComponent(text)
    let url = `https://api.fukugpt.my.id/api/dramabox?api=${global.apifuku}&query=${q}`

    try {
        let res = await fetch(url)
        let json = await res.json()

        if (!json.status) return m.reply('tidak ditemukan')

        let d = json.result?.[0]
        if (!d) return m.reply('kosong')

        let cap = `🎬 *${d.title}*\n\n📝 ${d.description}\n\n👤 ${d.protagonist}\n🏷️ ${d.tags.join(', ')}`

        await fukusima.sendMessage(m.chat, {
            image: { url: d.cover },
            caption: cap
        }, { quoted: m })

    } catch (e) {
        console.log(e)
        m.reply('error bang')
    }
}

handler.help = ['dramabox']
handler.tags = ['search']
handler.command = /^(dramabox|dbox)$/i
handler.register = true
handler.limit = true
export default handler