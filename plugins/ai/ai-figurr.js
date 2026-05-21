let handler = async (m, { fukusima, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ""

    if (!mime || !/image\/(jpe?g|png|webp)/.test(mime)) {
        return m.reply(`⚠️ Kirim atau reply *foto*, lalu ketik:\n\n${usedPrefix + command}`);
    }

    m.reply("⏳ Upload gambar ke UGUU...")

    try {
        // =======================
        // 1. DOWNLOAD IMAGE
        // =======================
        let buffer = await q.download()

        // =======================
        // 2. UPLOAD KE UGUU
        // =======================
        let form = new FormData()
        form.append("files[]", new Blob([buffer]), "image.jpg")

        let upload = await fetch("https://uguu.se/upload.php", {
            method: "POST",
            body: form
        })

        let json = await upload.json()

        if (!json.files || !json.files[0] || !json.files[0].url) {
            return m.reply("❌ Gagal upload ke UGUU.")
        }

        let imageUrl = json.files[0].url

        m.reply("⏳ Mengubah menjadi figure...")

        // =======================
        // 3. PANGGIL API TOFIGURA
        // =======================
        let api = `https://api-faa.my.id/faa/tofigura?url=${encodeURIComponent(imageUrl)}`
        let hasil = await fetch(api)

        if (!hasil.ok) return m.reply("❌ API gagal memproses gambar.")

        let out = Buffer.from(await hasil.arrayBuffer())

        // =======================
        // 4. KIRIM HASIL
        // =======================
        await fukusima.sendMessage(m.chat, {
            image: out,
            caption: "✨ *Berhasil mengubah ke Figure Style!*"
        }, { quoted: m })

    } catch (e) {
        console.error(e)
        m.reply("❌ Terjadi kesalahan saat memproses gambar.")
    }
}

handler.help = ["tofigure"]
handler.tags = ["ai", "tools", "maker"]
handler.command = /^tofig(ure)?$/i
handler.limit = true
handler.register = false

export default handler