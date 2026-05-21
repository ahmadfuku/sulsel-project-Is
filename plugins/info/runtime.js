let handler = async (m, { fukusima }) => {
  try {
    let totalDetik = process.uptime();
    let jam = Math.floor(totalDetik / 3600);
    let menit = Math.floor((totalDetik % 3600) / 60);
    let detik = Math.floor(totalDetik % 60);

    let runtimeText = `⏱ Bot telah aktif selama:\n${jam} jam ${menit} menit ${detik} detik`;

    await fukusima.sendMessage(m.chat, { text: runtimeText }, { quoted: m });
  } catch (err) {
    console.error(err);
    m.reply("Terjadi error saat menampilkan runtime.");
  }
};

handler.command = ["runtime", "uptime"];
handler.tags = ["info"];
handler.help = ["runtime"];
handler.register = true
export default handler;