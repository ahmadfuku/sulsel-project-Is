let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) return m.reply(`Contoh penggunaan:\n${usedPrefix}wm Nama|Nama2`)
    
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (/image|video|webp/.test(mime)) {
        if ((q.msg?.seconds || q.seconds) > 10) return m.reply('Video harus di bawah 10 detik.')

        let media = q.download ? await q.download() : null
        if (!media) return m.reply('Gagal mengambil media.')

        let [packName, packAuthor] = text.includes('|') 
            ? text.split('|').map(v => v.trim())
            : [text.trim(), '']

        fukusima.sendSticker(m.chat, media, m, { packName, packPublish: packAuthor })
    } else {
        m.reply('Reply stiker, gambar, atau video untuk dijadikan stiker.')
    }
}

handler.command = /^wm$/i
export default handler