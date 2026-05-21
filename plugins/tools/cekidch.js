import { sendInteractiveMessage } from "buttons-warpper"

const handler = async (m, { fukusima, text }) => {
  if (!text) return m.reply(
    "Masukkan link channel WhatsApp\nContoh: .cekidch https://whatsapp.com/channel/xxxx"
  )

  if (!text.includes("https://whatsapp.com/channel/"))
    return m.reply("Link channel tidak valid")

  const invite = text.split("https://whatsapp.com/channel/")[1]

  let res
  try {
    res = await fukusima.newsletterMetadata("invite", invite)
  } catch {
    return m.reply("Gagal mengambil data channel")
  }

  if (!res || !res.id)
    return m.reply("Channel tidak ditemukan atau tidak dapat diakses")

  const caption = `
📢 ᴄᴇᴋ ɪᴅ ᴄʜᴀɴɴᴇʟ

ɴᴀᴍᴀ ${res.name || "-"}
ɪᴅ ${res.id}
ᴘᴇɴɢɪᴋᴜᴛ ${res.subscribers || 0}
sᴛᴀᴛᴜs ${res.state || "-"}
ᴠᴇʀɪғɪᴇᴅ ${res.verification == "VERIFIED" ? "Ya" : "Tidak"}
`

  await sendInteractiveMessage(fukusima, m.chat, {
    text: caption,
    footer: "Channel Tools",
    interactiveButtons: [
      {
        name: "cta_copy",
        buttonParamsJson: JSON.stringify({
          display_text: "📋 Salin ID Channel",
          copy_code: res.id
        })
      }
    ]
  })
}

handler.help = ["cekidch", "idch"]
handler.tags = ["tools"]
handler.command = /^(cekidch|idch)$/i

export default handler