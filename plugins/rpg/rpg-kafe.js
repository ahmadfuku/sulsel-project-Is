let handler = async (m, { fukusima }) => {
  let user = global.db.data.users[m.sender]

  if (!user.cafe) {
    user.cafe = {
      name: 'Kafe Pemula',
      level: 1,
      capacity: 10,
      stock: 30,
      maxStock: 30,
      customers: 0,
      revenue: 0,
      popularity: 3,
      upgradeCost: 1000000,
      menu: [{ item: 'Kopi Hangat', price: 20000 }],
      facilities: ['Meja Kayu'],
      openHours: { start: 8, end: 22 },
      rating: 3.8
    }
  }

  let cafe = user.cafe
  let delay = ms => new Promise(res => setTimeout(res, ms))

  let jam = new Date().getHours()
  if (jam < cafe.openHours.start || jam >= cafe.openHours.end) {
    return fukusima.reply(m.chat, '🚪 Kafe masih tutup', m)
  }

  if (cafe.stock <= 0) {
    return fukusima.reply(m.chat, '📦 Stok kafe habis', m)
  }

  await fukusima.reply(m.chat, '☕ Membuka kafe...', m)
  await delay(1200)

  await fukusima.reply(m.chat, '🪑 Menata meja dan kursi...', m)
  await delay(1200)

  let pelanggan = Math.floor(Math.random() * cafe.capacity) + 1
  cafe.customers = pelanggan

  await fukusima.reply(m.chat, `👥 ${pelanggan} pelanggan datang`, m)
  await delay(1300)

  let totalUang = 0
  let laporan = '🧾 *LAPORAN KAFE*\n\n'

  for (let i = 0; i < pelanggan; i++) {
    if (cafe.stock <= 0) break

    let menu = cafe.menu[Math.floor(Math.random() * cafe.menu.length)]
    let bonus = Math.floor(Math.random() * 15000)
    let harga = menu.price + bonus

    cafe.stock--
    totalUang += harga

    laporan += `• ${menu.item} terjual +Rp${harga}\n`
    await delay(250)
  }

  cafe.revenue += totalUang
  user.money += totalUang

  cafe.rating = Math.min(5, (cafe.rating + Math.random() * 0.2)).toFixed(1)
  cafe.popularity += Math.floor(Math.random() * 2)

  await delay(800)
  await fukusima.reply(
    m.chat,
    `💰 Total Pendapatan: Rp${totalUang}\n📦 Sisa Stok: ${cafe.stock}\n⭐ Rating: ${cafe.rating}`,
    m
  )

  await delay(600)
  fukusima.reply(m.chat, laporan.trim(), m)
}

handler.help = ['kafe']
handler.tags = ['rpg']
handler.command = ['kafe']

export default handler