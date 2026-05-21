import path from 'path'
import fs from 'fs'
import util from 'util'
import { fileURLToPath } from 'url'
import chalk from 'chalk'
import PhoneNumber from 'awesome-phonenumber'
import { fileTypeFromBuffer } from 'file-type'

import store from './store.js'
import { toAudio } from './converter.js'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * @type {import('baileys')}
 */
import {
  makeWASocket as MakeWASocket,
  proto,
  delay,
  downloadContentFromMessage,
  jidDecode,
  areJidsSameUser,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  generateWAMessage,
  getBinaryNodeChild,
  WAMessageStubType,
  extractMessageContent
} from 'baileys'


export function makeWASocket(connectionOptions, options = {}) {
    /**
     * @type {import('baileys').WASocket}
     */
    let fukusima = MakeWASocket(connectionOptions)

    let sock = Object.defineProperties(fukusima, {
        chats: {
            value: { ...(options.chats || {}) },
            writable: true
        },
        decodeJid: {
            value(jid) {
                if (!jid || typeof jid !== 'string') return (!nullish(jid) && jid) || null
                return jid.decodeJid()
            }
        },
        profilePictureUrl: {
            async value(jid, type = 'preview', timeoutMs) {
                try {
                    const result = await fukusima.query({
                        tag: 'iq',
                        attrs: {
                            target: jid,
                            to: 's.whatsapp.net',
                            type: 'get',
                            xmlns: 'w:profile:picture'
                        },
                        content: [{ tag: 'picture', attrs: { type, query: 'buffer' } }]
                    }, timeoutMs);
                    const child = getBinaryNodeChild(result, 'picture');
                    return child.content
                } catch {
                    return fs.readFileSync(path.resolve(__dirname, '../media/avatar_contact.png'))
                    //return 'https://telegra.ph/file/24fa902ead26340f3df2c.png'
                }
            }
        },
        getJid: {
            value(sender) {
                sender = fukusima.decodeJid(sender)
                if (!fukusima.isLid) fukusima.isLid = new Map();
                if (fukusima.isLid.has(sender)) return fukusima.isLid.get(sender)
                if (!sender.endsWith('@lid')) return sender;

                for (const chat of Object.values(fukusima.chats)) {
                    if (!chat?.metadata?.participants) continue;
                    const user = chat.metadata.participants.find(p => p.lid === sender || p.id === sender);
                    if (user) {
                        const jid = user?.phoneNumber || user?.jid || user?.id;
                        fukusima.isLid.set(sender, jid);
                        return jid
                    }
                }

                return sender;
            }
        },
        logger: {
            get() {
                let dates = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
                return {
                    info(...args) {
                        console.log(
                            chalk.bold.bgRgb(51, 204, 51)('INFO '),
                            `[${chalk.rgb(255, 255, 255)(dates)}]:`,
                            chalk.cyan(util.format(...args))
                        )
                    },
                    error(...args) {
                        console.log(
                            chalk.bold.bgRgb(247, 38, 33)('ERROR '),
                            `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
                            chalk.rgb(255, 38, 0)(util.format(...args))
                        )
                    },
                    warn(...args) {
                        console.log(
                            chalk.bold.bgRgb(255, 153, 0)('WARNING '),
                            `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
                            chalk.redBright(util.format(...args))
                        )
                    },
                    trace(...args) {
                        console.log(
                            chalk.grey('TRACE '),
                            `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
                            chalk.white(util.format(...args))
                        )
                    },
                    debug(...args) {
                        console.log(
                            chalk.bold.bgRgb(66, 167, 245)('DEBUG '),
                            `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
                            chalk.white(util.format(...args))
                        )
                    }
                }
            },
            enumerable: true
        },
        getFile: {
            /**
             * getBuffer hehe
             * @param {fs.PathLike} PATH 
             * @param {Boolean} saveToFile
             */
            async value(PATH, saveToFile = false) {
                let res, filename
                const data = Buffer.isBuffer(PATH) ? PATH : PATH instanceof ArrayBuffer ? PATH.toBuffer() : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,` [1], 'base64') : /^https?:\/\//.test(PATH) ? res = Buffer.from(await (await fetch(PATH)).arrayBuffer()) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
                if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
                const type = await fileTypeFromBuffer(data) || { mime: 'application/octet-stream', ext: '.bin' }
                if (data && saveToFile && !filename)(filename = path.join(__dirname, '../tmp/' + new Date * 1 + '.' + type.ext), await fs.promises.writeFile(filename, data))
                return {
                    res,
                    filename,
                    ...type,
                    data,
                    deleteFile() {
                        return filename && fs.promises.unlink(filename)
                    }
                }
            },
            enumerable: true
        },
        sendFile: {
            /**
             * Send Media/File with Automatic Type Specifier
             * @param {String} jid
             * @param {String|Buffer} path
             * @param {String} filename
             * @param {String} caption
             * @param {import('baileys').proto.WebMessageInfo} quoted
             * @param {Boolean} ptt
             * @param {Object} options
             */
            async value(jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) {
                let type = await fukusima.getFile(path, true)
                let { res, data: file, filename: pathFile } = type
                if (res && res.status !== 200 || file.length <= 65536) {
                    try {
                        throw {
                            json: JSON.parse(file.toString())
                        }
                    } catch (e) {
                        if (e.json) throw e.json
                    }
                }
                const fileSize = fs.statSync(pathFile).size / 1024 / 1024
                if (fileSize >= 100) throw new Error('File size is too big!')
                let opt = {}
                if (quoted) opt.quoted = quoted
                if (!type) options.asDocument = true
                let mtype = '', mimetype = options.mimetype || type.mime, convert
                if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'
                else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'
                else if (/video/.test(type.mime)) mtype = 'video'
                else if (/audio/.test(type.mime))(
                    convert = await toAudio(file, type.ext),
                    file = convert.data,
                    pathFile = convert.filename,
                    mtype = 'audio',
                    mimetype = options.mimetype || 'audio/mpeg'
                )
                else mtype = 'document'
                if (options.asDocument) mtype = 'document'

                delete options.asSticker
                delete options.asLocation
                delete options.asVideo
                delete options.asDocument
                delete options.asImage

                let message = {
                    ...options,
                    caption,
                    ptt,
                    [mtype]: { url: pathFile },
                    mimetype,
                    fileName: filename || pathFile.split('/').pop()
                }
                /**
                 * @type {import('baileys').proto.WebMessageInfo}
                 */
                let m
                try {
                    m = await fukusima.sendMessage(jid, message, { ...opt, ...options })
                } catch (e) {
                    console.error(e)
                    m = null
                } finally {
                    if (!m) m = await fukusima.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options })
                    file = null // releasing the memory
                    return m
                }
            },
            enumerable: true
        },
        sendSticker: {
            async value(jid, filePath, m, options = {}) {
                const { data, mime } = await fukusima.getFile(filePath);
                if (data.length === 0) throw new TypeError('File tidak ditemukan');
                const exif = { packName: options.packname || global.stickpack, packPublish: options.packpublish || global.stickauth };
                const sticker = await (await import('./exif.js')).writeExif({ mimetype: mime, data }, exif);
                return fukusima.sendMessage(jid, { sticker }, { quoted: m, ephemeralExpiration: m?.expiration });
            }
        },
        sendMedia: {
            /**
             * Send Media/File with Automatic Type Specifier
             * @param {String} jid
             * @param {String|Buffer} path
             * @param {String} filename
             * @param {String} caption
             * @param {import('baileys').proto.WebMessageInfo} quoted
             * @param {Boolean} ptt
             * @param {Object} options
             */
            async value(jid, path, quoted, options = {}) {
                let { ext, mime, data } = await fukusima.getFile(path)
                let messageType = mime.split("/")[0]
                let pase = messageType.replace('application', 'document') || messageType
                return await fukusima.sendMessage(jid, { [`${pase}`]: data, mimetype: mime, ...options }, { quoted })
            }
        },
        sendAlbumMessage: {
            async value(jid, medias, options = {}) {
                const userJid = fukusima.user?.id || fukusima.authState?.creds?.me?.id;
                if (!Array.isArray(medias) || medias.length < 2) {
                    throw new Error('Album minimal berisi 2 media.');
                }

                const time = options.delay || 5000;
                delete options.delay;

                const album = await generateWAMessageFromContent(jid, {
                    albumMessage: {
                        expectedImageCount: medias.filter(media => media.image).length,
                        expectedVideoCount: medias.filter(media => media.video).length,
                        ...options
                    }
                }, {
                    userJid,
                    ...options
                });

                await fukusima.relayMessage(jid, album.message, {
                    messageId: album.key.id
                });

                for (const media of medias) {
                    let msg;

                    if (media.image) {
                        msg = await generateWAMessage(jid, {
                            image: media.image,
                            ...media,
                            ...options
                        }, {
                            userJid,
                            upload: async (readStream, opts) => fukusima.waUploadToServer(readStream, opts),
                            ...options
                        });
                    } else if (media.video) {
                        msg = await generateWAMessage(jid, {
                            video: media.video,
                            ...media,
                            ...options
                        }, {
                            userJid,
                            upload: async (readStream, opts) => fukusima.waUploadToServer(readStream, opts),
                            ...options
                        });
                    }

                    if (msg) {
                        msg.message.messageContextInfo = {
                            messageAssociation: {
                                associationType: 1,
                                parentMessageKey: album.key
                            }
                        };
                    }

                    await fukusima.relayMessage(jid, msg.message, { messageId: msg.key.id });
                    await delay(time);
                }

                return album;
            }
        },
        sendContact: {
            /**
             * Send Contact
             * @param {String} jid 
             * @param {String[][]|String[]} data
             * @param {import('baileys').proto.WebMessageInfo} quoted 
             * @param {Object} options 
             */
            async value(jid, data, quoted, options) {
                if (!Array.isArray(data[0]) && typeof data[0] === 'string') data = [data]
                let contacts = []
                for (let [number, name] of data) {
                    number = number.replace(/[^0-9]/g, '')
                    let njid = number + '@s.whatsapp.net'
                    let biz = await fukusima.getBusinessProfile(njid).catch(_ => null) || {}
                    let vcard = `
BEGIN:VCARD
VERSION:3.0
N:;${name.replace(/\n/g, '\\n')};;;
FN:${name.replace(/\n/g, '\\n')}
TEL;type=CELL;type=VOICE;waid=${number}:${PhoneNumber('+' + number).getNumber('international')}${biz.description ? `
X-WA-BIZ-NAME:${(fukusima.chats[njid]?.vname || fukusima.getName(njid) || name).replace(/\n/, '\\n')}
X-WA-BIZ-DESCRIPTION:${biz.description.replace(/\n/g, '\\n')}
`.trim() : ''}
END:VCARD
        `.trim()
                    contacts.push({ vcard, displayName: name })

                }
                return await fukusima.sendMessage(jid, {
                    ...options,
                    contacts: {
                        ...options,
                        displayName: (contacts.length >= 2 ? `${contacts.length} kontak` : contacts[0].displayName) || null,
                        contacts,
                    }
                }, {
                    quoted,
                    ...options
                })
            },
            enumerable: true
        },
        reply: {
            /**
             * Reply to a message
             * @param {String} jid
             * @param {String|Buffer} text
             * @param {import('baileys').proto.WebMessageInfo} quoted
             * @param {Object} options
             */
            value(jid, text = '', quoted, options) {
                return Buffer.isBuffer(text) ? fukusima.sendFile(jid, text, 'file', '', quoted, false, options) : fukusima.sendMessage(jid, {
                    text,
                    ...options,
                    contextInfo: {
                    mentionedJid: [...fukusima.parseMention(text)],
                    },
                }, {
                    quoted,
                    ...options
                })
            }
        },
        cMod: {
            /**
             * cMod
             * @param {String} jid 
             * @param {import('baileys').proto.WebMessageInfo} message 
             * @param {String} text 
             * @param {String} sender 
             * @param {*} options 
             * @returns 
             */
            value(jid, message, text = '', sender = fukusima.user.jid, options = {}) {
                if (options.mentions && !Array.isArray(options.mentions)) options.mentions = [options.mentions]
                let copy = message.toJSON()
                delete copy.message.messageContextInfo
                delete copy.message.senderKeyDistributionMessage
                let mtype = Object.keys(copy.message)[0]
                let msg = copy.message
                let content = msg[mtype]
                if (typeof content === 'string') msg[mtype] = text || content
                else if (content.caption) content.caption = text || content.caption
                else if (content.text) content.text = text || content.text
                if (typeof content !== 'string') {
                    msg[mtype] = { ...content, ...options }
                    msg[mtype].contextInfo = { ...(content.contextInfo || {}), mentionedJid: options.mentions || content.contextInfo?.mentionedJid || [] }
                }
                if (copy.participant) sender = copy.participant = sender || copy.participant
                else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
                if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
                else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
                copy.key.remoteJid = jid
                copy.key.fromMe = areJidsSameUser(sender, fukusima.user.id) || false
                return proto.WebMessageInfo.create(copy)
            },
            enumerable: true
        },
        copyNForward: {
            /**
             * Exact Copy Forward
             * @param {String} jid
             * @param {import('baileys').proto.WebMessageInfo} message
             * @param {Boolean|Number} forwardingScore
             * @param {Object} options
             */
            async value(jid, message, forwardingScore = true, options = {}) {
                let vtype
                if (options.readViewOnce && message.message.viewOnceMessage?.message) {
                    vtype = Object.keys(message.message.viewOnceMessage.message)[0]
                    delete message.message.viewOnceMessage.message[vtype].viewOnce
                    message.message = proto.Message.create(
                        JSON.parse(JSON.stringify(message.message.viewOnceMessage.message))
                    )
                    message.message[vtype].contextInfo = message.message.viewOnceMessage.contextInfo
                }
                let mtype = Object.keys(message.message)[0]
                let m = generateForwardMessageContent(message, !!forwardingScore)
                let ctype = Object.keys(m)[0]
                if (forwardingScore && typeof forwardingScore === 'number' && forwardingScore > 1) m[ctype].contextInfo.forwardingScore += forwardingScore
                m[ctype].contextInfo = { ...(message.message[mtype].contextInfo || {}), ...(m[ctype].contextInfo || {}) }
                m = generateWAMessageFromContent(jid, m, { ...options, userJid: fukusima.user.jid })
                await fukusima.relayMessage(jid, m.message, {
                    messageId: m.key.id,
                    additionalAttributes: { ...options }
                })
                return m
            },
            enumerable: true
        },
        downloadM: {
            /**
             * Download media message
             * @param {Object} m
             * @param {String} type
             * @param {fs.PathLike | fs.promises.FileHandle} saveToFile
             * @returns {Promise<fs.PathLike | fs.promises.FileHandle | Buffer>}
             */
            async value(m, type, saveToFile) {
                let filename
                if (!m || !(m.url || m.directPath)) return Buffer.alloc(0)
                const stream = await downloadContentFromMessage(m, type)
                let buffer = Buffer.from([])
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }
                if (saveToFile) ({ filename } = await fukusima.getFile(buffer, true))
                return saveToFile && fs.existsSync(filename) ? filename : buffer
            },
            enumerable: true
        },
        parseMention: {
            /**
             * Parses string into mentionedJid(s)
             * @param {String} text
             * @returns {Array<String>}
             */
            value(text = '') {
                if (!text) return []
                const matches = [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1])
                const result = matches.map(m => {
                    const lid = `${m}@lid`
                    const jid = fukusima.getJid(lid)
                    return (jid && jid !== lid) ? jid : `${m}@s.whatsapp.net`
                })

                return [...new Set(result.filter(Boolean))]
            },
            enumerable: true
        },
        getName: {
            /**
             * Get name from jid
             * @param {String} jid
             * @param {Boolean} withoutContact
             */
            async value(jid = '', withoutContact = false) {
                jid = fukusima.decodeJid(jid)
                withoutContact = fukusima.withoutContact || withoutContact
                let v
                if (jid.endsWith('@g.us')) return new Promise(async (resolve) => {
                    v = fukusima.chats[jid] || {}
                    if (!(v.name || v.subject)) v = ((fukusima.chats[jid] || {}).metadata || await fukusima.groupMetadata(jid).catch(_ => null)) || {}
                    resolve(v.name || v.subject || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international'))
                })
                else v = jid === '0@s.whatsapp.net' ? {
                        jid,
                        vname: 'WhatsApp'
                    } : areJidsSameUser(jid, fukusima.user.jid) ?
                    fukusima.user :
                    (fukusima.chats[jid] || {})
                return (withoutContact ? '' : v.name) || v.subject || v.vname || v.notify || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
            },
            enumerable: true
        },
        loadMessage: {
            /**
             * 
             * @param {String} messageID 
             * @returns {import('baileys').proto.WebMessageInfo}
             */
            value(messageID) {
                return Object.entries(fukusima.chats)
                    .filter(([_, { messages }]) => typeof messages === 'object')
                    .find(([_, { messages }]) => Object.entries(messages)
                        .find(([k, v]) => (k === messageID || v.key?.id === messageID)))
                    ?.[1].messages?.[messageID]
            },
            enumerable: true
        },
        sendGroupV4Invite: {
            /**
             * sendGroupV4Invite
             * @param {String} jid 
             * @param {*} participant 
             * @param {String} inviteCode 
             * @param {Number} inviteExpiration 
             * @param {String} groupName 
             * @param {String} caption 
             * @param {Buffer} jpegThumbnail
             * @param {*} options 
             */
                async value(groupJid, participant, inviteCode, inviteExpiration, groupName, caption, jpegThumbnail, options = {}) {
                    const msg = generateWAMessageFromContent(participant, {
                        groupInviteMessage: {
                            inviteCode,
                            inviteExpiration: parseInt(inviteExpiration) || Date.now() + 3 * 86400000,
                            groupJid,
                            groupName,
                            jpegThumbnail,
                            caption
                        }
                    }, {
                        userJid: fukusima.user.id,
                        ...options
                    });

                    await fukusima.relayMessage(participant, msg.message, {
                        messageId: msg.key.id
                    });
                    return msg;
                },
                enumerable: true
            },
        insertAllGroup: {
            async value() {
                const groups = await fukusima.groupFetchAllParticipating().catch(_ => null) || {}
                for (const group in groups) fukusima.chats[group] = {
                    ...(fukusima.chats[group] || {}),
                    id: group,
                    subject: groups[group].subject,
                    isChats: true,
                    metadata: groups[group]
                }
                return fukusima.chats
            },
        },
        pushMessage: {
            /**
             * pushMessage
             * @param {import('baileys').proto.WebMessageInfo[]} m 
             */
            async value(m) {
                if (!m) return
                if (!Array.isArray(m)) m = [m]
                for (const message of m) {
                    try {
                        // if (!(message instanceof proto.WebMessageInfo)) continue // https://github.com/adiwajshing/Baileys/pull/696/commits/6a2cb5a4139d8eb0a75c4c4ea7ed52adc0aec20f
                        if (!message) continue
                        //if (message.messageStubType && message.messageStubType != WAMessageStubType.CIPHERTEXT) fukusima.processMessageStubType(message).catch(console.error)
                        const _mtype = Object.keys(message.message || {})
                        const mtype = (!['senderKeyDistributionMessage', 'messageContextInfo'].includes(_mtype[0]) && _mtype[0]) ||
                            (_mtype.length >= 3 && _mtype[1] !== 'messageContextInfo' && _mtype[1]) ||
                            _mtype[_mtype.length - 1]
                        const chat = fukusima.getJid(message.key.remoteJid || message.message?.senderKeyDistributionMessage?.groupId || '')
                        if (message.message?.[mtype]?.contextInfo?.quotedMessage) {
                            /**
                             * @type {import('baileys').proto.IContextInfo}
                             */
                            let context = message.message[mtype].contextInfo
                            let participant = fukusima.getJid(context.participant)
                            const remoteJid = fukusima.getJid(context.remoteJid || participant)
                            /**
                             * @type {import('baileys').proto.IMessage}
                             * 
                             */
                            let quoted = message.message[mtype].contextInfo.quotedMessage
                            if ((remoteJid && remoteJid !== 'status@broadcast') && quoted) {
                                // let qMtype = Object.keys(quoted)[0]
                                // if (qMtype == 'conversation') {
                                // quoted.extendedTextMessage = { text: quoted[qMtype] }
                                // delete quoted.conversation
                                // qMtype = 'extendedTextMessage'
                                // }
                                //if (!quoted[qMtype].contextInfo) quoted[qMtype].contextInfo = {}
                                //quoted[qMtype].contextInfo.mentionedJid = context.mentionedJid || quoted[qMtype].contextInfo.mentionedJid || []
                                const isGroup = remoteJid.endsWith('g.us')
                                if (isGroup && !participant) participant = remoteJid
                                const qM = {
                                    key: {
                                        remoteJid,
                                        fromMe: areJidsSameUser(fukusima.user.jid, remoteJid),
                                        id: context.stanzaId,
                                        participant,
                                    },
                                    message: JSON.parse(JSON.stringify(quoted)),
                                    ...(isGroup ? { participant } : {})
                                }
                                let qChats = fukusima.chats[participant]
                                if (!qChats) qChats = fukusima.chats[participant] = {
                                    id: participant,
                                    isChats: !isGroup
                                }
                                if (!qChats.messages) qChats.messages = {}
                                if (!qChats.messages[context.stanzaId] && !qM.key.fromMe) qChats.messages[context.stanzaId] = qM
                                let qChatsMessages
                                if ((qChatsMessages = Object.entries(qChats.messages)).length > 40) qChats.messages = Object.fromEntries(qChatsMessages.slice(30, qChatsMessages.length)) // maybe avoid memory leak
                            }
                        }
                        if (!chat || chat === 'status@broadcast') continue
                        const isGroup = chat.endsWith('@g.us')
                        let chats = fukusima.chats[chat]
                        if (!chats) {
                            if (isGroup) await fukusima.insertAllGroup().catch(console.error)
                            chats = fukusima.chats[chat] = {
                                id: chat,
                                isChats: true,
                                ...(fukusima.chats[chat] || {})
                            }
                        }
                        let metadata, sender
                        if (isGroup) {
                            if (!chats.subject || !chats.metadata) {
                                metadata = await fukusima.groupMetadata(chat).catch(_ => ({})) || {}
                                if (!chats.subject) chats.subject = metadata.subject || ''
                                if (!chats.metadata) chats.metadata = metadata
                            }
                            sender = fukusima.getJid(message.key?.fromMe && fukusima.user.id || message.participant || message.key?.participant || chat)
                            if (sender !== chat) {
                                let chats = fukusima.chats[sender]
                                if (!chats) chats = fukusima.chats[sender] = {
                                    id: sender
                                }
                                if (!chats.name) chats.name = message.pushName || chats.name || ''
                            }
                        } else if (!chats.name) chats.name = message.pushName || chats.name || ''
                        if (['senderKeyDistributionMessage', 'messageContextInfo'].includes(mtype)) continue
                        chats.isChats = true
                        if (!chats.messages) chats.messages = {}
                        const fromMe = message.key.fromMe || areJidsSameUser(sender || chat, fukusima.user.id)
                        if (!['protocolMessage'].includes(mtype) && !fromMe && message.messageStubType != WAMessageStubType.CIPHERTEXT && message.message) {
                            delete message.message.messageContextInfo
                            delete message.message.senderKeyDistributionMessage
                            chats.messages[message.key.id] = JSON.parse(JSON.stringify(message, null, 2))
                            let chatsMessages
                            if ((chatsMessages = Object.entries(chats.messages)).length > 40) chats.messages = Object.fromEntries(chatsMessages.slice(30, chatsMessages.length))
                        }
                    } catch (e) {
                        console.error(e)
                    }
                }
            }
        },
        serializeM: {
            /**
             * Serialize Message, so it easier to manipulate
             * @param {import('baileys').proto.WebMessageInfo} m
             */
            value(m) {
                return smsg(fukusima, m)
            }
        },
        ...(typeof fukusima.setStatus !== 'function' ? {
            setStatus: {
                /**
                 * setStatus bot
                 * @param {String} status 
                 */
                value(status) {
                    return fukusima.query({
                        tag: 'iq',
                        attrs: {
                            to: S_WHATSAPP_NET,
                            type: 'set',
                            xmlns: 'status',
                        },
                        content: [{
                            tag: 'status',
                            attrs: {},
                            content: Buffer.from(status, 'utf-8')
                        }]
                    })
                },
                enumerable: true
            }
        } : {})
    })
    if (sock.user?.id) sock.user.jid = sock.decodeJid(sock.user.id)
    store.bind(sock)
    return sock
}
/**
 * Serialize Message
 * @param {ReturnType<typeof makeWASocket>} fukusima 
 * @param {import('baileys').proto.WebMessageInfo} m 
 * @param {Boolean} hasParent 
 */
export function smsg(fukusima, m, hasParent) {
    if (!m) return m
    /**
     * @type {import('baileys').proto.WebMessageInfo}
     */
    let M = proto.WebMessageInfo
    m = M.create(m)
    m.message = parseMessage(m.message)
    Object.defineProperty(m, 'fukusima', {
        enumerable: false,
        writable: true,
        value: fukusima
    })
    let protocolMessageKey
    if (m.message) {
        if (m.mtype == 'protocolMessage' && m.msg.key) {
            protocolMessageKey = m.msg.key
            if (protocolMessageKey == 'status@broadcast') protocolMessageKey.remoteJid = m.chat
            if (!protocolMessageKey.participant || protocolMessageKey.participant == 'status_me') protocolMessageKey.participant = m.sender
            protocolMessageKey.fromMe = fukusima.decodeJid(protocolMessageKey.participant) === fukusima.decodeJid(fukusima.user.id)
            if (!protocolMessageKey.fromMe && protocolMessageKey.remoteJid === fukusima.decodeJid(fukusima.user.id)) protocolMessageKey.remoteJid = m.sender
        }
        if (m.quoted)
            if (!m.quoted.mediaMessage) delete m.quoted.download
    }
    if (!m.mediaMessage) delete m.download

    try {
        if (protocolMessageKey && m.mtype == 'protocolMessage') fukusima.ev.emit('message.delete', protocolMessageKey)
    } catch (e) {
        console.error(e)
    }
    return m
}

// https://github.com/Nurutomo/wabot-aq/issues/490
export function serialize() {
    const MediaType = ['imageMessage', 'videoMessage', 'audioMessage', 'stickerMessage', 'documentMessage']
    return Object.defineProperties(proto.WebMessageInfo.prototype, {
        fukusima: {
            value: undefined,
            enumerable: false,
            writable: true
        },
        id: {
            get() {
                return this.key?.id
            }
        },
        isBaileys: {
            get() {
                return this.id?.length !== 32 || false
            }
        },
        chat: {
            get() {
                const senderKeyDistributionMessage = this.message?.senderKeyDistributionMessage?.groupId
                return this.fukusima.getJid(this.key?.remoteJidAlt?.endsWith('@s.whatsapp.net') ? this.key.remoteJidAlt : this.key?.remoteJid || (senderKeyDistributionMessage && senderKeyDistributionMessage !== 'status@broadcast'))
            }
        },
        isGroup: {
            get() {
                return this.chat.endsWith('@g.us')
            },
            enumerable: true
        },
        sender: {
            get() {
                return this.fukusima.getJid(this.key?.fromMe && this.fukusima?.user.id || this?.key?.participantAlt || this?.participant || this?.key?.participant || this.chat)
            },
            enumerable: true
        },
        fromMe: {
            get() {
                return areJidsSameUser(this.fukusima?.user.jid, this.sender) || this.key?.fromMe || false
            }
        },
        mtype: {
            get() {
                if (!this.message) return ''
                const type = Object.keys(this.message)
                return (!['senderKeyDistributionMessage', 'messageContextInfo'].includes(type[0]) && type[0]) || // Sometimes message in the front
                    (type.length >= 3 && type[1] !== 'messageContextInfo' && type[1]) || // Sometimes message in midle if mtype length is greater than or equal to 3
                    type[type.length - 1] // common case
            },
            enumerable: true
        },
        msg: {
          get() {
        if (!this.message) return null
        let content = this.message[this.mtype]
        if (content?.message) content = content.message
        return parseMessage(content)
    }              
        },
        mediaMessage: {
            get() {
                if (!this.message) return null
                const Message = ((this.msg?.url || this.msg?.directPath) ? {
                    ...this.message
                } : extractMessageContent(this.message)) || null
                if (!Message) return null
                const mtype = Object.keys(Message)[0]
                return MediaType.includes(mtype) ? Message : null
            },
            enumerable: true
        },
        mediaType: {
            get() {
                let message
                if (!(message = this.mediaMessage)) return null
                return Object.keys(message)[0]
            },
            enumerable: true,
        },
        quoted: {
            get() {
                /**
                 * @type {ReturnType<typeof makeWASocket>}
                 */
                const self = this
                const msg = self.msg
                const contextInfo = msg?.contextInfo
                const quoted = parseMessage(contextInfo?.quotedMessage)
                if (!msg || !contextInfo || !quoted) return null
                const type = Object.keys(quoted)[0]
                let q = quoted[type]
                const text = typeof q === 'string' ? q : q.text
                return Object.defineProperties(JSON.parse(JSON.stringify(typeof q === 'string' ? { text: q } : q)), {
                    mtype: {
                        get() {
                            return type
                        },
                        enumerable: true
                    },
                    mediaMessage: {
                        get() {
                            const Message = ((q.url || q.directPath) ? { ...quoted } : extractMessageContent(quoted)) || null
                            if (!Message) return null
                            const mtype = Object.keys(Message)[0]
                            return MediaType.includes(mtype) ? Message : null
                        },
                        enumerable: true
                    },
                    mediaType: {
                        get() {
                            let message
                            if (!(message = this.mediaMessage)) return null
                            return Object.keys(message)[0]
                        },
                        enumerable: true,
                    },
                    id: {
                        get() {
                            return contextInfo.stanzaId
                        },
                        enumerable: true
                    },
                    chat: {
                        get() {
                            return self.fukusima.getJid(contextInfo.remoteJid || self.chat)
                        },
                        enumerable: true
                    },
                    isBaileys: {
                        get() {
                            return this.id?.length !== 32 || false
                        },
                        enumerable: true
                    },
                    sender: {
                        get() {
                            return self.fukusima.getJid(contextInfo.participant || this.chat)
                        },
                        enumerable: true
                    },
                    fromMe: {
                        get() {
                            return areJidsSameUser(this.sender, self.fukusima?.user.jid)
                        },
                        enumerable: true,
                    },
                    text: {
                        get() {
                            return text || this.caption || this.contentText || this.selectedDisplayText || ''
                        },
                        enumerable: true
                    },
                    mentionedJid: {
                        get() {
                            let raw = q.contextInfo?.mentionedJid || self.getQuotedObj()?.mentionedJid || []
                            return raw.map(jid => self.fukusima.getJid(jid))
                        },
                        enumerable: true
                    },
                    name: {
                        get() {
                            const sender = this.sender
                            return sender ? self.fukusima?.getName(sender) : null
                        },
                        enumerable: true
                    },
                    vM: {
                        get() {
                            return proto.WebMessageInfo.create({
                                key: {
                                    fromMe: this.fromMe,
                                    remoteJid: this.chat,
                                    id: this.id
                                },
                                message: quoted,
                                ...(self.isGroup ? {
                                    participant: this.sender
                                } : {})
                            })
                        }
                    },
                    fakeObj: {
                        get() {
                            return this.vM
                        }
                    },
                    download: {
                        value(saveToFile = false) {
                            const mtype = this.mediaType
                            return self.fukusima?.downloadM(this.mediaMessage[mtype], mtype.replace(/message/i, ''), saveToFile)
                        },
                        enumerable: true,
                        configurable: true,
                    },
                    reply: {
                        /**
                         * Reply to quoted message
                         * @param {String|Object} text
                         * @param {String|false} chatId
                         * @param {Object} options
                         */
                        value(text, chatId, options) {
                            return self.fukusima?.reply(chatId ? chatId : this.chat, text, this.vM, options)
                        },
                        enumerable: true,
                    },
                    copy: {
                        /**
                         * Copy quoted message
                         */
                        value() {
                            const M = proto.WebMessageInfo
                            return smsg(self.fukusima, M.create(M.toObject(this.vM)))
                        },
                        enumerable: true,
                    },
                    forward: {
                        /**
                         * Forward quoted message
                         * @param {String} jid
                         *  @param {Boolean} forceForward
                         */
                        value(jid, force = false, options) {
                            return self.fukusima?.sendMessage(jid, {
                                forward: this.vM,
                                force,
                                ...options
                            }, {
                                ...options
                            })
                        },
                        enumerable: true,
                    },
                    copyNForward: {
                        /**
                         * Exact Forward quoted message
                         * @param {String} jid
                         * @param {Boolean|Number} forceForward
                         * @param {Object} options
                         */
                        value(jid, forceForward = false, options) {
                            return self.fukusima?.copyNForward(jid, this.vM, forceForward, options)
                        },
                        enumerable: true,

                    },
                    cMod: {
                        /**
                         * Modify quoted Message
                         * @param {String} jid
                         * @param {String} text
                         * @param {String} sender
                         * @param {Object} options
                         */
                        value(jid, text = '', sender = this.sender, options = {}) {
                            return self.fukusima?.cMod(jid, this.vM, text, sender, options)
                        },
                        enumerable: true,

                    },
                    delete: {
                        /**
                         * Delete quoted message
                         */
                        value() {
                            return self.fukusima?.sendMessage(this.chat, {
                                delete: this.vM.key
                            })
                        },
                        enumerable: true,

                    }
                })
            },
            enumerable: true
        },
        _text: {
            value: null,
            writable: true,
        },
        text: {
            get() {
                const msg = this.msg
                const text = (typeof msg === 'string' ? msg : msg?.text) || msg?.caption || msg?.contentText || ''
                return typeof this._text === 'string' ? this._text : '' || (typeof text === 'string' ? text : (
                    text?.selectedDisplayText ||
                    text?.hydratedTemplate?.hydratedContentText ||
                    text
                )) || ''
            },
            set(str) {
                return this._text = str
            },
            enumerable: true
        },
        mentionedJid: {
            get() {
                let raw = this.msg?.contextInfo?.mentionedJid?.length && this.msg.contextInfo.mentionedJid || []
                return raw.map(jid => this.fukusima.getJid(jid))
            },
            enumerable: true
        },
        name: {
            get() {
                return !nullish(this.pushName) && this.pushName || this.fukusima?.getName(this.sender)
            },
            enumerable: true
        },
        download: {
            value(saveToFile = false) {
                const mtype = this.mediaType
                return this.fukusima?.downloadM(this.mediaMessage[mtype], mtype.replace(/message/i, ''), saveToFile)
            },
            enumerable: true,
            configurable: true
        },
        reply: {
            value(text, chatId, options) {
                return this.fukusima?.reply(chatId ? chatId : this.chat, text, this, options)
            }
        },
        copy: {
            value() {
                const M = proto.WebMessageInfo
                return smsg(this.fukusima, M.create(M.toObject(this)))
            },
            enumerable: true
        },
        forward: {
            value(jid, force = false, options = {}) {
                return this.fukusima?.sendMessage(jid, {
                    forward: this,
                    force,
                    ...options
                }, {
                    ...options
                })
            },
            enumerable: true
        },
        copyNForward: {
            value(jid, forceForward = false, options = {}) {
                return this.fukusima?.copyNForward(jid, this, forceForward, options)
            },
            enumerable: true
        },
        cMod: {
            value(jid, text = '', sender = this.sender, options = {}) {
                return this.fukusima?.cMod(jid, this, text, sender, options)
            },
            enumerable: true
        },
        getQuotedObj: {
            value() {
                if (!this.quoted.id) return null
                const q = proto.WebMessageInfo.create(this.fukusima?.loadMessage(this.quoted.id) || this.quoted.vM)
                return smsg(this.fukusima, q)
            },
            enumerable: true
        },
        getQuotedMessage: {
            get() {
                return this.getQuotedObj
            }
        },
        delete: {
            value() {
                return this.fukusima?.sendMessage(this.chat, {
                    delete: this.key
                })
            },
            enumerable: true
        }
    })
}

export function logic(check, inp, out) {
    if (inp.length !== out.length) throw new Error('Input and Output must have same length')
    for (let i in inp)
        if (util.isDeepStrictEqual(check, inp[i])) return out[i]
    return null
}

function parseMessage(content) {
    content = extractMessageContent(content)
    if (content && content.viewOnceMessageV2Extension) {
        content = content.viewOnceMessageV2Extension.message
    }
    if (content && content.protocolMessage && content.protocolMessage.type == 14) {
        let type = getContentType(content.protocolMessage)
        content = content.protocolMessage[type]
    }
    if (content && content.message) {
        let type = getContentType(content.message)
        content = content.message[type]
    }

    return content
}

const getContentType = (content) => {
    if (content) {
        const keys = Object.keys(content);
        const key = keys.find(k => (k === 'conversation' || k.endsWith('Message') || k.includes('V2') || k.includes('V3')) && k !== 'senderKeyDistributionMessage');
        return key
    }
}

export function protoType() {
    Buffer.prototype.toArrayBuffer = function toArrayBufferV2() {
        const ab = new ArrayBuffer(this.length);
        const view = new Uint8Array(ab);
        for (let i = 0; i < this.length; ++i) {
            view[i] = this[i];
        }
        return ab;
    }
    /**
     * @returns {ArrayBuffer}
     */
    Buffer.prototype.toArrayBufferV2 = function toArrayBuffer() {
        return this.buffer.slice(this.byteOffset, this.byteOffset + this.byteLength)
    }
    /**
     * @returns {Buffer}
     */
    ArrayBuffer.prototype.toBuffer = function toBuffer() {
        return Buffer.from(new Uint8Array(this))
    }
    // /**
    //  * @returns {String}
    //  */
    // Buffer.prototype.toUtilFormat = ArrayBuffer.prototype.toUtilFormat = Object.prototype.toUtilFormat = Array.prototype.toUtilFormat = function toUtilFormat() {
    //     return util.format(this)
    // }
    Uint8Array.prototype.getFileType = ArrayBuffer.prototype.getFileType = Buffer.prototype.getFileType = async function getFileType() {
        return await fileTypeFromBuffer(this)
    }
    /**
     * @returns {Boolean}
     */
    String.prototype.isNumber = Number.prototype.isNumber = isNumber
    /**
     * 
     * @returns {String}
     */
    String.prototype.capitalize = function capitalize() {
        return this.charAt(0).toUpperCase() + this.slice(1, this.length)
    }
    /**
     * @returns {String}
     */
    String.prototype.capitalizeV2 = function capitalizeV2() {
        const str = this.split(' ')
        return str.map(v => v.capitalize()).join(' ')
    }
    String.prototype.decodeJid = function decodeJid() {
        if (/:\d+@/gi.test(this)) {
            const decode = jidDecode(this) || {}
            return (decode.user && decode.server && decode.user + '@' + decode.server || this).trim()
        } else return this.trim()
    }
    /**
     * number must be milliseconds
     * @returns {string}
     */
    Number.prototype.toTimeString = function toTimeString() {
        // const milliseconds = this % 1000
        const seconds = Math.floor((this / 1000) % 60)
        const minutes = Math.floor((this / (60 * 1000)) % 60)
        const hours = Math.floor((this / (60 * 60 * 1000)) % 24)
        const days = Math.floor((this / (24 * 60 * 60 * 1000)))
        return (
            (days ? `${days} hari ` : '') +
            (hours ? `${hours} jam ` : '') +
            (minutes ? `${minutes} menit ` : '') +
            (seconds ? `${seconds} detik` : '')
        ).trim()
    }
    Number.prototype.getRandom = String.prototype.getRandom = Array.prototype.getRandom = getRandom
}


function isNumber() {
    const int = parseInt(this)
    return typeof int === 'number' && !isNaN(int)
}

function getRandom() {
    if (Array.isArray(this) || this instanceof String) return this[Math.floor(Math.random() * this.length)]
    return Math.floor(Math.random() * this)
}


/**
 * ??
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator
 * @returns {boolean}
 */
function nullish(args) {
    return !(args !== null && args !== undefined)

}
