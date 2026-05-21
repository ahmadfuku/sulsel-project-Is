const handler = async (m, { fukusima }) => {
  try {
    const userRes = await fetch(`${global.domain}/api/application/users?include=servers&per_page=100`, {
      headers: {
        Authorization: "Bearer " + global.info.ptla,
        Accept: "application/json"
      }
    })
    const userData = await userRes.json()
    const users = userData?.data || []

    if (!users.length) return m.reply("❌ Tidak ada akun panel ditemukan.")

    let result = `📋 *Daftar Panel dan Server:*\n\n`

    for (let u of users) {
      const { username, id, email } = u.attributes
      const servers = u.attributes.relationships?.servers?.data || []

      result += `👤 *${username}* (${email})\n🆔 ID: ${id}\n📦 Total Server: ${servers.length || 0}\n`

      for (let s of servers) {
        const srv = s.attributes
        const ram = srv.limits.memory == 0 ? 'Unlimited' : (srv.limits.memory / 1000) + 'GB'
        const disk = srv.limits.disk == 0 ? 'Unlimited' : (srv.limits.disk / 1000) + 'GB'
        const status = srv.is_suspended ? '🔴 Suspended' : '🟢 Active'

        result += ` └─ 💻 *${srv.name}*\n`
        result += `     • ID: ${srv.id}\n`
        result += `     • RAM: ${ram}\n`
        result += `     • Disk: ${disk}\n`
        result += `     • Status: ${status}\n`
      }
      result += `\n`
    }

    await fukusima.sendMessage(m.chat, { text: result.trim() }, { quoted: m })
  } catch (err) {
    console.error(err)
    m.reply(`❌ Gagal mengambil data panel:\n${err.message}`)
  }
}

handler.command = /^listpanel$/i
handler.tags = ['panel']
handler.help = ['listpanel']
handler.owner = true

export default handler