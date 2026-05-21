import fetch from 'node-fetch'

let handler = async (m, { args }) => {
    let dropletId = args[0]
    if (!dropletId) return m.reply('ID droplet belum diberikan!')

    const turnOnDroplet = async (id) => {
        try {
            const res = await fetch(`https://api.digitalocean.com/v2/droplets/${id}/actions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${global.doToken}`
                },
                body: JSON.stringify({ type: 'power_on' })
            })

            if (!res.ok) {
                const err = await res.json()
                return new Error(`Gagal menghidupkan VPS: ${err.message}`)
            }

            const data = await res.json()
            if (data.action && data.action.status === 'in-progress') {
                return 'VPS sedang dihidupkan...'
            } else {
                return 'Gagal menghidupkan VPS.'
            }

        } catch {
            return new Error('Terjadi kesalahan saat menghidupkan VPS.')
        }
    }

    let hasil = await turnOnDroplet(dropletId)
    m.reply(hasil instanceof Error ? hasil.message : hasil)
}

handler.help = ['turnon <id>']
handler.tags = ['vps']
handler.command = /^turnon$/i
handler.owner = true
export default handler