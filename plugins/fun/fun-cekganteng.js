const handler = async (m, { fukusima }) => {
  const chatId = m.chat;
  const sender = m.sender;

  // Cari target (mention > quoted > default: pengirim)
  const ctx = m.message?.extendedTextMessage?.contextInfo || {};
  const mentioned = ctx.mentionedJid?.[0];
  const quoted = ctx.participant;

  const targetId = mentioned || quoted || sender;
  const targetUser = targetId.split("@")[0];

  const persentase = Math.floor(Math.random() * 101);

  let komentar;
  if (persentase <= 25) komentar = 'Masih biasa cok';
  else if (persentase <= 44) komentar = 'Lumayan laaa';
  else if (persentase <= 72) komentar = 'Gantengg juga kamu jir😘';
  else if (persentase <= 88) komentar = 'Wahh gantengg banget anjrr😋😋';
  else komentar = 'Calon Oppa Korea!😋💍💍';

  const teks = `*Seberapa ganteng* @${targetUser}\n\n*${persentase}%* Ganteng\n_${komentar}_`;

  await fukusima.sendMessage(chatId, {
    text: teks,
    mentions: [targetId]
  }, { quoted: m });
};

handler.help = ['cekganteng'];
handler.tags = ['fun'];
handler.command = /^cekganteng$/i;
handler.prefix = true;

export default handler;