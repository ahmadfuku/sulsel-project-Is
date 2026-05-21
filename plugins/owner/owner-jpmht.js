import fs from 'fs';
import mime from 'mime-types';

const handler = async (m, { text, fukusima, qmsg, quoted, mime: qMime }) => {
  if (!text) return m.reply('Contoh: .jpmht Teksnya');

  let mediaPath;
  if (/image/.test(qMime)) {
    mediaPath = await fukusima.downloadAndSaveMediaMessage(qmsg);
  }

  const allGroups = await fukusima.groupFetchAllParticipating();
  const groupIds = Object.keys(allGroups);
  let successCount = 0;

  const senderChat = m.chat;
  const messageType = mediaPath ? 'teks & foto ht' : 'teks ht';

  await m.reply(`Memproses ${messageType} ke ${groupIds.length} grup...`);

  for (const groupId of groupIds) {
    const groupData = allGroups[groupId];
    if (!groupData || !groupData.participants) {
      console.warn(`Lewatkan grup ID bermasalah: ${groupId}`);
      continue;
    }

    const participants = groupData.participants.map(p => p.id);
    const messageContent = mediaPath
      ? { image: fs.readFileSync(mediaPath), caption: text, mentions: participants }
      : { text, mentions: participants };

    try {
      await fukusima.sendMessage(groupId, messageContent, { quoted: quoted });
      successCount++;
    } catch (err) {
      console.error(`Gagal kirim ke grup ${groupId}:`, err);
    }

    await new Promise(resolve => setTimeout(resolve, 5000)); // Delay antar grup
  }

  if (mediaPath) fs.unlinkSync(mediaPath);

  await fukusima.sendMessage(senderChat, {
    text: `JPM ${messageType} berhasil dikirim ke ${successCount} grup.`,
  }, { quoted: m });
};

handler.help = ['jpmht <teks>'];
handler.tags = ['store'];
handler.command = /^jpmht$/i;
handler.owner = true;

export default handler;