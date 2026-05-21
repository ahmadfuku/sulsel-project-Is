let handler = async (m) => {

let q = m.quoted ? m.quoted : m

let data = {
type: q.type,
mtype: q.mtype,
mimetype: q.mimetype,
mediaType: q.mediaType,
id: q.id,
chat: q.chat,
sender: q.sender,
participant: q.key?.participant,
fromMe: q.fromMe,
isGroup: q.isGroup,
text: q.text,
mentionedJid: q.mentionedJid,
key: q.key,
message: q.message
}

m.reply(JSON.stringify(data, null, 2))

}

handler.help = ['debug']
handler.tags = ['tools']
handler.command = /^debug$/i

export default handler