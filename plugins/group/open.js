let handler = async (m, { fukusima }) => {
    await fukusima.groupSettingUpdate(m.chat, 'not_announcement');
    m.reply('Grup berhasil dibuka, semua anggota bisa mengirim pesan.');
}

handler.help = ['opengc'];
handler.tags = ['group'];
handler.command = /^open$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;