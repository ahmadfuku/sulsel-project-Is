import fetch from 'node-fetch';

let handler = async (m, { fukusima, usedPrefix, command }) => {
    try {
        if (!m.quoted || !m.quoted.message || !m.quoted.message.imageMessage) {
            return fukusima.reply(m.chat, `Balas gambar dengan perintah:\n${usedPrefix}${command}`, m);
        }

        await fukusima.sendMessage(m.chat, { text: '⏳ Sedang memproses gambar...' }, { quoted: m });

        // Download gambar
        const buffer = await m.quoted.download();
        if (!buffer) return fukusima.reply(m.chat, '❌ Gagal mengunduh gambar.', m);

        // Upload ke mirror API
        const formData = new FormData();
        formData.append('file', buffer, 'image.jpg');

        const uploadRes = await fetch('https://uploader.zenzxz.dpdns.org/upload', {
            method: 'POST',
            body: formData
        });

        const uploadHtml = await uploadRes.text();
        const match = uploadHtml.match(/href="(https?:\/\/uploader\.zenzxz\.dpdns\.org\/uploads\/[^"]+)"/);
        if (!match) throw new Error('❌ Gagal mendapatkan URL dari uploader.');

        const sourceUrl = match[1];

        // Panggil API mirror
        const apiRes = await fetch(`https://api-faa.my.id/faa/tomirror?url=${encodeURIComponent(sourceUrl)}`);
        if (!apiRes.ok) throw new Error('❌ API Mirror error');

        const imageBuffer = await apiRes.buffer();

        // Kirim hasil
        await fukusima.sendMessage(m.chat, { image: imageBuffer }, { quoted: m });

    } catch (e) {
        console.error(e);
        fukusima.reply(m.chat, '❌ Terjadi kesalahan saat memproses gambar. Coba lagi nanti!', m);
    }
};

handler.help = ['tomirror'];
handler.tags = ['ai', 'tools'];
handler.command = /^tomirror|mirror$/i;

export default handler;