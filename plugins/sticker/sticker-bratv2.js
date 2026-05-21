let handler = async (m, { text, usedPrefix, command, fukusima }) => {
    if (!text) return m.reply(`💬 Contoh penggunaan:\n${usedPrefix + command} Halo dunia`);

    try {
        await m.reply("⏳ Membuat stiker, tunggu sebentar...");
        const apiUrl = `https://api-faa.my.id/faa/brathd?text=${encodeURIComponent(text)}`;
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error('❌ Gagal mengambil stiker dari API');

        const buffer = Buffer.from(await res.arrayBuffer());
        let exif = {};
        if (text.includes(",")) {
            const [packname, author] = text.split(",");
            exif = { packName: packname.trim(), packPublish: author.trim() };
        }
        await fukusima.sendSticker(m.chat, buffer, m, exif);

    } catch (e) {
        console.error(e);
        m.reply('❌ Gagal membuat stiker, coba lagi nanti.');
    }
};

handler.help = ['bartv2'];
handler.tags = ['sticker'];
handler.command = /^(bartv2)$/i;
handler.register = true;
handler.limit = true;

export default handler;