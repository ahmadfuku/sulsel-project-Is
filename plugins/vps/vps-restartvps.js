import fetch from 'node-fetch'

let handler = async (m, { args }) => {
    let dropletId = args[0]
    if (!dropletId) return m.reply('ID droplet belum diberikan!')

    const restartVPS = async (id) => {
        try {
            const res = await fetch(`https://api.digitalocean.com/v2/droplets/${id}/actions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${global.doToken}`
                },
                body: JSON.stringify({ type: 'reboot' })
            })

            if (!res.ok) {
                const err = await res.json()
                return new Error(`Gagal merestart VPS: ${err.message}`)
            }

            const data = await res.json()
            return data.action?.status || 'unknown'
        } catch {
            return new Error('Terjadi kesalahan saat merestart VPS.')
        }
    }

    let hasil = await restartVPS(dropletId)
    m.reply(hasil instanceof Error ? hasil.message : `Restart VPS dimulai. Status: ${hasil}`)
}

handler.help = ['restartvps <id>']
handler.tags = ['vps']
handler.command = /^restartvps$/i
handler.owner = true
export default handler