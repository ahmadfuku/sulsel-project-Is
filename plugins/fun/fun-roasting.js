import axios from 'axios';
const handler = async (m, {
    fukusima,
    text
}) => {
    if (!text) {
        return m.reply('nama?');
    }
    try {
        const {
            data
        } = await axios.post(`https://github-roaster.programordie.workers.dev/${text}`);
        const roastMessage = data.roast || 'Wah, kayaknya aku kehabisan kata buat nge-roast dia.';
        await fukusima.sendMessage(m.chat, {
            text: `🔥 *Roasting Time!* 🔥\n\n${roastMessage}`
        }, {
            quoted: m
        });
    } catch (error) {
        console.error('Error:', error);
        await m.reply('Yah, ada error nih. Coba lagi deh, mungkin codenya lagi ngambek.');
    }
};

handler.help = ['roasting nama'];
handler.tags = ['fun'];
handler.command = /^(roasting|roastme)$/i;
export default handler;