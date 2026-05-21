import fs from "fs"
import os from "os"
import path from "path"
import fetch from "node-fetch"
import ffmpeg from "fluent-ffmpeg"
import ffmpegPath from "ffmpeg-static"
import { fileTypeFromBuffer } from "file-type"

ffmpeg.setFfmpegPath(ffmpegPath)

async function urlToVn(fukusima, m, url) {
  try {
    const res = await fetch(url)
    const media = await res.buffer()
    if (!media || media.length === 0) throw new Error("Buffer kosong")
    const tmpDir = path.join(os.tmpdir(), 'tmp')
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true })
    }

    const ft = await fileTypeFromBuffer(media)
    const mime = ft ? ft.mime : "audio/mpeg"
    const timestamp = Date.now()
    const inputPath = path.join(tmpDir, `input_${timestamp}.${mime.includes("mp3") ? "mp3" : "tmp"}`)
    fs.writeFileSync(inputPath, media)
    if (mime === "audio/ogg" || mime === "audio/ogg; codecs=opus") {
      await fukusima.sendMessage(
        m.chat,
        { audio: media, mimetype: "audio/ogg; codecs=opus", ptt: true },
        { quoted: m }
      )
      fs.unlinkSync(inputPath)
      return
    }
    const outputPath = path.join(tmpDir, `output_${timestamp}.opus`)
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .inputOptions(['-y']) 
        .audioCodec("libopus")
        .audioChannels(1)
        .audioFrequency(48000)
        .format("opus")
        .outputOptions([
          '-application voip',
          '-compression_level 10',
          '-frame_duration 60',
          '-vbr on'
        ])
        .on("start", (cmd) => console.log("FFmpeg command:", cmd))
        .on("error", (err) => {
          console.error("FFmpeg error:", err)
          reject(err)
        })
        .on("end", () => {
          console.log("FFmpeg conversion finished")
          resolve()
        })
        .save(outputPath)
    })
    const buffer = fs.readFileSync(outputPath)
    if (!buffer || buffer.length === 0) {
      throw new Error("Buffer output kosong")
    }
    await fukusima.sendMessage(
      m.chat,
      {
        audio: buffer,
        mimetype: "audio/ogg; codecs=opus",
        ptt: true
      },
      { quoted: m }
    )
    try {
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath)
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath)
    } catch (cleanupErr) {
      console.error("Cleanup error:", cleanupErr)
    }
    
  } catch (e) {
    console.error("urlToVn error:", e)
    m.reply("VN error: " + e.message)
  }
}

