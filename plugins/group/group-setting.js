let handler = async (m, { fukusima, args, usedPrefix, command }) => {
    let isClose = {
        'open': 'not_announcement',
        'close': 'announcement',
        'unlock': 'not_announcement',
        'lock': 'announcement',
    }[(args[0] || '').toLowerCase()]

    if (isClose === undefined)
        throw `
*Format salah! Contoh :*
  *○ ${usedPrefix + command} close*
  *○ ${usedPrefix + command} open*
  *○ ${usedPrefix + command} unlock*
  *○ ${usedPrefix + command} lock*
`.trim()

    await fukusima.groupSettingUpdate(m.chat, isClose)

    let status = isClose === 'announcement' ? '_*Group Berhasil Ditutup*_ 「 🔒 」' : '_*Group Berhasil Dibuka*_ 「 🔓 」'
    m.reply(status)
}

handler.help = ['group *open / close*']
handler.tags = ['group']
handler.command = /^(group)$/i

handler.admin = true
handler.botAdmin = true

export default handler