let handler = async (m, { fukusima, text, command, isBan }) => {
  if (isBan) return m.reply('🚫 Kamu dibanned!')
  if (!text) return m.reply(`📌 Usage:\n.${command} teks\nContoh:\n.${command} aku suka anime`)

  const api = `https://api.elrayyxml.web.id/api/maker/bratanime?text=${encodeURIComponent(text)}`
  try {
    const res = await fetch(api)
    if (!res.ok) throw new Error(`API Error: ${res.status}`)
    const contentType = (res.headers.get?.('content-type') || '').toLowerCase()
    let imageURL = null
    if (contentType.includes('application/json')) {
      const json = await res.json()
      imageURL = json.result || json.url || json.image || null
      if (!imageURL) throw new Error('API tidak mengembalikan URL gambar')
    } else {
      const arr = await res.arrayBuffer()
      const buffer = Buffer.from(arr)
      if (typeof fukusima.sendImageAsSticker === 'function') {
        try {
          await fukusima.sendImageAsSticker(m.chat, buffer, m, { packname: 'fukusima', author: 'AnimeBrat' })
          return
        } catch (e) {
          console.log('sendImageAsSticker error ->', e.message)
        }
      }

      if (typeof fukusima.sendSticker === 'function') {
        try {
          await fukusima.sendSticker(m.chat, buffer, m, { packname: 'Mecha', author: 'AnimeBrat' })
          return
        } catch (e) {
          console.log('sendSticker error ->', e.message)
        }
      }

     try {
        await fukusima.sendMessage(m.chat, { sticker: buffer }, { quoted: m })
        return
      } catch (e) {
        console.log('sendMessage sticker field error ->', e.message)
      }

      await fukusima.sendMessage(
        m.chat,
        { image: buffer, caption: `✨ Hasil (fallback gambar). Perhatian: Sticker tidak tersedia di instance ini.` },
        { quoted: m }
      )
      return
    }

        try {
      const imgRes = await fetch(imageURL)
      if (!imgRes.ok) throw new Error(`Gagal mengunduh gambar: ${imgRes.status}`)
      const arr = await imgRes.arrayBuffer()
      const buffer = Buffer.from(arr)

      if (typeof fukusima.sendImageAsSticker === 'function') {
        try {
          await fukusima.sendImageAsSticker(m.chat, buffer, m, { packname: 'Yareu-MD', author: 'AnimeBrat' })
          return
        } catch (e) { console.log('sendImageAsSticker error ->', e.message) }
      }

      if (typeof fukusima.sendSticker === 'function') {
        try {
          await fukusima.sendSticker(m.chat, buffer, m, { packname: 'mecha', author: 'AnimeBrat' })
          return
        } catch (e) { console.log('sendSticker error ->', e.message) }
      }

      try {
        await fukusima.sendMessage(m.chat, { sticker: buffer }, { quoted: m })
        return
      } catch (e) { console.log('sendMessage sticker field error ->', e.message) }

      await fukusima.sendMessage(m.chat, { image: buffer, caption: '✨ Hasil (fallback gambar). Instance ini tidak mendukung kirim sticker otomatis.' }, { quoted: m })
      return

    } catch (e) {
      throw new Error('Gagal mengunduh gambar dari URL: ' + e.message)
    }

  } catch (err) {
    console.error(err)
    return m.reply('❌ Error: ' + (err.message || String(err)))
  }
}

handler.help = ['animebrat <teks>']
handler.tags = ['maker','sticker']
handler.command = ['animebrat','bratanim','bratanime']
export default handler