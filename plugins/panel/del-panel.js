const handler = async (m, { fukusima, text }) => {
  if (!text) return m.reply('❗ Masukkan username akun panel yang ingin dihapus.\n\nContoh: .delpanel ahmadxyz')

  const username = text.trim().toLowerCase()

  try {
    const res = await fetch(`${global.domain}/api/application/users?per_page=100`, {
      headers: {
        Authorization: "Bearer " + global.info.ptla,
        Accept: "application/json"
      }
    })

    const data = await res.json()
    if (!data || !data.data) return m.reply("❌ Gagal mengambil data user")

    const user = data.data.find(u => u.attributes.username === username)
    if (!user) return m.reply(`❌ User "${username}" tidak ditemukan.`)

    const userId = user.attributes.id

    const res2 = await fetch(`${global.domain}/api/application/users/${userId}?include=servers`, {
      headers: {
        Authorization: "Bearer " + global.info.ptla,
        Accept: "application/json"
      }
    })

    const userDetails = await res2.json()
    const servers = userDetails.attributes.relationships?.servers?.data || []

    for (const server of servers) {
      const serverId = server.attributes.id
      await fetch(`${global.domain}/api/application/servers/${serverId}/force`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + global.info.ptla,
          Accept: "application/json"
        }
      })
    }

    await fetch(`${global.domain}/api/application/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + global.info.ptla,
        Accept: "application/json"
      }
    })

    m.reply(`✅ Berhasil menghapus akun panel dan semua server milik *${username}*.`)

  } catch (err) {
    console.error(err)
    m.reply(`❌ Terjadi kesalahan:\n${err.message}`)
  }
}

handler.command = /^delpanel$/i
handler.owner = true
handler.tags = ['panel']
handler.help = ['delpanel <username>']

export default handler