import axios from "axios"

const handler = async (m, { fukusima, command, args }) => {
    if (!args[0]) return m.reply("❌ Masukkan teks!\nContoh: .ustadz jangan lupa sholat")

    try {
        await m.reply("⏳ Ustadz sedang berbicara...")

        const { data: imgBuffer } = await axios.get(
            `https://api.elrayyxml.web.id/api/maker/ustadz?text=${encodeURIComponent(args.join(" "))}`,
            { responseType: "arraybuffer", timeout: 30000 }
        )

        await fukusima.sendMessage(
            m.chat,
            { image: imgBuffer, caption: "✅ Tausiyah selesai!" },
            { quoted: m }
        )
    } catch (err) {
        console.error("USTADZ ERROR:", err)
        m.reply("❌ Gagal membuat meme ustadz.")
    }
}

handler.help = ["ustadz <teks>"]
handler.tags = ["islami"]
handler.command = /^ustadz$/i
handler.exp = 3

export default handler