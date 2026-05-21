let handler = async (m, { fukusima }) => {
  let vid;
  if (m.quoted && m.quoted.mtype === "videoMessage") {
    vid = await m.quoted.download();
  }
  else if (m.mtype === "videoMessage") {
    vid = await m.download();
  }
  if (!vid) {
    throw `Kirim *video* atau *balas video* lalu ketik:\n\n.ptvch`;
  }
  const channelId = global.chjid
  await fukusima.sendMessage(
    channelId,
    {
      video: vid,
      mimetype: "video/mp4",
      gifPlayback: true,
      ptv: true,
    }
  );

  m.reply("Video berhasil dikirim ke channel sebagai PTV!");
};

handler.help = ["ptvch"];
handler.tags = ["owner"];
handler.command = /^ptvch$/i;
handler.owner = true;

export default handler;