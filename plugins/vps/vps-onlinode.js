import fetch from 'node-fetch'

let handler = async (m, { fukusima, args }) => {
    const linodeId = args[0]
    if (!linodeId) return m.reply('Masukkan ID Linode.\n\nContoh:\n.onlinode 12345678')

    try {
        const response = await fetch(`https://api.linode.com/v4/linode/instances/${linodeId}/boot`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${global.linodeToken}`
            }
        })

        if (response.ok) {
            return m.reply(`Linode dengan ID ${linodeId} berhasil dihidupkan.`)
        } else {
            const error = await response.json()
            throw new Error(error.errors?.[0]?.reason || 'Unknown Error')
        }

    } catch (err) {
        m.reply(`Terjadi kesalahan saat menghidupkan Linode: ${err}`)
    }
}

handler.help = ['onlinode']
handler.tags = ['linode', 'vps']
handler.command = /^onlinode$/i
handler.owner = true

export default handler