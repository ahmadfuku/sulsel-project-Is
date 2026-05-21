import fetch from 'node-fetch'

let handler = async (m, { fukusima, args }) => {
    const linodeId = args[0]
    if (!linodeId) return m.reply('Masukkan ID Linode.\n\nContoh:\n.offlinode 12345678')

    try {
        const response = await fetch(`https://api.linode.com/v4/linode/instances/${linodeId}/shutdown`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${global.linodeToken}`
            }
        })

        if (response.ok) {
            return m.reply(`Linode dengan ID ${linodeId} berhasil dimatikan.`)
        } else {
            const errData = await response.json()
            throw new Error(errData.errors?.[0]?.reason || 'Unknown Error')
        }

    } catch (err) {
        m.reply(`Terjadi kesalahan saat mematikan Linode: ${err}`)
    }
}

handler.help = ['offlinode']
handler.tags = ['vps', 'linode']
handler.command = /^offlinode$/i
handler.owner = true
export default handler