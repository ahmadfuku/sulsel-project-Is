import fetch from 'node-fetch'

let handler = async (m, { args }) => {
    let dropletId = args[0]
    if (!dropletId) return m.reply('ID droplet belum diberikan!')

    const getDropletInfo = async (id) => {
        try {
            const apiUrl = `https://api.digitalocean.com/v2/droplets/${id}`
            const response = await fetch(apiUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${global.doToken}`
                }
            })

            if (response.ok) {
                const data = await response.json()
                const droplet = data.droplet
                const ipv4 = droplet.networks.v4.filter(v => v.type === 'public')
                const ipAddress = ipv4.length > 0 ? ipv4[0].ip_address : 'Tidak ada IP!'
                const vpsRam = droplet.memory / 1024

                return {
                    dropletid: droplet.id,
                    username: droplet.name,
                    ip: ipAddress,
                    ram: `${vpsRam} GB`,
                    os: droplet.image.distribution,
                    cpu: droplet.vcpus > 1 ? `${droplet.vcpus} vCPU` : `${droplet.vcpus} vCPUs`,
                    storage: droplet.disk,
                    status: droplet.status
                }
            } else {
                const err = await response.json()
                return new Error(`Gagal memeriksa detail droplet: ${err.message}`)
            }
        } catch (e) {
            return new Error('Terjadi kesalahan saat memeriksa detail droplet.')
        }
    }

    getDropletInfo(dropletId).then(info => {
        let txt = `*DETAIL VPS KAMU*\n`
        txt += `Droplet ID: ${info.dropletid}\n`
        txt += `Hostname: ${info.username}\n`
        txt += `IPv4: ${info.ip}\n`
        txt += `Ram: ${info.ram}\n`
        txt += `OS: ${info.os}\n`
        txt += `CPU: ${info.cpu}\n`
        txt += `Storage: ${info.storage}\n`
        txt += `Status: ${info.status}`

        m.reply(txt)
    }).catch(err => {
        m.reply('Terjadi kesalahan saat memeriksa detail VPS.')
    })
}

handler.help = ['cekdroplet <id>']
handler.tags = ['vps']
handler.command = /^cekdroplet$/i
handler.owner = true
handler.register = true
export default handler