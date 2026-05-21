import axios from "axios"
import FormData from "form-data"
import { fileTypeFromBuffer } from "file-type"
import fetch from "node-fetch"
import {
  prepareWAMessageMedia,
  generateWAMessageFromContent,
  proto
} from "baileys"

let handler = async (m, { fukusima }) => {
  if (!m.quoted) return m.reply("Reply media")

  try {
    const q = m.quoted
    const mime = (q.msg || q).mimetype || ""
    if (!mime) return m.reply("Media tidak terdeteksi")

    const media = await q.download()
    if (!media) return m.reply("Media kosong")

    const ft = await fileTypeFromBuffer(media)
    if (!ft) return m.reply("File tidak dikenali")

    await fukusima.sendMessage(m.chat, {
      react: { text: "〽️", key: m.key }
    })

    let thumbMedia = null

    if (mime.startsWith("image/")) {
      thumbMedia = await prepareWAMessageMedia(
        { image: media },
        { upload: fukusima.waUploadToServer }
      )
    } else if (
      (mime.startsWith("audio/") || mime.startsWith("video/")) &&
      global.thumb
    ) {
      thumbMedia = await prepareWAMessageMedia(
        { image: { url: global.thumb } },
        { upload: fukusima.waUploadToServer }
      )
    }

    const results = {}

    const tryUpload = async fn =>
      Promise.race([
        fn(),
        new Promise(r => setTimeout(() => r(null), 30000))
      ])

    results.TMPFiles = await tryUpload(async () => {
      try {
        const form = new FormData()
        form.append("file", media, {
          filename: `${Date.now()}.${ft.ext}`,
          contentType: ft.mime
        })
        const r = await axios.post("https://tmpfiles.org/api/v1/upload", form, {
          headers: form.getHeaders()
        })
        return r.data?.data?.url?.replace("tmpfiles.org/", "tmpfiles.org/dl/")
      } catch {
        return null
      }
    })

    results.Uguu = await tryUpload(async () => {
      try {
        const form = new FormData()
        form.append("files[]", media, "upload")
        const r = await axios.post("https://uguu.se/upload.php", form, {
          headers: form.getHeaders()
        })
        return r.data?.files?.[0]?.url
      } catch {
        return null
      }
    })

    results.Catbox = await tryUpload(async () => {
      try {
        const form = new FormData()
        form.append("reqtype", "fileupload")
        form.append("fileToUpload", media, `file.${ft.ext}`)
        const r = await fetch("https://catbox.moe/user/api.php", {
          method: "POST",
          body: form
        })
        const t = await r.text()
        return t.startsWith("https") ? t.trim() : null
      } catch {
        return null
      }
    })

    results.FukuCloud = await tryUpload(async () => {
      try {
        const form = new FormData()
        form.append("file", media, {
          filename: `file.${ft.ext}`,
          contentType: ft.mime
        })
        
        const r = await axios.post(
          "https://uploader.fuku-cloud.my.id/api/upload",
          form,
          {
            headers: {
              ...form.getHeaders(),
              Authorization: "Bearer c68b7e9d7ebaf1058608f238138654962326357349853f8713495ce765365915"
            },
            maxBodyLength: Infinity,
            maxContentLength: Infinity
          }
        )
        
        const data = r.data
        
        if (data.success && data.shortUrl) {
          return data.shortUrl
        } else if (data.success && data.url) {
          return data.url
        } else if (data.downloadUrl) {
          return data.downloadUrl
        }
        
        return null
      } catch (error) {
        console.error("Fuku Cloud error:", error.message)
        return null
      }
    })

    results.Telegraph = await tryUpload(async () => {
      try {
        const form = new FormData()
        form.append("file", media)
        
        const r = await axios.post("https://telegra.ph/upload", form, {
          headers: form.getHeaders()
        })
        
        const data = r.data
        if (Array.isArray(data) && data[0]?.src) {
          return `https://telegra.ph${data[0].src}`
        }
        return null
      } catch {
        return null
      }
    })

    const successResults = Object.entries(results).filter(([name, url]) => url)
    
    if (!successResults.length) {
      return m.reply("Gagal upload ke semua layanan")
    }

    if (successResults.length === 1) {
      const [name, url] = successResults[0]
      const text = `☁️ *${name.toUpperCase()}*\n\n${url}`
      
      if (thumbMedia) {
        await fukusima.sendMessage(m.chat, {
          image: media,
          caption: text
        }, { quoted: m })
      } else {
        await fukusima.sendMessage(m.chat, {
          text: text
        }, { quoted: m })
      }
    } else {
      const cards = successResults.map(([name, url]) => ({
        body: proto.Message.InteractiveMessage.Body.fromObject({
          text: `☁️ *${name.toUpperCase()}*\n\n${url}`
        }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({
          text: "URL Tools"
        }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
          title: name.toUpperCase(),
          hasMediaAttachment: !!thumbMedia,
          ...(thumbMedia ? { imageMessage: thumbMedia.imageMessage } : {})
        }),
        nativeFlowMessage:
          proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
            buttons: [
              {
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                  display_text: "📋 Salin URL",
                  copy_code: url,
                  id: "copy_url"
                })
              }
            ]
          })
      }))

      const msg = generateWAMessageFromContent(
        m.chat,
        {
          viewOnceMessage: {
            message: {
              interactiveMessage:
                proto.Message.InteractiveMessage.fromObject({
                  body: proto.Message.InteractiveMessage.Body.fromObject({
                    text: `🌐 *UPLOAD TO URL*\n\nBerhasil upload ke ${successResults.length} layanan`
                  }),
                  footer: proto.Message.InteractiveMessage.Footer.fromObject({
                    text: "Multi Uploader • Total: " + successResults.length
                  }),
                  header: proto.Message.InteractiveMessage.Header.fromObject({
                    hasMediaAttachment: false
                  }),
                  carouselMessage:
                    proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                      cards: cards.slice(0, 10)
                    })
                })
            }
          }
        },
        { quoted: m, userJid: fukusima.user.id }
      )

      await fukusima.relayMessage(
        m.chat,
        msg.message,
        { messageId: msg.key.id }
      )
    }

    await fukusima.sendMessage(m.chat, {
      react: { text: "✅", key: m.key }
    })

  } catch (e) {
    console.error(e)
    await fukusima.sendMessage(m.chat, {
      react: { text: "❌", key: m.key }
    })
    m.reply("Error: " + e.message)
  }
}

handler.help = ["tourl"]
handler.tags = ["tools"]
handler.command = /^tourl$/i
handler.register = true

export default handler