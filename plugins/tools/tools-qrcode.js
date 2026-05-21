let handler = async (m, { fukusima, text, usedPrefix, command }) => {
  if (!text) return fukusima.reply(m.chat, `Use example: \n${usedPrefix + command} <teks>`, m);
  fukusima.sendFile(m.chat, `https://quickchart.io/qr?text=${encodeURIComponent(text)}`, 'qrcode.png', '¯\\_(ツ)_/¯', m);
}

handler.help = ['qrcode <teks>']
handler.tags = ['tools']
handler.command = /^qr(code)?$/i
handler.register = true

export default handler