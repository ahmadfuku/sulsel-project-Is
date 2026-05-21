const handler = async (m, { fukusima }) => {
  const chatId = m.chat;

  // Hanya boleh di grup
  if (!m.isGroup) {
    return fukusima.sendMessage(chatId, {
      text: 'Perintah ini hanya bisa digunakan di grup.'
    }, { quoted: m });
  }

  // Ambil metadata grup
  const metadata = await fukusima.groupMetadata(chatId).catch(() => null);
  if (!metadata) {
    return fukusima.sendMessage(chatId, {
      text: 'Tidak dapat mengambil data grup.'
    }, { quoted: m });
  }

  // Ambil seluruh peserta
  const participants = metadata.participants
    .map(p => p.id)
    .filter(id => id !== fukusima.user.id); // jangan bot

  const ctx = m.message?.extendedTextMessage?.contextInfo || {};
  const mentioned = ctx.mentionedJid || [];
  const quoted = ctx.participant;

  let target1, target2;

  // Kasus mention 2 orang
  if (mentioned.length >= 2) {
    [target1, target2] = mentioned;
  }

  // Kasus mention 1 orang → ambil pasangan acak
  else if (mentioned.length === 1) {
    target1 = mentioned[0];
    target2 = pickRandom(participants, [target1]);
  }

  // Kasus reply seseorang → ambil pasangan acak
  else if (quoted) {
    target1 = quoted;
    target2 = pickRandom(participants, [target1]);
  }

  // Tidak mention siapa pun → ambil 2 orang acak
  else {
    target1 = pickRandom(participants);
    do { target2 = pickRandom(participants); }
    while (target1 === target2);
  }

  // Hitung persentase cinta acak
  const percent = Math.floor(Math.random() * 100) + 1;

  const name1 = target1.split("@")[0];
  const name2 = target2.split("@")[0];

  const teks = `❤️ *Cek Jodoh* ❤️
@${name1} ❤️ @${name2}
*Kecocokan:* *${percent}%*`;

  // Kirim hasil
  await fukusima.sendMessage(chatId, {
    text: teks,
    mentions: [target1, target2]
  }, { quoted: m });
};

// Helper fungsi
function pickRandom(list, exclude = []) {
  const filtered = list.filter(x => !exclude.includes(x));
  return filtered[Math.floor(Math.random() * filtered.length)];
}

handler.help = ['cekjodoh'];
handler.tags = ['fun'];
handler.command = /^cekjodoh$/i;
handler.prefix = true;

export default handler;