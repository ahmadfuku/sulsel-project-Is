import util from "util";

let handler = async (m, { fukusima, usedPrefix, command, isAdmin }) => {
  if (!isAdmin) return m.reply("❌ Only Admin");
  if (!m.quoted) return m.reply(`❌ Balas media yang ingin diupload ke status dengan perintah *${usedPrefix + command}*`);

  try {
    
    const muani = JSON.parse(JSON.stringify({ [m.quoted.mtype]: m.quoted }));

    
    await fukusima.relayMessage(m.chat, {
      groupStatusMessageV2: { message: muani }
    }, {});

    await m.reply(`✅ Berhasil upload ke status grup.`);
  } catch (error) {
    console.error("❌ Terjadi error saat upload status:", error);
    m.reply("⚠️ Gagal upload ke status grup! Cek log untuk detailnya.");
  }
};

// Konfigurasi plugin
handler.help = ["upswgroup", "upswgc"];
handler.tags = ["owner"];
handler.command = ["upswgroup", "upswgc"];
handler.admin = true;

export default handler;