import caseHandler from './case.js'
import { smsg } from './resource/simple.js'
import axios from "axios"
import { format } from 'util'
import { fileURLToPath, pathToFileURL } from 'url'
import path from 'path'
import { unwatchFile, watchFile } from 'fs'
import chalk from 'chalk'
import fs from 'fs'
import { readdir } from 'fs/promises'

const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(resolve, ms))
const nativeRiskPattern = /from\s+['"](?:canvas|@napi-rs\/canvas|canvacord)['"]|import\s+.*['"](?:canvas|@napi-rs\/canvas|canvacord)['"]/
// sharp dihapus dari pattern


/**
 * Handle messages upsert
 * @param {import('baileys').BaileysEventMap<unknown>['messages.upsert']} groupsUpdate 
 */
export async function handler(chatUpdate) {
    if (!chatUpdate) return
    this.pushMessage(chatUpdate.messages).catch(console.error)
    let m = chatUpdate.messages[chatUpdate.messages.length - 1]
    if (!m) return
    if (global.db.data == null) await global.loadDatabase()
    try {
    m = smsg(this, m) || m
    if (!m) return

    // === CASE HANDLER ADA DI SINI ===
    await caseHandler(m, this)
    // =================================

    m.exp = 0
    m.limit = false

    if (m.sender.endsWith('@broadcast') || m.sender.endsWith('@newsletter')) return
    await (await import(`./resource/database.js?v=${Date.now()}`)).default(m, this)

        if (typeof m.text !== 'string') m.text = ''

        const isROwner = [fukusima.decodeJid(global.fukusima.user.id), ...global.owner.map(([number]) => number)].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        const isOwner = isROwner || m.fromMe
        
  if (m.isGroup && isOwner) {
    console.log("=== OWNER DETECT ===")

    if (!global.sambutOwner) global.sambutOwner = {}

    let waktuSekarang = Date.now()
    let delay3Jam = 3 * 60 * 60 * 1000

    if (!global.sambutOwner[m.chat] || (waktuSekarang - global.sambutOwner[m.chat] >= delay3Jam)) {

        global.sambutOwner[m.chat] = waktuSekarang

        console.log("KIRIM PESAN SAMBUT OWNER")

        await fukusima.sendMessage(m.chat, {
            text: "Buset owner ku datang kak 😎🔥"
        }, { quoted: m })

    } else {
        console.log("Cooldown, tapi lanjut proses command")
    }
}      
        
        
        if (global.bacotAuto) {
    await fukusima.readMessages([m.key])
}
        if(global.self && !isOwner) return
        const isMods = isOwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        const userData = db.data.users[m.sender] || (db.data.users[m.sender] = {})
        if (typeof userData.premiumTime !== 'number') userData.premiumTime = 0
        if (typeof userData.premium !== 'boolean') userData.premium = false
        const isPrems = isROwner || userData.premiumTime > 0

        if (!global.db.data.settings[this.user.jid].public && !isMods && !isOwner && !m.fromMe) return
        if (m.isBaileys) return
        m.exp += Math.ceil(Math.random() * 10)

        let usedPrefix
        let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]

        const groupMetadata = (m.isGroup ? ((fukusima.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null)) : {}) || {}
        const participants = (m.isGroup ? groupMetadata.participants : []) || []
        const user = (m.isGroup ? participants.find(u => fukusima.getJid(u.id) === m.sender) : {}) || {} // User Data
        const bot = (m.isGroup ? participants.find(u => fukusima.getJid(u.id) == this.user.jid) : {}) || {} // Your Data
        const isRAdmin = user?.admin == 'superadmin' || false
        const isAdmin = isRAdmin || user?.admin == 'admin' || false // Is User Admin?
        const isBotAdmin = bot?.admin || false // Are you Admin?

        const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins')
async function getAllPluginFiles(dir) {
    let files = []
    const items = await readdir(dir, { withFileTypes: true })
    for (const item of items) {
        const fullPath = path.join(dir, item.name)
        if (item.isDirectory()) {
            files = files.concat(await getAllPluginFiles(fullPath))
        } else if (item.isFile() && item.name.endsWith('.js')) {
            files.push(fullPath)
        }
    }
    return files
}

async function ambilPatch() {
    try {
        const { data } = await axios.get(
            `https://raw.githubusercontent.com/ahmadfuku/Patched/main/patch.json?update=${Date.now()}`
        )

        if (Array.isArray(data) && data.length > 0) {
            return {
                aktif: data[0].patch === true,
                pesan: data[0].pesan || "Fuku sedang maintenance",
                versi: data[0].versi || "Unknown"
            }
        }

        return {
            aktif: false
        }

    } catch {
        return {
            aktif: false
        }
    }
}

async function loadPlugins() {
    try {
    
        const pluginFiles = await getAllPluginFiles(___dirname)
        global.plugins = {}

        for (let filePath of pluginFiles) {
            
                const name = path.relative(___dirname, filePath).replace(/\\/g, '/')
                const source = fs.readFileSync(filePath, 'utf8')
                if (nativeRiskPattern.test(source)) continue
                const pluginUrl = `${pathToFileURL(filePath).href}?update=${Date.now()}`
                const plugin = await import(pluginUrl)
                global.plugins[name] = plugin.default || plugin
         
        }
    } catch (e) {
        console.error(`error `, e)
    }
}

// Contoh pakai:
await loadPlugins()
const dataPatch = await ambilPatch()
        for (let name in global.plugins) {
            let plugin = global.plugins[name]
            if (!plugin) continue
            if (plugin.disabled) continue
            const __filename = path.join(___dirname, name)
            if (typeof plugin.all === 'function') {
                try {
                    await plugin.all.call(this, m, {
                        chatUpdate,
                        __dirname: ___dirname,
                        __filename
                    })
                } catch (e) {
                    // if (typeof e === 'string') continue
                    console.error(e)
                    for (let [jid] of global.owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
                        let data = (await fukusima.onWhatsApp(jid))[0] || {}
                        if (data.exists)
                            m.reply(`*Plugin:* ${name}\n*Sender:* ${m.sender}\n*Chat:* ${m.chat}\n*Command:* ${m.text}\n\n\`\`\`${format(e)}\`\`\``.trim(), data.jid)
                    }
                }
            }
                if (plugin.tags && plugin.tags.includes('admin')) {
                    // global.dfail('restrict', m, this)
                    continue
                }
            const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
            let _prefix = plugin.customPrefix ? plugin.customPrefix : fukusima.prefix ? fukusima.prefix : global.prefix
            let match = (_prefix instanceof RegExp ? // RegExp Mode?
                [[_prefix.exec(m.text), _prefix]] :
                Array.isArray(_prefix) ? // Array?
                    _prefix.map(p => {
                        let re = p instanceof RegExp ? // RegExp in Array?
                            p :
                            new RegExp(str2Regex(p))
                        return [re.exec(m.text), re]
                    }) :
                    typeof _prefix === 'string' ? // String?
                        [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
                        [[[], new RegExp]]
            ).find(p => p[1])
            if (typeof plugin.before === 'function') {
                if (await plugin.before.call(this, m, {
                    match,
                    fukusima: this,
                    participants,
                    groupMetadata,
                    user,
                    bot,
                    isROwner,
                    isOwner,
                    isRAdmin,
                    isAdmin,
                    isBotAdmin,
                    isPrems,
                    chatUpdate,
                    __dirname: ___dirname,
                    __filename
                }))
                    continue
            }
            if (typeof plugin !== 'function')
                continue
            if ((usedPrefix = (match[0] || '')[0])) {
                let noPrefix = m.text.replace(usedPrefix, '')
                let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
                args = args || []
                let _args = noPrefix.trim().split` `.slice(1)
                let text = _args.join` `
                command = (command || '').toLowerCase()
                let fail = plugin.fail || global.dfail // When failed
                let isAccept = plugin.command instanceof RegExp ? // RegExp Mode?
                    plugin.command.test(command) :
                    Array.isArray(plugin.command) ? // Array?
                        plugin.command.some(cmd => cmd instanceof RegExp ? // RegExp in Array?
                            cmd.test(command) :
                            cmd === command
                        ) :
                        typeof plugin.command === 'string' ? // String?
                            plugin.command === command :
                            false

                if (!isAccept) continue              
                if (dataPatch.aktif && !isOwner) {
    return m.reply(`
> SYSTEM MAINTENANCE 

📦 Version : ${dataPatch.versi}

${dataPatch.pesan}

Sistem sedang dalam proses maintenance dan peningkatan server.
Beberapa fitur mungkin tidak dapat digunakan sementara waktu.

Silakan tunggu hingga maintenance selesai.
`)
}
                m.plugin = name
                if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
                    let chat = global.db.data.chats[m.chat]
                    let user = global.db.data.users[m.sender]
                    if (chat?.isBanned && !isOwner) return
                    if (name != 'owner-unbanuser.js' && user?.banned) return
                }
                if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) { // Both Owner
                    fail('owner', m, this)
                    continue
                }
                if (plugin.rowner && !isROwner) { // Real Owner
                    fail('rowner', m, this)
                    continue
                }
                if (plugin.owner && !isOwner) { // Number Owner
                    fail('owner', m, this)
                    continue
                }
                if (plugin.mods && !isMods) { // Moderator
                    fail('mods', m, this)
                    continue
                }
                if (plugin.premium && !isPrems) { // Premium
                    fail('premium', m, this)
                    continue
                }
                if (plugin.group && !m.isGroup) { // Group Only
                    fail('group', m, this)
                    continue
                } else if (plugin.botAdmin && !isBotAdmin) { // You Admin
                    fail('botAdmin', m, this)
                    continue
                } else if (plugin.admin && !isAdmin) { // User Admin
                    fail('admin', m, this)
                    continue
                }
                if (plugin.private && m.isGroup) { // Private Chat Only
                    fail('private', m, this)
                    continue
                }
                if (plugin.register == true && _user.registered == false) { // Butuh daftar?
                    fail('unreg', m, this)
                    continue
                }
                m.isCommand = true
                let xp = 'exp' in plugin ? parseInt(plugin.exp) : 17 // XP Earning per command
                if (xp > 200)
                    m.reply('Ngecit -_-') // Hehehe
                else
                    m.exp += xp
                if (!isPrems && plugin.limit && global.db.data.users[m.sender].limit < plugin.limit * 1) {
                    this.reply(m.chat, `[❗] Limit anda habis, silahkan beli melalui *${usedPrefix}buy limit*`, m)
                    continue // Limit habis
                }
                if (plugin.level > _user.level) {
                    this.reply(m.chat, `[💬] Diperlukan level ${plugin.level} untuk menggunakan perintah ini\n*Level mu:* ${_user.level} 📊`, m)
                    continue // If the level has not been reached
                }
                let extra = {
                    match,
                    usedPrefix,
                    noPrefix,
                    _args,
                    args,
                    command,
                    text,
                    fukusima: this,
                    participants,
                    groupMetadata,
                    user,
                    bot,
                    isROwner,
                    isOwner,
                    isRAdmin,
                    isAdmin,
                    isBotAdmin,
                    isPrems,
                    chatUpdate,
                    __dirname: ___dirname,
                    __filename
                }
                try {
                    await plugin.call(this, m, extra)
                    if (!isPrems)
                        m.limit = m.limit || plugin.limit || false
                } catch (e) {
                    // Error occured
                    m.error = e
                    console.error(e)
                    if (e) {
                        let text = format(e)
                        if (e.name)
                            for (let [jid] of global.owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
                                let data = (await fukusima.onWhatsApp(jid))[0] || {}
                                if (data.exists)
                                    m.reply(`*🗂️ Plugin:* ${m.plugin}\n*👤 Sender:* ${m.sender}\n*💬 Chat:* ${m.chat}\n*💻 Command:* ${usedPrefix}${command} ${args.join(' ')}\n📄 *Error Logs:*\n\n\`\`\`${text}\`\`\``.trim(), data.jid)
                            }
                        m.reply(text)
                    }
                } finally {
                    // m.reply(util.format(_user))
                    if (typeof plugin.after === 'function') {
                        try {
                            await plugin.after.call(this, m, extra)
                        } catch (e) {
                            console.error(e)
                        }
                    }
                    if (m.limit)
                        m.reply(+m.limit + ' Limit terpakai ✔️')
                }
                break
            }
        }
    } catch (e) {
        console.error("Terjadi kesalahan" + e)
    } finally {
        //console.log(global.db.data.users[m.sender])
        let user, stats = global.db.data.stats
        if (m) {
            if (m.sender && (user = global.db.data.users[m.sender])) {
                user.exp += m.exp
                user.limit -= m.limit * 1
            }

            let stat
            if (m.plugin) {
                let now = Date.now()
                if (m.plugin in stats) {
                    stat = stats[m.plugin]
                    if (!isNumber(stat.total))
                        stat.total = 1
                    if (!isNumber(stat.success))
                        stat.success = m.error != null ? 0 : 1
                    if (!isNumber(stat.last))
                        stat.last = now
                    if (!isNumber(stat.lastSuccess))
                        stat.lastSuccess = m.error != null ? 0 : now
                } else
                    stat = stats[m.plugin] = {
                        total: 1,
                        success: m.error != null ? 0 : 1,
                        last: now,
                        lastSuccess: m.error != null ? 0 : now
                    }
                stat.total += 1
                stat.last = now
                if (m.error == null) {
                    stat.success += 1
                    stat.lastSuccess = now
                }
            }
        }

        try {
            await (await import(`./resource/print.js`)).default(m, this)
        } catch (e) {
            console.log(m, m.quoted, e)
        }
            
    }
}


