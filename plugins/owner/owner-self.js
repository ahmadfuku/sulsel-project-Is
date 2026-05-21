let handler = async (m, { usedPrefix, command }) => {
    try {
        const cmd = command.toLowerCase()
        if (cmd === 'self') {
            global.self = true
            return m.reply('Berhasil ke mode self.')
        } else if (cmd === 'public') {
            global.self = false
            return m.reply('Berhasil set bot ke public.')
        } else {
            return m.reply(`Perintah tidak valid! Gunakan .self atau .public`)
        }
    } catch (err) {
        console.error(err)
        return m.reply(`Terjadi kesalahan: ${err.message}`)
    }
}

handler.help = ['self', 'public']
handler.tags = ['owner']
handler.command = /^(self|public)$/i
handler.owner = true

export default handler