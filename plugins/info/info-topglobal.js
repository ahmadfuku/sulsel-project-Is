let handler = async (m, { fukusima }) => {
    let users = Object.entries(global.db.data.users)

    let data = users.map(([jid, u]) => {
        let name = u.name && u.name.length ? u.name : jid.split("@")[0]
        let exp = u.exp || 0
        let limit = u.limit || 0
        let level = u.level || 0
        let role = typeof u.role === "string" ? u.role : "-"
        let score = exp + limit + (level * 1000)

        return { name, exp, limit, level, role, score }
    })

    data = data
        .filter(v => v.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)

    let teks = `T O P   G L O B A L\n\n`

    data.forEach((u, i) => {
        teks +=
`#${i + 1}
- *ɴᴀᴍᴀ:* ${u.name}
- *ʟᴇᴠᴇʟ:* ${u.level}
- *ᴇxᴘ:* ${u.exp}
- *ʟɪᴍɪᴛ:* ${u.limit}
- *ʀᴀɴᴋ:* ${u.role}
`
    })

    await fukusima.sendMessage(m.chat, {
        text: teks.trim(),
        contextInfo: {
            externalAdReply: {
                title: "TOP GLOBAL",
                body: "Jadilah yang teratas",
                thumbnailUrl: global.thumb,
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m })
}

handler.command = /^(topglobal)$/i
handler.tags = ["info", "rpg"]
handler.help = ["topglobal"]
handler.register = true
handler.limit = true
export default handler