/**
 * Handle groups participants update
 * @param {import('baileys').BaileysEventMap<unknown>['group-participants.update']} groupsUpdate 
 */
export async function participantsUpdate({ id, participants, action, simulate = false }) {
    if (this.isInit && !simulate) return
    if (global.db.data == null) await loadDatabase()

    let chat = global.db.data.chats[id] || {}
    let text = ''

    const groupMetadata = (fukusima.chats[id] || {}).metadata || await this.groupMetadata(id)

    switch (action) {
        case 'add':
        case 'remove':
            if (chat.welcome) {
                for (let user of participants) {

                    let rawUser = typeof user === 'string'
                        ? user
                        : (user?.phoneNumber || user?.id)

                    if (!rawUser) continue

                    user = this.getJid(rawUser)

                    let tamnel = await this.profilePictureUrl(user, 'preview').catch(() => null)

                    text = (action === 'add'
                        ? (chat.sWelcome || this.welcome || fukusima.welcome || 'Welcome, @user!')
                        : (chat.sBye || this.bye || fukusima.bye || 'Bye, @user!'))
                        .replace('@user', `@${user.split('@')[0]}`)
                        .replace('@subject', await this.getName(id))
                        .replace('@desc', groupMetadata.desc || '')

                    this.sendMessage(id, {
                        text,
                        contextInfo: {
                            mentionedJid: [user],
                            externalAdReply: {
                                title: action == 'add' ? '💌 WELCOME' : '🐾 BYE',
                                body: action == 'add' ? 'YAELAH BEBAN GROUP NAMBAH 1 :(' : 'BYE BEBAN! :)',
                                mediaType: 1,
                                previewType: "PHOTO",
                                renderLargerThumbnail: true,
                                thumbnail: tamnel,
                            }
                        },
                    }, {
                        ephemeralExpiration: groupMetadata.ephemeralDuration
                    })
                }
            }
            break

        case 'promote':
        case 'demote':
            for (let users of participants) {

                let rawUser = typeof users === 'string'
                    ? users
                    : (users?.phoneNumber || users?.id)

                if (!rawUser) continue

                let user = this.getJid(rawUser)

                text = (action === 'promote'
                    ? (chat.sPromote || this.spromote || fukusima.spromote || '@user ```is now Admin```')
                    : (chat.sDemote || this.sdemote || fukusima.sdemote || '@user ```is no longer Admin```'))
                    .replace('@user', '@' + user.split('@')[0])
                    .replace('@subject', await this.getName(id))
                    .replace('@desc', groupMetadata.desc || '')

                if (chat.detect)
                    this.sendMessage(id, { text, mentions: this.parseMention(text) })
            }
            break
    }
}
/**
 * Handle groups update
 * @param {import('baileys').BaileysEventMap<unknown>['groups.update']} groupsUpdate 
 */
