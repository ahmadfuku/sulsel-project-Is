import ms from "ms"

let handler = async (m, { fukusima, args }) => {
    if (!args[0]) return m.reply('Masukkan durasi. Contoh: .opentime 20m / 10s / 2h')

    let time = ms(args[0])
    if (!time) return m.reply('Format tidak valid. Gunakan: 10s, 5m, 2h')

    m.reply(`Grup akan *dibuka* dalam ${args[0]}`)

    setTimeout(async () => {
        await fukusima.groupSettingUpdate(m.chat, 'not_announcement')
        m.reply('Grup berhasil dibuka otomatis.')
    }, time)
}

handler.help = ['opentime <waktu>', 'otime <waktu>']
handler.tags = ['group']
handler.command = /^opentime|otime$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler