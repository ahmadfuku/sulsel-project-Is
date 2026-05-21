import fs from 'fs'
import fetch from 'node-fetch'
let handler = async(m, { fukusima, text, participants }) => {
const fkontak = {
	"key": {
    "participants":"0@s.whatsapp.net",
		"remoteJid": "status@broadcast",
		"fromMe": false,
		"id": "Halo"
	},
	"message": {
		"contactMessage": {
			"vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
		}
	},
	"participant": "0@s.whatsapp.net"
}

    fukusima.sendMessage(m.chat, { text: text, mentions: participants.map(a => a.id) }, {quoted:fkontak})
    }
handler.help = ['pengumuman']
handler.tags = ['group']
handler.command = /^(pengumuman)$/i

handler.group = true
handler.admin = true

export default handler