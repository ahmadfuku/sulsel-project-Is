import moment from 'moment-timezone'

let handler = async (m, { fukusima }) => {
  if (!global.payment) global.payment = {}

  let teks = `
💳 *ᴍ ᴇ ᴛ ᴏ ᴅ ᴇ  ᴘ ᴇ ᴍ ʙ ᴀ ʏ ᴀ ʀ ᴀ ɴ*

ʜᴀʟᴏ *${m.pushName}*,
ʙᴇʀɪᴋᴜᴛ ᴍᴇᴛᴏᴅᴇ ᴘᴇᴍʙᴀʏᴀʀᴀɴ ʏᴀɴɢ ᴛᴇʀsᴇᴅɪᴀ:

📱 *ᴇ-ᴡᴀʟʟᴇᴛ*
• ᴅᴀɴᴀ     : ${global.payment.dana || '-'}
• ᴏᴠᴏ      : ${global.payment.ovo || '-'}
• ɢᴏᴘᴀʏ    : ${global.payment.gopay || '-'}

🏦 *ʙᴀɴᴋ ᴛʀᴀɴsғᴇʀ*
• ʙᴄᴀ      : ${global.payment.bca || '-'}
• ʙʀɪ      : ${global.payment.bri || '-'}
• ᴍᴀɴᴅɪʀɪ  : ${global.payment.mandiri || '-'}

📌 sᴇᴛᴇʟᴀʜ ᴛʀᴀɴsғᴇʀ,
ᴋɪʀɪᴍ ʙᴜᴋᴛɪ ᴘᴇᴍʙᴀʏᴀʀᴀɴ ʏᴀʜ ᴋᴀᴋ.

📆 ${moment.tz('Asia/Jakarta').format('dddd, DD MMMM YYYY')}
⏰ ${moment.tz('Asia/Jakarta').format('HH:mm')} ᴡɪʙ

ᴛᴇʀɪᴍᴀ ᴋᴀsɪʜ ᴛᴇʟᴀʜ ᴍᴇɴɢɢᴜɴᴀᴋᴀɴ ʟᴀʏᴀɴᴀɴ ᴋᴀᴍɪ 💛
`

  await fukusima.sendMessage(
    m.chat,
    {
      image: { url: global.qris },
      caption: teks
    },
    { quoted: m }
  )
}

handler.command = ['pay', 'payment']
handler.help = ['pay', 'payment']
handler.tags = ['store']

export default handler