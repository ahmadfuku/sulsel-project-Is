import fetch from 'node-fetch'

let handler = async (m, { fukusima }) => {
    try {
        const response = await fetch('https://api.linode.com/v4/linode/instances', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${global.linodeToken}`
            }
        })

        const json = await response.json()

        if (response.ok) {
            let msg = 'Daftar Linode VPS:\n\n'
            json.data.forEach(v => {
                msg += `ID: ${v.id}\n`
                msg += `Label: ${v.label}\n`
                msg += `IP: ${v.ipv4[0]}\n\n`
            })

            fukusima.reply(m.chat, msg.trim(), m)
        } else {
            throw new Error('Gagal mendapatkan daftar Linode.')
        }

    } catch (err) {
        m.reply(`Terjadi kesalahan saat mendapatkan daftar Linode: ${err}`)
    }
}

handler.help = ['listlinode']
handler.tags = ['linode', 'vps']
handler.command = /^listlinode$/i
handler.owner = true
export default handler