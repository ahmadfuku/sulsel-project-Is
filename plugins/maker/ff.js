import { createCanvas, loadImage } from 'canvas'

let handler = async (m, { fukusima, text }) => {
if (!text) return m.reply(`Contoh: .flobyff AhmadXyz`)

await m.reply('*Sek bentar..*')

try {

const nickname = text.trim()

const images = [
'https://www.fuku-cloud.my.id/upload/2270_1755567680240.jpeg',
'https://www.fuku-cloud.my.id/upload/8316_1755571031099.jpeg',
'https://www.fuku-cloud.my.id/upload/4996_1755574342175.jpeg',
'https://www.fuku-cloud.my.id/upload/3367_1755574517037.jpeg',
'https://www.fuku-cloud.my.id/upload/4745_1755574612938.jpeg',
'https://www.fuku-cloud.my.id/upload/5609_1755574717210.jpeg',
'https://www.fuku-cloud.my.id/upload/272_1755574832037.jpeg'
]

for (let i = 0; i < images.length; i++) {

const bg = await loadImage(images[i])
const canvas = createCanvas(bg.width, bg.height)
const ctx = canvas.getContext('2d')

ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)

ctx.font = `16px Arial`
ctx.fillStyle = '#ffffff'
ctx.textAlign = 'center'

const textX = canvas.width / 2
const textY = canvas.height - 249

ctx.fillText(nickname, textX, textY)

const buffer = canvas.toBuffer('image/png')

await fukusima.sendMessage(m.chat, {
image: buffer,
caption: `*Lobby FF Selesai Nick:* ${nickname}`
}, { quoted: m })

if (i < images.length - 1)
await new Promise(r => setTimeout(r, 2000))
}

await fukusima.sendMessage(m.chat, {
text: '*Dah tuh masuk ke capcut sana JJ In*'
}, { quoted: m })

} catch (e) {
m.reply('Error: ' + e.message)
}
}

handler.command = ['flobyff', 'lobyff']
handler.tags = ['maker']
handler.help = ['flobyff *teks*']

export default handler