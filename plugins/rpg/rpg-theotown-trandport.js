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

  if (!c.transport) {
    c.transport = {
      roads: 10,
      highways: 0,
      railways: 0,
      subway: 0,
      buses: 0,
      airports: 0,
      ports: 0,
      traffic: 30,
      efficiency: 50,
      lastUpdate: Date.now()
    }
  }

  const transportItems = {
    roads: { cost: 1000, effect: { traffic: -2, efficiency: 5 }, requirement: { level: 1 } },
    highways: { cost: 5000, effect: { traffic: -5, efficiency: 10 }, requirement: { level: 5, roads: 50 } },
    railways: { cost: 8000, effect: { traffic: -8, efficiency: 15 }, requirement: { level: 8, technology: 20 } },
    subway: { cost: 15000, effect: { traffic: -15, efficiency: 25 }, requirement: { level: 12, technology: 35 } },
    buses: { cost: 3000, effect: { traffic: -3, efficiency: 8 }, requirement: { level: 3, roads: 20 } },
    airports: { cost: 25000, effect: { tourism: 50, efficiency: 20 }, requirement: { level: 15, technology: 50 } },
    ports: { cost: 20000, effect: { trade: 100, efficiency: 15 }, requirement: { level: 10, technology: 30 } }
  }

  if (!cmd) {
    updateTransport()
    
    let transportDisplay = `
🚦 *SISTEM TRANSPORTASI ${c.name}*

📊 *STATUS:*
• Traffic Level: ${c.transport.traffic}% ${c.transport.traffic > 70 ? '🚨' : c.transport.traffic > 40 ? '⚠️' : '✅'}
• Efficiency: ${c.transport.efficiency}%
• Happiness Impact: ${Math.floor(c.transport.efficiency / 2)}%

🛣️ *INFRASTRUKTUR:*
${Object.entries(c.transport).filter(([key, val]) => typeof val === 'number' && transportItems[key]).map(([type, amount]) => 
  `• ${type}: ${amount}`
).join('\n')}

💰 *UPGRADE TERSEDIA:*
${Object.entries(transportItems).map(([type, data]) => {
  let canBuild = true
  let missing = []
  
  for (let req in data.requirement) {
    if (req === 'level' && c.level < data.requirement[req]) {
      canBuild = false
      missing.push(`Level ${data.requirement[req]}`)
    } else if (c.transport[req] < data.requirement[req]) {
      canBuild = false
      missing.push(`${req} ${data.requirement[req]}`)
    }
  }
  
  return `• ${type} ($${data.cost})${canBuild ? ' ✅' : ' 🔒'} - ${Object.entries(data.effect).map(([k, v]) => `${k} ${v > 0 ? '+' : ''}${v}`).join(', ')}${!canBuild ? `\n  Butuh: ${missing.join(', ')}` : ''}`
}).join('\n')}

🎯 *EFFECT TRANSPORTASI:*
• Traffic > 70%: Happiness -20, Crime +10
• Traffic < 30%: Happiness +10, Efficiency +20
• Efficiency > 80%: Population Growth +5%
• Airports: Tourism income +50%
• Ports: Trade income +100%

🎯 *PERINTAH:*
${usedPrefix}transport build [type] - Bangun infrastruktur
${usedPrefix}transport optimize - Optimasi sistem ($5,000)
${usedPrefix}transport traffic - Kurangi traffic
${usedPrefix}transport plan - Rencana pengembangan
    `.trim()
    
    return fukusima.reply(m.chat, transportDisplay, m)
  }

  if (cmd === "build") {
    let type = args[1]?.toLowerCase()
    
    if (!type || !transportItems[type]) {
      return fukusima.reply(m.chat, `❌ Jenis transportasi tidak valid!\nPilihan: ${Object.keys(transportItems).join(', ')}`, m)
    }
    
    let item = transportItems[type]
    
    for (let req in item.requirement) {
      if (req === 'level' && c.level < item.requirement[req]) {
        return fukusima.reply(m.chat, `❌ Butuh level ${item.requirement[req]}!`, m)
      } else if (c.transport[req] < item.requirement[req]) {
        return fukusima.reply(m.chat, `❌ Butuh ${req} ${item.requirement[req]}!`, m)
      }
    }
    
    if (c.money < item.cost) {
      return fukusima.reply(m.chat, `❌ Uang tidak cukup! Butuh $${item.cost}`, m)
    }
    
    c.money -= item.cost
    c.transport[type] = (c.transport[type] || 0) + 1
    
    Object.keys(item.effect).forEach(effect => {
      if (effect === 'traffic') c.transport.traffic += item.effect[effect]
      else if (effect === 'efficiency') c.transport.efficiency += item.effect[effect]
      else if (effect === 'tourism') c.tourism += item.effect[effect]
      else c[effect] = (c[effect] || 0) + item.effect[effect]
    })
    
    c.transport.traffic = Math.max(0, Math.min(100, c.transport.traffic))
    c.transport.efficiency = Math.max(0, Math.min(100, c.transport.efficiency))
    
    c.logs.push(`🚦 Membangun ${type} ($${item.cost})`)
    
    return fukusima.reply(m.chat, `✅ Berhasil membangun *${type}*!\n${Object.entries(item.effect).map(([k, v]) => `• ${k}: ${v > 0 ? '+' : ''}${v}`).join('\n')}`, m)
  }

  if (cmd === "optimize") {
    let cost = 5000
    if (c.money < cost) return fukusima.reply(m.chat, `❌ Butuh $${cost} untuk optimasi!`, m)
    
    c.money -= cost
    c.transport.efficiency = Math.min(100, c.transport.efficiency + 20)
    c.transport.traffic = Math.max(0, c.transport.traffic - 15)
    
    c.happiness += 10
    c.logs.push(`⚡ Optimasi sistem transportasi ($${cost})`)
    
    return fukusima.reply(m.chat, `⚡ *SISTEM DIOPTIMASI!*\n\n🚦 Efficiency: +20%\n🚗 Traffic: -15%\n😊 Happiness: +10%\n💰 Biaya: $${cost}`, m)
  }

  if (cmd === "traffic") {
    let options = `
🚗 *KURANGI TRAFFIC*

1. *Rush Hour Management* ($3,000)
   • Traffic: -10%
   • Happiness: -5%
   
2. *Public Transport Campaign* ($5,000)
   • Traffic: -15%
   • Efficiency: +10%
   
3. *Work From Home Policy* ($2,000)
   • Traffic: -20%
   • Productivity: -10%
   
4. *Smart Traffic Lights* ($8,000)
   • Traffic: -25%
   • Efficiency: +15%
   • Technology: +5
   
Pilih 1-4: ${usedPrefix}transport traffic [nomor]
    `.trim()
    
    let choice = parseInt(args[1])
    if (!choice || choice < 1 || choice > 4) return fukusima.reply(m.chat, options, m)
    
    const trafficOptions = [
      { cost: 3000, effect: { traffic: -10, happiness: -5 } },
      { cost: 5000, effect: { traffic: -15, efficiency: 10 } },
      { cost: 2000, effect: { traffic: -20, productivity: -10 } },
      { cost: 8000, effect: { traffic: -25, efficiency: 15, technology: 5 } }
    ]
    
    let option = trafficOptions[choice - 1]
    
    if (c.money < option.cost) {
      return fukusima.reply(m.chat, `❌ Uang tidak cukup! Butuh $${option.cost}`, m)
    }
    
    c.money -= option.cost
    c.transport.traffic += option.effect.traffic
    
    if (option.effect.happiness) c.happiness += option.effect.happiness
    if (option.effect.efficiency) c.transport.efficiency += option.effect.efficiency
    if (option.effect.technology) c.technology += option.effect.technology
    
    c.transport.traffic = Math.max(0, Math.min(100, c.transport.traffic))
    c.transport.efficiency = Math.max(0, Math.min(100, c.transport.efficiency))
    
    c.logs.push(`🚗 Mengurangi traffic ($${option.cost})`)
    
    let result = `🚗 *TRAFFIC BERKURANG!*\n\n`
    Object.entries(option.effect).forEach(([k, v]) => {
      result += `• ${k}: ${v > 0 ? '+' : ''}${v}\n`
    })
    result += `💰 Biaya: $${option.cost}`
    
    return fukusima.reply(m.chat, result, m)
  }

  if (cmd === "plan") {
    let roadNeed = Math.max(0, Math.floor(c.population / 1000) - c.transport.roads)
    let highwayNeed = Math.max(0, Math.floor(c.population / 5000) - c.transport.highways)
    
    let plan = `
📋 *RENCANA PENGEMBANGAN TRANSPORTASI*

👥 *BERDASARKAN POPULASI ${c.population.toLocaleString()}:*
• Jalan yang dibutuhkan: ${roadNeed}
• Jalan tol yang dibutuhkan: ${highwayNeed}
• Stasiun kereta: ${Math.floor(c.population / 10000)}
• Bandara: ${Math.floor(c.population / 500000)}
• Pelabuhan: ${Math.floor(c.population / 300000)}

📊 *REKOMENDASI:*
${roadNeed > 0 ? `• Bangun ${roadNeed} jalan untuk mengurangi traffic` : '• Jalan sudah memadai'}
${highwayNeed > 0 ? `• Bangun ${highwayNeed} jalan tol untuk efisiensi` : '• Jalan tol sudah memadai'}
${c.transport.traffic > 60 ? '• Prioritaskan pengurangan traffic!' : '• Traffic dalam kondisi baik'}
${c.transport.efficiency < 60 ? '• Tingkatkan efisiensi transportasi' : '• Efisiensi sudah baik'}

💰 *ESTIMASI BIAYA:* $${(roadNeed * 1000 + highwayNeed * 5000).toLocaleString()}
⏰ *ESTIMASI WAKTU:* ${Math.ceil((roadNeed + highwayNeed) / 2)} hari
    `.trim()
    
    return fukusima.reply(m.chat, plan, m)
  }

  function updateTransport() {
    let now = Date.now()
    let hoursPassed = Math.floor((now - c.transport.lastUpdate) / (1000 * 60 * 60))
    
    if (hoursPassed > 0) {
      let trafficGrowth = Math.floor(c.population / 10000) * hoursPassed
      let efficiencyLoss = Math.floor(c.transport.traffic / 10) * hoursPassed
      
      c.transport.traffic = Math.min(100, c.transport.traffic + trafficGrowth)
      c.transport.efficiency = Math.max(0, c.transport.efficiency - efficiencyLoss)
      
      if (c.transport.traffic > 70) {
        c.happiness -= 5 * hoursPassed
        c.crime += 2 * hoursPassed
      } else if (c.transport.traffic < 30) {
        c.happiness += 3 * hoursPassed
      }
      
      if (c.transport.efficiency > 80) {
        c.population += Math.floor(c.population * 0.001 * hoursPassed)
      }
      
      c.transport.lastUpdate = now
    }
  }
}

handler.help = ["transport [build|optimize|traffic|plan]"]
handler.tags = ["rpg", "game"]
handler.command = ["transport", "transportasi"]
handler.group = true

export default handler