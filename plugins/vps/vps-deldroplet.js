import fetch from 'node-fetch'

let handler = async (m, { args }) => {
    let id = args[0]
    if (!id) return m.reply('ID droplet belum diberikan!')

    try {
        let res = await fetch(`https://api.digitalocean.com/v2/droplets/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${global.doToken}`
            }
        })

        if (res.ok) return m.reply('Droplet berhasil dihapus!')
        
        let err = await res.json()
        return m.reply(`Gagal menghapus droplet: ${err.message}`)

    } catch (e) {
        return m.reply('Terjadi kesalahan saat menghapus droplet.')
    }
}

handler.help = ['deldroplet <id>']
handler.tags = ['vps']
handler.command = /^deldroplet$/i
handler.owner = true
export default handler