import axios from "axios";

const handler = async (m, { fukusima, usedPrefix, command, text }) => {
  try {
    if (!text) {
      return fukusima.sendMessage(
        m.chat,
        { text: `Masukkan pertanyaan.\nContoh: *${usedPrefix + command} siapa kamu*` },
        { quoted: m }
      );
    }

    const loading = await fukusima.sendMessage(
      m.chat,
      { text: "Sedang bertanya dengan Copilot..." },
      { quoted: m }
    );

    const url = `https://api.yupra.my.id/api/ai/copilot?text=${encodeURIComponent(text)}`;
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; YPBot)"
      }
    });

    if (!data?.status) throw new Error("API Error");

    const answer = data.result || "Tidak ada jawaban.";

    await fukusima.sendMessage(
      m.chat,
      { text: answer, edit: loading.key },
      {}
    );

  } catch (e) {
    await fukusima.sendMessage(
      m.chat,
      { text: "Gagal memproses pertanyaan." },
      { quoted: m }
    );
  }
};

handler.help = ["copilot2"];
handler.tags = ["ai"];
handler.command = /^copilot2$/i;

export default handler;