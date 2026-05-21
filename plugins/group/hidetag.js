let handler = async (m, { fukusima, text }) => {
    const groupMetadata = await fukusima.groupMetadata(m.chat)
    const participants = groupMetadata.participants

    const fbot = {
        key: { 
            participant: `0@s.whatsapp.net`, 
            ...(m.chat ? { remoteJid: `status@broadcast` } : {}) 
        },
        message: {
            contactMessage: {
                displayName: `${global.namebot}`,
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${m.pushName},;;;\nFN:${m.pushName},\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
                jpegThumbnail: thumb,
                thumbnail: thumb,
                sendEphemeral: true
            }
        }
    }

    let teks = m.quoted?.text || text || 'Pesan Kosong'
    teks = `*${teks}*`

    let contextInfo = {
        mentionedJid: participants.map(a => a.id),
        groupMentions: [{ groupJid: m.chat, groupSubject: "everyone" }]
    }

    if (m.quoted) {
        let mime = m.quoted.mimetype || ''
        if (/image/.test(mime)) {
            let media = await m.quoted.download()
            await fukusima.sendMessage(m.chat, { image: media, caption: teks, contextInfo }, { quoted: fbot })
        } else if (/video/.test(mime)) {
            let media = await m.quoted.download()
            await fukusima.sendMessage(m.chat, { video: media, caption: teks, contextInfo }, { quoted: fbot })
        } else if (/document/.test(mime)) {
            let media = await m.quoted.download()
            await fukusima.sendMessage(m.chat, { document: media, mimetype: mime, fileName: m.quoted.fileName || 'file', caption: teks, contextInfo }, { quoted: fbot })
        } else if (/audio/.test(mime)) {
            let media = await m.quoted.download()
            await fukusima.sendMessage(m.chat, { audio: media, mimetype: mime, ptt: false, contextInfo }, { quoted: fbot })
        } else {
            await fukusima.sendMessage(m.chat, { text: teks, contextInfo }, { quoted: fbot })
        }
    } else {
        await fukusima.sendMessage(m.chat, { text: teks, contextInfo }, { quoted: fbot })
    }
}

handler.help = ['hidetag <pesan>', 'h <pesan>']
handler.tags = ['group']
handler.command = /^(hidetag|h)$/i
handler.group = true
handler.admin = true
handler.register = true
export default handler