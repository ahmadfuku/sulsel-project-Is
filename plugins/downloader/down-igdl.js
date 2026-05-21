import axios from "axios"

let handler = async (m, { fukusima, text, command }) => {
    if (!text) return m.reply(`> *Masukkan URL Instagram!*\nContoh: .${command} https://www.instagram.com/reel/...`)

    await fukusima.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

    try {
        let api = `https://api.yupra.my.id/api/downloader/Instagram?url=${encodeURIComponent(text)}`
        let res = await axios.get(api)

        if (!res.data?.result?.medias?.length)
            return m.reply("> *Gagal mengambil media.*")

        let media = res.data.result.medias[0]
        let url = media.url
        let type = media.type

        if (type === "video") {
            await fukusima.sendMessage(
                m.chat,
                { video: { url }, caption: "> *Berhasil mengambil video IG.*" },
                { quoted: m }
            )
        } else {
            await fukusima.sendMessage(
                m.chat,
                { image: { url }, caption: "> *Berhasil mengambil gambar IG.*" },
                { quoted: m }
            )
        }

    } catch (e) {
        console.error(e)
        m.reply("> *Server error, coba lagi nanti.*")
    } finally {
        await fukusima.sendMessage(m.chat, { react: { text: "", key: m.key } })
    }
}

handler.help = ["ig <url>"]
handler.tags = ["downloader"]
handler.command = /^ig(dl)?$/i

export default handler