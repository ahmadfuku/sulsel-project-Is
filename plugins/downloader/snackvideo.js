import fetch from 'node-fetch';

let handler = async(m, {fukusima, command, text}) => {
  try {
    if(!text) return m.reply(`Contoh: .${command} <url>`);
    m.reply("Tunggu sebentar...")
    const api = `https://api.siputzx.my.id/api/d/snackvideo?url=${encodeURIComponent(text)}`
    const ress = await fetch(api);
    const periksa = await ress.json();
    
    if(!periksa.status) return m.reply("Api Down");
    const judul = periksa.data.title;
    const des = periksa.data.description;
    const waktu = periksa.data.uploadDate;
    const vid = periksa.data.videoUrl;
    
    await fukusima.sendMessage(m.chat, 
    {
      video: { url: vid },
      caption: `
      *JUDUL:* ${judul}
      *DESKRIPSI:* ${des}
      *DATE:* ${waktu}
      
      _Powerred By ${global.author}
      `
    }, { quoted: m }
    )
  } catch (e) {
    m.reply("Terjadi kesalahan " + e.message)
  }
}

handler.command = ["snackvideo", "snackviddl"]
handler.tags = ["downloader"]
handler.help = ["snackvideo", "snackviddl"]
handler.register = true;
handler.limit = true

export default handler