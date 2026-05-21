import fetch from "node-fetch"
import { spawn } from "child_process"
import fs from "fs"

function ffmpeg(buffer, args = [], ext = '', ext2 = '') {
  return new Promise((resolve, reject) => {
    try {
      const tmp = `./tmp_${Date.now()}.${ext}`
      const out = `./tmp_${Date.now()}.${ext2}`

      fs.writeFileSync(tmp, buffer)

      const process = spawn('ffmpeg', ['-y','-i',tmp,...args,out])

      process.on('close', () => {
        const buff = fs.readFileSync(out)
        fs.unlinkSync(tmp)
        fs.unlinkSync(out)
        resolve(buff)
      })

    } catch (e) {
      reject(e)
    }
  })
}

async function toAudio(buffer, ext) {
  try {
    const audio = await ffmpeg(buffer, [
      '-vn',
      '-ac','2',
      '-b:a','128k',
      '-ar','44100',
      '-f','mp3'
    ], ext, 'mp3')
    return audio
  } catch {
    return buffer
  }
}

async function fukuYtmp3(url) {
  try {
    const apiKey = global.apifuku
    if (!apiKey) return { status:false }
    const endpoint = `https://api.fukugpt.my.id/api/ytmp3?api=${encodeURIComponent(apiKey)}&url=${encodeURIComponent(url)}`
    const res = await fetch(endpoint)
    return await res.json()
  } catch {
    return { status:false }
  }
}

let handler = async (m, { fukusima, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix+command} https://youtu.be/xxxx`)

  const res = await fukuYtmp3(text)
  if (!res?.status) return m.reply("Gagal mengambil audio")

  const result = res.result
  if (!result?.download) return m.reply("Audio tidak ditemukan")

  const title = result.title || "audio"
  m.reply("Processing audio...")

  try {
    const get = await fetch(result.download)
    const buff = await get.buffer()
    const mp3 = await toAudio(buff, "mp4")

    await fukusima.sendMessage(m.chat, {
      audio: mp3,
      mimetype: "audio/mpeg",
      fileName: title + ".mp3",
      ptt: false
    }, { quoted:m })

  } catch (e) {
    m.reply("Gagal kirim audio")
  }
}

handler.help = ["ytmp3","ytaudio"]
handler.tags = ["downloader"]
handler.command = /^(ytmp3|ytaudio)$/i

export default handler