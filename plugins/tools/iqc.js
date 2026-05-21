let handler = async (m, { text, fukusima }) => {
    if (!text) return m.reply('teksnya?')

    let q = encodeURIComponent(text)
    let url = `https://api.fukugpt.my.id/api/iqc?api=${global.apifuku}&text=${q}`

    try {
        let res = await fetch(url)
        let json = await res.json()

        if (!json.status) return m.reply('gagal')

        let img = json.result?.image
        if (!img) return m.reply('Mungkin apikey mu habis. silahkan tambah limit penggunaan di api.fukugpt.my.id')

        await fukusima.sendMessage(m.chat, {
            image: { url: img },
            caption: 'Done Kak'
        }, { quoted: m })

    } catch (e) {
        console.log(e)
        m.reply('error bang')
    }
}

handler.help = ['iqc']
handler.tags = ['maker']
handler.command = /^(iqc)$/i
handler.register = true
handler.limit = true
export default handler