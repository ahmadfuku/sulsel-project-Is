/*
FITUR THEOTOWN
Terinspirasi dari game TheoTown

Pembuat    : AhmadXyz
Sumber     : SC FUKU GEN 2

JANGAN HAPUS WATERMARK DAN NAMA PEMBUAT.
Punya ide itu dikembangkan, bukan dimaling.
Kalau cuma bisa nyomot, mending belajar dulu.
*/

let handler = async (m, { fukusima, args, usedPrefix }) => {
  let user = global.db.data.users[m.sender]
  if (!user.city) return fukusima.reply(m.chat, "Kamu belum memiliki kota! Ketik *.city* untuk memulai", m)
  
  let c = user.city
  let cmd = args[0]?.toLowerCase()

  const marketItems = {
    resources: {
      steel: { price: 100, produce: "factory", amount: 10 },
      electronics: { price: 250, produce: "tech_factory", amount: 5 },
      chemicals: { price: 150, produce: "factory", amount: 8 },
      fuel: { price: 80, produce: "factory", amount: 15 },
      uranium: { price: 1000, produce: "nuclear_plant", amount: 1 },
      silicon: { price: 300, produce: "tech_factory", amount: 3 },
      gold: { price: 500, produce: null, amount: 1 }
    },
    food: {
      grain: { price: 20, produce: "farm", amount: 50 },
      vegetables: { price: 30, produce: "farm", amount: 40 },
      meat: { price: 50, produce: "farm", amount: 25 },
      fish: { price: 40, produce: "port", amount: 30 }
    },
    special: {
      tourist_package: { price: 200, effect: { tourism: 10 } },
      cultural_artifact: { price: 500, effect: { culture: 15 } },
      diplomatic_gift: { price: 1000, effect: { diplomacy: 20 } },
      emergency_supplies: { price: 800, effect: { health: 25 } }
    }
  }

  const updatePrices = () => {
    let demand = c.population / 1000
    let inflation = c.inflation / 100
    
    for (let category in marketItems) {
      for (let item in marketItems[category]) {
        let basePrice = marketItems[category][item].basePrice || marketItems[category][item].price
        marketItems[category][item].currentPrice = Math.floor(basePrice * (1 + inflation) * (1 + demand * 0.1))
      }
    }
  }

  updatePrices()

  if (!cmd) {
    let marketDisplay = `
🏪 *PASAR ${c.name}*
💰 Uang: $${c.money.toLocaleString()}
📈 Inflasi: ${c.inflation}%

🛒 *RESOURCES:*
${Object.entries(marketItems.resources).map(([item, data]) => 
  `• ${item}: $${data.currentPrice} (Stok: ${c.resources[item] || 0})`
).join('\n')}

🥦 *MAKANAN:*
${Object.entries(marketItems.food).map(([item, data]) => 
  `• ${item}: $${data.currentPrice}`
).join('\n')}

🎁 *SPESIAL:*
${Object.entries(marketItems.special).map(([item, data]) => 
  `• ${item}: $${data.currentPrice} - ${Object.keys(data.effect).map(e => `${e} +${data.effect[e]}`).join(', ')}`
).join('\n')}

🏭 *PRODUKSI SENDIRI:*
${Object.entries(c.buildings).filter(([b, count]) => count > 0).map(([building, count]) => {
  let production = []
  for (let cat in marketItems) {
    for (let item in marketItems[cat]) {
      if (marketItems[cat][item].produce === building) {
        production.push(`${item}: +${marketItems[cat][item].amount * count}/hari`)
      }
    }
  }
  return production.length > 0 ? `• ${building} (${count}): ${production.join(', ')}` : ''
}).filter(x => x).join('\n') || 'Belum ada produksi'}

Perintah:
${usedPrefix}market buy [item] [jumlah] - Beli barang
${usedPrefix}market sell [item] [jumlah] - Jual barang
${usedPrefix}market produce - Kumpulkan produksi
${usedPrefix}market trade [@user] [item] [jumlah] [harga] - Trading dengan pemain lain
    `.trim()
    
    return fukusima.reply(m.chat, marketDisplay, m)
  }

  if (cmd === "buy") {
    let item = args[1]?.toLowerCase()
    let amount = parseInt(args[2]) || 1
    
    if (!item) return fukusima.reply(m.chat, "❌ Berikan nama barang!", m)
    
    let itemData = null
    let category = null
    
    for (let cat in marketItems) {
      if (marketItems[cat][item]) {
        itemData = marketItems[cat][item]
        category = cat
        break
      }
    }
    
    if (!itemData) return fukusima.reply(m.chat, "❌ Barang tidak tersedia!", m)
    
    let totalCost = itemData.currentPrice * amount
    
    if (c.money < totalCost) {
      return fukusima.reply(m.chat, `❌ Uang tidak cukup! Butuh $${totalCost}, punya $${c.money}`, m)
    }
    
    c.money -= totalCost
    
    if (category === 'resources') {
      c.resources[item] = (c.resources[item] || 0) + amount
    } else if (category === 'food') {
      c.food += amount * 10
    } else if (category === 'special') {
      Object.keys(itemData.effect).forEach(effect => {
        c[effect] += itemData.effect[effect] * amount
      })
    }
    
    c.inflation += 0.1 * amount
    c.logs.push(`🛒 Membeli ${amount} ${item} ($${totalCost})`)
    
    return fukusima.reply(m.chat, `✅ Berhasil membeli *${amount} ${item}* seharga $${totalCost}`, m)
  }

  if (cmd === "sell") {
    let item = args[1]?.toLowerCase()
    let amount = parseInt(args[2]) || 1
    
    if (!item) return fukusima.reply(m.chat, "❌ Berikan nama barang!", m)
    
    if (!marketItems.resources[item]) {
      return fukusima.reply(m.chat, "❌ Hanya bisa menjual resources!", m)
    }
    
    if (!c.resources[item] || c.resources[item] < amount) {
      return fukusima.reply(m.chat, `❌ Stok ${item} tidak cukup! Stok: ${c.resources[item] || 0}`, m)
    }
    
    let totalValue = marketItems.resources[item].currentPrice * amount * 0.8
    
    c.resources[item] -= amount
    c.money += totalValue
    c.inflation -= 0.05 * amount
    
    c.logs.push(`💰 Menjual ${amount} ${item} ($${totalValue})`)
    
    return fukusima.reply(m.chat, `✅ Berhasil menjual *${amount} ${item}* seharga $${totalValue}`, m)
  }

  if (cmd === "produce") {
    let production = []
    let totalResources = {}
    
    for (let building in c.buildings) {
      let count = c.buildings[building]
      if (count > 0) {
        for (let cat in marketItems) {
          for (let item in marketItems[cat]) {
            if (marketItems[cat][item].produce === building) {
              let amount = marketItems[cat][item].amount * count
              
              if (cat === 'resources') {
                c.resources[item] = (c.resources[item] || 0) + amount
                totalResources[item] = (totalResources[item] || 0) + amount
              } else if (cat === 'food') {
                c.food += amount * 10
              }
              
              production.push(`${building}: +${amount} ${item}`)
            }
          }
        }
      }
    }
    
    if (production.length === 0) {
      return fukusima.reply(m.chat, "❌ Tidak ada bangunan yang memproduksi!", m)
    }
    
    let result = `🏭 *PRODUKSI HARIAN*\n\n`
    result += production.join('\n')
    
    if (Object.keys(totalResources).length > 0) {
      result += `\n\n📦 *TOTAL RESOURCES:*\n`
      result += Object.entries(totalResources).map(([item, amount]) => 
        `• ${item}: +${amount} (Total: ${c.resources[item] || 0})`
      ).join('\n')
    }
    
    c.logs.push(`🏭 Produksi harian dikumpulkan`)
    
    return fukusima.reply(m.chat, result, m)
  }

  if (cmd === "trade") {
    if (!m.mentionedJid || m.mentionedJid.length === 0) {
      return fukusima.reply(m.chat, "❌ Tag pemain yang ingin diajak trading!", m)
    }
    
    let target = m.mentionedJid[0]
    let item = args[2]?.toLowerCase()
    let amount = parseInt(args[3]) || 1
    let price = parseInt(args[4])
    
    if (!item || !price) {
      return fukusima.reply(m.chat, "❌ Format: .market trade @user [item] [jumlah] [harga]", m)
    }
    
    if (!marketItems.resources[item]) {
      return fukusima.reply(m.chat, "❌ Hanya bisa trading resources!", m)
    }
    
    if (!c.resources[item] || c.resources[item] < amount) {
      return fukusima.reply(m.chat, `❌ Stok ${item} tidak cukup!`, m)
    }
    
    let totalPrice = price * amount
    
    if (!global.db.data.users[target]) {
      return fukusima.reply(m.chat, "❌ Pemain target tidak ditemukan!", m)
    }
    
    if (!global.db.data.users[target].city) {
      return fukusima.reply(m.chat, "❌ Pemain target belum memiliki kota!", m)
    }
    
    let targetCity = global.db.data.users[target].city
    
    if (targetCity.money < totalPrice) {
      return fukusima.reply(m.chat, "❌ Pemain target tidak memiliki cukup uang!", m)
    }
    
    c.resources[item] -= amount
    c.money += totalPrice
    
    targetCity.resources[item] = (targetCity.resources[item] || 0) + amount
    targetCity.money -= totalPrice
    
    c.logs.push(`🤝 Trading ${amount} ${item} dengan @${target.split('@')[0]} ($${totalPrice})`)
    targetCity.logs.push(`🤝 Trading ${amount} ${item} dengan @${m.sender.split('@')[0]} ($${totalPrice})`)
    
    fukusima.reply(target, `📨 *TAWARAN TRADING*\n\nDari: @${m.sender.split('@')[0]}\nBarang: ${amount} ${item}\nHarga: $${totalPrice}\n\nKetik .accept trade untuk menerima`, null, {
      mentions: [m.sender]
    })
    
    return fukusima.reply(m.chat, `📨 Tawaran trading dikirim ke @${target.split('@')[0]}!\nMenunggu konfirmasi...`, m, {
      mentions: [target]
    })
  }
}

handler.help = ["market [buy|sell|produce|trade]"]
handler.tags = ["rpg", "game"]
handler.command = ["market", "pasar"]
handler.group = true

export default handler