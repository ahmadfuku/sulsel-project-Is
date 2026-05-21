import fetch from 'node-fetch'

let handler = async (m, { args }) => {
    const linodeId = args[0]
    if (!linodeId) return m.reply(`Masukkan ID VPS.\n\nContoh:\n.cekvpslinode 12345678`)

    try {
        const response = await fetch(`https://api.linode.com/v4/linode/instances/${linodeId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${global.linodeToken}`
            }
        })

        const json = await response.json()

        if (response.ok) {
            let txt = `Detail Linode:\n\n`
            txt += `ID: ${json.id}\n`
            txt += `Label: ${json.label}\n`
            txt += `Status: ${json.status}\n`
            txt += `Region: ${json.region}\n`
            txt += `Type: ${json.type}\n`
            txt += `IP: ${json.ipv4.join(', ')}\n`

            return m.reply(txt)
        } else {
            throw new Error('Gagal mendapatkan detail Linode.')
        }

    } catch (err) {
        return m.reply(`Terjadi kesalahan saat memeriksa detail Linode: ${err}`)
    }
}

handler.help = ['cekvpslinode']
handler.tags = ['linode', 'vps']
handler.command = /^cekvpslinode$/i

export default handler