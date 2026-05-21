import * as levelling from '../resource/levelling.js'
import fs from 'fs'
import sharp from "sharp"
import { spawn } from "child_process"
import axios from "axios"
import path from "path"
import { fileURLToPath } from 'url'
import { generateWAMessageFromContent, proto, prepareWAMessageMedia } from "baileys"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ASSETS_PATH = path.join(process.cwd(), 'assets')
const IMAGES_PATH = path.join(ASSETS_PATH, 'images')
const AUDIO_PATH = path.join(ASSETS_PATH, 'audio')
const VIDEO_PATH = path.join(ASSETS_PATH, 'video')

if (!fs.existsSync(ASSETS_PATH)) fs.mkdirSync(ASSETS_PATH, { recursive: true })
if (!fs.existsSync(IMAGES_PATH)) fs.mkdirSync(IMAGES_PATH, { recursive: true })
if (!fs.existsSync(AUDIO_PATH)) fs.mkdirSync(AUDIO_PATH, { recursive: true })
if (!fs.existsSync(VIDEO_PATH)) fs.mkdirSync(VIDEO_PATH, { recursive: true })

const OURIN_MAIN = path.join(IMAGES_PATH, 'ourin.jpg')
const OURIN_THUMB = path.join(IMAGES_PATH, 'ourin2.jpg')
const OURIN_BANNER = path.join(IMAGES_PATH, 'ourin3.jpg')
const OURIN_V7 = path.join(IMAGES_PATH, 'ourin-v7.jpg')
const OURIN_V8 = path.join(IMAGES_PATH, 'ourin-v8.jpg')
const OURIN_V9 = path.join(IMAGES_PATH, 'ourin-v9.jpg')
const OURIN_V11 = path.join(IMAGES_PATH, 'ourin.jpg')
const OURIN_ALLMENU = path.join(IMAGES_PATH, 'ourin-allmenu.jpg')
const PP_KOSONG = path.join(IMAGES_PATH, 'pp-kosong.jpg')
const OURIN_VIDEO = path.join(VIDEO_PATH, 'ourin.mp4')
const OURIN_AUDIO = path.join(AUDIO_PATH, 'ourin.mp3')

async function sendVnMenu(fukusima, m, vnMenu) {
  try {
    let audioBuffer
    if (fs.existsSync(OURIN_AUDIO)) {
      audioBuffer = fs.readFileSync(OURIN_AUDIO)
    } else {
      const res = await fetch(vnMenu || 'https://example.com/audio.mp3')
      if (!res.ok) return m.reply("Gagal download VN")
      audioBuffer = Buffer.from(await res.arrayBuffer())
    }
    
    const ffmpeg = spawn("ffmpeg", [
      "-i","pipe:0",
      "-ar","48000",
      "-ac","1",
      "-c:a","libopus",
      "-f","ogg",
      "pipe:1"
    ])
    let oggBuffer = Buffer.alloc(0)
    ffmpeg.stdout.on("data",(chunk)=>{
      oggBuffer = Buffer.concat([oggBuffer,chunk])
    })
    ffmpeg.on("close", async(code)=>{
      if(code !== 0) return m.reply("Gagal convert VN")
      await fukusima.sendMessage(m.chat,{
        audio: oggBuffer,
        mimetype: "audio/ogg; codecs=opus",
        ptt: true
      },{ quoted:m })
    })
    ffmpeg.stdin.write(audioBuffer)
    ffmpeg.stdin.end()
  } catch (err) {
    m.reply("Error VN "+err.message)
  }
}

function clockString(ms){
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

function toSmallCaps(text) {
  const smallCaps = {
    a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ꜰ", g: "ɢ", h: "ʜ",
    i: "ɪ", j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ",
    q: "ǫ", r: "ʀ", s: "s", t: "ᴛ", u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x",
    y: "ʏ", z: "ᴢ"
  }
  return text.toLowerCase().split("").map(c => smallCaps[c] || c).join("")
}

function toMonoUpperBold(text) {
  const chars = {
    A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚",
    H: "𝗛", I: "𝗜", J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠", N: "𝗡",
    O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥", S: "𝗦", T: "𝗧", U: "𝗨",
    V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭"
  }
  return text.toUpperCase().split("").map(c => chars[c] || c).join("")
}

function getTimeGreeting() {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return "Selamat Pagi"
  if (hour >= 12 && hour < 15) return "Selamat Siang"
  if (hour >= 15 && hour < 18) return "Selamat Sore"
  return "Selamat Malam"
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  if (days > 0) return `${days}d ${hours}h ${minutes}m`
  if (hours > 0) return `${hours}h ${minutes}m ${secs}s`
  if (minutes > 0) return `${minutes}m ${secs}s`
  return `${secs}s`
}

const menuTags = {
  main: 'Main Menu',
  ai: 'Ai Menu',
  downloader: 'Downloader Menu',
  random: 'Random Menu',
  database: 'Database Menu',
  sticker: 'Sticker Menu',
  tools: 'Tools Menu',
  fun: 'Fun Menu',
  group: 'Group Menu',
  xp: 'XP & Level Menu',
  info: 'Info Menu',
  owner: 'Owner Menu',
  anime: 'Anime Menu',
  game: 'Game Menu',
  islami: 'Islami Menu',
  maker: 'Maker Menu',
  internet: 'Internet Menu',
  rpg: 'RPG Menu',
  stalker: 'Stalker Menu',
  panel: 'Panel Menu',
  store: 'Store Menu'
}

const CATEGORY_EMOJIS = {
  owner: "👑", main: "🏠", utility: "🔧", fun: "🎮", group: "👥",
  download: "📥", search: "🔍", tools: "🛠️", sticker: "🖼️", ai: "🤖",
  game: "🎯", media: "🎬", info: "ℹ️", religi: "☪️", panel: "🖥️",
  user: "📊", random: "🎲", canvas: "🎨", anime: "🎌", rpg: "⚔️",
  maker: "🎨", internet: "🌐", stalker: "🔍", store: "📦", xp: "⭐",
  database: "💾", downloader: "📥"
}

function getVerifiedQuoted() {
  return {
    key: {
      participant: `0@s.whatsapp.net`,
      remoteJid: `status@broadcast`,
    },
    message: {
      contactMessage: {
        displayName: `🪸 ${global.namebot}`,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;ttname,;;;\nFN:ttname\nitem1.TEL;waid=13135550002:+1 (313) 555-0002\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
        sendEphemeral: true,
      },
    },
  }
}

function getContextInfo(thumbBuffer, renderLargerThumbnail = false) {
  const saluranLink = "https://whatsapp.com/channel/0029VaDykXF6kTnvPZtObr0M"
  const mainThumb = fs.existsSync(OURIN_MAIN) ? OURIN_MAIN : global.thumb
  return {
    mentionedJid: [],
    forwardingScore: 9999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363@newsletter",
      newsletterName: global.namebot,
      serverMessageId: 127
    },
    externalAdReply: {
      title: global.namebot,
      body: `BOT WHATSAPP MULTI DEVICE`,
      sourceUrl: saluranLink,
      mediaType: 1,
      renderLargerThumbnail,
      thumbnailUrl: mainThumb,
    }
  }
}

