import axios from "axios"
import FormData from "form-data"
import fs from "fs"

let handler = async (m, { fukusima }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!mime) return m.reply("reply gambar")
    if (!/image/.test(mime)) return m.reply("khusus gambar")

    try {
        await m.reply("⏳ sedang HD kan...")

        let buffer = await q.download()

        const input = `hd_in_${Date.now()}.jpg`
        const output = `hd_out_${Date.now()}.jpg`

        fs.writeFileSync(input, buffer)

        const form = new FormData()
        form.append("file", fs.createReadStream(input))

        const res = await axios.post(
            "https://ai-services.visual-paradigm.com/api/super-resolution/file",
            form,
            {
                headers: {
                    ...form.getHeaders(),
                    "user-agent": "Mozilla/5.0 (Linux; Android 10)",
                    "referer": "https://online.visual-paradigm.com/id/photo-effects-studio/image-upscale-tool/"
                },
                responseType: "arraybuffer",
                timeout: 60000
            }
        )

        fs.writeFileSync(output, res.data)

        await fukusima.sendMessage(m.chat, {
            image: fs.readFileSync(output),
            caption: "✨ Done HD"
        }, { quoted: m })

        fs.unlinkSync(input)
        fs.unlinkSync(output)

    } catch (e) {
        console.log(e)
        m.reply("error hd bang")
    }
}

handler.help = ["hd","remini"]
handler.tags = ["tools"]
handler.command = /^(hd|remini)$/i
handler.register = true
handler.limit = true

export default handler