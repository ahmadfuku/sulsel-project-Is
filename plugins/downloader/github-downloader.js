let handler = async (m, { fukusima, text }) => {
  try {
    if (!text) return m.reply('❌ Masukkan URL GitHub!\nContoh: .github https://github.com/username/repo');

    await fukusima.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    const apiUrl = `https://api.baguss.xyz/github/download?url=${encodeURIComponent(text)}`;
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`Status ${res.status} saat menghubungi API`);

    const data = await res.json();

    if (!data || !data.result) throw new Error('Gagal mendapatkan data dari API');

    // Kirim file atau link hasil download
    if (data.result.url) {
      await fukusima.sendMessage(m.chat, { text: `✔ File tersedia!\nNama: ${data.result.name}\nUkuran: ${data.result.size}\nURL: ${data.result.url}` }, { quoted: m });
    } else {
      await m.reply('❌ API tidak mengembalikan URL file');
    }

  } catch (e) {
    console.error(e);
    m.reply(`❌ Terjadi kesalahan: ${e.message}`);
  }
};

handler.help = ['github'];
handler.tags = ['downloader'];
handler.command = /^github$/i;
export default handler;