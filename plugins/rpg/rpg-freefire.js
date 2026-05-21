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

    const tmpDir = path.join(os.tmpdir(), "tmp")
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

    const ft = await fileTypeFromBuffer(media)
    const mime = ft ? ft.mime : "audio/mpeg"
    const timestamp = Date.now()

    const inputPath = path.join(
      tmpDir,
      `input_${timestamp}.${mime.includes("mp3") ? "mp3" : "tmp"}`
    )

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
        .audioCodec("libopus")
        .audioChannels(1)
        .audioFrequency(48000)
        .format("opus")
        .outputOptions([
          "-application voip",
          "-compression_level 10",
          "-frame_duration 60",
          "-vbr on"
        ])
        .on("error", reject)
        .on("end", resolve)
        .save(outputPath)
    })

    const buffer = fs.readFileSync(outputPath)
    if (!buffer || buffer.length === 0) throw new Error("Buffer output kosong")

    await fukusima.sendMessage(
      m.chat,
      {
        audio: buffer,
        mimetype: "audio/ogg; codecs=opus",
        ptt: false
      },
      { quoted: m }
    )

    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath)
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath)

  } catch (e) {
    console.error(e)
    m.reply("VN error")
  }
}

let handler = async (m, { fukusima }) => {
  let user = global.db.data.users[m.sender]

  if (!user.ff) {
    user.ff = {
      level: 1,
      exp: 0,
      kill: 0,
      rank: "Bronze",
      match: 0,
      win: 0,
      lose: 0
    }
  }

  let ff = user.ff
  let delay = ms => new Promise(r => setTimeout(r, ms))

  const kalahEpep = "https://d.uguu.se/xgbNHDth.mpeg"
  const menang = "https://cloud-fukushima.vercel.app/uploader/fx4gkpbedu.mp4"
  const main = [
    "https://cloud-fukushima.vercel.app/uploader/ira1s802xg.mp4",
    "https://cloud-fukushima.vercel.app/uploader/qgnu05ind9.mp4"
  ]

  const rankList = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Heroic", "Grandmaster"]

  let isWin = Math.random() > 0.45
  let kills = Math.floor(Math.random() * 8) + 1
  let expGain = kills * 18

  ff.match++

  await fukusima.reply(m.chat, "ᴋᴀᴍᴜ ᴍᴀsᴜᴋ ᴍᴀᴛᴄʜ ғʀᴇᴇ ғɪʀᴇ...", m)
  await delay(1200)

  await fukusima.sendMessage(m.chat, {
    video: { url: main[Math.floor(Math.random() * main.length)] },
    caption: "ᴍᴏᴅᴇ ʙᴀɴᴛᴀɪ😜😝"
  })

  await delay(1500)

  ff.kill += kills
  ff.exp += expGain

  while (ff.exp >= ff.level * 120) {
    ff.exp -= ff.level * 120
    ff.level++
  }

  if (isWin) {
    ff.win++
    if (ff.rank !== "Grandmaster") {
      ff.rank = rankList[Math.min(rankList.indexOf(ff.rank) + 1, rankList.length - 1)]
    }

    await fukusima.sendMessage(m.chat, {
      video: { url: menang },
      caption: "- *ɪɴғᴏ sᴇᴍᴜᴀ ʀᴀᴛᴀ ʏɢʏ😎*"
    }, { quoted: m })

    await delay(1200)

    return fukusima.reply(
      m.chat,
      `- *ʜᴀsɪʟ ᴘᴇʀᴍᴀɪɴᴀɴ*\n\n🔥 sᴛᴀᴛᴜs: *ʙᴏʏᴀᴀʜ*\nᴋɪʟʟ: +${kills}\nᴇxᴘ : +${expGain}\nʟᴇᴠᴇʟ : ${ff.level}\nʀᴀɴᴋ : ${ff.rank}`,
      m
    )
  }

  ff.lose++
  if (rankList.indexOf(ff.rank) > 0) {
    ff.rank = rankList[rankList.indexOf(ff.rank) - 1]
  }

  await fukusima.sendMessage(m.chat, {
  audio: { url: 'https://d.uguu.se/xgbNHDth.mpeg' },
  mimetype: 'audio/mpeg'
})

  await delay(1200)

  fukusima.reply(
    m.chat,
    `💀 *ʜᴀsɪʟ ᴘᴇʀᴍᴀɪɴᴀɴ*\n\nsᴛᴀᴛᴜs : *ᴋᴀʟᴀʜ*\nᴋɪʟʟ : ${kills}\nᴇxᴘ : +${expGain}\nʟᴇᴠᴇʟ : ${ff.level}\nʀᴀɴᴋ : ${ff.rank}`,
    m
  )
}

handler.help = ["freefire", "ff", "epep"]
handler.tags = ["rpg"]
handler.command = ["freefire", "ff", "epep"]
handler.register = true
export default handler