let handler = async (m, { fukusima, text, command }) => {
  if (!text) return m.reply(`⚠️ Contoh penggunaan:\n.${command} <kota>\n\nMisal:\n.${command} gresik`)

  let kota = text.trim()

  try {
    let res = await fetch(`https://api-faa.my.id/faa/jadwal-sholat?kota=${encodeURIComponent(kota)}`)
    let json = await res.json()

    if (!json.status) return m.reply(`❌ Kota tidak ditemukan.`)

    let hasil = `
🕌 *JADWAL SHOLAT HARI INI*

📍 Kota: *${json.kota}*
🗺 Daerah: *${json.daerah}*
📅 Tanggal: *${json.tanggal}*

🕓 *Imsak:* ${json.jadwal.imsak}
🕓 *Subuh:* ${json.jadwal.subuh}
🌅 *Terbit:* ${json.jadwal.terbit}
🌄 *Dhuha:* ${json.jadwal.dhuha}
☀ *Dzuhur:* ${json.jadwal.dzuhur}
🌤 *Ashar:* ${json.jadwal.ashar}
🌆 *Maghrib:* ${json.jadwal.maghrib}
🌙 *Isya:* ${json.jadwal.isya}

Creator: Zen
    `.trim()

    fukusima.sendMessage(m.chat, { text: hasil }, { quoted: m })

  } catch (e) {
    m.reply("❌ Terjadi kesalahan: " + e)
  }
}

handler.command = ["jadwal"]
handler.tags = ["islami"]
handler.help = ["jadwal <kota>"]

export default handler