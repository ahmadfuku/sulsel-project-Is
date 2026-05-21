let handler = async (m, { text, participants }) => {
    let alasan = text ? text : 'Tidak ada pesan tambahan'

    let member = participants.map(v => v.id)

    let list = participants.map((v, i) => {
        let num = v.id.split('@')[0]
        return `│ ${i + 1}. @${num}`
    }).join('\n')

    let pesan = `╭───「 TAG ALL MEMBER 」───⬣
│ 
│ 📢 Pesan Admin:
│ ${alasan}
│ 
├─ 👥 Member:
${list}
│ 
╰──────────────⬣`

    await fukusima.sendMessage(m.chat, {
        text: pesan,
        mentions: member
    }, { quoted: m })
}

handler.help = ['tagall <text>']
handler.tags = ['group']
handler.command = /^(tagall)$/i
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler