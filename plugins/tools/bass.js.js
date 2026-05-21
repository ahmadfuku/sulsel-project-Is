import fs from "fs"
import path from "path"
import { exec } from "child_process"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const effects = {
  bass: "-af equalizer=f=54:width_type=o:width=2:g=20",
  blown: "-af acrusher=.1:1:64:0:log",
  deep: "-af atempo=4/4,asetrate=44500*2/3",
  earrape: "-af volume=12",
  fast: '-filter:a "atempo=1.63,asetrate=44100"',
  fat: '-filter:a "atempo=1.6,asetrate=22100"',
  nightcore: "-filter:a atempo=1.06,asetrate=44100*1.25",
  reverse: '-filter_complex "areverse"',
  robot: "-filter_complex \"afftfilt=real='hypot(re,im)*sin(0)':imag='hypot(re,im)*cos(0)':win_size=512:overlap=0.75\"",
  slow: '-filter:a "atempo=0.7,asetrate=44100"',
  smooth: "-filter:v \"minterpolate='mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120'\"",
  tupai: '-filter:a "atempo=0.5,asetrate=65100"',
  echo: '-af "aecho=0.8:0.88:60:0.4"',
  flanger: '-af "flanger"',
  vaporwave: "-filter:a atempo=0.8,asetrate=44100*0.9",
  treble: "-af treble=g=5",
  vibrato: "-af vibrato=f=5",
  distortion: "-af adistort",
  karaoke: "-af stereotools=mlev=0.03",
  chipmunk: '-filter:a "asetrate=22100,atempo=1.5"'
}

let handler = async (m, { fukusima, command, usedPrefix }) => {
  if (!m.quoted) return m.reply("Kutip audio")
  let q = m.quoted
  let mime = q.mimetype || q.msg?.mimetype || ""
  if (!mime.startsWith("audio")) return m.reply("Hanya mendukung audio")

  let set = effects[command]
  if (!set) return m.reply("Filter tidak ditemukan")

  let media = await q.download()
  if (!media) return m.reply("Gagal mengambil audio")

  let input = path.join(__dirname, `in_${Date.now()}.mp3`)
  let output = path.join(__dirname, `out_${Date.now()}.mp3`)

  fs.writeFileSync(input, media)

  exec(`ffmpeg -i ${input} ${set} ${output}`, (err) => {
    fs.unlinkSync(input)
    if (err) return m.reply("Gagal memproses audio")

    let result = fs.readFileSync(output)
    fukusima.sendMessage(m.chat, {
      audio: result,
      mimetype: "audio/mpeg"
    }, { quoted: m })

    fs.unlinkSync(output)
  })
}

handler.help = ['bass','blown','deep','earrape','fast','fat','nightcore','reverse','robot','slow','smooth','tupai','echo','flanger','vaporwave','treble','vibrato','distortion','karaoke','chipmunk']
handler.tags = ['tools']
handler.command = /^(bass|blown|deep|earrape|fast|fat|nightcore|reverse|robot|slow|smooth|tupai|echo|flanger|vaporwave|treble|vibrato|distortion|karaoke|chipmunk)$/i
handler.register = true
export default handler