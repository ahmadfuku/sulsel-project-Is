import { createCanvas, loadImage, registerFont } from 'canvas';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const fkontak = {
  key: {
    participant: '0@s.whatsapp.net',
    remoteJid: '0@s.whatsapp.net',
    fromMe: false,
    id: 'Halo',
  },
  message: {
    conversation: `Lobby MLBB Maker ✨¨`,
    
  },
};

const handler = async (m, { fukusima, text, usedPrefix, command }) => {

  if (!text) {
    return fukusima.reply(m.chat, `Harap Masukkan Username\nContoh: ${usedPrefix + command} ${global.author}`, m, { quoted: fkontak });
  }

  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mimetype || '';
  if (!mime.startsWith('image/')) {
    return fukusima.reply(m.chat, `Harap balas sebuah gambar untuk dijadikan profil MLBB.`, m, { quoted: fkontak });
  }

  await fukusima.reply(m.chat, "Processing Lobby MLBB Picture" || global.wait, m, { quoted: fkontak });

  try {
    // --- Persiapan Font dan Direktori ---
    const tmpDir = process.cwd();
    const fontUrl = 'https://www.fuku-cloud.my.id/upload/z0gvtn.ttf';
    const fontPath = path.join(tmpDir, 'z0gvtn.ttf');

    if (!fs.existsSync(fontPath)) {
      const res = await axios.get(fontUrl, { responseType: 'arraybuffer' });
      fs.writeFileSync(fontPath, Buffer.from(res.data));
    }
    registerFont(fontPath, { family: 'CustomFont' });

    const mediaBuffer = await q.download();
    const userImage = await loadImage(mediaBuffer);
    const bg = await loadImage('https://www.fuku-cloud.my.id/upload/2akeq0.jpeg');
    const frameOverlay = await loadImage('https://www.fuku-cloud.my.id/upload/rkwlf1.jpeg');

    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    const avatarSize = 205;
    const frameSize = 293;
    const centerX = (canvas.width - frameSize) / 2;
    const centerY = (canvas.height - frameSize) / 2 - 282;
    const avatarX = centerX + (frameSize - avatarSize) / 2;
    const avatarY = centerY + (frameSize - avatarSize) / 2 - 3;

    const { width, height } = userImage;
    const minSide = Math.min(width, height);
    const cropX = (width - minSide) / 2;
    const cropY = (height - minSide) / 2;

    ctx.drawImage(userImage, cropX, cropY, minSide, minSide, avatarX, avatarY, avatarSize, avatarSize);
    ctx.drawImage(frameOverlay, centerX, centerY, frameSize, frameSize);

    const nickname = text.trim();
    const maxFontSize = 36;
    const minFontSize = 24;
    const maxChar = 11;
    let fontSize = maxFontSize;

    if (nickname.length > maxChar) {
      const excess = nickname.length - maxChar;
      fontSize -= excess * 2;
      if (fontSize < minFontSize) fontSize = minFontSize;
    }

    ctx.font = `${fontSize}px CustomFont`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(nickname, canvas.width / 2 + 13, centerY + frameSize + 15);

    const buffer = canvas.toBuffer('image/png');

    await fukusima.sendMessage(m.chat, {
      image: buffer,
      caption: `*🎀 Gambar Lobby MLBB Berhasil Dibuat*\n*Nickname:* ${nickname}`,
    }, { quoted: fkontak });

  } catch (e) {
    console.error(e);
    
    fukusima.reply(m.chat, `❌ Terjadi kesalahan saat membuat gambar\nLog: ${e.message}`, m, { quoted: fkontak });
  }
};

handler.help = ['fakeml <text>'];
handler.tags = ['maker'];
handler.command = /^(fakeml)$/i;

handler.limit = true;

export default handler;