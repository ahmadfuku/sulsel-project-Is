// ANTI LINK HANDLER
let handler = m => m

let channelRegex = /https?:\/\/whatsapp\.com\/channel\//i
let groupRegex   = /https?:\/\/chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i

handler.before = async function (m, { fukusima, isAdmin, isBotAdmin }) {

    if ((m.isBaileys && m.fromMe) || m.fromMe) return
    if (!m.isGroup) return
    if (isAdmin) return

    let chat = global.db.data.chats[m.chat]
    if (!chat.antiLink) return // Anti-link OFF

    // Deteksi link
    if (!(channelRegex.test(m.text) || groupRegex.test(m.text))) return

    let sender = m.sender
    let tag = '@' + sender.split('@')[0]

    if (!chat.users) chat.users = {}
    if (!chat.users[sender]) chat.users[sender] = { warn: 0 }

    chat.users[sender].warn += 1

    await m.reply(
        `*「 ANTI LINK 」*\n\n`+
        `Link terdeteksi dari ${tag}\n` +
        `Warn: *${chat.users[sender].warn}/5*`,
        null, { mentions: [sender] }
    )

    // Hapus pesan link
    if (isBotAdmin) {
        try { await fukusima.sendMessage(m.chat, { delete: m.key }) } catch {}
    }

    if (chat.users[sender].warn >= 5) {
        await m.reply(
            `*「 ANTI LINK 」*\n\n${tag} mencapai *5 warn* dan dikeluarkan.`,
            null, { mentions: [sender] }
        )
        if (isBotAdmin) {
            try {
                await fukusima.groupParticipantsUpdate(m.chat, [sender], 'remove')
            } catch {}
        }
        chat.users[sender].warn = 0
    }

    return
}

export default handler