import fetch from "node-fetch";

let handler = async(m, {fukusima, text, command}) => {
  try {
    if(!text) return m.reply(`contoh: .${command} https://youtube.com/tytyd `)
    
    await m.reply("wait")
    const api = `https://theresapis.vercel.app/tools/ytmonet?url=${encodeURIComponent(text)}`
    const ress = await fetch(api);
    const data = await ress.json();
    if(!data.status) return m.reply("Terjadi kesalahan")
    const awal = data.result;
    const namach = awal.title;
    const status = awal.isMonetized;
    const totalvid = awal.videoCount;
    const totalView = awal.viewCount;
    const ppYt = awal.thumbnailUrl;
    const sub = awal.subscriberCount;
    await fukusima.sendMessage(m.chat,
    {
  image: {url: ppYt},
  caption: `*BERIKUT DETAIL CHANNEL ${namach}* 
  
🎬 *NAMA:* ${namach}
👥 *SUBREK:* ${sub}
💰 *MONETISASI:* ${status}
📹 *TOTAL VIDEO:* ${totalvid}
👀 *TOTAL VIEW:* ${totalView}`
    },
    {quoted: m}
    )
  } catch (err) {
    m.reply("Terjadi kesalahan" + err.message)
  }
}

handler.command = ["ytmonet"]
handler.tags = ["tools"]
handler.help = ["ytmonet <url>"]
export default handler