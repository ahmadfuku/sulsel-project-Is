import axios from "axios"

let handler = async (m, { text, usedPrefix, command, fukusima }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!text) return m.reply(`Contoh: *${usedPrefix + command} halo dunia*`)

    try {
        m.reply("Wait...")
        const url = `https://api-faa.my.id/faa/brathd?text=${encodeURIComponent(text)}`
        const res = await fetch(url)
        const buffer = Buffer.from(await res.arrayBuffer())
        let exif = {}
        if (text) {
            const [packname, author] = text.split(/[,|\-+&]/)
            exif = { packName: packname || '', packPublish: author || '' }
        }
        await fukusima.sendSticker(m.chat, buffer, m, exif)

    } catch (e) {
        m.reply(e.message)
    }
}

handler.help = ['brat']
handler.tags = ['sticker']
handler.command = /^brat$/i
handler.register = true
handler.limit = true
export default handler