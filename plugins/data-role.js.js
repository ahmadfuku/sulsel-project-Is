import { canLevelUp, xpRange } from '../resource/levelling.js';

let handler = m => m

handler.before = function(m) {
    let user = global.db.data.users[m.sender]
    let before = user.level * 1
    if (user.autolevelup) {
        while (canLevelUp(user.level, user.exp, global.multiplier))
            user.level++
    }

    let role = (user.level <= 2) ? 'ʙʀᴏɴᴢᴇ' :
    ((user.level >= 2) && (user.level <= 4)) ? 'sɪʟᴠᴇʀ 1' :
    ((user.level >= 4) && (user.level <= 6)) ? 'sɪʟᴠᴇʀ 2' :
    ((user.level >= 6) && (user.level <= 8)) ? 'sɪʟᴠᴇʀ 3' :
    ((user.level >= 8) && (user.level <= 10)) ? 'sɪʟᴠᴇʀ 4' :
    ((user.level >= 10) && (user.level <= 20)) ? 'ɢᴏʟᴅ ʟᴀɴᴇ 1' :
    ((user.level >= 20) && (user.level <= 30)) ? 'ɢᴏʟᴅ ʟᴀɴᴇ 2' :
    ((user.level >= 30) && (user.level <= 40)) ? 'ɢᴏʟᴅ ʟᴀɴᴇ 3' :
    ((user.level >= 40) && (user.level <= 50)) ? 'ɢᴏʟᴅ ʟᴀɴᴇ 4' :
    ((user.level >= 50) && (user.level <= 60)) ? 'ᴘᴇᴛᴜᴀʟᴀɴɢ 1' :
    ((user.level >= 60) && (user.level <= 70)) ? 'ᴘᴇᴛᴜᴀʟᴀɴɢ 2' :
    ((user.level >= 70) && (user.level <= 80)) ? 'ᴘᴇᴛᴜᴀʟᴀɴɢ 3' :
    ((user.level >= 80) && (user.level <= 90)) ? 'ᴋᴀᴘᴛᴇɴ 1' :
    ((user.level >= 90) && (user.level <= 100)) ? 'ᴋᴀᴘᴛᴇɴ 2' :
    ((user.level >= 100) && (user.level <= 110)) ? 'ᴋᴀᴘᴛᴇɴ 3' :
    ((user.level >= 110) && (user.level <= 120)) ? 'ᴍᴀsᴛᴇʀ 1' :
    ((user.level >= 120) && (user.level <= 130)) ? 'ᴍᴀsᴛᴇʀ 2' :
    ((user.level >= 130) && (user.level <= 140)) ? 'ᴍᴀsᴛᴇʀ 3' :
    ((user.level >= 140) && (user.level <= 150)) ? 'ᴍᴀsᴛᴇʀ 4' :
    ((user.level >= 150) && (user.level <= 160)) ? 'ᴍᴀsᴛᴇʀ 5' :
    ((user.level >= 160) && (user.level <= 170)) ? 'ᴠᴏʀᴛᴇx ﹀¹' :
    ((user.level >= 170) && (user.level <= 180)) ? 'ᴠᴏʀᴛᴇx ﹀²' :
    ((user.level >= 180) && (user.level <= 190)) ? 'ᴠᴏʀᴛᴇx ﹀³' :
    ((user.level >= 190) && (user.level <= 200)) ? 'ᴠᴏʀᴛᴇx ﹀⁴' :
    ((user.level >= 200) && (user.level <= 210)) ? 'ᴠᴏʀᴛᴇx ﹀⁵' :
    ((user.level >= 210) && (user.level <= 220)) ? 'sᴇɴɪᴏʀ 1' :
    ((user.level >= 220) && (user.level <= 230)) ? 'sᴇɴɪᴏʀ ︾²' :
    ((user.level >= 230) && (user.level <= 240)) ? 'sᴇɴɪᴏʀ ︾³' :
    ((user.level >= 240) && (user.level <= 250)) ? 'sᴇɴɪᴏʀ ︾⁴' :
    ((user.level >= 250) && (user.level <= 260)) ? 'sᴇɴɪᴏʀ ︾⁵' :
    ((user.level >= 260) && (user.level <= 270)) ? 'ᴄᴏᴅᴇʀ ♢¹' :
    ((user.level >= 270) && (user.level <= 280)) ? 'ᴄᴏᴅᴇʀ ♢²' :
    ((user.level >= 280) && (user.level <= 290)) ? 'ᴄᴏᴅᴇʀ ♢³' :
    ((user.level >= 290) && (user.level <= 300)) ? 'ᴄᴏᴅᴇʀ ♢⁴' :
    ((user.level >= 300) && (user.level <= 310)) ? 'ᴄᴏᴅᴇʀ ♢⁵' :
    ((user.level >= 310) && (user.level <= 320)) ? 'ʟᴇɢᴇɴᴅ ♢♢¹' :
    ((user.level >= 320) && (user.level <= 330)) ? 'ʟᴇɢᴇɴᴅ ♢♢²' :
    ((user.level >= 330) && (user.level <= 340)) ? 'ʟᴇɢᴇɴᴅ ♢♢³' :
    ((user.level >= 340) && (user.level <= 350)) ? 'ʟᴇɢᴇɴᴅ ♢♢⁴' :
    ((user.level >= 350) && (user.level <= 360)) ? 'ʟᴇɢᴇɴᴅ ♢♢⁵' :
    ((user.level >= 360) && (user.level <= 370)) ? 'ʜᴇʀᴏ ✷¹' :
    ((user.level >= 370) && (user.level <= 380)) ? 'ʜᴇʀᴏ ✷²' :
    ((user.level >= 380) && (user.level <= 390)) ? 'ʜᴇʀᴏ ✷³' :
    ((user.level >= 390) && (user.level <= 400)) ? 'ʜᴇʀᴏ ✷⁴' :
    ((user.level >= 400) && (user.level <= 410)) ? 'ʜᴇʀᴏ ✷⁵' :
    ((user.level >= 410) && (user.level <= 420)) ? 'ᴋɪʟʟᴇʀ ᴄᴍᴅ ✷✷¹' :
    ((user.level >= 420) && (user.level <= 430)) ? 'ᴋɪʟʟᴇʀ ᴄᴍᴅ ✷✷²' :
    ((user.level >= 430) && (user.level <= 440)) ? 'ᴋɪʟʟᴇʀ ᴄᴍᴅ ✷✷³' :
    ((user.level >= 440) && (user.level <= 450)) ? 'ᴋɪʟʟᴇʀ ᴄᴍᴅ ✷✷⁴' :
    ((user.level >= 450) && (user.level <= 460)) ? 'ᴋɪʟʟᴇʀ ᴄᴍᴅ ✷✷⁵' :
    ((user.level >= 460) && (user.level <= 470)) ? 'ғᴏʀᴋ ✰' :
    ((user.level >= 470) && (user.level <= 480)) ? 'ғᴏʀᴋ sɪʟᴠᴇʀ ✩' :
    ((user.level >= 480) && (user.level <= 490)) ? 'ғᴏʀᴋ ɢᴏʟᴅ ✯' :
    ((user.level >= 490) && (user.level <= 500)) ? 'ғᴏʀᴋ ᴛɪᴛᴀɴ ✬' :
    ((user.level >= 500) && (user.level <= 600)) ? 'ғᴏʀᴋ ᴅɪᴀᴍᴏɴᴅ ✪' :
    ((user.level >= 600) && (user.level <= 700)) ? 'ᴄᴇᴏ ' :
    ((user.level >= 700) && (user.level <= 800)) ? 'ᴍᴀsᴛᴇʀ ᴄᴇᴏ' :
    ((user.level >= 800) && (user.level <= 900)) ? 'ʟᴇɢᴇɴᴅᴀ ᴄᴇᴏ' :
    ((user.level >= 900) && (user.level <= 1000)) ? 'ᴢᴇᴜs ᴘᴇɢᴀsᴜs' :
    ' 𖤐 ᴋ ɪ ɴ ɢ 𖤐'
    user.role = role

    if (user.autolevelup && before !== user.level) {
        m.reply(`Selamat, Kamu Telah Naik Level!\n\n• Level Up : *${before}* -> *${user.level}*`)
    }

    return true
}

export default handler