/**
 * @param {import('baileys').WASocket | import('baileys').WALegacySocket}
 */
function bind(fukusima) {
    if (!fukusima.chats) fukusima.chats = {}
    /**
     * 
     * @param {import('baileys').Contact[]|{contacts:import('baileys').Contact[]}} contacts 
     * @returns 
     */
    function updateNameToDb(contacts) {
        if (!contacts) return
        try {
            contacts = contacts.contacts || contacts
            for (const contact of contacts) {
                const id = fukusima.decodeJid(contact.id)
                if (!id || id === 'status@broadcast') continue
                let chats = fukusima.chats[id] 
                if (!chats) chats = fukusima.chats[id] = { ...contact, id }
                fukusima.chats[id] = {
                    ...chats,
                    ...({
                        ...contact, id, ...(id.endsWith('@g.us') ?
                            { subject: contact.subject || contact.name || chats.subject || '' } :
                            { name: contact.notify || contact.name || chats.name || chats.notify || '' })
                    } || {})
                }
            }
        } catch (e) {
            console.error(e)
        }
    }
    fukusima.ev.on('contacts.upsert', updateNameToDb)
    fukusima.ev.on('groups.update', updateNameToDb)
    fukusima.ev.on('contacts.set', updateNameToDb)
    fukusima.ev.on('chats.set', async ({ chats }) => {
        try {
            for (let { id, name, readOnly } of chats) {
                id = fukusima.decodeJid(id)
                if (!id || id === 'status@broadcast') continue
                const isGroup = id.endsWith('@g.us')
                let chats = fukusima.chats[id]
                if (!chats) chats = fukusima.chats[id] = { id }
                chats.isChats = !readOnly
                if (name) chats[isGroup ? 'subject' : 'name'] = name
                if (isGroup) {
                    const metadata = await fukusima.groupMetadata(id).catch(_ => null)
                    if (name || metadata?.subject) chats.subject = name || metadata.subject
                    if (!metadata) continue
                    chats.metadata = metadata
                }
            }
        } catch (e) {
            console.error(e)
        }
    })

    fukusima.ev.on('group-participants.update', async ({ id, participants, action }) => {
        if (!id) return
        id = fukusima.decodeJid(id)
        if (id === 'status@broadcast') return
        if (!(id in fukusima.chats)) fukusima.chats[id] = { id }
        let chat = fukusima.chats[id]
        chat.isChats = true

        let metadata = chat.metadata
        if (!metadata) {
            try {
                metadata = await fukusima.groupMetadata(id)
                chat.metadata = metadata
                chat.subject = metadata.subject
            } catch (e) {
                console.error('Gagal ambil metadata grup:', e)
            }
        }

        switch (action) {
            case 'add':
            case 'revoked_membership_requests':
                for (const p of participants) {
                    if (!metadata.participants.find(x => x.id === p.id))
                    metadata.participants.push(p)
                }
                break

            case 'promote':
            case 'demote':
                for (const p of participants) {
                    const target = metadata.participants.find(x => x.id === p.id);
                    if (target) target.admin = action === 'promote' ? 'admin' : null
                }
                break

            case 'remove':
                metadata.participants = metadata.participants.filter(a => !participants.find(b => b.id === a.id))
                break
        }
    })

    fukusima.ev.on('groups.update', (updates) => {
        for (const update of updates) {
            const id = fukusima.decodeJid(update.id)
            if (!id || id === 'status@broadcast') continue
            const isGroup = id.endsWith('@g.us')
            if (!isGroup) continue
            const chat = fukusima.chats[id]
            if (!chat) chats = fukusima.chats[id] = { id }
            chat.isChats = true
            chat.metadata = {
                ...(chat.metadata || {}),
                ...update
            }
            if (update.subject) chat.subject = update.subject || metadata.subject

        }
    })

    fukusima.ev.on('chats.upsert', (chatsUpsert) => {
        try {
            const { id } = chatsUpsert
            if (!id || id === 'status@broadcast') return
            fukusima.chats[id] = { ...(fukusima.chats[id] || {}), ...chatsUpsert, isChats: true }
            const isGroup = id.endsWith('@g.us')
            if (isGroup) fukusima.insertAllGroup().catch(_ => null)
        } catch (e) {
            console.error(e)
        }
    })

    fukusima.ev.on('presence.update', async ({ id, presences }) => {
        try {
            const sender = Object.keys(presences)[0] || id
            const _sender = fukusima.decodeJid(sender)
            const presence = presences[sender]['lastKnownPresence'] || 'composing'
            let chats = fukusima.chats[_sender]
            if (!chats) chats = fukusima.chats[_sender] = { id: sender }
            chats.presences = presence
            if (id.endsWith('@g.us')) {
                let chats = fukusima.chats[id]
                if (!chats) chats = fukusima.chats[id] = { id }
            }
        } catch (e) {
            console.error(e)
        }
    })
}

export default {
    bind
}