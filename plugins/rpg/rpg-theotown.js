/*
FITUR THEOTOWN
Terinspirasi dari game TheoTown

Pembuat    : AhmadXyz
Sumber     : SC FUKU GEN 2

JANGAN HAPUS WATERMARK DAN NAMA PEMBUAT.
Punya ide itu dikembangkan, bukan dimaling.
Kalau cuma bisa nyomot, mending belajar dulu.
*/
let handler = async (m, { fukusima, args, usedPrefix, command }) => {
  let user = global.db.data.users[m.sender]

  if (!user.city) {
    user.city = {
      name: "Neo City",
      mayor: m.sender,
      level: 1,
      exp: 0,
      money: 5000,
      population: 120,
      happiness: 75,
      pollution: 5,
      power: 100,
      water: 100,
      food: 100,
      education: 50,
      crime: 10,
      health: 80,
      reputation: 50,
      research: 0,
      tourism: 0,
      unemployment: 5,
      inflation: 0,
      zones: {
        residential: 2,
        commercial: 1,
        industrial: 1,
        agricultural: 0,
        recreational: 0,
        military: 0,
        scientific: 0
      },
      buildings: {
        house: 5,
        shop: 2,
        factory: 1,
        hospital: 0,
        police: 0,
        fire: 0,
        powerplant: 1,
        waterpump: 1,
        school: 0,
        university: 0,
        farm: 0,
        park: 0,
        stadium: 0,
        lab: 0,
        barracks: 0,
        monument: 0,
        airport: 0,
        port: 0,
        mall: 0,
        cinema: 0,
        apartment: 0,
        skyscraper: 0,
        nuclear_plant: 0,
        solar_farm: 0,
        dam: 0,
        sewage_plant: 0,
        prison: 0,
        court: 0
      },
      resources: {
        steel: 0,
        electronics: 0,
        chemicals: 0,
        foodstock: 100,
        fuel: 50,
        uranium: 0,
        silicon: 0,
        gold: 0
      },
      disasters: 0,
      tax: 10,
      sales_tax: 5,
      property_tax: 3,
      day: 1,
      achievements: [],
      policies: [],
      laws: [],
      logs: [],
      alliances: [],
      tradeRoutes: [],
      lastUpdate: Date.now(),
      events: [],
      projects: [],
      culture: 0,
      technology: 0,
      defense: 0,
      diplomacy: 0,
      environment: 0,
      transport: {
        roads: 10,
        highways: 0,
        railways: 0,
        subway: 0,
        buses: 0
      }
    }
  }

  let c = user.city
  
  let now = Date.now()
  let hoursPassed = Math.floor((now - c.lastUpdate) / (1000 * 60 * 60))
  if (hoursPassed > 0) {
    for (let i = 0; i < hoursPassed; i++) {
      updateCity()
    }
    c.lastUpdate = now
  }

  const expNeed = lvl => lvl * 150 + Math.pow(lvl, 2) * 50

  const levelUp = () => {
    while (c.exp >= expNeed(c.level)) {
      c.exp -= expNeed(c.level)
      c.level++
      c.happiness += 5
      c.money += 5000
      c.reputation += 10
      c.logs.push(`✨ Level kota naik ke ${c.level}`)
      
      if (c.level === 5) c.achievements.push("Small Town")
      if (c.level === 10) c.achievements.push("Metropolis")
      if (c.level === 20) c.achievements.push("Megacity")
      if (c.level === 30) c.achievements.push("Cosmopolis")
    }
  }

  const updateCity = () => {
    let popGrowthRate = (c.happiness / 100) * 0.02
    let popGrowth = Math.floor(c.population * popGrowthRate)
    c.population += popGrowth
    
    c.power -= c.population * 0.1
    c.water -= c.population * 0.08
    c.food -= c.population * 0.05
    
    c.power += c.buildings.powerplant * 50
    c.power += c.buildings.solar_farm * 30
    c.power += c.buildings.nuclear_plant * 200
    c.water += c.buildings.waterpump * 40
    c.water += c.buildings.dam * 100
    c.food += c.buildings.farm * 30
    
    c.pollution += c.buildings.factory * 3
    c.pollution += c.buildings.nuclear_plant * 10
    c.pollution -= c.buildings.park * 2
    c.pollution -= c.buildings.sewage_plant * 5
    c.pollution = Math.max(0, c.pollution)
    
    c.crime = Math.max(0, 20 - (c.buildings.police * 2) - (c.buildings.prison * 1.5) + (c.unemployment || 0) / 10)
    
    c.health = Math.min(100, 60 + (c.buildings.hospital * 5) - (c.pollution / 10))
    
    c.education = Math.min(100, (c.buildings.school * 10) + (c.buildings.university * 15))
    
    let dailyIncome = calculateDailyIncome()
    c.money += dailyIncome
    
    if (Math.random() < 0.05) {
      triggerDisaster()
    }
    
    if (Math.random() < 0.1) {
      triggerEvent()
    }
    
    levelUp()
  }

  const calculateDailyIncome = () => {
    let base = c.population * c.tax * 0.1
    let commercialIncome = c.zones.commercial * 500
    let industrialIncome = c.zones.industrial * 800
    let tourismIncome = c.tourism * 200
    let modifier = c.happiness / 100
    
    return Math.floor((base + commercialIncome + industrialIncome + tourismIncome) * modifier)
  }

  const triggerDisaster = () => {
    const disasters = [
      { name: "Gempa Bumi", effect: { population: -0.15, money: -2000, buildings: -2 }, chance: 0.3 },
      { name: "Banjir", effect: { population: -0.1, food: -50, happiness: -20 }, chance: 0.25 },
      { name: "Kebakaran", effect: { money: -1500, buildings: -3 }, chance: 0.2 },
      { name: "Pandemi", effect: { population: -0.2, health: -30 }, chance: 0.15 },
      { name: "Krisis Ekonomi", effect: { money: -5000, happiness: -30 }, chance: 0.1 },
      { name: "Tornado", effect: { population: -0.25, buildings: -5 }, chance: 0.05 },
      { name: "Tsunami", effect: { population: -0.35, money: -10000 }, chance: 0.02 },
      { name: "Serangan Alien", effect: { population: -0.5, defense: -50 }, chance: 0.001 }
    ]
    
    let disaster = disasters[Math.floor(Math.random() * disasters.length)]
    c.disasters++
    c.logs.push(`💥 Bencana: ${disaster.name}`)
    
    if (disaster.effect.population) c.population -= Math.floor(c.population * disaster.effect.population)
    if (disaster.effect.money) c.money += disaster.effect.money
    if (disaster.effect.happiness) c.happiness += disaster.effect.happiness
    if (disaster.effect.buildings) {
      let buildingTypes = Object.keys(c.buildings).filter(b => c.buildings[b] > 0)
      if (buildingTypes.length > 0) {
        for (let i = 0; i < disaster.effect.buildings; i++) {
          let randomBuilding = buildingTypes[Math.floor(Math.random() * buildingTypes.length)]
          c.buildings[randomBuilding] = Math.max(0, c.buildings[randomBuilding] - 1)
        }
      }
    }
  }

  const triggerEvent = () => {
    const events = [
      { name: "Festival Musik", effect: { happiness: 15, tourism: 10 }, message: "🎵 Festival musik sukses digelar!" },
      { name: "Turnamen Olahraga", effect: { reputation: 10, culture: 5 }, message: "⚽ Turnamen olahraga menarik banyak pengunjung!" },
      { name: "Konferensi Internasional", effect: { diplomacy: 15, money: 3000 }, message: "🌐 Konferensi internasional meningkatkan reputasi kota!" },
      { name: "Penemuan Ilmiah", effect: { research: 100, technology: 10 }, message: "🔬 Penemuan ilmiah di universitas kota!" },
      { name: "Boom Ekonomi", effect: { money: 10000, happiness: 10 }, message: "📈 Boom ekonomi meningkatkan pendapatan kota!" }
    ]
    
    let event = events[Math.floor(Math.random() * events.length)]
    c.events.push(event.name)
    c.logs.push(`🎉 Event: ${event.name}`)
    
    Object.keys(event.effect).forEach(key => {
      if (c[key] !== undefined) c[key] += event.effect[key]
    })
  }

  let cmd = args[0]?.toLowerCase()

  if (!cmd) {
    let stats = `
🏙️ *${c.name}*
👑 Walikota: @${c.mayor.split('@')[0]}
📊 Level: ${c.level} | ⭐ EXP: ${c.exp}/${expNeed(c.level)}
🏆 Achievement: ${c.achievements.length > 0 ? c.achievements.join(', ') : 'Belum ada'}

💰 *EKONOMI*
💵 Uang: $${c.money.toLocaleString()}
📈 Pajak: ${c.tax}% | Pajak Penjualan: ${c.sales_tax}%
🏢 Zona: R${c.zones.residential} C${c.zones.commercial} I${c.zones.industrial} A${c.zones.agricultural} S${c.zones.scientific}

👥 *DEMOGRAFI*
👪 Populasi: ${c.population.toLocaleString()}
😊 Kebahagiaan: ${c.happiness}%
⚕️ Kesehatan: ${c.health}%
🎓 Pendidikan: ${c.education}%
⚖️ Kejahatan: ${c.crime}%
📉 Pengangguran: ${c.unemployment}%

🏭 *INFRASTRUKTUR*
⚡ Listrik: ${Math.floor(c.power)}%
💧 Air: ${Math.floor(c.water)}%
🌾 Makanan: ${Math.floor(c.food)}%
🏭 Polusi: ${c.pollution}%
🔬 Research: ${c.research}

🎭 *LAINNYA*
🌟 Reputasi: ${c.reputation}
🌍 Diplomasi: ${c.diplomacy}
🎨 Budaya: ${c.culture}
⚔️ Pertahanan: ${c.defense}
🚆 Transport: Level ${c.transport.roads}

📅 Hari ke-${c.day} | Bencana: ${c.disasters} | Event: ${c.events.length}

*PERINTAH TERSEDIA:*
_${usedPrefix}city build [type]_ - Bangun gedung
_${usedPrefix}city zone [type]_ - Tambah zona
_${usedPrefix}city tax [1-30]_ - Atur pajak
_${usedPrefix}city next_ - Lanjut hari
_${usedPrefix}city manage_ - Kelola kota
_${usedPrefix}city market_ - Pasar
_${usedPrefix}city research_ - Riset teknologi
_${usedPrefix}city army_ - Militer
_${usedPrefix}city trade_ - Perdagangan
_${usedPrefix}city mission_ - Misi
_${usedPrefix}city upgrade_ - Upgrade bangunan
_${usedPrefix}city policy_ - Kebijakan
_${usedPrefix}city rename [nama]_ - Ganti nama kota
_${usedPrefix}city project_ - Proyek besar
_${usedPrefix}city transport_ - Transportasi
_${usedPrefix}city disaster_ - Info bencana
_${usedPrefix}city stats_ - Statistik detail
    `
    
    return fukusima.reply(m.chat, stats, m, {
      mentions: [c.mayor]
    })
  }

  if (cmd === "next") {
    let earn = calculateDailyIncome()
    c.money += earn
    c.exp += Math.floor(earn / 10)
    c.day++
    updateCity()
    levelUp()

    return fukusima.reply(
      m.chat,
      `📅 *HARI BERJALAN #${c.day}*
💰 Pendapatan: +$${earn.toLocaleString()}
👪 Populasi: ${c.population.toLocaleString()} (+${Math.floor(c.population * 0.02)})
😊 Kebahagiaan: ${c.happiness}%
⚡ Listrik: ${Math.floor(c.power)}%
💧 Air: ${Math.floor(c.water)}%
📊 Pengangguran: ${c.unemployment}%

${c.logs.slice(-3).map(log => `• ${log}`).join('\n') || 'Tidak ada aktivitas hari ini.'}`,
      m
    )
  }

  if (cmd === "build") {
    let type = args[1]?.toLowerCase()
    if (!type) {
      let buildingList = `
🏗️ *DAFTAR BANGUNAN*

🏠 *PERUMAHAN*
• house ($500) +25 populasi
• apartment ($2,000) +100 populasi
• mansion ($5,000) +250 populasi, +5 kebahagiaan
• skyscraper ($20,000) +1000 populasi, +10 reputasi

🏥 *KESEHATAN*
• clinic ($1,500) +10 kesehatan
• hospital ($5,000) +30 kesehatan
• research_hospital ($15,000) +50 kesehatan, +20 research/day

👮 *KEAMANAN*
• police ($2,000) -10% kejahatan
• prison ($3,500) -15% kejahatan, -5 kebahagiaan
• court ($4,000) -5% kejahatan, +5 reputasi

⚡ *ENERGI*
• powerplant ($3,000) +300 listrik
• solar_farm ($8,000) +200 listrik, -5 polusi
• nuclear_plant ($25,000) +800 listrik, +20 polusi, +50 research

💧 *AIR*
• waterpump ($2,500) +300 air
• dam ($10,000) +800 air, +10 kebahagiaan
• sewage_plant ($6,000) -15 polusi

🎓 *PENDIDIKAN*
• school ($3,000) +20 pendidikan
• university ($10,000) +40 pendidikan, +50 research/day
• lab ($15,000) +100 research/day, +10 teknologi

🌾 *PERTANIAN*
• farm ($1,000) +50 makanan
• vertical_farm ($5,000) +150 makanan, -5 polusi

🎭 *REKREASI*
• park ($800) +10 kebahagiaan, -2 polusi
• stadium ($5,000) +20 kebahagiaan, +10 budaya
• cinema ($3,000) +15 kebahagiaan
• mall ($8,000) +25 kebahagiaan, +500 income/day

🏭 *INDUSTRI*
• factory ($1,200) +300 income/day, +10 polusi
• tech_factory ($15,000) +800 income/day, +50 research/day

Contoh: ${usedPrefix}city build hospital
      `
      return fukusima.reply(m.chat, buildingList, m)
    }

    const buildingData = {
      house: { cost: 500, effect: { population: 25 } },
      apartment: { cost: 2000, effect: { population: 100 } },
      mansion: { cost: 5000, effect: { population: 250, happiness: 5 } },
      skyscraper: { cost: 20000, effect: { population: 1000, reputation: 10 }, requirement: { level: 15 } },
      
      clinic: { cost: 1500, effect: { health: 10 } },
      hospital: { cost: 5000, effect: { health: 30 } },
      research_hospital: { cost: 15000, effect: { health: 50, research: 20 }, requirement: { technology: 30 } },
      
      police: { cost: 2000, effect: { crime: -10 } },
      prison: { cost: 3500, effect: { crime: -15, happiness: -5 } },
      court: { cost: 4000, effect: { crime: -5, reputation: 5 } },
      
      powerplant: { cost: 3000, effect: { power: 300 } },
      solar_farm: { cost: 8000, effect: { power: 200, pollution: -5 } },
      nuclear_plant: { cost: 25000, effect: { power: 800, pollution: 20, research: 50 }, requirement: { technology: 50 } },
      
      waterpump: { cost: 2500, effect: { water: 300 } },
      dam: { cost: 10000, effect: { water: 800, happiness: 10 } },
      sewage_plant: { cost: 6000, effect: { pollution: -15 } },
      
      school: { cost: 3000, effect: { education: 20 } },
      university: { cost: 10000, effect: { education: 40, research: 50 } },
      lab: { cost: 15000, effect: { research: 100, technology: 10 } },
      
      farm: { cost: 1000, effect: { food: 50 } },
      vertical_farm: { cost: 5000, effect: { food: 150, pollution: -5 }, requirement: { technology: 20 } },
      
      park: { cost: 800, effect: { happiness: 10, pollution: -2 } },
      stadium: { cost: 5000, effect: { happiness: 20, culture: 10 } },
      cinema: { cost: 3000, effect: { happiness: 15 } },
      mall: { cost: 8000, effect: { happiness: 25 } },
      
      factory: { cost: 1200, effect: { pollution: 10 } },
      tech_factory: { cost: 15000, effect: { research: 50 }, requirement: { technology: 40 } }
    }

    if (!buildingData[type]) return fukusima.reply(m.chat, "❌ Bangunan tidak dikenal!", m)

    let building = buildingData[type]
    
    if (building.requirement) {
      for (let req in building.requirement) {
        if (c[req] < building.requirement[req]) {
          return fukusima.reply(m.chat, `❌ Membutuhkan ${req} level ${building.requirement[req]}!`, m)
        }
      }
    }
    
    if (c.money < building.cost) {
      return fukusima.reply(m.chat, `❌ Uang tidak cukup! Butuh $${building.cost}, punya $${c.money}`, m)
    }

    c.money -= building.cost
    c.buildings[type] = (c.buildings[type] || 0) + 1
    
    Object.keys(building.effect).forEach(effect => {
      if (effect === 'population') c.population += building.effect[effect]
      else if (effect === 'crime') c.crime += building.effect[effect]
      else c[effect] += building.effect[effect]
    })
    
    c.logs.push(`🏗️ Dibangun ${type} ($${building.cost})`)
    
    return fukusima.reply(m.chat, `✅ Berhasil membangun *${type}* seharga $${building.cost}!\n${Object.keys(building.effect).map(e => `• ${e}: ${building.effect[e] > 0 ? '+' : ''}${building.effect[e]}`).join('\n')}`, m)
  }

  if (cmd === "zone") {
    let type = args[1]?.toLowerCase()
    if (!type) {
      return fukusima.reply(m.chat, `
🗺️ *JENIS ZONA:*
• residential (R) - $1,000 - +50 populasi maksimum
• commercial (C) - $1,500 - +$500 income/day
• industrial (I) - $2,000 - +$800 income/day, +5 polusi
• agricultural (A) - $800 - +100 makanan
• recreational (RC) - $1,200 - +10 kebahagiaan
• scientific (S) - $3,000 - +20 research/day
• military (M) - $5,000 - +10 pertahanan

Contoh: ${usedPrefix}city zone commercial
      `.trim(), m)
    }

    const zoneData = {
      residential: { cost: 1000, effect: { population: 50 } },
      commercial: { cost: 1500, effect: {} },
      industrial: { cost: 2000, effect: { pollution: 5 } },
      agricultural: { cost: 800, effect: { food: 100 } },
      recreational: { cost: 1200, effect: { happiness: 10 } },
      scientific: { cost: 3000, effect: { research: 20 } },
      military: { cost: 5000, effect: { defense: 10 } }
    }

    if (!zoneData[type]) return fukusima.reply(m.chat, "❌ Zona tidak valid!", m)

    if (c.money < zoneData[type].cost) {
      return fukusima.reply(m.chat, `❌ Uang tidak cukup! Butuh $${zoneData[type].cost}`, m)
    }

    c.money -= zoneData[type].cost
    c.zones[type] = (c.zones[type] || 0) + 1
    
    Object.keys(zoneData[type].effect).forEach(effect => {
      c[effect] += zoneData[type].effect[effect]
    })
    
    c.logs.push(`🗺️ Zona ${type} ditambahkan`)
    
    return fukusima.reply(m.chat, `✅ Berhasil menambah zona *${type}* seharga $${zoneData[type].cost}`, m)
  }

  if (cmd === "tax") {
    let val = parseInt(args[1])
    if (isNaN(val) || val < 1 || val > 30) return fukusima.reply(m.chat, "❌ Pajak harus antara 1-30%", m)
    
    let oldTax = c.tax
    c.tax = val
    
    if (val > 25) c.happiness -= 10
    else if (val < 5) c.happiness += 5
    
    c.logs.push(`💰 Pajak diubah dari ${oldTax}% ke ${val}%`)
    
    return fukusima.reply(m.chat, `✅ Pajak diatur ke *${val}%*\n${val > 25 ? '⚠️ Pajak terlalu tinggi mengurangi kebahagiaan!' : val < 5 ? '🎉 Pajak rendah meningkatkan kebahagiaan!' : ''}`, m)
  }

  if (cmd === "rename") {
    let name = args.slice(1).join(' ')
    if (!name) return fukusima.reply(m.chat, "❌ Berikan nama baru untuk kota!", m)
    if (name.length > 20) return fukusima.reply(m.chat, "❌ Nama terlalu panjang! Maks 20 karakter", m)
    if (c.money < 1000) return fukusima.reply(m.chat, "❌ Butuh $1,000 untuk mengganti nama kota", m)
    
    c.money -= 1000
    let oldName = c.name
    c.name = name
    c.logs.push(`🏙️ Nama kota diubah dari "${oldName}" ke "${name}"`)
    
    return fukusima.reply(m.chat, `✅ Nama kota berhasil diubah menjadi *${name}* (Biaya: $1,000)`, m)
  }

  if (cmd === "log") {
    return fukusima.reply(m.chat, `📜 *Log Kota ${c.name}*\n\n${c.logs.slice(-20).join('\n') || 'Belum ada log'}`, m)
  }

  if (cmd === "stats") {
    let buildingCount = Object.values(c.buildings).reduce((a, b) => a + b, 0)
    let zoneCount = Object.values(c.zones).reduce((a, b) => a + b, 0)
    
    let stats = `
📊 *STATISTIK DETAIL ${c.name}*

🏙️ *UMUM*
• Level: ${c.level}
• Hari: ${c.day}
• Bencana: ${c.disasters}
• Event: ${c.events.length}
• Achievement: ${c.achievements.length}

🏗️ *INFRASTRUKTUR*
• Total Bangunan: ${buildingCount}
• Total Zona: ${zoneCount}
• Jalan: ${c.transport.roads} km
• Jalan Tol: ${c.transport.highways}
• Rel Kereta: ${c.transport.railways}

💰 *EKONOMI*
• Income/hari: $${calculateDailyIncome().toLocaleString()}
• Tax Revenue: $${Math.floor(c.population * c.tax * 0.1).toLocaleString()}
• Commercial Revenue: $${(c.zones.commercial * 500).toLocaleString()}
• Industrial Revenue: $${(c.zones.industrial * 800).toLocaleString()}

👥 *POPULASI*
• Growth Rate: ${((c.happiness / 100) * 0.02 * 100).toFixed(2)}%/hari
• Density: ${(c.population / (zoneCount * 1000)).toFixed(2)} orang/km²
• Life Expectancy: ${Math.floor(60 + c.health / 2)} tahun

🌍 *LINGKUNGAN*
• Air Quality: ${100 - c.pollution}%
• Green Space: ${(c.buildings.park * 5)}%
• Renewable Energy: ${(c.buildings.solar_farm * 20)}%

🎯 *PRESTASI*
${c.achievements.map(a => `• ${a}`).join('\n') || 'Belum ada'}
    `.trim()
    
    return fukusima.reply(m.chat, stats, m)
  }

  if (cmd === "destroy") {
    let type = args[1]?.toLowerCase()
    if (!type) return fukusima.reply(m.chat, "❌ Berikan jenis bangunan yang akan dihancurkan!", m)
    
    if (!c.buildings[type] || c.buildings[type] <= 0) {
      return fukusima.reply(m.chat, `❌ Tidak ada bangunan ${type} di kota!`, m)
    }
    
    let refund = Math.floor(buildingData[type]?.cost * 0.3 || 500)
    c.buildings[type]--
    c.money += refund
    c.pollution -= 2
    c.logs.push(`💥 Bangunan ${type} dihancurkan (+$${refund})`)
    
    return fukusima.reply(m.chat, `💥 Bangunan *${type}* dihancurkan!\n💰 Mendapat refund: $${refund}`, m)
  }

  return fukusima.reply(m.chat, "❌ Perintah tidak dikenali! Ketik *.city* untuk melihat menu", m)
}

handler.help = ["city [build|zone|tax|next|rename|log|stats|destroy]"]
handler.tags = ["rpg", "game"]
handler.command = ["city", "kota"]
handler.group = true
handler.limit = true

export default handler