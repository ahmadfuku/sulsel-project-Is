import fetch from 'node-fetch'

let handler = async (m) => {
    try {
        let res = await fetch('https://api.digitalocean.com/v2/droplets', {
            headers: {
                Authorization: `Bearer ${global.doToken}`
            }
        })

        let json = await res.json()
        let droplets = json.droplets || []

        let text = `Total Droplet: ${droplets.length}\n\n`

        if (droplets.length === 0) {
            text += 'Tidak ada droplet yang tersedia!'
            return m.reply(text)
        }

        for (let d of droplets) {
            let ipv4 = d.networks?.v4?.filter(v => v.type === "public")
            let ip = ipv4?.length ? ipv4[0].ip_address : 'Tidak ada IP!'
            
            text += `ID: ${d.id}\n`
            text += `Hostname: ${d.name}\n`
            text += `Username: root\n`
            text += `IP: ${ip}\n`
            text += `RAM: ${d.memory} MB\n`
            text += `CPU: ${d.vcpus} CPU\n`
            text += `OS: ${d.image?.distribution}\n`
            text += `Disk: ${d.disk} GB\n`
            text += `Status: ${d.status}\n\n`
        }

        return m.reply(text)

    } catch (err) {
        return m.reply('Terjadi kesalahan: ' + err.message)
    }
}

handler.help = ['listdroplet']
handler.tags = ['vps']
handler.command = /^listdroplet$/i
handler.owner = true
export default handler