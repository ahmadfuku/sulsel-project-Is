
let handler = async (m, { fukusima, text, usedPrefix, command }) => {
    try {
        if (!text) return m.reply(`*Contoh: ${usedPrefix + command} Bandung*`);
        await fukusima.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        const url = `https://api.ootaizumi.web.id/lokasi/cuaca?lokasi=${encodeURIComponent(text)}`;
        const r = await fetch(url);
        const j = await r.json();

        if (!j?.status) {
            return m.reply(`*🍂 Gagal mengambil data cuaca, coba ulang lagi.*`);
        }

        const d = j.result;
        const lo = d.lokasi;
        const cu = d.cuaca;
        const ang = cu.angin;
        const link = d.url;

        let caption = `*🌤️ Informasi Cuaca — ${d.namaTempat}*\n\n`;
        caption += `*📍 Lokasi:*\n`;
        caption += `• *Provinsi:* ${lo.provinsi}\n`;
        caption += `• *Kota/Kab:* ${lo.kotkab}\n`;
        caption += `• *Kecamatan:* ${lo.kecamatan}\n`;
        caption += `• *Desa:* ${lo.desa}\n\n`;

        caption += `*⛅ Cuaca Saat Ini:*\n`;
        caption += `• *Waktu:* ${cu.waktu}\n`;
        caption += `• *Deskripsi:* ${cu.deskripsi}\n`;
        caption += `• *Suhu:* ${cu.suhu}\n`;
        caption += `• *Kelembapan:* ${cu.kelembapan}\n`;
        caption += `• *Tutupan Awan:* ${cu.tutupanAwan}\n`;
        caption += `• *Jarak Pandang:* ${cu.jarakPandang.teks}\n\n`;

        caption += `*🍃 Angin:*\n`;
        caption += `• *Dari:* ${ang.dari}\n`;
        caption += `• *Menuju:* ${ang.ke}\n`;
        caption += `• *Kecepatan:* ${ang.kecepatan}\n`;
        caption += `• *Derajat:* ${ang.derajat}°\n\n`;

        caption += `*🔗 Tautan:*\n`;
        caption += `• *BMKG:* ${link.bmkg}\n`;

        await fukusima.sendMessage(
            m.chat,
            {
                text: caption,
                contextInfo: {
                    externalAdReply: {
                        title: `Cuaca — ${d.namaTempat}`,
                        body: `${cu.deskripsi} • ${cu.suhu}`,
                        thumbnailUrl: 'https://files.cloudkuimages.guru/images/5bc85d9d0eab.jpg',
                        sourceUrl: link.bmkg,
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        showAdAttribution: false
                    }
                }
            },
            { quoted: m.quoted ? m.quoted : m }
        );
    } catch {
        await m.reply(`*🍂 Terjadi kesalahan saat memproses data cuaca.*`);
    } finally {
        await fukusima.sendMessage(m.chat, { react: { text: '', key: m.key } });
    }
};

handler.help = ['cuaca'];
handler.tags = ['tools'];
handler.command = /^(cuaca|cekcuaca|prakiraan)$/i;
handler.register = true;

export default handler;