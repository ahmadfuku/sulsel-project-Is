let handler = async (m, { fukusima, command, text }) => {
	
    if (!text) return fukusima.reply(m.chat, '• *Example :* .cekmemek farida', m)
	
  fukusima.reply(m.chat, `
╭━━━━°「 *Memeknya ${text}* 」°
┃
┊• Nama : ${text}
┃• Memek : ${pickRandom(['Putih mulus','Hitam','Pink','Pink Mulus','Hitam mulus'])}
┊• Jembut : ${pickRandom(['Lebat','Tipis','Gada Jembut', 'Bersih'])}
┃• Lobang : ${pickRandom(['Perawan','Ga Perawan','Besar','Sempit'])}
╰═┅═━––––––๑
`.trim(), m)
}
handler.help = ['cekmemek *<name>*']
handler.tags = ['fun']
handler.command = /^cekmemek|cekmmk/i

export default handler

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}