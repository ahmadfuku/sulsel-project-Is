import axios from "axios";

let handler = async (m, { fukusima }) => {
  try {
    const res = await axios.get(`https://api.jasaotp.id/${global.vno}/negara.php`);
    if (!res.data || res.data.code !== 200 || !res.data.data) 
      return fukusima.sendMessage(m.chat, { text: "Terjadi kesalahan saat mengambil data negara" }, { quoted: m });

    let text = "🌍 *DAFTAR NEGARA YANG TERSEDIA* 🌍\n\n";
    res.data.data.forEach((country, i) => {
      text += `${i + 1}. ${country.nama_negara}\n`;
    });
    text += "\nGunakan nama negara untuk memeriksa stok nomor kosong.";

   await global.re(m)
fukusima.sendMessage(m.chat, { text }, { quoted: m });

  } catch (error) {
    console.error("Error in cekstoknokos handler:", error);
    fukusima.sendMessage(m.chat, { text: "Terjadi kesalahan saat mengambil data negara. Silakan coba lagi nanti." }, { quoted: m });
  }
};

handler.help = ["cekstoknokos"];
handler.tags = ["nokos"];
handler.command = /^cekstoknokos$/i;

export default handler;