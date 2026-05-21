let handler = async (m, { fukusima, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix + command} pemandangan`);
  try {
    await fukusima.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });
    const apiUrl = `https://api.baguss.xyz/api/search/pinterest?q=${encodeURIComponent(text)}`;
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`API gagal dengan status ${res.status}`);
    const json = await res.json();
    if (!json.results || json.results.length === 0) throw new Error("Tidak ditemukan gambar.");
    for (let i = 0; i < Math.min(5, json.results.length); i++) {
      const pin = json.results[i];
      const caption = `📌 Title: ${pin.title || 'Tidak tersedia'}\n👤 Author: ${pin.author?.fullname || pin.author?.username || 'Unknown'}\n🔗 Pin URL: ${pin.pin_url}`;
      await fukusima.sendMessage(m.chat, { image: { url: pin.image_url }, caption }, { quoted: m });
    }
    await fukusima.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  } catch (err) {
    console.error(err);
    m.reply(`⚠️ Terjadi kesalahan: ${err.message}`);
  }
};

handler.help = ['pinterest'];
handler.tags = ['internet', 'search'];
handler.command = /^pinterest$/i;

export default handler;