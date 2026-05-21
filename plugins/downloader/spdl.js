import fetch from "node-fetch"

let handler = async (m, { fukusima, text, command }) => {
    if (!text)
        return m.reply(`ᴄᴏɴᴛᴏʜ:\n.${command} https://open.spotify.com/track/xxxxx`)

m.reply(`memproses ${text}`)
    if (!text.includes("open.spotify.com"))
        return m.reply("ʟɪɴᴋ sᴘᴏᴛɪғʏ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ")

    let res = await fetch(
        `https://api.vreden.my.id/api/v1/download/spotify?url=${encodeURIComponent(text)}`
    )
    let json = await res.json()

    if (!json.status || !json.result?.download)
        return m.reply("ɢᴀɢᴀʟ ᴍᴇɴɢᴀᴍʙɪʟ ᴀᴜᴅɪᴏ")

    let lagu = json.result

    let caption =
`🎶 *sᴘᴏᴛɪғʏ ᴅᴏᴡɴʟᴏᴀᴅ*

• ᴊᴜᴅᴜʟ : ${lagu.title}
• ᴀʀᴛɪs : ${lagu.artists}
• ᴀʟʙᴜᴍ : ${lagu.album}
• ʀɪʟɪs : ${lagu.release_date}`

    await fukusima.sendMessage(m.chat, {
        audio: { url: lagu.download },
        mimetype: "audio/mpeg",
        fileName: `${lagu.title}.mp3`,
        contextInfo: {
            externalAdReply: {
                title: lagu.title,
                body: lagu.artists,
                thumbnailUrl: lagu.cover_url,
                mediaType: 1,
                renderLargerThumbnail: true,
                sourceUrl: text
            }
        }
    }, { quoted: m })

    await m.reply(caption)
}

handler.command = ["spdl", "spotifydl"]
handler.tags = ["downloader"]
handler.help = ["spdl <link spotify>"]
handler.limit = true
handler.register = true

export default handler