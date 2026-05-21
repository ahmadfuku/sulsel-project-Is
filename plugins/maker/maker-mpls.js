import fs from 'fs'
import path from 'path'
import { createCanvas, loadImage } from 'canvas'
import { fileURLToPath } from 'url'
import { fileTypeFromBuffer } from 'file-type'
import { downloadMediaMessage } from 'baileys'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let handler = async (m, { fukusima }) => {
  if (!m.quoted) return m.reply('Reply gambar')
  const q = m.quoted
  const mime = q.mimetype || q.msg?.mimetype || ''
  if (!mime.startsWith('image/')) return m.reply('Hanya mendukung gambar')

  await m.reply('Sedang membuat Twibbon MPLS 2025')

  try {
    let buffer = null
    if (q.download) buffer = await q.download().catch(() => null)
    if (!buffer) buffer = await downloadMediaMessage(q, 'buffer').catch(() => null)
    if (!buffer) return m.reply('Gagal mengambil gambar')

    const fileType = await fileTypeFromBuffer(buffer)
    const ext = fileType ? fileType.ext : 'jpg'

    const fotoUser = await loadImage(buffer)
    const twibbonURL = 'https://files.catbox.moe/783yxh.png'
    const twibbon = await loadImage(twibbonURL)

    const canvas = createCanvas(twibbon.width, twibbon.height)
    const ctx = canvas.getContext('2d')

    const circleX = 600
    const circleY = 533
    const radius = 420

    const aspect = fotoUser.width / fotoUser.height
    let srcX, srcY, srcW, srcH

    if (aspect > 1) {
      srcH = fotoUser.height
      srcW = fotoUser.height
      srcX = (fotoUser.width - srcW) / 2
      srcY = 0
    } else {
      srcW = fotoUser.width
      srcH = fotoUser.width
      srcX = 0
      srcY = (fotoUser.height - srcH) / 2
    }

    ctx.save()
    ctx.beginPath()
    ctx.arc(circleX, circleY, radius, 0, Math.PI * 2)
    ctx.clip()
    ctx.drawImage(
      fotoUser,
      srcX,
      srcY,
      srcW,
      srcH,
      circleX - radius,
      circleY - radius,
      radius * 2,
      radius * 2
    )
    ctx.restore()

    ctx.drawImage(twibbon, 0, 0)
    const out = canvas.toBuffer('image/png')

    await fukusima.sendMessage(
      m.chat,
      { image: out, caption: 'Twibbon MPLS 2025 siap digunakan' },
      { quoted: m }
    )
  } catch (err) {
    m.reply('Gagal membuat Twibbon MPLS: ' + err.message)
  }
}

handler.help = ['mpls']
handler.tags = ['maker']
handler.command = ['mpls']
handler.register = true
export default handler