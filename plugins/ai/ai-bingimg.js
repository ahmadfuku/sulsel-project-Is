let handler = async (m, { text, fukusima }) => {
    if (!text) return m.reply('prompt gambarnya?')

    let q = encodeURIComponent(text)
    let url = `https://api.fukugpt.my.id/api/bingimg?api=${global.apifuku}&text=${q}`

    try {
        let res = await fetch(url)
        let json = await res.json()

        if (!json.status) return m.reply('gagal generate')

        let img = json.result?.[0]
        if (!img) return m.reply('gambar kosong')

        await fukusima.sendMessage(m.chat, {
            image: { url: img },
            caption: `Done Kak`
        }, { quoted: m })

    } catch (e) {
        console.log(e)
        m.reply('error bang')
    }
}

handler.help = ['bingimg','bingimage']
handler.tags = ['ai','image']
handler.command = /^(bingimg|bingimage)$/i
handler.register = true
handler.limit = true
export default handler