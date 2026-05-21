let handler = async (m, { fukusima, text, usedPrefix, command }) => {
    try {
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ""

        // Jika tidak reply gambar dan tidak pakai link
        if (!text && !/image\/(jpe?g|png|webp)/.test(mime)) {
            return m.reply(
`📸 *Cara pemakaian*

• Reply gambar:  
  ➤  *${usedPrefix + command}*

• Pakai link gambar:  
  ➤  *${usedPrefix + command} <url>*`
            )
        }

        await fukusima.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        let imageUrl = text

        // Kalau reply foto → upload otomatis via Baileys
        if (/image\/(jpe?g|png|webp)/.test(mime)) {
            let buffer = await q.download()
            if (!buffer) return m.reply("❌ *Gagal mengunduh gambar.*")

            // Upload ke WhatsApp (hasilnya URL WA)
            let up = await fukusima.sendMessage(m.chat, { image: buffer }, { ephemeralExpiration: 1 })
            imageUrl = up?.message?.imageMessage?.url

            if (!imageUrl) return m.reply("❌ *Gagal upload gambar ke server WhatsApp.*")
        }

        // Request API anime
        const apiURL = `https://zelapioffciall.koyeb.app/imagecreator/toanime?url=${encodeURIComponent(imageUrl)}`
        let r = await fetch(apiURL)

        if (!r.ok) return m.reply("❌ *Gagal convert ke anime.*")

        let hasil = Buffer.from(await r.arrayBuffer())

        await fukusima.sendMessage(
            m.chat,
            {
                image: hasil,
                caption: "✨ *Berhasil mengubah foto menjadi Anime!*"
            },
            { quoted: m }
        )

    } catch (e) {
        console.log(e)
        m.reply("❌ *Terjadi kesalahan saat memproses.*")
    } finally {
        await fukusima.sendMessage(m.chat, { react: { text: '', key: m.key } })
    }
}

handler.help = ["toanime"]
handler.tags = ["maker"]
handler.command = /^(toanime|animeconv|animeconvert)$/i
handler.limit = true

export default handler