import axios from "axios";
import { sendInteractiveMessage } from "buttons-warpper";

let handler = async (m, { fukusima, text }) => {
    if (!text)
        return fukusima.sendMessage(m.chat, { text: "Contoh:\n.pin jokowi" }, { quoted: m });

    try {
        const res = await axios.get(`https://vor-apis.biz.id/api/pin?q=${encodeURIComponent(text)}`);
        if (!res.data || !res.data.data || res.data.data.length === 0)
            return fukusima.sendMessage(m.chat, { text: "Tidak ada hasil ditemukan." }, { quoted: m });

        const data = res.data.data;
        const random = data[Math.floor(Math.random() * data.length)];

        const caption = `
Upload By: ${random.upload_by}
Fullname: ${random.fullname}
Followers: ${random.followers}
Caption: ${random.caption || "-"}
Source: ${random.source}
        `;

        await fukusima.sendMessage(
            m.chat,
            { image: { url: random.image }, caption, parse_mode: "Markdown" },
            { quoted: m }
        );

        await new Promise(resolve => setTimeout(resolve, 1000));

        await sendInteractiveMessage(fukusima, m.chat, {
            text: "Apakah Anda ingin mencari hal yang sama?",
            footer: "Quick Search",
            interactiveButtons: [
                { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Ya, cari lagi", buttonId: `.pin ${text}`, type: 1 }) },
                { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Tidak, selesai", buttonId: `.stop`, type: 1 }) }
            ]
        }, { quoted: m });

    } catch (err) {
        await fukusima.sendMessage(m.chat, { text: "Terjadi kesalahan saat mengambil data." }, { quoted: m });
    }
};

handler.help = ["pin"];
handler.tags = ["search"];
handler.command = /^pin$/i;
handler.register = true;

export default handler;