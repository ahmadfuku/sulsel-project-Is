let handler = async (m, { fukusima, text }) => {
    if (!text) return m.reply('❌ Kirim teksnya. Contoh: .ripleai Halo');

    try {
        // React loading
        await fukusima.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        // Kirim request ke API
        let res = await fetch(`https://api.nekolabs.web.id/ai/ripleai?text=${encodeURIComponent(text)}`);
        if (!res.ok) throw new Error(`Status ${res.status} saat menghubungi API`);

        let json = await res.json();
        if (!json.success) throw new Error(json.error || 'API gagal');

        // Kirim hasil
        await fukusima.sendMessage(m.chat, { text: json.result }, { quoted: m });

    } catch (e) {
        console.error(e);
        await m.reply(`❌ Terjadi kesalahan: ${e.message}`);
    }
}

handler.help = ['ripleai'];
handler.tags = ['ai'];
handler.command = /^(ripleai)$/i;
handler.register = false;

export default handler;