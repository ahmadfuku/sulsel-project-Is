import fetch from "node-fetch"

let handler = async (m, { fukusima, text, command }) => {
    if (!text) return m.reply(`Contoh:\n.${command} https://www.douyin.com/video/...`)

    await fukusima.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

    try {
        const api = `https://api.siputzx.my.id/api/d/douyin?url=${encodeURIComponent(text)}`
        const res = await fetch(api)
        const json = await res.json()

        if (!json.status || !json.data) throw new Error("Gagal mengambil data dari API")

        const { title, downloads } = json.data
        if (!downloads || !downloads.length) throw new Error("Link download tidak ditemukan")

        let version1 = downloads[0]
        let videoUrl = version1.url

        let buff = await (await fetch(videoUrl)).buffer()

        let caption =
            `🎵 *DOUYIN DOWNLOADER*\n\n` +
            `• Judul: ${title || "-"}\n` +
            `• Kualitas: ${version1.quality || "-"}\n\n` +
            `Selesai ✓`

        await fukusima.sendMessage(m.chat, { video: buff, caption }, { quoted: m })
        await fukusima.sendMessage(m.chat, { react: { text: "✔️", key: m.key } })
    } catch (e) {
        await m.reply("Terjadi kesalahan: " + e.message)
        await fukusima.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
    }
}

handler.command = /^(douyin|douyindl|doudl)$/i
handler.tags = ["downloader"]
handler.help = ["douyin <url>", "doudl", "douyindl"]
handler.register = true

export default handler