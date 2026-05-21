import { createHash } from 'crypto'

let handler = async function(m) {
    let sn = createHash('md5').update(m.sender).digest('hex')
    m.reply(`*ʏᴏᴜʀ sɴ:* ${sn}`)
}

handler.help = ['ceksn']
handler.tags = ['xp']
handler.command = /^(ceksn)$/i
handler.register = true
export default handler