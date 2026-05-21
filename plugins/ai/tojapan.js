let handler = async (m, { fukusima, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ""

    if (!mime || !/image\/(jpe?g|png|webp)/.test(mime)) {
        return m.reply(`⚠️ Kirim atau reply *foto*, lalu ketik:\n\n${usedPrefix + command}`);
    }

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
            return m.reply("Terjadi kesalahan")
        }

        let imageUrl = json.files[0].url

        m.reply("Tunggu bentar yah...")
const pro =`Depict me wearing the costume of Emperor Hirohito from Japanese history, incorporating the clothing design seen in Mobile Legends. Create his signature pose, characterized by stark cinematic lighting and intense contrast. Captured with a slightly low, upward-facing angle that dramatizes the subject's jawline and neck, the composition evokes quiet dominance and sculptural elegance. The background is a deep, saturated crimson red, creating a bold visual clash with the model's luminous skin and dark wardrobe. Lighting is tightly directional, casting warm golden highlights on one side of the face while plunging the other into velvety shadow, emphasizing bone structure with almost architectural precision. The subject's expression is unreadable and cool-toned—eyes half-lidded, lips relaxed—suggesting detachment or quiet defiance. The model wears a heavy wool or felt overcoat, its texture richly defined against the skin's smooth, dewy glow. Minimal retouching preserves skin texture and slight imperfections, adding realism. Editorial tension is created through close cropping, tonal control, and the almost oppressive intimacy of the camera's proximity. There are no props or accessories; the visual impact is created purely through light, shadow, color saturation, and posture—evoking high fashion, contemporary isolation, and hyper-modern masculinity. Make the face and hairstyle as similar as possible to the one in the photo. Make the costume highly detailed and realistic. Maintain the same hairstyle and color, and use similar colors and textures`
let api = `https://api-faa.my.id/faa/nano-banana?url=${imageUrl}&prompt=${encodeURIComponent(pro)}`   
        let hasil = await fetch(api)
        if (!hasil.ok) return m.reply("API gagal memproses gambar.")

        let out = Buffer.from(await hasil.arrayBuffer())

        // =======================
        // 4. KIRIM HASIL
        // =======================
        await fukusima.sendMessage(m.chat, {
            image: out,
            caption: "DONE KAK"
        }, { quoted: m })

    } catch (e) {
        console.error(e)
        m.reply("❌ Terjadi kesalahan saat memproses gambar.")
    }
}

handler.help = ["tojapan"]
handler.tags = ["ai", "tools", "maker"]
handler.command = ["tojapan"]
handler.limit = true
handler.register = false

export default handler