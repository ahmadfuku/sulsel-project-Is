let handler = async (m, { fukusima }) => {
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (!mime.startsWith('image/')) return m.reply('ᴍᴀɴᴀ ɢᴀᴍʙᴀʀ ɴʏᴀ?.');
    let buffer = await q.download();
    let boundary = '----WebKitFormBoundary' + Date.now();
    let body = '';
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="reqtype"\r\n\r\nfileupload\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="userhash"\r\n\r\n\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="fileToUpload"; filename="upload.jpg"\r\n`;
    body += `Content-Type: image/jpeg\r\n\r\n`;

    let pre = Buffer.from(body, 'utf8');
    let post = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8');
    let finalBuffer = Buffer.concat([pre, buffer, post]);

    let res = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data; boundary=' + boundary },
      body: finalBuffer
    });
    let url = await res.text();
    if (!url.startsWith('http')) throw new Error('Gagal mendapatkan URL');
    await fukusima.sendMessage(m.chat, { text: `✔ Upload berhasil!\nURL: ${url}` }, { quoted: m });
  } catch (e) {
    console.error(e);
    await m.reply(`Terjadi kesalahan: ${e.message}`);
  }
}

handler.help = ['tourlcatbox'];
handler.tags = ['tools'];
handler.command = /^tourlcatbox$/i;
handler.register = true

export default handler;