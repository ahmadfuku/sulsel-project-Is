import axios from 'axios'

let handler = async (m, { fukusima, args, usedPrefix, command }) => {
    if (args.length < 2) return m.reply(`ᴋᴇᴛɪᴋ ᴅᴜᴀ ᴇᴍᴏᴊɪ ᴅᴇɴɢᴀɴ ғᴏʀᴍᴀᴛ ʙᴇʀɪᴋᴜᴛ ♡\n\nᴄᴏɴᴛᴏʜ:\n${usedPrefix + command} 😂 | 🥰`)

    const [emoji1, emoji2] = args.join(' ').split('|').map(s => s.trim())

    if (!emoji1 || !emoji2) return m.reply('ɢᴜɴᴀᴋᴀɴ ᴘᴇᴍʙᴇᴅᴀ ʙᴇʀᴜᴘᴀ ᴛᴀɴᴅᴀ | ᴀɴᴛᴀʀᴀ ᴅᴜᴀ ᴇᴍᴏᴊɪ ♡')
    if (!/[\uD800-\uDBFF][\uDC00-\uDFFF]/.test(emoji1 + emoji2)) {
        return m.reply('ʜᴀʀᴀᴘ ɢᴜɴᴀᴋᴀɴ ᴇᴍᴏᴊɪ ʙᴇɴᴀʀᴀɴ ʏᴀ, ʙᴜᴋᴀɴ ᴛᴇᴋs!')
    }
    await m.reply('ᴍᴇɴɢɢᴀʙᴜɴɢᴋᴀɴ ᴇᴍᴏᴊɪ... ♡')
    try {
        const url = `https://www.restwave.my.id/tools/emojimix?emoji1=${encodeURIComponent(emoji1)}&emoji2=${encodeURIComponent(emoji2)}`
        const { data } = await axios.get(url, { responseType: 'arraybuffer' })
        const caption = `
ᴇᴍᴏᴊɪᴍɪx sᴜᴄᴄᴇssғᴜʟʟʏ ᴄʀᴇᴀᴛᴇᴅ ♡
(${emoji1}) | (${emoji2})
        `.trim()

        await fukusima.sendFile(m.chat, Buffer.from(data), 'emojimix.png', caption, m)
    } catch (e) {
        console.log(e)
        m.reply('ᴇᴍᴏᴊɪ ᴛɪᴅᴀᴋ ʙɪsᴀ ᴅɪɢᴀʙᴜɴɢ ᴀᴛᴀᴜ ᴛɪᴅᴀᴋ ᴅɪᴅᴜᴋᴜɴɢ :(\nᴄᴏʙᴀ ᴘᴀsᴀɴɢᴀɴ ʟᴀɪɴ ʏᴜᴋ!')
    }
}

handler.help = ['emojimix']
handler.tags = ['tools']
handler.command = /^(emojimix|mixemoji|emojicampur)$/i

export default handler