import axios from "axios";

async function translateToEnglish(text) {
    try {
        const url = "https://translate.googleapis.com/translate_a/single";
        const params = {
            client: "gtx",
            sl: "auto",
            tl: "en",
            dt: "t",
            q: text
        };
        const res = await axios.get(url, { params });
        return res.data[0][0][0];
    } catch {
        return text;
    }
}

let handler = async (m, { fukusima, text }) => {
    if (!text) return fukusima.sendMessage(
        m.chat,
        { text: "Contoh:\n.imagen Gunung Fuji bertuliskan Ahmad" },
        { quoted: m }
    );

    try {
        const promptEnglish = await translateToEnglish(text);

        const url = `https://api.nekolabs.web.id/image-generation/flux/dev?prompt=${encodeURIComponent(promptEnglish)}&ratio=1:1`;
        const res = await axios.get(url);

        if (!res.data || !res.data.success || !res.data.result)
            return fukusima.sendMessage(
                m.chat,
                { text: "Gagal membuat gambar." },
                { quoted: m }
            );

        await fukusima.sendMessage(
            m.chat,
            {
                image: { url: res.data.result },
                caption: `✨ Prompt:\n${text}`
            },
            { quoted: m }
        );

    } catch (e) {
        await fukusima.sendMessage(
            m.chat,
            { text: "Terjadi kesalahan saat membuat gambar." },
            { quoted: m }
        );
    }
};

handler.help = ["imagen"];
handler.tags = ["ai"];
handler.command = /^imagen$/i;
handler.register = true;

export default handler;