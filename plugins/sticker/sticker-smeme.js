import axios from 'axios';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
import { writeFileSync, unlinkSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import sharp from 'sharp'; 

let handler = async (m, { fukusima, text, usedPrefix, command }) => {
    try {
        let teks = text ? text.split('|').map(t => t.trim()) : [];
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';

        if (!mime || !/image\/(jpe?g|png|webp)/.test(mime))
            return m.reply(`Balas gambar dengan perintah:\n\n${usedPrefix + command} teks atas | teks bawah`);

        await fukusima.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
        let imgBuffer = await q.download();
        let imgUrl = await uploadTempFile(imgBuffer);

        let topText = encodeURIComponent(teks[0] || ' ');
        let bottomText = encodeURIComponent(teks[1] || ' ');
        let memeUrl = `https://api.memegen.link/images/custom/${topText}/${bottomText}.png?background=${imgUrl}`;
        const memeRes = await axios.get(memeUrl, { responseType: 'arraybuffer' });
        const tmpDir = path.join(process.cwd(), 'tmp');
        if (!existsSync(tmpDir)) mkdirSync(tmpDir);
        const tempFilePng = path.join(tmpDir, `meme_${Date.now()}.png`);
        writeFileSync(tempFilePng, memeRes.data);
        const tempFileWebp = path.join(tmpDir, `meme_${Date.now()}.webp`);
        await sharp(tempFilePng)
            .resize(512, 512, { fit: 'contain', background: { r:0, g:0, b:0, alpha:0 } })
            .webp()
            .toFile(tempFileWebp);
        await fukusima.sendMessage(m.chat, { sticker: { url: tempFileWebp } }, { quoted: m });
        unlinkSync(tempFilePng);
        unlinkSync(tempFileWebp);
        await fukusima.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error(err);
        m.reply('Gagal membuat stiker meme. Coba lagi nanti.');
    }
};

handler.help = ['smeme <teks atas> | <teks bawah>'];
handler.tags = ['tools'];
handler.command = /^(smeme)$/i;

export default handler;

async function uploadTempFile(buffer) {
    const { ext, mime } = await fileTypeFromBuffer(buffer);
    const form = new FormData();
    form.append('file', buffer, { filename: `${Date.now()}.${ext}`, contentType: mime });
    const { data } = await axios.post('https://tmpfiles.org/api/v1/upload', form, {
        headers: { ...form.getHeaders() },
    });
    const result = data.data.url.split('org')[1];
    return `https://tmpfiles.org/dl${result}`;
}