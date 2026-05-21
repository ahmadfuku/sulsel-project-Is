const pickRandom = (list) => list[Math.floor(Math.random() * list.length)];

let handler = async (m, { fukusima, text }) => {
  try {
    if (!text) return m.reply('Hei, isi namamu dulu dong biar aku bisa cek khodammu!');

    // React loading ala loli
    await fukusima.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    const khodams = [
      { name: "Harimau Cinta", meaning: "Kamu buas... dalam urusan cinta. Siap menerkam siapa saja yang berani mendekati gebetanmu!" },
      { name: "Monyet Gabut", meaning: "Kamu lincah dan pintar... menghindari pekerjaan. Sering ketangkap lagi bengong, ya?" },
      { name: "Naga Tiduran", meaning: "Kamu perkasa... tapi suka rebahan. Kalau ada yang minta tolong, jawabnya 'nanti aja'." },
      { name: "Burung Gagal Terbang", meaning: "Kamu punya mimpi besar... tapi sering nyangkut di pohon. Jangan lupa belajar dari kegagalan, ya!" },
      { name: "Serigala Jomblo", meaning: "Kamu setia... pada kesendirian. Udah lama nggak dapet chat, ya?" },
      { name: "Macan Ngopi", meaning: "Kamu kuat... tapi cuma kalau udah ngopi dulu. Tanpa kopi, kamu kayak macan yang ngantuk." },
      { name: "Kuda Malas", meaning: "Kamu cepat... nyari alasan buat nggak kerja. Ayo dong, semangat dikit!" },
      { name: "Elang Galau", meaning: "Kamu bisa terbang tinggi... kecuali pas mikirin mantan. Jangan kebanyakan melamun, ya!" }
      // Bisa ditambah lagi sesuai kebutuhan
    ];

    const khodam = pickRandom(khodams);

    const teks = `
*_🔮 CEK KHODAM ${text} 🔮_*

• Nama : ${text}
• Khodam : ${khodam.name}
• Arti : ${khodam.meaning}
`.trim();

    await fukusima.sendMessage(m.chat, { text: teks }, { quoted: m });

    // Hapus react
    await fukusima.sendMessage(m.chat, { react: { text: '', key: m.key } });

  } catch (e) {
    console.error('CEK KHODAM ERROR:', e);
    await fukusima.sendMessage(m.chat, { text: `❌ Terjadi error: ${e.message}` }, { quoted: m });
  }
};

handler.help = ['cekkhodam <nama>'];
handler.tags = ['fun'];
handler.command = /^cekkhodam/i;
handler.register = true;
handler.group = true;

export default handler;