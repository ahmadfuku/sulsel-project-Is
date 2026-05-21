let handler = async (m, { fukusima, args }) => {
  const generateRandomPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let pass = ""
    for (let i = 0; i < 10; i++) pass += chars[Math.floor(Math.random() * chars.length)]
    return pass
  }

  let hostname = args[0]
  if (!hostname) return m.reply("Masukkan hostname VPS nya!")

  try {
    let password = generateRandomPassword()

    let dropletData = {
      name: hostname,
      region: "sgp1",
      size: "s-4vcpu-16gb",
      image: "ubuntu-22-04-x64",
      ipv6: true,
      backups: false,
      tags: ["T"],
      user_data: `#cloud-config
password: ${password}
chpasswd: { expire: False }`
    }

    let response = await fetch("https://api.digitalocean.com/v2/droplets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + doToken
      },
      body: JSON.stringify(dropletData)
    })

    let responseData = await response.json()
    if (!response.ok) throw responseData

    let dropletId = responseData.droplet.id

    await m.reply("Tunggu Sebentar...")

    await new Promise(r => setTimeout(r, 60000))

    let dropletResponse = await fetch(`https://api.digitalocean.com/v2/droplets/${dropletId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + doToken
      }
    })

    let dropletInfo = await dropletResponse.json()
    let ipVPS =
      dropletInfo.droplet.networks.v4?.[0]?.ip_address ||
      "Tidak ada alamat IP yang tersedia!"

    let messageText = `VPS berhasil dibuat!

ID: ${dropletId}
IP VPS: ${ipVPS}
Password: ${password}`

    await fukusima.sendMessage(m.chat, { text: messageText }, { quoted: m })
  } catch (e) {
    console.error(e)
    m.reply("Terjadi kesalahan saat membuat VPS.")
  }
}

handler.help = ["vps16g4c <hostname>"]
handler.tags = ["owner"]
handler.command = /^vps16g4c$/i
handler.owner = true

export default handler