let handler = async (m, { fukusima }) => {
  let user = global.db.data.users[m.sender]

  if (!user.tiktok) {
    user.tiktok = {
      follower: 0,
      like: 0,
      view: 0,
      rating: 3.0
    }
  }
  let tt = user.tiktok
  let delay = ms => new Promise(r => setTimeout(r, ms))
  const kontenRandom = [
    "https://d.uguu.se/CLUWEjGk.mpeg",
    "https://n.uguu.se/AWznaJwL.mpeg",
    "https://o.uguu.se/WWKuzphe.mpeg"
  ]
  const kamuMarah = "https://o.uguu.se/bTpbEZVj.mpeg"

  const komentarBagus = [
    "Kontennya menarik woi lah",
    "anjay masuk fyp",
    "bang jangan berhenti konten",
    "ini sih real",
    "asli ngakak",
    "real or ai:v"
  ]

  const komentarHujat = [
    "apaan sih gajelas anj",
    "konten sampah",
    "kok bisa fyp sih njir di gw",
    "hapus akun aja kak. Muak banget liat nya",
    "laporin rame rame"
  ]

  const komentarLanjutan = [
    "apaan njir lebay banget",
    "baru dikit followers udah songong",
    "klarifikasi kok makin aneh anj",
    "baru klarifikasi kalau dah salah. Orang Dongo",
    "lah bukan kah ini si priaa..."
  ]

  let sukses = Math.random() > 0.45
  let konten = kontenRandom[Math.floor(Math.random() * kontenRandom.length)]

  await fukusima.reply(m.chat, "ᴋᴀᴍᴜ sᴇᴅᴀɴɢ ᴍᴇᴍɪᴋɪʀᴋᴀɴ ɪᴅᴇ ᴋᴏɴᴛᴇɴ.", m)
  await delay(1000)

  await fukusima.reply(m.chat, "ᴋᴀᴍᴜ sᴇʟᴇsᴀɪ ʙᴇʀғɪᴋɪʀ. ᴅᴀɴ ᴍᴇɴɢᴜᴘʟᴏᴀᴅ ɴʏᴀ ᴅɪ ᴛɪᴋᴛᴏᴋ", m)
  await delay(1200)

  await urlToVn(fukusima, m, konten)

  await delay(1500)
  await fukusima.reply(m.chat, "👀 ᴠɪᴅᴇᴏ ᴍᴜ ᴛɪʙᴀ ᴛɪʙᴀ ᴅɪʟɪʜᴀᴛ ʙᴀɴʏᴀᴋ ɴᴇᴛɪᴢᴇɴ", m)
  await delay(1200)

  if (sukses) {
    let addFollow = Math.floor(Math.random() * 120) + 30
    let addLike = Math.floor(Math.random() * 400) + 200
    let addView = Math.floor(Math.random() * 15000) + 8000

    tt.follower += addFollow
    tt.like += addLike
    tt.view += addView
    tt.rating = Math.min(5, tt.rating + Math.random() * 0.4).toFixed(1)

    await fukusima.reply(
      m.chat,
      `💬 "${komentarBagus[Math.floor(Math.random() * komentarBagus.length)]}"`,
      m
    )

    return fukusima.reply(
      m.chat,
      `- *ᴠɪᴅᴇᴏ ᴋᴀᴍᴜ ᴠɪʀᴀʟ*\n\n👥 ᴘᴇɴɢɪᴋᴜᴛ ʙᴀʀᴜ +${addFollow}\n❤️ sᴜᴋᴀ +${addLike}\n👀 ᴠɪᴇᴡ +${addView}\nʀᴀᴛɪɴɢ: ${tt.rating}`,
      m
    )
  }

  tt.like += 10
  tt.view += Math.floor(Math.random() * 30000) + 15000
  tt.rating = Math.max(1, tt.rating - 0.5).toFixed(1)

  await fukusima.reply(
    m.chat,
    `💬 "${komentarHujat[Math.floor(Math.random() * komentarHujat.length)]}"`,
    m
  )

  await delay(800)
  await fukusima.reply(m.chat, "🚨 *ᴘᴇʀɪɴɢᴀᴛᴀɴ:* ᴋᴀᴍᴜ ᴛᴇʟᴀʜ ᴍᴇʟᴀᴋᴜᴋᴀɴ ᴋᴇsᴀʟᴀʜᴀɴ ᴜᴄᴀᴘᴀɴ ᴅɪ ᴠɪᴅᴇᴏ ᴋᴀᴍᴜ.", m)

await delay(1000)
await fukusima.sendMessage(m.chat, {
  image: { url: 'https://cloud-fukushima.vercel.app/uploader/0686no93r2.jpg' },
  caption: `- *ᴋᴀᴍᴜ:* 😭 ɢᴡ sᴀʟᴀʜ ᴀᴘᴀ sɪʜ ᴄᴏᴋ ᴊᴀʜᴀᴛ ʙᴀɴɢᴇᴛ sɪʜ.`
})
  await delay(1000)
  await fukusima.reply(m.chat, "ᴋᴀᴍᴜ ᴅɪsᴜʀᴜʜ ᴍᴇᴍʙᴜᴀᴛ ᴠɪᴅᴇᴏ ᴋʟᴀʀɪғɪᴋᴀsɪ", m)

await delay(1000)
await fukusima.sendMessage(m.chat, {
  image: { url: 'https://cloud-fukushima.vercel.app/uploader/oo4stgrtd7.jpg' }
})

await delay(1000)
  await fukusima.reply(m.chat, "- *ᴋᴀᴍᴜ:* ᴍᴀᴀғ ʏᴀ ᴛᴇᴍᴇɴ ᴛᴇᴍᴇɴ 😭 ɢᴡ ɢᴀᴋ ᴀᴅᴀ ʙᴇʀᴍᴀᴋsᴜᴅ ᴍᴇʀᴜsᴀᴋ sᴜᴀsᴀɴᴀ🥺", m)


  await delay(800)
  await urlToVn(fukusima, m, kamuMarah)

  await delay(1200)
  await fukusima.reply(
    m.chat,
    `ɴᴇᴛɪᴢᴇɴ: "${komentarLanjutan[Math.floor(Math.random() * komentarLanjutan.length)]}"`,
    m
  )

  fukusima.reply(
    m.chat,
    `ᴠɪᴅᴇᴏ ᴋᴀᴍᴜ ᴍᴇɴᴜʀᴜɴ\n\n👥 ᴘᴇɴɢɪᴋᴜᴛ +0\n❤️ sᴜᴋᴀ +10\n👀 ᴠɪᴇᴡ: ᴛᴀᴜ sᴇɴᴅɪʀɪ ʏᴀ ᴋᴀɴ\n⭐ ʀᴀᴛɪɴɢ ${tt.rating}`,
    m
  )
}

handler.help = ["tiktokers"]
handler.tags = ["rpg"]
handler.command = ["tiktokers"]
handler.register = true
export default handler