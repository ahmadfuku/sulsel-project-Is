let handler = async (m, { fukusima, isAdmin, isBotAdmin, usedPrefix, command }) => {
    if (!m.quoted) return m.reply(`Reply pesan yang ingin dihapus dengan caption ${usedPrefix + command}`)
    if (m.quoted.fromMe) {
        await m.quoted.delete()
    } else {
        if (!isBotAdmin) return global.dfail('botAdmin', m, fukusima);
        if (!isAdmin) return global.dfail('admin', m, fukusima);
        let bilek = m.message.extendedTextMessage.contextInfo.participant;
        let banh = m.message.extendedTextMessage.contextInfo.stanzaId;
        await fukusima.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: banh, participant: bilek } });
    }
};

handler.help = ['del'];
handler.tags = ['tools'];
handler.command = /^(del|delete|hapus?)$/i;
handler.register = true

export default handler;