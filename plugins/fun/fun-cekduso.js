const cekDosaList = [
  "Nonton aneh-aneh tengah malam",
  "Ngeghost orang baik",
  "Pacaran sambil chat mantan",
  "Ngutang tapi pura-pura lupa",
  "Stalking mantan tiap malam",
  "Males mandi dua hari",
  "Ghibah 3 jam tanpa jeda",
  "Spam sticker gak jelas",
  "PHP-in orang",
  "Tidur habis subuh",
  "Pelit saat ditraktir",
  "Chat cuma kalo butuh doang",
  "Bikin janji tapi nggak datang",
  "Ngerusuh di grup",
  "Ngeshare hoax"
];

const handler = async (m, { fukusima }) => {
  try {

    // React loading
    await fukusima.sendMessage(m.chat, {
      react: { text: '⏳', key: m.key }
    });

    // Fungsi target
    const target = (m) => {
      if (m.mentionedJid?.length) return m.mentionedJid[0].split("@")[0];
      if (m.quoted) return m.quoted.sender.split("@")[0];
      return m.sender.split("@")[0];
    };

    const targetId = target(m);
    const mentionTag = `${targetId}@s.whatsapp.net`;

    // Ambil 10 dosa acak
    const dosaUnik = [...cekDosaList]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);

    // Format pesan
    let teks = `*Top 10 dosa besar* @${targetId}\n\n`;
    dosaUnik.forEach((dosa, i) => {
      teks += `${i + 1}. ${dosa}\n`;
    });

    // Kirim hasil
    await fukusima.sendMessage(
      m.chat,
      {
        text: teks.trim(),
        mentions: [mentionTag]
      },
      { quoted: m }
    );

  } catch (e) {
    await m.reply(`🍂 *Ups error:* ${e.message || e}`);
  } finally {
    // Hapus react
    await fukusima.sendMessage(m.chat, {
      react: { text: '', key: m.key }
    });
  }
};

handler.help = ['cekdosa', 'cek dosa'];
handler.tags = ['fun'];
handler.command = /^(cekdosa|cek dosa)$/i;
handler.prefix = true;
handler.register = false;

export default handler;