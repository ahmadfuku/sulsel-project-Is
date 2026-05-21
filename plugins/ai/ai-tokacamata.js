let handler = async (m, { fukusima, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ""

    if (!mime || !/image\/(jpe?g|png|webp)/.test(mime)) {
        return m.reply(`Contoh: ${usedPrefix + command}`);
    }
    m.reply("Memproses gambar kamu...")
    try {
        let buffer = await q.download()
        let form = new FormData()
        form.append("files[]", new Blob([buffer]), "image.jpg")
        let upload = await fetch("https://uguu.se/upload.php", {
            method: "POST",
            body: form
        })

        let json = await upload.json()
        if (!json.files || !json.files[0] || !json.files[0].url) {
            return m.reply("Gagal memproses")
        }
        let imageUrl = json.files[0].url
        m.reply("Tunggu sebentar ya...")
        let api = `https://api-faa.my.id/faa/tokacamata?url=${encodeURIComponent(imageUrl)}`
        let hasil = await fetch(api)

        if (!hasil.ok) return m.reply("Api Down")

        let out = Buffer.from(await hasil.arrayBuffer())

        await fukusima.sendMessage(m.chat, {
            image: out,
            caption: "done"
        }, { quoted: m })

    } catch (e) {
        console.error(e)
        m.reply("Terjadi kesalahan saat memproses gambar.")
    }
}

handler.help = ["toglasses", "tokacamata"]
handler.tags = ["ai"]
handler.command = ["toglasses", "tokacamata"]
handler.limit = true
handler.register = true

export default handler