import fs from "fs"
import { exec } from "child_process"

let handler = async (m, { fukusima, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ""

    if (!mime.startsWith("video/")) {
        return m.reply(
            `ᴋɪʀɪᴍ / ʀᴇᴘʟʏ ᴠɪᴅᴇᴏ\n\nғᴏʀᴍᴀᴛ ʏᴀɴɢ ᴅɪᴅᴜᴋᴜɴɢ:\n• MP4, MOV, AVI, MKV\n• WEBM, 3GP, WMV, FLV\n\nᴄᴏɴᴛᴏʜ ᴘᴇɴɢɢᴜɴᴀᴀɴ:\n${usedPrefix + command} (reply video)\nᴀᴛᴀᴜ\n${usedPrefix + command} (kirim video langsung)`
        )
    }

    await m.reply("ᴍᴇɴɢᴏᴘᴛɪᴍᴀʟᴋᴀɴ ᴠɪᴅᴇᴏ ᴋᴇ ʜᴅ ᴍᴀᴋsɪᴍᴜᴍ...")

    let input = `input-${Date.now()}.mp4`
    let output = `output-${Date.now()}.mp4`

    try {
        let buffer = await q.download()
        fs.writeFileSync(input, buffer)

        await new Promise((resolve, reject) => {
          exec(
    `ffmpeg -y -i ${input} \
    -vf "scale=if(gt(a\\,16/9)\\,1920\\,-2):if(gt(a\\,16/9)\\,-2\\,1080), \
    unsharp=3:3:1.0, \
    format=yuv420p10le" \
    -c:v libx264 \
    -profile:v high10 \
    -level 5.1 \
    -pix_fmt yuv420p10le \
    -preset slower \
    -crf 14 \
    -x264-params "aq-mode=3:aq-strength=1.0:psy-rd=1.0:psy-rdoq=2.0:deblock=1,1" \
    -b:v 10M \
    -maxrate 15M \
    -bufsize 20M \
    -g 60 \
    -keyint_min 60 \
    -sc_threshold 0 \
    -movflags +faststart \
    -c:a aac \
    -b:a 320k \
    -ar 48000 \
    -ac 2 \
    ${output}`,
    (err) => (err ? reject(err) : resolve())
)
        })

        let outBuffer = fs.readFileSync(output)
        let fileSize = formatBytes(outBuffer.length)
        let videoDuration = (q.msg || q).seconds || 0

        await fukusima.sendMessage(m.chat, {
            video: outBuffer,
            caption: `ᴠɪᴅᴇᴏ ʜᴅ - ᴋᴜᴀʟɪᴛᴀs ᴏᴘ\n\nɪɴғᴏʀᴍᴀsɪ:\n• ᴅᴜʀᴀsɪ: ${videoDuration ? `${videoDuration} ᴅᴇᴛɪᴋ` : "-"}\n• ᴜᴋᴜʀᴀɴ: ${fileSize}\n• ғᴏʀᴍᴀᴛ: video/mp4\n\nᴠɪᴅᴇᴏ ᴛᴇʟᴀʜ ᴅɪᴜᴘsᴄᴀʟᴇ + ʀᴇ-ᴇɴᴄᴏᴅᴇ ʜᴅ`,
            mimetype: "video/mp4",
            fileName: `video-hd-${Date.now()}.mp4`,
            quoted: m
        })

        fs.unlinkSync(input)
        fs.unlinkSync(output)

    } catch (error) {
        console.error("Error processing video:", error)

        try {
            if (fs.existsSync(input)) fs.unlinkSync(input)
            if (fs.existsSync(output)) fs.unlinkSync(output)
        } catch {}

        await m.reply("ɢᴀɢᴀʟ ᴍᴇɴɢᴜᴘɢʀᴀᴅᴇ ᴠɪᴅᴇᴏ")
    }
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

handler.help = ["hdvid", "hdvideo", "videohq", "qualityup"]
handler.tags = ["tools"]
handler.command = /^(hdvid|hdvideo|videohd|hqvid|qualityvid|enhancevideo|videohq|qualityup)$/i
handler.register = true
handler.limit = true
handler.premium = false

export default handler