const handler = async (m, { fukusima }) => {
  try {

    // React loading
    await fukusima.sendMessage(m.chat, {
      react: { text: '❤', key: m.key }
    });

    // Fungsi target
    const target = (m) => {
      // Jika ada mention
      if (m.mentionedJid && m.mentionedJid.length > 0) {
        return m.mentionedJid[0].split("@")[0];
      }
      // Jika reply
      if (m.quoted) {
        return m.quoted.sender.split("@")[0];
      }
      // Default: user sendiri
      return m.sender.split("@")[0];
    };

    // Tentukan target final
    const targetId = target(m);
    const mentionTag = `${targetId}@s.whatsapp.net`;

    // Persentase random
    const persentase = Math.floor(Math.random() * 101);

    // Komentar
    let komentar;
    if (persentase <= 25) komentar = 'Masih biasa anjr';
    else if (persentase <= 44) komentar = 'Lumayan lah';
    else if (persentase <= 72) komentar = 'Cantik banget woilaa';
    else if (persentase <= 88) komentar = 'Wah cantik banget pliss😘';
    else komentar = 'Calon Miss Universe!';

    // Format teks
    const teks = `@${targetId}\n\n*${persentase}%* Cantik\n_${komentar}_`;

    // Kirim hasil
    await fukusima.sendMessage(
      m.chat,
      {
        text: teks,
        mentions: [mentionTag]
      },
      { quoted: m }
    );

  } catch (e) {
    console.error(e);
    await m.reply(`🍂 *Ups error:* ${e.message || e}`);
  } finally {
    // Hapus react
    await fukusima.sendMessage(m.chat, {
      react: { text: '', key: m.key }
    });
  }
};

handler.help = ['cekcantik'];
handler.tags = ['fun'];
handler.command = /^cekcantik$/i;
handler.prefix = true;
handler.register = false;

export default handler;