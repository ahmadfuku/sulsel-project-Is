import fetch from 'node-fetch';

let handler = async (m, { text, fukusima, command }) => {
    if (!text) return m.reply(`Contoh penggunaan:\n.${command} https://whatsapp.com/channel/xxx 😇,🗿,😅`);

    try {
        const parts = text.split(' ');
        const link = parts[0];
        const emojis = parts.slice(1).join(' ') || '❤️';

        if (!link.includes('whatsapp.com/channel/')) {
            return m.reply('Link channel tidak valid');
        }
        await fukusima.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const apiUrl = `https://api-faa.my.id/faa/react-channel?url=${encodeURIComponent(link)}&react=${encodeURIComponent(emojis)}`;
        const response = await fetch(apiUrl);
        const result = await response.json();

        if (result.status) {
            await m.reply(
                `- *Reaksi Berhasil*\n\n` +
                `- Reaksi digunakan: ${result.info.reaction_used}\n` +
                `- Channel: ${result.info.destination}\n` +
                `- Pesan: ${result.message || 'Reaksi berhasil'}`
            );
            await fukusima.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
        } else {
            await m.reply('Gagal mengirim reactions');
            await fukusima.sendMessage(m.chat, { react: { text: "🗿", key: m.key } });
        }

    } catch (err) {
        console.error(err);
        await m.reply('Terjadi kesalahan saat mengirim reactions');
        await fukusima.sendMessage(m.chat, { react: { text: "😆", key: m.key } });
    }
}

handler.help = ['rch', 'reachch'];
handler.tags = ['tools'];
handler.command = ['rch', 'reactch']
handler.register = true;
handler.premium = true
export default handler;