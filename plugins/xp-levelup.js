import { canLevelUp, xpRange } from '../resource/levelling.js';
let handler = async (m) => {
    const name = fukusima.getName(m.sender);
    const pp = await fukusima.profilePictureUrl(m.sender, 'image');
    const user = global.db.data.users[m.sender];
    const { min, xp, max } = xpRange(user.level, global.multiplier);
    if (!canLevelUp(user.level, user.exp, global.multiplier)) {
        await fukusima.reply(m.chat, `Level ${name} ${user.level} (${user.exp - min}/${xp})\nKurang ${max - user.exp} EXP lagi!`.trim(), m);
    }
    let before = user.level * 1;
    while (canLevelUp(user.level, user.exp, global.multiplier)) {
        user.level++;
    }
    if (before !== user.level) {
        await fukusima.reply(m.chat, `${name} Level Up!\n_${before}_ -> ${user.level}`.trim(), m);
    }
}

handler.help = ['levelupp'];
handler.tags = ['xp'];
handler.command = /^levelup$/i;

export default handler;