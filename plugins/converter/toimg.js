import fs from "fs"
import path from "path"
import { exec } from "child_process"

let handler = async (m, { usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!mime || !/webp/.test(mime)) {
        return m.reply('Reply stiker untuk dijadikan gambar.')
    }

    let media = await q.download()
    let id = Date.now()
    let input = path.join(process.cwd(), `toimg_${id}.webp`)
    let output = path.join(process.cwd(), `toimg_${id}.jpg`)

    fs.writeFileSync(input, media)

    exec(`ffmpeg -y -i "${input}" "${output}"`, async (err) => {
        fs.unlinkSync(input)

        if (err || !fs.existsSync(output)) {
            return m.reply('Gagal convert stiker ke gambar.')
        }

        let img = fs.readFileSync(output)
        fs.unlinkSync(output)

        await fukusima.sendMessage(
            m.chat,
            { image: img, mimetype: 'image/jpeg' },
            { quoted: m }
        )
    })
}

handler.help = ['toimg']
handler.tags = ['sticker']
handler.command = /^toimg$/i
handler.register = true

export default handler