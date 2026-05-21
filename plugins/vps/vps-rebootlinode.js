import fetch from 'node-fetch'

let handler = async (m, { fukusima, args }) => {
    const linodeId = args[0]
    if (!linodeId) return m.reply('Masukkan ID Linode.\n\nContoh:\n.rebootlinode 12345678')

    try {
        const response = await fetch(`https://api.linode.com/v4/linode/instances/${linodeId}/reboot`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${global.linodeToken}`
            }
        })

        if (response.ok) {
            return m.reply(`Linode dengan ID ${linodeId} berhasil di-restart.`)
        } else {
            const errData = await response.json()
            throw new Error(errData.errors?.[0]?.reason || 'Unknown Error')
        }

    } catch (err) {
        m.reply(`Terjadi kesalahan saat me-restart Linode: ${err}`)
    }
}

handler.help = ['rebootlinode']
handler.tags = ['owner', 'vps', 'linode']
handler.command = /^rebootlinode$/i
handler.owner = true
export default handler