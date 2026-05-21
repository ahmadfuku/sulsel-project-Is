const handler = async (m, { text }) => {
    if (!text || !text.includes("|")) {
        return m.reply(`❗ Format salah!\n\nContoh:\n.addlist PANEL|Premium Panel|Panel cepat & stabil`);
    }

    let [header, title, description] = text.split("|").map(v => v.trim());

    if (!header || !title || !description) {
        return m.reply("❗ Semua data harus diisi dengan format yang benar!");
    }

    // Pastikan database tersedia
    if (!global.db.data.storeProduk) global.db.data.storeProduk = [];

    // Tambah data
    global.db.data.storeProduk.push({
        header,
        title,
        description,
        id: ".owner"
    });

    m.reply(`✅ Produk berhasil ditambahkan!

📦 *Produk:* ${title}
🏷️ *Kategori:* ${header}
📝 *Deskripsi:* ${description}

Produk ini sekarang muncul di *listproduk*.`);
};

handler.help = ['addlist']
handler.tags = ['store']
handler.command = /^addlist$/i
handler.owner = true

export default handler