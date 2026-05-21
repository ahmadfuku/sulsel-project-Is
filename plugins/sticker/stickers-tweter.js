import fetch from 'node-fetch'
import { sticker } from '../../resource/sticker.js'
import uploadImage from '../../resource/uploadImage.js'


let handler = async (m, { fukusima, args, text, usedPrefix, command }) => {
let input = `[!] *wrong input*
	
Ex : ${usedPrefix + command} Pagi sayang
or
${usedPrefix + command} reply teks`

let teks = m.quoted ? m.quoted.text : text
	if (!teks) return m.reply(input)
	let stiker = false
			const avatar = await fukusima.profilePictureUrl(m.sender, 'image').catch(_ => 'https://telegra.ph/file/24fa902ead26340f3df2c.png');
    const displayName = fukusima.getName(m.sender)
    const username = m.sender.split('@')[0];
    const replies = '639';
    const retweets = '186';
    const theme = 'dark'; 
    const url = `https://some-random-api.com/canvas/misc/tweet?displayname=${encodeURIComponent(displayName)}&username=${encodeURIComponent(username)}&avatar=${encodeURIComponent(avatar)}&comment=${encodeURIComponent(text)}&replies=${encodeURIComponent(replies)}&retweets=${encodeURIComponent(retweets)}&theme=${encodeURIComponent(theme)}`;

		stiker = await sticker(false, url, packname, author)
fukusima.sendFile(m.chat, stiker, 's.webp', m)
}
handler.help = ['tweetmaker']
handler.tags = ['sticker']
handler.command = /^(tweetmaker)$/i

export default handler