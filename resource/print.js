import { WAMessageStubType } from 'baileys'
import PhoneNumber from 'awesome-phonenumber'
import chalk from 'chalk'
import { watchFile } from 'fs'

export default async function (m, fukusima = { user: {} }) {
  let _name = await fukusima.getName(m.sender)
  let sender = PhoneNumber('+' + m.sender.replace('@s.whatsapp.net', '')).getNumber('international') + (_name ? ' ~' + _name : '')
  let chat = await fukusima.getName(m.chat)
  // let ansi = '\x1b['
  let filesize = (m.msg ?
    m.msg.vcard ?
      m.msg.vcard.length :
      m.msg.fileLength ?
        m.msg.fileLength.low || m.msg.fileLength :
        m.msg.axolotlSenderKeyDistributionMessage ?
          m.msg.axolotlSenderKeyDistributionMessage.length :
          m.text ?
            m.text.length :
            0
    : m.text ? m.text.length : 0) || 0
  let user = global.db.data.users[m.sender]
  let me = PhoneNumber('+' + (fukusima.user?.jid).replace('@s.whatsapp.net', '')).getNumber('international')
  console.log(`
\n▣ ${chalk.redBright('%s')}\n│⏰ ${chalk.black(chalk.bgYellow('%s'))}\n│📑 ${chalk.black(chalk.bgGreen('%s'))}\n│📊 ${chalk.magenta('%s [%s %sB]')}
│📤 ${chalk.green('%s')}\n│📃 ${chalk.yellow('%s%s')}\n│📥 ${chalk.green('%s')}\n│💬 ${chalk.black(chalk.bgYellow('%s'))}
▣──────···
`.trim(),
    me + ' ~' + fukusima.user.name,
    (m.messageTimestamp ? new Date(1000 * (m.messageTimestamp.low || m.messageTimestamp)) : new Date).toTimeString(),
    m.messageStubType ? WAMessageStubType[m.messageStubType] : '',
    filesize,
    filesize === 0 ? 0 : (filesize / 1009 ** Math.floor(Math.log(filesize) / Math.log(1000))).toFixed(1),
    ['', ...'KMGTP'][Math.floor(Math.log(filesize) / Math.log(1000))] || '',
    sender,
    m ? m.exp : '?',
    user ? '|' + user.exp + '|' + user.limit + '|' + user.level : '',
    m.chat + (chat ? ' ~' + chat : ''),
    m.mtype ? m.mtype.replace(/message$/i, '').replace('audio', m.msg.ptt ? 'PTT' : 'audio').replace(/^./, v => v.toUpperCase()) : ''
  )
  if (typeof m.text === 'string' && m.text) {
    let log = m.text.replace(/\u200e+/g, '')
    let mdRegex = /(?<=(?:^|[\s\n])\S?)(?:([*_~])(.+?)\1|```((?:.||[\n\r])+?)```)(?=\S?(?:[\s\n]|$))/g
    let mdFormat = (depth = 4) => (_, type, text, monospace) => {
      let types = {
        _: 'italic',
        '*': 'bold',
        '~': 'strikethrough'
      }
      text = text || monospace
      let formatted = !types[type] || depth < 1 ? text : chalk[types[type]](text.replace(mdRegex, mdFormat(depth - 1)))
      // console.log({ depth, type, formatted, text, monospace }, formatted)
      return formatted
    }
    log = log.replace(mdRegex, mdFormat(4))
    if (m.mentionedJid) for (let user of m.mentionedJid) log = log.replace('@' + user.split`@`[0], chalk.blueBright('@' + await fukusima.getName(user)))
    console.log(m.error != null ? chalk.red(log) : m.isCommand ? chalk.yellow(log) : log)
  }
  if (m.messageStubParameters) console.log(m.messageStubParameters.map(jid => {
    jid = fukusima.decodeJid(jid)
    let name = fukusima.getName(jid)
    return chalk.gray(PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international') + (name ? ' ~' + name : ''))
  }).join(', '))
  if (/document/i.test(m.mtype)) console.log(`🗂️ ${m.msg.fileName || m.msg.displayName || 'Document'}`)
  else if (/ContactsArray/i.test(m.mtype)) console.log(`👨‍👩‍👧‍👦 ${' ' || ''}`)
  else if (/contact/i.test(m.mtype)) console.log(`👨 ${m.msg.displayName || ''}`)
  else if (/audio/i.test(m.mtype)) {
    const duration = m.msg.seconds
    console.log(`${m.msg.ptt ? '🎤 (PTT ' : '🎵 ('}AUDIO) ${Math.floor(duration / 60).toString().padStart(2, 0)}:${(duration % 60).toString().padStart(2, 0)}`)
  }

  console.log()
  // if (m.quoted) console.log(m.msg.contextInfo)
}

let file = global.__filename(import.meta.url)
watchFile(file, () => {
  console.log(chalk.redBright("Update 'fuku/print.js'"))
})