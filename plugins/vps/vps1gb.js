import fetch from 'node-fetch'

function randomPass() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let pass = ""
    for (let i = 0; i < 10; i++) pass += chars[Math.floor(Math.random() * chars.length)]
    return pass
}

let handler = async (m, { args }) => {
    const hostname = args[0]
    if (!hostname) return m.reply('Masukkan hostname VPS!\n\nContoh:\n.vps1g1c nama-vps')

    try {
        let password = randomPass()

        let body = {
            name: hostname,
            region: 'sgp1',
            size: 's-1vcpu-1gb',
            image: 'ubuntu-22-04-x64',
            ssh_keys: null,
            backups: false,
            ipv6: true,
            user_data: `#cloud-config
password: ${password}
chpasswd: { expire: False }`,
            private_networking: null,
            volumes: null,
            tags: ['T']
        }

        let res = await fetch('https://api.digitalocean.com/v2/droplets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + global.doToken
            },
            body: JSON.stringify(body)
        })

        let json = await res.json()

        if (!res.ok) throw new Error(json.message)

        let id = json.droplet.id

        await m.reply("Tunggu sebentar...")

        await new Promise(r => setTimeout(r, 60000))

        let get = await fetch(`https://api.digitalocean.com/v2/droplets/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + global.doToken
            }
        })

        let info = await get.json()

        let ip = info?.droplet?.networks?.v4?.length
            ? info.droplet.networks.v4[0].ip_address
            : "IP belum tersedia"

        let msg = `VPS berhasil dibuat!\n\n`
        msg += `ID: ${id}\n`
        msg += `IP VPS: ${ip}\n`
        msg += `Password: ${password}\n`

        return m.reply(msg)

    } catch (err) {
        return m.reply(`Terjadi kesalahan saat membuat VPS: ${err.message || err}`)
    }
}

handler.help = ['vps1g1c']
handler.tags = ['vps']
handler.command = /^vps1g1c$/i
handler.owner = true
handler.register = true
export default handler