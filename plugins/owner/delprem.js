let handler = async (m, { usedPrefix, command, text }) => {
    let who

    if (m.isGroup) {
        who = m.mentionedJid[0]
            ? m.mentionedJid[0]
            : m.quoted
            ? m.quoted.sender
            : null
    } else {
        who = m.chat
    }

    if (!who && text) {
        let num = text.replace(/[^0-9]/g, '')
        if (num) who = num + '@s.whatsapp.net'
    }

    if (!who)
        return m.reply(
            `Target tidak ditemukan.\n\nContoh:\n${usedPrefix + command} @user\n${usedPrefix + command} reply\n${usedPrefix + command} 628xxx`
        )

    let user = global.db.data.users[who]
    if (!user) return m.reply('User tidak terdaftar di database.')

    if (!user.premium)
        return m.reply(
            `AKSI DIBATALKAN\n\n` +
            `Status User : Non-Premium\n` +
            `Keterangan  : User ini bukan premium.`
        )

    user.premium = false
    user.premiumTime = 0

    m.reply(
        `PREMIUM DINONAKTIFKAN\n\n` +
        `Nama   : ${user.name || 'User'}\n` +
        `Status : Non-Premium`,
        null,
        { mentions: [who] }
    )
}

handler.help = ['delprem']
handler.tags = ['owner']
handler.command = ['delprem', 'deleteprem', 'removeprem']
handler.owner = true

export default handler