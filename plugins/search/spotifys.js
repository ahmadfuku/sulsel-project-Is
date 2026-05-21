import fetch from "node-fetch"
import { sendInteractiveMessage } from "buttons-warpper"

let handler = async (m, { fukusima, text, command }) => {
    if (!text) return m.reply(`ᴄᴏɴᴛᴏʜ:\n.${command} sᴇʀᴀɴᴀ`)

    let res = await fetch(
        `https://api.vreden.my.id/api/v2/search/spotify?query=${encodeURIComponent(text)}`
    )
    let json = await res.json()

    if (!json.status || !json.result?.search_data?.[0])
        return m.reply("ʟᴀɢᴜ ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ")

    let lagu = json.result.search_data[0]

    await sendInteractiveMessage(fukusima, m.chat, {
        text:
`🎧 *sᴘᴏᴛɪғʏ ғᴏᴜɴᴅ*

• ᴊᴜᴅᴜʟ : ${lagu.name}
• ᴀʀᴛɪs : ${lagu.artist}
• ᴀʟʙᴜᴍ : ${lagu.album}
• ᴅᴜʀᴀsɪ : ${lagu.duration}`,
        footer: "sᴘᴏᴛɪғʏ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ",
        interactiveButtons: [
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "⬇️ ᴅᴏᴡɴʟᴏᴀᴅ ᴀᴜᴅɪᴏ",
                    id: `.spdl ${lagu.song_link}`
                })
            }
        ]
    })
}

handler.command = ["spotifys", "spotifysearch"]
handler.tags = ["search"]
handler.help = ["spotifys"]
handler.register = true
handler.limit = true

export default handler