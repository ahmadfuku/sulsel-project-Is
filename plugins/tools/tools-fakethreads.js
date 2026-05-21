import axios from "axios"
import FormData from "form-data"

async function Uguu(buffer, filename) {
  const form = new FormData()
  form.append("files[]", buffer, { filename })
  const { data } = await axios.post("https://uguu.se/upload.php", form, {
    headers: form.getHeaders()
  })
  if (!data.files || !data.files[0]) throw new Error("Upload gagal")
  return data.files[0].url
}

let handler = async (m, { text, fukusima }) => {
  try {
    if (!m.quoted) return m.reply("Reply gambar buat avatar")
    if (!text) return m.reply("Format:\n.faketh nama|teks|like")

    const [username, teks, like] = text.split("|")
    if (!username || !teks || !like)
      return m.reply("Format salah.\n.faketh nama|teks|like")

    const q = m.quoted
    const mime = (q.msg || q).mimetype || ""
    if (!mime.startsWith("image/"))
      return m.reply("Avatar harus gambar")

    const buffer = await q.download()
    const ext = mime.split("/")[1]
    const avatarUrl = await Uguu(buffer, `avatar.${ext}`)

    const api = `https://api.elrayyxml.web.id/api/maker/fakethreads?username=${encodeURIComponent(username.trim())}&avatar=${encodeURIComponent(avatarUrl)}&text=${encodeURIComponent(teks.trim())}&count_like=${encodeURIComponent(like.trim())}`

    const res = await axios.get(api, { responseType: "arraybuffer" })

    await fukusima.sendMessage(
      m.chat,
      {
        image: Buffer.from(res.data),
        caption: `By ${username.trim()}`
      },
      { quoted: m }
    )

  } catch (e) {
    m.reply("Error: " + e.message)
  }
}

handler.help = ["faketh"]
handler.tags = ["tools"]
handler.command = ["faketh"]
handler.register = true
handler.limit = true
export default handler