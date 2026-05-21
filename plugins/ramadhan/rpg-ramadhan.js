let handler = async (m, { fukusima }) => {
  let user = global.db.data.users[m.sender]

  if (!user.ngabuburit) {
    user.ngabuburit = {
      level: 1,
      exp: 0,
      last: 0,
      tas: {}
    }
  }

  let data = user.ngabuburit
  let now = Date.now()
  let cooldown = 1000 * 60 * 20

  if (now - data.last < cooldown) {
    let sisa = cooldown - (now - data.last)
    let menit = Math.floor(sisa / 60000)
    let detik = Math.floor((sisa % 60000) / 1000)
    return m.reply(`kamu sudah ngabuburit\ncoba lagi ${menit}m ${detik}s`)
  }

  data.last = now

  const delay = ms => new Promise(r => setTimeout(r, ms))

  const lokasi = [
    "pasar ramadhan",
    "taman kota",
    "pinggir jalan",
    "depan masjid",
    "alun alun kota",
    "pantai sore hari",
    "warung takjil"
  ]

  const itemList = [
    { nama: "es_teh", emoji: "🧋" },
    { nama: "kolak", emoji: "🍲" },
    { nama: "kurma", emoji: "🌴" },
    { nama: "gorengan", emoji: "🍤" },
    { nama: "es_buah", emoji: "🍹" },
    { nama: "cendol", emoji: "🥤" },
    { nama: "martabak", emoji: "🥮" },
    { nama: "takjil_box", emoji: "📦" }
  ]

  let randomLokasi = lokasi[Math.floor(Math.random() * lokasi.length)]

  await fukusima.reply(m.chat, "🌇 kamu keluar rumah untuk ngabuburit...", m)
  await delay(1500)

  await fukusima.reply(m.chat, `🚶 kamu berjalan menuju ${randomLokasi}`, m)
  await delay(1800)

  await fukusima.reply(m.chat, "👀 kamu melihat banyak orang mencari takjil...", m)
  await delay(2000)

  await fukusima.reply(m.chat, "🛍️ kamu ikut berburu takjil...", m)
  await delay(1500)

  await fukusima.sendMessage(m.chat, {
    audio: { url: "https://uploader.fuku-cloud.my.id/uploader/1e57f985bfd7.opus" }, // audio ini
    mimetype: "audio/ogg; codecs=opus",
    ptt: true
  }, { quoted: m })

  await delay(2500)

  let jumlahItem = Math.floor(Math.random() * 3) + 1
  let hasilText = []
  let dapatExp = Math.floor(Math.random() * 50) + 20

  for (let i = 0; i < jumlahItem; i++) {
    let item = itemList[Math.floor(Math.random() * itemList.length)]
    if (!data.tas[item.nama]) data.tas[item.nama] = 0
    let jumlah = Math.floor(Math.random() * 3) + 1
    data.tas[item.nama] += jumlah
    hasilText.push(`${item.emoji} ${item.nama.replace("_"," ")} x${jumlah}`)
  }

  data.exp += dapatExp

  let naik = false
  let need = data.level * 120
  if (data.exp >= need) {
    data.level += 1
    data.exp = 0
    naik = true
  }

  await fukusima.reply(m.chat, "🎁 kamu berhasil mendapatkan beberapa takjil...", m)
  await delay(2000)

  await fukusima.sendMessage(m.chat, {
    audio: { url: "https://uploader.fuku-cloud.my.id/uploader/8a6ff0dbb911.opus" }, // audio ini
    mimetype: "audio/ogg; codecs=opus",
    ptt: true
  }, { quoted: m })

  await delay(1800)

  let teks = `🌙 *HASIL NGABUBURIT*\n\n📍 lokasi: ${randomLokasi}\n\n${hasilText.join("\n")}\n\n✨ exp +${dapatExp}`

  if (naik) teks += `\n\n🎉 level naik ke ${data.level}`

  await fukusima.reply(m.chat, teks, m)
  await delay(1200)

  let rare = Math.random() < 0.15

  if (rare) {
    await fukusima.reply(m.chat, "🤩 kamu menemukan pedagang misterius...", m)
    await delay(1500)

    await fukusima.sendMessage(m.chat, {
      audio: { url: "https://uploader.fuku-cloud.my.id/uploader/a8af7e40e1eb.opus" }, // audio ini
      mimetype: "audio/ogg; codecs=opus",
      ptt: true
    }, { quoted: m })

    let bonus = Math.floor(Math.random() * 5) + 1
    if (!data.tas["kurma_sultan"]) data.tas["kurma_sultan"] = 0
    data.tas["kurma_sultan"] += bonus

    await delay(2000)
    fukusima.reply(m.chat, `👑 kamu mendapat kurma sultan x${bonus}`, m)
  }

  await delay(1500)
  await fukusima.reply(m.chat, "🌆 kamu pulang menunggu waktu berbuka...", m)
}

handler.help = ["ngabuburit"]
handler.tags = ["rpg", "ramadhan"]
handler.command = ["ngabuburit"]
handler.register = true

export default handler