let handler = async (m, { fukusima, args, usedPrefix, isOwner }) => {
  try {
  const input = (args[0] || '').toLowerCase()
  const isAll = input === 'all'
  const isCategory = menuTags[input]
  
  let menuVariant = global.varian || 2
  if (args[0] && args[0].match(/^v([1-9]|1[0-5])$/)) {
    menuVariant = parseInt(args[0].substring(1))
    global.varian = menuVariant
  }

  const plugins = Object.values(global.plugins).filter(p => !p.disabled)

  const help = plugins.map(p => ({
    help: Array.isArray(p.help) ? p.help : [p.help],
    tags: Array.isArray(p.tags) ? p.tags : [p.tags],
    limit: p.limit,
    premium: p.premium,
    owner: p.owner
  }))

  let user = global.db.data.users[m.sender]
  let { exp, level, role } = user
  let { min, xp, max } = levelling.xpRange(level, global.multiplier)

  let uptime = clockString(process.uptime() * 1000)
  let uptimeSeconds = process.uptime()
  let totalreg = Object.keys(global.db.data.users).length
  let pushname = m.pushName

  const userJid = (m.sender || '').replace(/[^a-zA-Z0-9]/g, '_')
  const folderPath = './tmp'
  const filePathe = path.join(folderPath, `${userJid}.jpg`)

  if (!fs.existsSync(filePathe)) {
    let ppuser2 = null
    try {
      ppuser2 = await fukusima.profilePictureUrl(m.sender, 'image')
    } catch {}
    if (typeof ppuser2 !== 'string' || !ppuser2.startsWith('http')) {
      ppuser2 = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
    }
    const response = await axios.get(ppuser2, { responseType: 'arraybuffer' })
    await sharp(response.data)
      .resize(200, 200, { fit: sharp.fit.cover })
      .jpeg({ quality: 30 })
      .toFile(filePathe)
  }

  const ppBuffer = fs.readFileSync(filePathe)
  
  const mainImage = fs.existsSync(OURIN_MAIN) ? fs.readFileSync(OURIN_MAIN) : ppBuffer
  const thumbImage = fs.existsSync(OURIN_THUMB) ? fs.readFileSync(OURIN_THUMB) : ppBuffer
  const bannerImage = fs.existsSync(OURIN_BANNER) ? fs.readFileSync(OURIN_BANNER) : ppBuffer
  const v7Image = fs.existsSync(OURIN_V7) ? fs.readFileSync(OURIN_V7) : ppBuffer
  const v8Image = fs.existsSync(OURIN_V8) ? fs.readFileSync(OURIN_V8) : ppBuffer
  const v9Image = fs.existsSync(OURIN_V9) ? fs.readFileSync(OURIN_V9) : ppBuffer
  const v11Image = fs.existsSync(OURIN_V11) ? fs.readFileSync(OURIN_V11) : ppBuffer
  const allmenuImage = fs.existsSync(OURIN_ALLMENU) ? fs.readFileSync(OURIN_ALLMENU) : ppBuffer
  const videoBuffer = fs.existsSync(OURIN_VIDEO) ? fs.readFileSync(OURIN_VIDEO) : null

  let d = new Date()
  let locale = 'id-ID'
  let week = d.toLocaleDateString(locale, { weekday: 'long' })
  let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
  let timeNow = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

  const hijriToday = new Intl.DateTimeFormat('id-ID-u-ca-islamic', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date())

  const commandsByCategory = {}
  for (const tag in menuTags) {
    commandsByCategory[tag] = help
      .filter(p => p.tags.includes(tag))
      .flatMap(p => p.help)
  }

  const getSortedCategories = () => {
    const sorted = []
    for (const [key, name] of Object.entries(menuTags)) {
      if (key === 'owner' && !isOwner) continue
      const cmds = commandsByCategory[key] || []
      if (cmds.length === 0) continue
      const emoji = CATEGORY_EMOJIS[key] || "📁"
      sorted.push({ cat: key, name, cmds, emoji })
    }
    return sorted
  }

  const menuSorted = getSortedCategories()
  const totalCmds = menuSorted.reduce((acc, cat) => acc + cat.cmds.length, 0)
  const greeting = getTimeGreeting()
  const uptimeFormatted = formatUptime(uptimeSeconds)
  const userRole = isOwner ? "Owner" : (user.premium ? "Premium" : "User")
  const prefix = usedPrefix

  let baseText = `Hai *@${pushname || "User"}*

Aku ${global.namebot}, bot WhatsApp berbasis JavaScript yang siap membantu kebutuhan kamu secara efisien.

Kamu dapat menggunakan berbagai fitur untuk mencari informasi, mengambil data, dan kebutuhan lainnya langsung dari WhatsApp.`

  baseText += `\n\n╭─〔 *𝙸𝙽𝙵𝙾 𝙱𝙾𝚃* 〕\n`
  baseText += `│ 𝙽𝙰𝙼𝙰   : ${global.namebot}\n`
  baseText += `│ 𝚅𝙴𝚁𝚂𝙸  : v${global.versi}\n`
  baseText += `│ 𝙼𝙾𝙳𝙴   : PUBLIC\n`
  baseText += `│ 𝙿𝚁𝙴𝙵𝙸𝚇 : ${prefix}\n`
  baseText += `│ 𝚄𝙿𝚃𝙸𝙼𝙴 : ${uptimeFormatted}\n`
  baseText += `│ 𝙾𝚆𝙽𝙴𝚁  : ${global.author}\n`
  baseText += `╰───────────────\n\n`

  baseText += `╭─〔 *𝙸𝙽𝙵𝙾 𝚄𝚂𝙴𝚁* 〕\n`
  baseText += `│ 𝙽𝙰𝙼𝙰   : ${pushname}\n`
  baseText += `│ 𝚁𝙾𝙻𝙴   : ${userRole}\n`
  baseText += `│ 𝙴𝙽𝙴𝚁𝙶𝙸 : ${isOwner || user.premium ? "∞ Unlimited" : (user.energi ?? 25)}\n`
  baseText += `│ 𝙻𝙴𝚅𝙴𝙻  : ${user.rpg?.level || level || 1}\n`
  baseText += `│ 𝙴𝚇𝙿    : ${(exp ?? 0).toLocaleString()}\n`
  baseText += `│ 𝙺𝙾𝙸𝙽   : ${(user.koin ?? 0).toLocaleString()}\n`
  baseText += `╰────────────────⬣\n\n`

  baseText += `📂 *ᴅᴀꜰᴛᴀʀ ᴍᴇɴᴜ*\n`

  for (const { cat, emoji } of menuSorted) {
    baseText += `- \`◦\` ${prefix}menu ${cat} ${emoji}\n`
  }

 if (isCategory) {
    const cmds = help
      .filter(p => p.tags.includes(input))
      .flatMap(p => p.help.map(cmd => {
        let flag = `${p.limit ? 'Ⓛ' : ''}${p.premium ? 'Ⓟ' : ''}${p.owner ? 'Ⓞ' : ''}`
        return `• ${prefix}${cmd} ${flag}`
      }))

    if (cmds.length) {
      let text = `╭─〔 *${menuTags[input].toUpperCase()}* 〕\n`
      text += `│ Total: ${cmds.length} commands\n`
      text += `╰────────────\n\n`
      text += cmds.join('\n')
      text += `\n\n> Ketik ${prefix}menu untuk kembali`
      
      await fukusima.sendMessage(m.chat, {
        image: mainImage,
        caption: text,
        contextInfo: getContextInfo(thumbImage)
      }, { quoted: m })
    } else {
      m.reply(`Tidak ada command dalam kategori *${menuTags[input]}*`)
    }
    return
  }

else if (isAll) {
    let text = `╭─〔 *ALL MENU ${global.namebot.toUpperCase()}* 〕\n`
    text += `│ Total: ${totalCmds} commands\n`
    text += `╰────────────\n\n`
    
    for (const tag in menuTags) {
      if (tag === 'owner' && !isOwner) continue
      const cmds = help
        .filter(p => p.tags.includes(tag))
        .flatMap(p => p.help.map(cmd => {
          let flag = `${p.limit ? 'Ⓛ' : ''}${p.premium ? 'Ⓟ' : ''}${p.owner ? 'Ⓞ' : ''}`
          return `• ${prefix}${cmd} ${flag}`
        }))
      
      if (cmds.length) {
        text += `\n┌─〔 *${menuTags[tag].toUpperCase()}* 〕 (${cmds.length})\n`
        text += cmds.slice(0, 15).join('\n')
        if (cmds.length > 15) text += `\n...dan ${cmds.length - 15} lainnya`
        text += `\n└────────────\n`
      }
    }
    
    text += `\n> Total ${totalCmds} commands | ${prefix}menu v1-15 untuk tampilan lain`
    
    await fukusima.sendMessage(m.chat, {
      document: allmenuImage,
      mimetype: 'image/png',
      fileName: `allmenu_${global.namebot}.png`,
      caption: text,
      contextInfo: getContextInfo(thumbImage)
    }, { quoted: m })
    return
  }

 else if (menuVariant === 1) {
    await fukusima.sendMessage(m.chat, { image: mainImage, caption: baseText }, { quoted: m })
  }
  
  else if (menuVariant === 2) {
    await fukusima.sendMessage(m.chat, {
      image: mainImage,
      caption: baseText,
      contextInfo: getContextInfo(thumbImage)
    }, { quoted: m })
  }
  
  else if (menuVariant === 3) {
    const resizedThumb = await sharp(thumbImage).resize(300, 300, { fit: "cover" }).jpeg({ quality: 80 }).toBuffer()
    await fukusima.sendMessage(m.chat, {
      document: mainImage,
      mimetype: "image/png",
      fileLength: 999999999999,
      fileSize: 999999999999,
      fileName: `ɴᴏ ᴘᴀɪɴ ɴᴏ ɢᴀɪɴ`,
      caption: baseText,
      jpegThumbnail: resizedThumb,
      contextInfo: getContextInfo(bannerImage, true)
    }, { quoted: getVerifiedQuoted() })
  }
  
  else if (menuVariant === 4) {
    if (videoBuffer) {
      await fukusima.sendMessage(m.chat, {
        video: videoBuffer,
        caption: baseText,
        gifPlayback: true,
        contextInfo: getContextInfo(thumbImage)
      }, { quoted: getVerifiedQuoted() })
    } else {
      await fukusima.sendMessage(m.chat, {
        image: mainImage,
        caption: baseText,
        gifPlayback: true,
        contextInfo: getContextInfo(thumbImage)
      }, { quoted: getVerifiedQuoted() })
    }
  }
  
  else if (menuVariant === 5) {
    const categoryRows = menuSorted.map(({ cat, cmds, emoji }) => ({
      title: `${emoji} ${toMonoUpperBold(cat)}`,
      id: `${prefix}menu ${cat}`,
      description: `${cmds.length} commands`
    }))

    let headerText = `*@${pushname || "User"}* 🪸\n\n`
    headerText += `Aku ${global.namebot}, bot WhatsApp yang siap bantu kamu.\n\n`
    headerText += `╭┈┈⬡「 🤖 *ʙᴏᴛ ɪɴꜰᴏ* 」\n`
    headerText += `┃ \`◦\` ɴᴀᴍᴀ: *${global.namebot}*\n`
    headerText += `┃ \`◦\` ᴠᴇʀsɪ: *v${global.versi}*\n`
    headerText += `┃ \`◦\` ᴜᴘᴛɪᴍᴇ: *${uptimeFormatted}*\n`
    headerText += `┃ \`◦\` ᴛᴏᴛᴀʟ ᴄᴍᴅ: *${totalCmds}*\n`
    headerText += `╰┈┈┈┈┈┈┈┈⬡\n\n`
    headerText += `📋 *Pilih kategori di bawah untuk melihat daftar command*`

    const buttons = [
      {
        name: "single_select",
        buttonParamsJson: JSON.stringify({
          title: "📁 ᴘɪʟɪʜ ᴍᴇɴᴜ",
          sections: [{ title: "📋 PILIH CATEGORY", rows: categoryRows }]
        })
      },
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "📊 TOTAL SEMUA FITUR",
          id: `${prefix}totalfitur`
        })
      },
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "📊 SEMUA MENU",
          id: `${prefix}allmenu`
        })
      }
    ]

    let headerMedia = null
    if (v7Image) {
      try {
        headerMedia = await prepareWAMessageMedia({ image: v7Image }, { upload: fukusima.waUploadToServer })
      } catch (e) {}
    }

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: proto.Message.InteractiveMessage.Body.fromObject({ text: headerText }),
            footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: `© ${global.namebot} | ${menuSorted.length} Categories` }),
            header: proto.Message.InteractiveMessage.Header.fromObject({
              title: `${global.namebot}`,
              hasMediaAttachment: !!headerMedia,
              ...(headerMedia || {})
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ buttons }),
            contextInfo: { mentionedJid: [m.sender], forwardingScore: 9999, isForwarded: true }
          })
        }
      }
    }, { userJid: m.sender, quoted: getVerifiedQuoted() })

    await fukusima.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
  }
  
  else if (menuVariant === 6) {
    let bannerThumb = null
    try {
      bannerThumb = await sharp(bannerImage).resize(200, 200, { fit: "inside" }).jpeg({ quality: 90 }).toBuffer()
    } catch (e) { bannerThumb = bannerImage }
    
    await fukusima.sendMessage(m.chat, {
      document: mainImage,
      mimetype: "application/pdf",
      fileName: `ɴᴏ ᴘᴀɪɴ ɴᴏ ɢᴀɪɴ`,
      fileLength: 9999999999,
      caption: baseText,
      jpegThumbnail: bannerThumb,
      contextInfo: getContextInfo(bannerImage, true)
    }, { quoted: getVerifiedQuoted() })
  }
  
  else if (menuVariant === 7) {
    const carouselCards = []
    for (const { cat, cmds, emoji } of menuSorted) {
      let cardBody = `━━━━━━━━━━━━━━━\n`
      for (const cmd of cmds.slice(0, 15)) {
        cardBody += `◦ \`${prefix}${cmd}\`\n`
      }
      if (cmds.length > 15) cardBody += `\n_...dan ${cmds.length - 15} command lainnya_`
      cardBody += `\n\n> Total: ${cmds.length} commands`

      let cardMedia = null
      try {
        const resized = await sharp(v7Image).resize(300, 300, { fit: "cover" }).jpeg({ quality: 80 }).toBuffer()
        cardMedia = await prepareWAMessageMedia({ image: resized }, { upload: fukusima.waUploadToServer })
      } catch (e) {}

      const cardMessage = {
        header: proto.Message.InteractiveMessage.Header.fromObject({
          title: `${emoji} ${toSmallCaps(cat).toUpperCase()}`,
          hasMediaAttachment: !!cardMedia,
          ...(cardMedia || {})
        }),
        body: proto.Message.InteractiveMessage.Body.fromObject({ text: cardBody }),
        footer: proto.Message.InteractiveMessage.Footer.create({ text: `${global.namebot} • ${cat}` }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
          buttons: [{
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
              display_text: `📋 Lihat ${toSmallCaps(cat)}`,
              id: `${prefix}menu ${cat}`
            })
          }]
        })
      }
      carouselCards.push(cardMessage)
    }

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: proto.Message.InteractiveMessage.Body.fromObject({
              text: `${greeting} *${pushname}!*\n\n> Geser untuk melihat kategori menu\n> Ketuk tombol untuk melihat detail`
            }),
            footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: `${global.namebot} v${global.versi}` }),
            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards: carouselCards })
          })
        }
      }
    }, { userJid: m.sender, quoted: getVerifiedQuoted() })

    await fukusima.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
  }
  
  else if (menuVariant === 8) {
    let menuText = `┏━━━〔 👤 *PROFILE* 〕━━━┓\n`
    menuText += `┃ 👤 *${pushname}*\n`
    menuText += `┃ 🏷️ ${userRole}\n`
    menuText += `┃ ⚡ Level   ➤ ${user.rpg?.level || level || 1}\n`
    menuText += `┃ ✨ Exp     ➤ ${(exp ?? 0).toLocaleString()}\n`
    menuText += `┃ 💰 Koin    ➤ ${(user.koin ?? 0).toLocaleString()}\n`
    if (user.rpg?.health) {
      menuText += `┃ ❤️ HP      ➤ ${user.rpg.health}/${user.rpg.maxHealth}\n`
      menuText += `┃ 🔮 Mana    ➤ ${user.rpg.mana}/${user.rpg.maxMana}\n`
    }
    menuText += `┃ ⏰ ${timeNow} WIB\n`
    menuText += `┃ 📅 ${date}\n`
    menuText += `┗━━━━━━━━━━━━━━━┛\n\n`
    menuText += `┏━━〔 ⚡ *SYS STATS* 〕━━┓\n`
    menuText += `┃ ⏱️ Uptime  ➤ ${uptimeFormatted}\n`
    menuText += `┃ 🔧 Mode    ➤ PUBLIC\n`
    menuText += `┃ 📊 Total   ➤ ${totalCmds} Commands\n`
    menuText += `┃ 👥 Users   ➤ ${totalreg} Aktif\n`
    menuText += `┗━━━━━━━━━━━━━━━━━━━━━━┛\n\n`
    menuText += `╭══════════════════════╮\n`
    menuText += `║  📋 *𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗟𝗜𝗦𝗧*    ║\n`
    menuText += `╰══════════════════════╯\n\n`
    
    for (const { cat, cmds, emoji } of menuSorted) {
      menuText += `┌─────「 ${emoji} *${cat.toUpperCase()}* 」\n`
      menuText += `│ ✦ Total: ${cmds.length} commands\n`
      menuText += `│\n`
      for (const cmd of cmds.slice(0, 5)) {
        menuText += `│ ├➤ ${prefix}${cmd}\n`
      }
      if (cmds.length > 5) menuText += `│ └ dan ${cmds.length - 5} lainnya\n`
      menuText += `└───────────────────\n\n`
    }

    const thumbV8Img = await sharp(v8Image).resize(300, 300, { fit: "cover" }).jpeg({ quality: 80 }).toBuffer()
    const ftroliQuoted = {
      key: { fromMe: false, participant: "0@s.whatsapp.net", remoteJid: "status@broadcast" },
      message: {
        orderMessage: {
          orderId: "1337",
          thumbnail: thumbV8Img,
          itemCount: totalCmds,
          status: "INQUIRY",
          surface: "CATALOG",
          message: `${global.namebot} Menu`,
          orderTitle: `📋 ${totalCmds} Commands`,
          sellerJid: m.sender,
          token: "menu-v8",
          totalAmount1000: 0,
          totalCurrencyCode: "IDR",
          contextInfo: {
            isForwarded: true,
            forwardingScore: 9999,
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363@newsletter",
              newsletterName: global.namebot,
              serverMessageId: 127
            }
          }
        }
      }
    }

    await fukusima.sendMessage(m.chat, {
      image: v8Image,
      caption: menuText,
      contextInfo: getContextInfo(thumbImage, true)
    }, { quoted: ftroliQuoted })
  }
  
  else if (menuVariant === 9) {
    let headerMedia = null
    try {
      const resized = await sharp(v9Image).resize(300, 300).jpeg().toBuffer()
      headerMedia = await prepareWAMessageMedia({ image: resized }, { upload: fukusima.waUploadToServer })
    } catch (e) {}

    const buttons = [
      { name: "single_select", buttonParamsJson: JSON.stringify({ has_multiple_buttons: true }) },
      {
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
          display_text: "Nomor Owner ku",
          url: `https://wa.me/${global.nomorown || "6281234567890"}`,
          merchant_url: `https://wa.me/${global.nomorown || "6281234567890"}`
        })
      },
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "🧾 Tampilkan Semua Menu",
          id: `${prefix}allmenu`
        })
      }
    ]

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: proto.Message.InteractiveMessage.Body.fromObject({ text: baseText }),
            footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: `© ${global.namebot} v${global.versi}` }),
            header: proto.Message.InteractiveMessage.Header.fromObject({
              hasMediaAttachment: !!headerMedia,
              ...(headerMedia || {})
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ 
              messageParamsJson: JSON.stringify({
                limited_time_offer: {
                  text: global.namebot,
                  url: "https://whatsapp.com/channel/0029VaDykXF6kTnvPZtObr0M",
                  copy_code: global.author,
                  expiration_time: Date.now() * 999
                },
                bottom_sheet: {
                  in_thread_buttons_energi: 2,
                  divider_indices: [1, 2, 3, 4, 5, 999],
                  list_title: global.namebot,
                  button_title: "🍀 ριℓιн кαтєgσяι"
                }
              }),
              buttons: buttons
            }),
            contextInfo: { mentionedJid: [m.sender], forwardingScore: 9999, isForwarded: true }
          })
        }
      }
    }, { userJid: m.sender, quoted: getVerifiedQuoted() })

    await fukusima.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
  }
  
  else if (menuVariant === 10) {
    let productImage = null
    try {
      const resized = await sharp(v9Image).resize(736, 890, { fit: "cover" }).jpeg({ quality: 85 }).toBuffer()
      productImage = await prepareWAMessageMedia({ image: resized }, { upload: fukusima.waUploadToServer })
    } catch (e) {}

    const footerText = `Hai *@${pushname || "User"}* 🪸\n\nAku ${global.namebot}, bot WhatsApp yang siap bantu kamu.\n\n─────────────────────────\nNama    : ${global.namebot}\nVersi : v${global.versi}\nRuntime : Node.js ${process.version}\nBot Up  : ${uptimeFormatted}\n\nOwner ku kak   : ${global.author}\n─────────────────────────\nKlik tombol di bawah untuk menampilkan menu`

    const buttons = [{
      name: "quick_reply",
      buttonParamsJson: JSON.stringify({ display_text: global.namebot, id: `${prefix}allmenu` })
    }]

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            header: proto.Message.InteractiveMessage.Header.fromObject({
              title: `${global.namebot} Menu`,
              hasMediaAttachment: !!productImage,
              productMessage: {
                product: {
                  productImage: productImage?.imageMessage || null,
                  productId: `menu_${global.namebot}`,
                  title: `${global.namebot} Menu`,
                  description: "Menu Bot",
                  currencyCode: "IDR",
                  priceAmount1000: "1000000000000000",
                  retailerId: global.namebot,
                  productImageCount: 1
                },
                businessOwnerJid: m.sender
              }
            }),
            body: proto.Message.InteractiveMessage.Body.fromObject({ text: `*© ${global.namebot} 2024*` }),
            footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: footerText }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ buttons }),
            contextInfo: {
              mentionedJid: [m.sender],
              forwardingScore: 9999,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: "120363@newsletter",
                newsletterName: global.namebot,
                serverMessageId: 127
              }
            }
          })
        }
      }
    }, { userJid: m.sender, quoted: getVerifiedQuoted() })

    await fukusima.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
  }
  
  else if (menuVariant === 11) {
    const docuThumb = await sharp(v11Image).resize(300, 300).toBuffer()
    const catRows = menuSorted.map(({ cat, emoji, cmds }) => ({
      header: "",
      title: `🍀 ${toMonoUpperBold(cat)}`,
      id: `${prefix}menu ${cat}`,
      description: `Berisi ${cmds.length} Perintah`
    }))

    const titleText = `Hallo Kak *@${pushname}*\n\nSebelumnya, terima kasih yak sudah menggunakan bot kami\n\n╭─ \`INFORMASI BOT\` 𝜗ৎ\n┆ ᵎᵎ Nama Bot : *${global.namebot}*\n┆ ᵎᵎ Owner Bot : *${global.author}*\n┆ ᵎᵎ Prefix : *${prefix}*\n┆ ᵎᵎ Total Perintah : *${totalCmds}*\n┆ ᵎᵎ Role Kamu : ${userRole}\n╰─────\n\nsilahkan tekan tombol dibawah untuk memilih menu`

    const buttons = [
      { name: "single_select", buttonParamsJson: JSON.stringify({ has_multiple_buttons: true }) },
      { name: "call_permission_request", buttonParamsJson: JSON.stringify({ has_multiple_buttons: true }) },
      {
        name: "single_select",
        buttonParamsJson: JSON.stringify({
          title: "Pilihan Menu",
          sections: [{ title: "🍀 Silahkan pilih menu yang kamu inginkan", highlight_label: global.namebot, rows: catRows }],
          has_multiple_buttons: true
        })
      },
      {
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
          display_text: "🌏 Kunjungi Saluran Kami",
          url: "https://whatsapp.com/channel/0029VaDykXF6kTnvPZtObr0M",
          merchant_url: "https://whatsapp.com/channel/0029VaDykXF6kTnvPZtObr0M"
        })
      },
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({ display_text: "🖐 Owner Kami", id: `${prefix}owner` })
      },
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({ display_text: "🌺 Lihat Semua Menu", id: `${prefix}allmenu` })
      }
    ]

    await fukusima.sendMessage(m.chat, {
      document: v11Image,
      mimetype: "image/png",
      fileName: `${greeting}`,
      jpegThumbnail: docuThumb,
      caption: titleText,
      footer: `© ${global.namebot} 2024`,
      buttons: buttons,
      contextInfo: getContextInfo(v11Image, true)
    }, { quoted: getVerifiedQuoted() })
  }
  
  else if (menuVariant === 12) {
    let ppUser = ppBuffer
    try {
      const ppUrl = await fukusima.profilePictureUrl(m.sender, 'image')
      const res = await axios.get(ppUrl, { responseType: 'arraybuffer' })
      ppUser = Buffer.from(res.data)
    } catch (e) {}

    const docuThumb = await sharp(ppUser).resize(300, 300).toBuffer()
    const catButtons = menuSorted.map(({ cat }) => ({
      name: "quick_reply",
      buttonParamsJson: JSON.stringify({ display_text: `${toMonoUpperBold(cat)}`, id: `${prefix}menu ${cat}` })
    }))

    const titleText = `🌾 *𝘏𝘪! ${pushname}*\n\n𝘛𝘩𝘢𝘯𝘬𝘴 𝘧𝘰𝘳 𝘮𝘦𝘴𝘴𝘢𝘨𝘪𝘯𝘨 𝘶𝘴. 𝘠𝘰𝘶'𝘳𝘦 𝘯𝘰𝘸 𝘤𝘩𝘢𝘵𝘵𝘪𝘯𝘨 𝘸𝘪𝘵𝘩 𝘰𝘶𝘳 𝘈𝘶𝘵𝘰𝘮𝘢𝘵𝘪𝘤 𝘞𝘩𝘢𝘵𝘴𝘈𝘱𝘱 𝘉𝘰𝘵.\n\n╭─「 *${pushname}* 」\n│ • Bot Version : *${global.versi}*\n│ • Database : ${(JSON.stringify(global.db.data.users).length / 1024).toFixed(2)} KB\n╰──`

    const buttons = [
      { name: "single_select", buttonParamsJson: JSON.stringify({ has_multiple_buttons: true }) },
      { name: "call_permission_request", buttonParamsJson: JSON.stringify({ has_multiple_buttons: true }) },
      { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Lihat Semua Menu", id: `${prefix}allmenu` }) },
      ...catButtons
    ]

    const ftroliQuotedV12 = {
      key: { fromMe: false, participant: "0@s.whatsapp.net", remoteJid: "status@broadcast" },
      message: {
        requestPaymentMessage: {
          currencyCodeIso4217: "IDR",
          amount1000: 999999999,
          requestFrom: "0@s.whatsapp.net",
          noteMessage: { extendedTextMessage: { text: global.namebot } },
          expiryTimestamp: 999999999
        }
      }
    }

    await fukusima.sendMessage(m.chat, {
      document: v11Image,
      mimetype: "image/png",
      fileName: `${greeting}`,
      jpegThumbnail: docuThumb,
      caption: titleText,
      footer: `© ${global.namebot} 2024`,
      buttons: buttons,
      contextInfo: getContextInfo(thumbImage, true)
    }, { quoted: ftroliQuotedV12 })
  }
  
  else if (menuVariant === 13) {
    const catList = menuSorted.map(({ cat }) => `│ *${prefix}menu ${cat}*`).join("\n")
    
    const captionV13 = `🎄 ʜᴀʟʟᴏ *${pushname}*

╭─ *✦* \`${toMonoUpperBold("biodata bot")}\` *✦*
│ ʙᴏᴛ : *${global.namebot}*
│ ᴠᴇʀsɪᴏɴ : *${global.versi}*
╰───

╭─ *✦* \`${toMonoUpperBold("list category")}\` *✦*
${catList}
╰─────────────`

    await fukusima.sendMessage(m.chat, {
      image: v8Image,
      caption: captionV13,
      footer: global.namebot,
      contextInfo: getContextInfo(thumbImage, true)
    }, { quoted: getVerifiedQuoted() })
  }
  
  else if (menuVariant === 14) {
    const docuThumb = await sharp(v11Image).resize(300, 300).toBuffer()
    const catButtons = menuSorted.map(({ cat }) => ({
      name: "quick_reply",
      buttonParamsJson: JSON.stringify({ display_text: `${toMonoUpperBold(cat)}`, id: `${prefix}menu ${cat}` })
    }))

    const buttons = [
      { name: "single_select", buttonParamsJson: JSON.stringify({ has_multiple_buttons: true }) },
      { name: "call_permission_request", buttonParamsJson: JSON.stringify({ has_multiple_buttons: true }) },
      { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Lihat Semua Menu", id: `${prefix}allmenu` }) },
      ...catButtons
    ]

    const footerText = `Halo kak *${pushname}* ≽^• ˕ • ྀི≼\n*⌞ INFO USER ⌝*\n‧ Number    : +${m.sender.split("@")[0]}\n‧ Name    : ${pushname}\n\n*⌞ INFO BOT ⌝*\n‧ Name    : ${global.namebot}\n‧ Version : v${global.versi}\n‧ Prefix  : ${prefix}\n\n*⌞ CARA PAKAI ⌝*\n‧ Klik tombol untuk melihat menu kategori\n‧ Klik *LIHAT SEMUA MENU* untuk seluruh fitur`

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            contextInfo: {
              mentionedJid: [m.sender],
              forwardingScore: 19,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterId: "120363@newsletter",
                newsletterName: global.namebot,
                serverMessageId: -1
              },
              externalAdReply: {
                title: global.namebot,
                body: `🌾 Dikembangkan oleh ${global.author}`,
                thumbnailUrl: global.thumb,
                sourceUrl: "https://instagram.com/",
                mediaUrl: "https://instagram.com/",
                mediaType: 2,
                renderLargerThumbnail: true
              }
            },
            header: {
              title: null,
              locationMessage: {
                degreesLatitude: 0,
                degreesLongitude: 0,
                name: `꫶ᥫ᭡꫶ ${pushname || "User"}`,
                url: `https://ss.ss`,
                address: `Semoga harimu menyenangkan :3`,
                jpegThumbnail: docuThumb
              },
              subtitle: "",
              hasMediaAttachment: false
            },
            body: { text: null },
            footer: { text: footerText },
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: buttons,
              messageParamsJson: JSON.stringify({
                bottom_sheet: {
                  in_thread_buttons_limit: 1,
                  divider_indices: [1],
                  list_title: getTimeGreeting(),
                  button_title: "𖤍"
                }
              })
            })
          })
        }
      }
    }, { userJid: m.sender, quoted: getVerifiedQuoted() })

    await fukusima.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
  }
    
  else if (menuVariant === 15) {
    const catRows = menuSorted.map(({ cat, emoji }) => ({
      title: `[ ${emoji} ] - ${toMonoUpperBold(`${cat} MENU`)}`,
      description: `Klik untuk membuka ${cat}`,
      id: `${prefix}menu ${cat}`
    }))

    const buttons = [
      { name: "single_select", buttonParamsJson: JSON.stringify({ has_multiple_buttons: true }) },
      { name: "call_permission_request", buttonParamsJson: JSON.stringify({ has_multiple_buttons: true }) },
      { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "All Menu", id: `${prefix}allmenu` }) },
      {
        name: "single_select",
        buttonParamsJson: JSON.stringify({
          title: "CLICK HERE",
          sections: [{ title: "PILIH CATEGORY", rows: catRows }],
          has_multiple_buttons: true
        })
      },
      { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "HUB KAMI", id: `${prefix}owner` }) }
    ]

    const footerText = `🌿 ʜᴇʟʟᴏ *${pushname}* 👋

ᴡᴇʟᴄᴏᴍᴇ ᴛᴏ *${global.namebot}* ✨  
ʙᴏᴛ ɪɴɪ ᴅɪᴊᴀʟᴀɴᴋᴀɴ ᴍᴇɴɢɢᴜɴᴀᴋᴀɴ ʙᴀʜᴀsᴀ ᴘʀᴏɢʀᴀᴍᴀɴ ᴊᴀᴠᴀsᴄʀɪᴘᴛ! ʏᴀɴɢ sɪᴀᴘ ᴍᴇᴍʙᴀɴᴛᴜ ᴋᴀᴍᴜ ᴋᴀᴘᴀɴ sᴀᴊᴀ 🚀

sɪʟᴀʜᴋᴀɴ ɢᴜɴᴀᴋᴀɴ ʙᴏᴛ ɪɴɪ ᴅᴇɴɢᴀɴ ʙɪᴊᴀᴋ ᴅᴀɴ ᴘɪʟɪʜ ᴍᴇɴᴜ ʏᴀɴɢ ᴛᴇʀsᴇᴅɪᴀ ʏᴀʜ 🍃

🍃︎ *ɪɴғᴏ ʙᴏᴛ* 🌱
→ *ɴᴀᴍᴇ*: ${global.namebot}
→ *ᴠᴇʀsɪᴏɴ*: v${global.versi}
→ *ғᴇᴀᴛᴜʀᴇ*: ${totalCmds} Fitur
→ *ᴏᴡɴᴇʀ*: ${global.author}
→ *ᴘʀᴇғɪx*: ${prefix}

👾︎ *ɪɴғᴏ ᴜsᴇʀ* 👾
→ *ɴᴀᴍᴇ*: ${pushname}
→ *ʀᴏʟᴇ*: ${userRole}
→ *ᴇɴᴇʀɢɪ*: ${isOwner || user.premium ? "∞ ᴜɴʟɪᴍɪᴛᴇᴅ" : (user.energi ?? 25)}
→ *ʟᴇᴠᴇʟ*: ${user.rpg?.level || level || 1}
→ *ᴇxᴘ*: ${(exp ?? 0).toLocaleString()}
→ *ᴄᴏɪɴ*: ${(user.koin ?? 0).toLocaleString()}
${user.rpg?.health ? `→ *HP*: ${user.rpg.health}/${user.rpg.maxHealth}
→ *Mana*: ${user.rpg.mana}/${user.rpg.maxMana}
→ *Stamina*: ${user.rpg.stamina}/${user.rpg.maxStamina}` : ""}

𝙿𝙾𝚆𝙴𝚁𝚁𝙴𝙳 𝙱𝚈 𝙰𝙷𝙼𝙰𝙳𝚇𝚈𝚉`

    const thumbResized = await sharp(v8Image).resize(300, 300).toBuffer()
    
    let weatherData = { suhu: "32", cuaca: "Cerah" }
    try {
      const res = await axios.get("https://api.bmkg.go.id/weather/33.26.16.2005")
      if (res.data) {
        weatherData.suhu = res.data.data?.forecast?.[0]?.entries?.[0]?.temperature_c || "32"
        weatherData.cuaca = res.data.data?.forecast?.[0]?.entries?.[0]?.weather || "Cerah"
      }
    } catch (e) {}

    const weatherEmoji = { Cerah: "☀️", "Cerah Berawan": "🌤️", Berawan: "☁️", Hujan: "🌧️", "Hujan Petir": "⛈️" }
    const emojiCuaca = weatherEmoji[weatherData.cuaca] || "🌤️"

    let headerMedia = null
    try {
      headerMedia = await prepareWAMessageMedia({ image: thumbResized }, { upload: fukusima.waUploadToServer })
    } catch (e) {}

    const ftroliQuotedV15 = {
      key: { fromMe: false, participant: "0@s.whatsapp.net", remoteJid: "status@broadcast" },
      message: {
        orderMessage: {
          orderId: "44444444444444",
          thumbnail: thumbResized,
          itemCount: totalCmds,
          status: "INQUIRY",
          surface: "CATALOG",
          message: `★ Terima kasih\n✦ Ada Error? Lapor owner`,
          orderTitle: `📋 ${totalCmds} Commands`,
          sellerJid: m.sender,
          token: "menu-v15",
          totalAmount1000: 3333333,
          totalCurrencyCode: "IDR",
          contextInfo: {
            isForwarded: true,
            forwardingScore: 9,
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363@newsletter",
              newsletterName: global.namebot,
              serverMessageId: 127
            }
          }
        }
      }
    }

    const interactiveMessage = {
      body: proto.Message.InteractiveMessage.Body.fromObject({ text: footerText }),
      footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: `${greeting} • ${global.namebot}` }),
      header: proto.Message.InteractiveMessage.Header.fromObject({
        title: `🌡️ ${weatherData.suhu}°C | ${emojiCuaca} ${weatherData.cuaca}`,
        hasMediaAttachment: !!headerMedia,
        ...(headerMedia || {})
      }),
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ 
        messageParamsJson: JSON.stringify({
          limited_time_offer: {
            text: global.namebot,
            url: "https://whatsapp.com/channel/0029VaDykXF6kTnvPZtObr0M",
            copy_code: null,
            expiration_time: null
          },
          bottom_sheet: {
            in_thread_buttons_limit: 2,
            divider_indices: [1, 2, 3, 4, 5, 999],
            list_title: "Silahkan pilih menu yang kamu inginkan",
            button_title: "🌥️ Lebih Lengkap"
          }
        }),
        buttons: buttons
      }),
      contextInfo: { mentionedJid: [m.sender], forwardingScore: 9999, isForwarded: true }
    }

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
          interactiveMessage: proto.Message.InteractiveMessage.fromObject(interactiveMessage)
        }
      }
    }, { userJid: m.sender, quoted: ftroliQuotedV15 })

    await fukusima.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
  }
  
  
  else {
    let text = `
${greeting} ${pushname} 🤝

*${global.namebot}*
━━━━━━━━━━━━━━━━━━━━━
📌 Version  : ${global.versi}
⏱️ Uptime   : ${uptime}
👥 Users    : ${totalreg}
📁 Commands : ${totalCmds}
━━━━━━━━━━━━━━━━━━━━━
👤 Nama  : ${pushname}
👑 Role  : ${userRole}
⭐ Level : ${level}
✨ Exp   : ${exp - min}/${xp}
━━━━━━━━━━━━━━━━━━━━━
📅 ${week}, ${date}
🕌 ${hijriToday}
━━━━━━━━━━━━━━━━━━━━━

📂 *MENU CATEGORIES*

`.trim()

    for (const tag in menuTags) {
      if (!isOwner && tag === 'owner') continue
      text += `• ${prefix}menu ${tag}\n`
    }

    text += `\n📌 *Contoh:* ${prefix}menu main\n`
    text += `✨ *Varian Menu:* ${prefix}menu v1 - v15\n`
    text += `━━━━━━━━━━━━━━━━━━━━━\n`
    text += `© ${global.namebot}`

    const rowsDefault = Object.entries(menuTags)
      .filter(([k]) => isOwner || k !== 'owner')
      .map(([key, name]) => ({
        title: name,
        description: `Buka ${name}`,
        id: `${prefix}menu ${key}`
      }))

    const buttonsDefault = [
      {
        buttonId: `${prefix}menu all`,
        buttonText: { displayText: '📋 ALL MENU' },
        type: 1
      },
      {
        buttonId: 'listmenu',
        buttonText: { displayText: '📂 MENU' },
        type: 4,
        nativeFlowInfo: {
          name: 'single_select',
          paramsJson: JSON.stringify({
            title: 'MENU',
            sections: [{ title: 'Pilih', rows: rowsDefault }]
          })
        }
      }
    ]

    await fukusima.sendMessage(m.chat, {
      document: allmenuImage,
      mimetype: 'image/png',
      fileName: `${pushname}.png`,
      jpegThumbnail: thumbImage,
      caption: text,
      footer: global.namebot,
      buttons: buttonsDefault,
      headerType: 4,
      contextInfo: getContextInfo(thumbImage, true)
    }, { quoted: m })

    return sendVnMenu(fukusima, m, global.musikMenu)
  }
  } catch (e) {
    await m.reply(`❌ Error: ${e.message}\n\nLaporkan ke owner.`)
    console.error(e)
  }
}

handler.command = ["menu"]

export default handler