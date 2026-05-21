let handler = async (m, { fukusima, command, text }) => {
	
    if (!text) return fukusima.reply(m.chat, 'Ketik Namanya Tolol!', m)
	
  fukusima.reply(m.chat, `
╭━━━━°「 *Memek ${text}* 」°
┃
┊• Nama : ${text}
┃• memek : ${pickRandom(['ih item','Belang wkwk','Muluss','Putih Mulus','Black Doff','Pink wow','Item Glossy'])}
┊• lubang : ${pickRandom(['perawan','ga perawan','udah pernah dimasukin','masih rapet','tembem'])}
┃• jembut : ${pickRandom(['lebat','ada sedikit','gada jembut','tipis','muluss'])}
╰═┅═━––––––๑
`.trim(), m)
}
handler.help = ['cekmemek <nama>']
handler.tags = ['fun']
handler.command = /^cekmemek/i
handler.register = true
export default handler 

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}