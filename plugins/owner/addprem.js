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
            `Siapa yang mau dipremiumkan?\n\nContoh:\n${usedPrefix + command} @user 30 hari\n${usedPrefix + command} reply 2 jam\n${usedPrefix + command} 628xxx 15 menit`
        )

    let user = global.db.data.users[who]
    if (!user) return m.reply('❌ User tidak ditemukan di database!')

    let args = text.toLowerCase().split(' ')
    let timeValue = parseInt(args.find(v => /\d+/.test(v)))
    let timeUnit = args.find(v =>
        ['menit', 'jam', 'hari', 'perm', 'permanen', 'selamanya', 'infinite'].includes(v)
    )

    if (!timeUnit)
        return m.reply(
            `Masukkan durasi!\n\nContoh:\n30 hari\n2 jam\n15 menit\natau *selamanya*`
        )

    let now = Date.now()
    let durationMs = 0
    let isPermanent = false

    if (['perm', 'permanen', 'selamanya', 'infinite'].includes(timeUnit)) {
        isPermanent = true
        durationMs = 86400000 * 365 * 100
    } else {
        if (!timeValue || timeValue <= 0)
            return m.reply('❌ Durasi tidak valid!')

        if (timeUnit === 'menit') durationMs = timeValue * 60000
        if (timeUnit === 'jam') durationMs = timeValue * 3600000
        if (timeUnit === 'hari') durationMs = timeValue * 86400000
    }

    if (user.premium && user.premiumTime > now) {
        user.premiumTime += durationMs
    } else {
        user.premiumTime = now + durationMs
    }

    user.premium = true

    let sisaMs = user.premiumTime - now
    let sisaHari = Math.ceil(sisaMs / 86400000)
    let masaPremium = isPermanent
        ? 'Selamanya (Permanen)'
        : `${sisaHari} hari`

    m.reply(
        `✅ *SUKSES MENJADIKAN ${user.name || 'User'} PREMIUM*\n\n` +
        `📌 Status: Premium Aktif\n` +
        `⏳ Masa Premium: ${masaPremium}`,
        null,
        { mentions: [who] }
    )
}

handler.help = ['addprem']
handler.tags = ['owner']
handler.command = ['addprem']
handler.owner = true

export default handler