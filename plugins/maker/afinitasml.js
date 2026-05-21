import fs from "fs";
import path from "path";
import { createCanvas, loadImage } from "canvas";
import { fileURLToPath } from "url";
import { downloadMediaMessage } from "baileys";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let handler = async (m, { fukusima, usedPrefix }) => {
  if (!m.quoted) return m.reply(`Balas gambar dengan perintah: ${usedPrefix}afinitasml`);
  const q = m.quoted;
  const mime = q.mimetype || q.msg?.mimetype || "";

  if (!mime.startsWith("image/")) return m.reply("Hanya gambar yang didukung");

  await m.reply("Sedang memproses");

  try {
    let media = null;
    if (q.download) media = await q.download().catch(() => null);
    if (!media) media = await downloadMediaMessage(q, "buffer").catch(() => null);
    if (!media) return m.reply("Gagal mengambil gambar");

    const medianame = `afinitasml_${Date.now()}.jpg`;
    const tmpPath = path.join(__dirname, 'tmp', medianame);
    if (!fs.existsSync(path.join(__dirname, 'tmp'))) fs.mkdirSync(path.join(__dirname, 'tmp'));
    await fs.promises.writeFile(tmpPath, media);

    const [template, userImg] = await Promise.all([
      loadImage('https://www.fuku-cloud.my.id/upload/6254_1755349605289.jpeg'),
      loadImage(tmpPath)
    ]);

    const canvas = createCanvas(template.width, template.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(template, 0, 0);

    const x = 210, y = 540, w = 370, h = 358;
    const scale = 0.8;
    const newW = w * scale;
    const newH = h * scale;
    const newX = x + (w - newW) / 2;
    const newY = y + (h - newH) / 2;

    function roundedImage(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    }

    ctx.save();
    roundedImage(ctx, newX, newY, newW, newH, 20);
    ctx.clip();
    ctx.drawImage(userImg, newX, newY, newW, newH);
    ctx.restore();

    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
    await fukusima.sendMessage(
      m.chat,
      { image: buffer, caption: 'Afinitas ML sudah jadi', mentions: [m.sender] },
      { quoted: m }
    );

    fs.unlinkSync(tmpPath);
  } catch (e) {
    m.reply('Gagal memproses gambar');
  }
};

handler.command = ['afinitasml'];
handler.tags = ['maker', 'tools'];
handler.help = ['afinitasml *img*'];
handler.register = true;

export default handler