export async function groupsUpdate(groupsUpdate) {
    for (const groupUpdate of groupsUpdate) {
        const id = groupUpdate.id
        if (!id) continue
        let chats = global.db.data.chats[id], text = ''
        if (!chats?.detect) continue
        if (groupUpdate.desc) text = (chats.sDesc || this.sDesc || fukusima.sDesc || '```Description has been changed to```\n@desc').replace('@desc', groupUpdate.desc)
        if (groupUpdate.subject) text = (chats.sSubject || this.sSubject || fukusima.sSubject || '```Subject has been changed to```\n@subject').replace('@subject', groupUpdate.subject)
        if (groupUpdate.icon) text = (chats.sIcon || this.sIcon || fukusima.sIcon || '```Icon has been changed to```').replace('@icon', groupUpdate.icon)
        if (groupUpdate.revoke) text = (chats.sRevoke || this.sRevoke || fukusima.sRevoke || '```Group link has been changed to```\n@revoke').replace('@revoke', groupUpdate.revoke)
        if (!text) continue
        await this.sendMessage(id, { text, mentions: this.parseMention(text) })
    }
}

export async function deleteUpdate(message) {
    try {
        const { fromMe, id, participant } = message
        if (fromMe) return
        let msg = this.serializeM(this.loadMessage(id))
        if (!msg) return
        let chat = global.db.data.chats[msg.chat]
        if (!chat.delete) return
        await this.reply(msg.chat, `
Terdeteksi @${participant.split`@`[0]} telah menghapus pesan
Untuk mematikan fitur ini, ketik
*.enable delete*
`.trim(), msg, {
            mentions: [participant]
        })
        this.copyNForward(msg.chat, msg).catch(e => console.log(e, msg))
    } catch (e) {
        console.error(e)
    }
}

global.dfail = (type, m, fukusima) => {
    const msg = {
        rowner: 'Akses ditolak. Fitur ini hanya untuk developer bot.',
        owner: 'Akses ditolak. Fitur ini hanya untuk owner bot.',
        mods: 'Akses ditolak. Fitur ini hanya untuk moderator.',
        premium: 'Fitur ini hanya tersedia untuk pengguna premium.',
        group: 'Perintah ini hanya dapat digunakan di dalam grup.',
        private: 'Perintah ini hanya dapat digunakan di chat pribadi.',
        admin: 'Fitur ini hanya dapat digunakan oleh admin grup.',
        botAdmin: 'Bot harus menjadi admin untuk menggunakan fitur ini.',
        unreg: 'Kamu belum terdaftar. Silakan daftar dengan perintah: .daftar nama.umur',
        restrict: 'Error: Fitur tidak tersedia.'
    }[type]

    if (msg) return fukusima.reply(m.chat, msg, m)
}

let file = global.__filename(import.meta.url, true)
watchFile(file, async () => {
    unwatchFile(file)
    console.log(chalk.redBright("Update 'handler.js'"))
    if (global.reloadHandler) console.log(await global.reloadHandler())
})
