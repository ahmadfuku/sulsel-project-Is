let handler = async (m, { fukusima }) => {
    await fukusima.groupSettingUpdate(m.chat, 'announcement');
    m.reply('Grup berhasil ditutup, hanya admin yang bisa mengirim pesan.');
}

handler.help = ['closegc'];
handler.tags = ['group'];
handler.command = /^close$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;