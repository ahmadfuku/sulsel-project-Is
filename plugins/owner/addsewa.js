let handler = async (m, { text, fukusima }) => {
  if (!text) {
    return m.reply('Format salah!\nContoh:\n.addsewa https://chat.whatsapp.com/xxxx|1 hari')
  }

  let [link, durasi] = text.split('|')
  if (!link || !durasi) {
    return m.reply('Format salah!\nGunakan:\n.addsewa linkgc|1 hari')
  }

  link = link.trim()
  durasi = durasi.trim()

  let match = link.match(/chat\.whatsapp\.com\/([0-9A-Za-z]+)/i)
  if (!match) return m.reply('Link grup tidak valid!')

  let code = match[1]

  let ms = parseDuration(durasi)
  if (!ms) return m.reply('Durasi tidak valid!\nGunakan: detik / menit / jam / hari / bulan')

  let now = Date.now()
  let expired = now + ms

  if (!global.db.data.users) global.db.data.users = {}
  if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = {}
  if (!Array.isArray(global.db.data.users[m.sender].sewabot)) {
    global.db.data.users[m.sender].sewabot = []
  }

  let entryId = Date.now().toString(36) + Math.random().toString(36).slice(2)

  let entry = {
    id: entryId,
    link,
    code,
    jid: null,
    expired,
    added_at: now,
    status: 'pending',
    intro_sent: false
  }

  global.db.data.users[m.sender].sewabot.push(entry)

  let jid = null

  try {
    await fukusima.groupGetInviteInfo(code).catch(() => {
      throw new Error('Link invalid / expired / bot tidak bisa akses')
    })

    await new Promise(r => setTimeout(r, 5000))

    await fukusima.groupAcceptInvite(code).catch(() => {
      throw new Error('Gagal join grup (kemungkinan sudah di dalam / limit / link mati)')
    })

    await new Promise(r => setTimeout(r, 8000))

    let groups = Object.values(await fukusima.groupFetchAllParticipating())
    if (groups.length) {
      groups.sort((a, b) => (b.creation || 0) - (a.creation || 0))
      jid = groups[0].id
    }

    if (!jid) throw new Error('Grup tidak terdeteksi setelah join')

    entry.jid = jid
    entry.status = 'active'

    let userEntry = global.db.data.users[m.sender].sewabot
    let index = userEntry.findIndex(x => x.id === entryId)
    if (index !== -1) {
      userEntry[index] = entry
    }

    setTimeout(async () => {
      try {
        await fukusima.sendMessage(jid, {
          text: `👋 Halo semua!\n\n🤖 Bot disewa oleh @${m.sender.split('@')[0]}\n\n⏳ ${durasi}\n📅 ${new Date(expired).toLocaleString('id-ID')}`,
          mentions: [m.sender]
        })

        entry.intro_sent = true
        let idx = userEntry.findIndex(x => x.id === entryId)
        if (idx !== -1) userEntry[idx] = entry

        fukusima.sendMessage(m.chat, {
          text: `✅ Intro terkirim\nID: ${jid}`
        })
      } catch (e) {
        fukusima.sendMessage(m.chat, {
          text: `⚠️ Intro gagal tapi sewa aktif\n${e.message}`
        })
      }
    }, 120000)

    m.reply(
      `✅ Sewa aktif\n\n` +
      `Durasi: ${durasi}\n` +
      `Expired: ${new Date(expired).toLocaleString('id-ID')}\n` +
      `ID: ${jid}`
    )

  } catch (error) {
    global.db.data.users[m.sender].sewabot =
      global.db.data.users[m.sender].sewabot.filter(x => x.id !== entryId)

    m.reply(`❌ Gagal: ${error.message}`)
  }
}

function parseDuration(input) {
  let [num, unit] = input.trim().split(' ')
  num = parseInt(num)
  if (isNaN(num) || !unit) return null

  unit = unit.toLowerCase()

  if (unit.startsWith('detik')) return num * 1000
  if (unit.startsWith('menit')) return num * 60000
  if (unit.startsWith('jam')) return num * 3600000
  if (unit.startsWith('hari')) return num * 86400000
  if (unit.startsWith('bulan')) return num * 2592000000

  return null
}

async function checkSewaExpired(fukusima) {
  if (!global.db.data.users) return

  const now = Date.now()

  for (let user in global.db.data.users) {
    let data = global.db.data.users[user]
    if (!Array.isArray(data.sewabot)) continue

    let aktif = []

    for (let sewa of data.sewabot) {
      if (sewa.expired > now && sewa.jid) {
        aktif.push(sewa)
      } else if (sewa.jid) {
        try {
          await fukusima.sendMessage(sewa.jid, {
            text: `⏰ Sewa habis, bot cabut.`
          })
          await fukusima.groupLeave(sewa.jid)

          await fukusima.sendMessage(user, {
            text: `📢 Sewa grup ${sewa.jid} habis.`
          })
        } catch {}
      }
    }

    data.sewabot = aktif
  }
}

setInterval(() => {
  if (global.fukusima) checkSewaExpired(global.fukusima)
}, 3600000)

handler.help = ['addsewa <link>|<durasi>']
handler.tags = ['owner']
handler.command = /^(addsewa)$/i
handler.owner = true

export default handler