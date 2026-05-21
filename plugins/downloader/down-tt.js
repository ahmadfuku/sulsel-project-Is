import fetch from "node-fetch"

let handler = async (m, { fukusima, args }) => {
    if (!args[0])
        return m.reply("Masukkan URL TikTok.\nContoh: .tiktok https://vt.tiktok.com/xxxx")

    let url = args[0]
    let apikey = "fukuxyz_bd912e"

    try {
        m.reply("Sedang mengunduh video TikTok...")

        let res = await fetch(
            `https://api.fukugpt.my.id/api/tiktok?api=${global.apifuku}&url=${encodeURIComponent(url)}`
        )
        let json = await res.json()

        if (!json.status) return m.reply("Gagal mengambil data dari API.")

        let { video, audio, author } = json.result

        if (!video) return m.reply("Video tidak tersedia.")

        let v = await fetch(video)
        let vbuf = Buffer.from(await v.arrayBuffer())

        await fukusima.sendMessage(
            m.chat,
            {
                video: vbuf,
                caption: `Judul            : TikTok Downloader
Author           : ${author || "Tidak diketahui"}
Platform         : TikTok
Kualitas         : Original
Status Unduhan   : Berhasil`
            },
            { quoted: m }
        )

        if (audio) {
            let a = await fetch(audio)
            let abuf = Buffer.from(await a.arrayBuffer())

            await fukusima.sendMessage(
                m.chat,
                {
                    audio: abuf,
                    mimetype: "audio/mpeg",
                    caption: `Judul            : Audio TikTok
Author           : ${author || "Tidak diketahui"}
Format           : MP3
Status Unduhan   : Berhasil`
                },
                { quoted: m }
            )
        }
    } catch (e) {
        console.log(e)
        m.reply("Terjadi kesalahan saat mengunduh video TikTok.")
    }
}

handler.help = ["tiktok <url>"]
handler.tags = ["downloader"]
handler.command = /^(tiktok|tt)$/i

export default handler