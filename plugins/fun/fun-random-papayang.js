let handler = async (m, { fukusima }) => {
    try {
        // Request langsung ke API
        const res = await fetch('https://api-faa.my.id/faa/papayang');

        // Mengecek content-type
        const contentType = res.headers.get('content-type');
        if (!contentType.startsWith('image/')) throw new Error('API tidak mengembalikan gambar');

        // Ambil buffer gambar
        const buffer = await res.arrayBuffer();
        const data = Buffer.from(buffer);

        // Kirim gambar ke chat
        await fukusima.sendMessage(m.chat, {
            image: data,
            caption: 'Nih foto Myistri 😏'
        }, { quoted: m });

    } catch (err) {
        console.error(err);
        await fukusima.sendMessage(m.chat, {
            text: `❌ API gagal, coba lagi nanti.\nError: ${err.message}`
        }, { quoted: m });
    }
};

handler.help = ['myistri'];
handler.tags = ['fun', 'random'];
handler.command = /^myistri$/i;

export default handler;