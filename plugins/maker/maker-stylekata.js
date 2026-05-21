import fs from 'fs'
import path from 'path'
import axios from 'axios'
import { createCanvas, loadImage } from '@napi-rs/canvas'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

let handler = async (m, { fukusima, args }) => {
  if (!args[0] || !args.join(' ').includes('|')) 
    return m.reply(`Contoh:\n.quotes3 Jangan menyerah Wak, kita semua berproses pelan-pelan|AhmadXyz|FukushimaMD`)

  let [quote, nama, tag] = args.join(' ').split('|')
  let sender = m.quoted ? m.quoted.sender : m.sender

  let ppuser
  try {
    ppuser = await fukusima.profilePictureUrl(sender, 'image')
  } catch {
    ppuser = 'https://telegra.ph/file/23cc3c5cd2375d3b93559.jpg'
  }

  const canvas = createCanvas(1024, 512)
  const ctx = canvas.getContext('2d')

  const bg = await loadImage(ppuser)
  ctx.drawImage(bg, 0, 0, 512, 512)

  const gradient = ctx.createLinearGradient(460, 0, 512, 0)
  gradient.addColorStop(0, 'rgba(0,0,0,0)')
  gradient.addColorStop(1, 'rgba(0,0,0,1)')
  ctx.fillStyle = gradient
  ctx.fillRect(460, 0, 52, 512)

  ctx.fillStyle = '#000'
  ctx.fillRect(512, 0, 512, 512)

  ctx.fillStyle = '#fff'
  ctx.font = 'bold 32px sans-serif'

  const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(' ')
    let line = ''
    let lines = []
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' '
      const metrics = ctx.measureText(testLine)
      if (metrics.width > maxWidth && n > 0) {
        lines.push(line)
        line = words[n] + ' '
      } else {
        line = testLine
      }
    }
    lines.push(line)
    lines.forEach((l, i) => ctx.fillText(l.trim(), x, y + i * lineHeight))
    return y + lines.length * lineHeight
  }

  let endY = wrapText(ctx, quote, 540, 160, 440, 40)

  ctx.font = '24px sans-serif'
  ctx.fillText(`— ${nama}`, 540, endY + 10)

  ctx.font = '20px sans-serif'
  ctx.fillStyle = '#aaa'
  ctx.fillText(tag, 540, endY + 40)

  const buffer = canvas.toBuffer('image/png')

  await fukusima.sendMessage(
    m.chat,
    { image: buffer, caption: '' },
    { quoted: m }
  )
}

handler.help = ['stylekata']
handler.tags = ['maker']
handler.command = ['stylekata']
handler.register = true
export default handler