import fetch from 'node-fetch'

global.fbTemp = global.fbTemp || {}

let handler = async (m, { fukusima, args, usedPrefix, command }) => {
  await fukusima.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })

  if (!args[0]) {
    return m.reply(`🚨 Contoh:\n• ${usedPrefix + command} <url Facebook>\n• ${usedPrefix + command} 720p\n\nKetik *.fb <url>* dulu untuk memulai.`)
  }

  // Kalau input user bukan URL, berarti dia mau pilih resolusi
  let isUrl = args[0].startsWith('http://') || args[0].startsWith('https://')
  let user = m.sender

  // === PILIH RESOLUSI YANG DISIMPAN ===
  if (!isUrl) {
    let videoList = global.fbTemp[user]
    if (!videoList) throw '⚠️ Tidak ada video disimpan. Ketik *.fb <url>* dulu.'

    let wanted = args.join(' ').toLowerCase()
    let selected = videoList.find(v => v.quality.toLowerCase().includes(wanted))
    if (!selected) throw '❌ Resolusi tidak ditemukan. Cek kembali list yang dikirim sebelumnya.'

    await fukusima.sendMessage(m.chat, { react: { text: '⬇️', key: m.key } })
    await fukusima.sendFile(m.chat, selected.url, `fb-${selected.quality}.mp4`, `🎞️ Video kualitas *${selected.quality}*`, m)
    await fukusima.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    return
  }

  // === PENGAMBILAN VIDEO BARU ===
  try {
    let api = `https://www.sankavolereii.my.id/download/facebook?apikey=planaai&url=${encodeURIComponent(args[0])}`
    let res = await fetch(api)
    if (!res.ok) throw '❌ Gagal ambil data.'

    let json = await res.json()
    if (!json.status || !json.result || !Array.isArray(json.result.video)) throw '❌ Video tidak ditemukan.'

    let { title, duration, video } = json.result

    global.fbTemp[user] = video // simpan list ke sesi

    // Pilih kualitas terbaik
    let selected = video.find(v => /HD/i.test(v.quality)) || video.at(-1)
    if (!selected?.url) throw '❌ URL video tidak ditemukan.'

    let caption = `📹 *${title}*\n⏱️ Durasi: ${duration}\n\n✅ Mengirim kualitas *${selected.quality}*\n\n🔽 *Ketik lagi:*`
    video.forEach(v => caption += `\n• *.fb ${v.quality}*`)

    await fukusima.sendFile(m.chat, selected.url, `${title.replace(/[^\w\s\-_.]/gi, '')}.mp4`, caption, m)
    await fukusima.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (e) {
    console.error(e)
    await fukusima.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    m.reply('⚠️ Gagal mengambil video.')
  }
}

handler.help = ['fb'].map(v => v + ' <url|resolusi>')
handler.tags = ['downloader']
handler.command = /^(fb|facebook|fesnuk)$/i
handler.limit = true

export default handler