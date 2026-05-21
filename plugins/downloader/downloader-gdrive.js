import fetch from "node-fetch"

let handler = async (m, { fukusima, text, command }) => {
    if (!text) return m.reply(`Contoh:\n.${command} https://drive.google.com/file/...`)

    await fukusima.sendMessage(m.chat, {
        react: { text: "⏳", key: m.key }
    })

    try {
        const api = `https://api.siputzx.my.id/api/d/gdrive?url=${encodeURIComponent(text)}`
        const res = await fetch(api)
        const json = await res.json()

        if (!json.status || !json.data) {
            let err = json.error || "Gagal mengambil data dari API"
            throw new Error(err)
        }

        const { name, download, link } = json.data
        if (!download) throw new Error("Link download tidak ditemukan")

        let caption =
            `☁️ *GOOGLE DRIVE DOWNLOADER*\n\n` +
            `• Nama: ${name || "-"}\n` +
            `• Link: ${link || "-"}\n\n` +
            `Selesai ✓`

        await fukusima.sendMessage(m.chat, {
            document: { url: download },
            fileName: name || "gdrive-file",
            caption,
            mimetype: "application/octet-stream"
        }, { quoted: m })

        await fukusima.sendMessage(m.chat, {
            react: { text: "✔️", key: m.key }
        })
    } catch (e) {
        await m.reply("Terjadi kesalahan: " + e.message)
        await fukusima.sendMessage(m.chat, {
            react: { text: "❌", key: m.key }
        })
    }
}

handler.command = /^(gdrive|googledrive|gdrivedl)$/i
handler.tags = ["downloader"]
handler.help = ["gdrive <url>", "gdrivedl <url>"]
handler.register = true

export default handler