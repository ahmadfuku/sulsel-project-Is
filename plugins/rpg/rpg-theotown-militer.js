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

  if (!c.army) {
    c.army = {
      infantry: 0,
      tanks: 0,
      aircraft: 0,
      navy: 0,
      special_forces: 0,
      defense_systems: 0,
      experience: 0,
      morale: 100,
      attacks: 0,
      defenses: 0,
      victories: 0
    }
  }

  const armyUnits = {
    infantry: { cost: 100, maintenance: 10, power: 5, requirement: { barracks: 1 } },
    tanks: { cost: 500, maintenance: 50, power: 25, requirement: { barracks: 2, technology: 10 } },
    aircraft: { cost: 2000, maintenance: 200, power: 100, requirement: { airport: 1, technology: 20 } },
    navy: { cost: 3000, maintenance: 300, power: 150, requirement: { port: 1, technology: 30 } },
    special_forces: { cost: 1000, maintenance: 100, power: 75, requirement: { barracks: 3, technology: 15 } },
    defense_systems: { cost: 1500, maintenance: 150, power: 0, defense: 200, requirement: { technology: 25 } }
  }

  if (!cmd) {
    let armyPower = calculateArmyPower()
    let defensePower = calculateDefensePower()
    
    let armyDisplay = `
⚔️ *MILITER ${c.name}*
🛡️ Defense Power: ${defensePower}
⚔️ Attack Power: ${armyPower}
⭐ Experience: ${c.army.experience}
🎖️ Morale: ${c.army.morale}%
🏆 Victories: ${c.army.victories}

👥 *UNIT MILITER:*
${Object.entries(c.army).filter(([key, val]) => typeof val === 'number' && armyUnits[key]).map(([unit, count]) => 
  `• ${unit}: ${count} (Power: ${count * (armyUnits[unit].power || 0)})`
).join('\n')}

💰 *MAINTENANCE/HARI:* $${calculateMaintenance().toLocaleString()}

🏗️ *REQUIREMENTS:*
${Object.entries(armyUnits).map(([unit, data]) => 
  `• ${unit}: ${Object.entries(data.requirement).map(([req, val]) => `${req} ${val}`).join(', ')}`
).join('\n')}

🎯 *PERINTAH:*
${usedPrefix}army recruit [unit] [jumlah] - Rekrut unit
${usedPrefix}army attack [@user] - Serang kota lain
${usedPrefix}army defend - Perkuat pertahanan
${usedPrefix}army train - Latih tentara
${usedPrefix}army spy [@user] - Mata-mata
${usedPrefix}army alliance [create|join|invite] - Aliansi
    `.trim()
    
    return fukusima.reply(m.chat, armyDisplay, m)
  }

  if (cmd === "recruit") {
    let unit = args[1]?.toLowerCase()
    let amount = parseInt(args[2]) || 1
    
    if (!unit || !armyUnits[unit]) {
      return fukusima.reply(m.chat, `❌ Unit tidak valid!\nPilihan: ${Object.keys(armyUnits).join(', ')}`, m)
    }
    
    let unitData = armyUnits[unit]
    
    for (let req in unitData.requirement) {
      if (req === 'technology') {
        if (c.technology < unitData.requirement[req]) {
          return fukusima.reply(m.chat, `❌ Butuh technology level ${unitData.requirement[req]}!`, m)
        }
      } else if (c.buildings[req] < unitData.requirement[req]) {
        return fukusima.reply(m.chat, `❌ Butuh ${req} level ${unitData.requirement[req]}!`, m)
      }
    }
    
    let totalCost = unitData.cost * amount
    
    if (c.money < totalCost) {
      return fukusima.reply(m.chat, `❌ Uang tidak cukup! Butuh $${totalCost}`, m)
    }
    
    if (c.population < amount * 10) {
      return fukusima.reply(m.chat, `❌ Populasi tidak cukup! Butuh ${amount * 10} populasi`, m)
    }
    
    c.money -= totalCost
    c.army[unit] += amount
    c.population -= Math.floor(amount * 0.5)
    c.happiness -= amount * 0.5
    
    c.logs.push(`⚔️ Merekrut ${amount} ${unit} ($${totalCost})`)
    
    return fukusima.reply(m.chat, `✅ Berhasil merekrut ${amount} ${unit}!\n💰 Biaya: $${totalCost}\n👥 Populasi berkurang: ${Math.floor(amount * 0.5)}`, m)
  }

  if (cmd === "attack") {
    if (!m.mentionedJid || m.mentionedJid.length === 0) {
      return fukusima.reply(m.chat, "❌ Tag kota yang ingin diserang!", m)
    }
    
    let target = m.mentionedJid[0]
    
    if (target === m.sender) {
      return fukusima.reply(m.chat, "❌ Tidak bisa menyerang diri sendiri!", m)
    }
    
    if (!global.db.data.users[target] || !global.db.data.users[target].city) {
      return fukusima.reply(m.chat, "❌ Kota target tidak ditemukan!", m)
    }
    
    let attackerPower = calculateArmyPower()
    let targetCity = global.db.data.users[target].city
    let defenderPower = calculateDefensePower(targetCity)
    
    if (attackerPower < 100) {
      return fukusima.reply(m.chat, "❌ Power militer terlalu lemah untuk menyerang!", m)
    }
    
    let cost = attackerPower * 10
    if (c.money < cost) {
      return fukusima.reply(m.chat, `❌ Butuh $${cost} untuk biaya serangan!`, m)
    }
    
    c.money -= cost
    c.army.attacks++
    
    let victoryChance = (attackerPower / (attackerPower + defenderPower)) * 100
    let random = Math.random() * 100
    
    if (random <= victoryChance) {
      let loot = Math.floor(targetCity.money * 0.3)
      let resourceLoot = {}
      
      c.money += loot
      c.army.victories++
      c.army.experience += 50
      c.army.morale = Math.min(100, c.army.morale + 10)
      
      targetCity.money -= loot
      targetCity.happiness -= 20
      targetCity.army.defenses++
      targetCity.army.morale = Math.max(0, targetCity.army.morale - 20)
      
      c.logs.push(`⚔️ Menyerang @${target.split('@')[0]} dan MENANG! +$${loot}`)
      targetCity.logs.push(`💥 Diserang oleh @${m.sender.split('@')[0]} dan KALAH! -$${loot}`)
      
      return fukusima.reply(m.chat, `🎖️ *KEMENANGAN!*\n\n⚔️ Power: ${attackerPower} vs ${defenderPower}\n💰 Rampasan: $${loot}\n⭐ Experience: +50\n🎖️ Morale: +10%\n\nKota musuh kehilangan 20% kebahagiaan!`, m, {
        mentions: [target]
      })
    } else {
      let losses = Math.floor(attackerPower * 0.3)
      c.army.morale = Math.max(0, c.army.morale - 15)
      c.happiness -= 10
      
      c.logs.push(`⚔️ Menyerang @${target.split('@')[0]} dan KALAH!`)
      targetCity.logs.push(`🛡️ Berhasil mempertahankan kota dari @${m.sender.split('@')[0]}`)
      
      return fukusima.reply(m.chat, `💥 *KEKALAHAN!*\n\n⚔️ Power: ${attackerPower} vs ${defenderPower}\n💀 Losses: ${losses} power\n🎖️ Morale: -15%\n😊 Kebahagiaan: -10%\n\nKota musuh meningkatkan morale!`, m, {
        mentions: [target]
      })
    }
  }

  if (cmd === "defend") {
    let cost = 5000
    if (c.money < cost) return fukusima.reply(m.chat, `❌ Butuh $${cost} untuk memperkuat pertahanan!`, m)
    
    c.money -= cost
    c.defense += 50
    c.army.defense_systems += 5
    c.happiness += 5
    
    c.logs.push(`🛡️ Memperkuat pertahanan kota ($${cost})`)
    
    return fukusima.reply(m.chat, `🛡️ Pertahanan kota diperkuat!\n⚔️ Defense: +50\n😊 Kebahagiaan: +5%`, m)
  }

  if (cmd === "train") {
    let cost = 2000
    if (c.money < cost) return fukusima.reply(m.chat, `❌ Butuh $${cost} untuk pelatihan!`, m)
    
    c.money -= cost
    c.army.experience += 100
    c.army.morale = Math.min(100, c.army.morale + 20)
    
    Object.keys(c.army).forEach(unit => {
      if (typeof c.army[unit] === 'number' && c.army[unit] > 0 && armyUnits[unit]) {
        c.army[unit] += Math.floor(c.army[unit] * 0.1)
      }
    })
    
    c.logs.push(`🎖️ Melatih tentara ($${cost})`)
    
    return fukusima.reply(m.chat, `🎖️ *PELATIHAN SELESAI!*\n\n⭐ Experience: +100\n🎖️ Morale: +20%\n👥 Semua unit +10%\n💰 Biaya: $${cost}`, m)
  }

  function calculateArmyPower(city = c) {
    if (!city.army) return 0
    let power = 0
    Object.entries(city.army).forEach(([unit, count]) => {
      if (armyUnits[unit]) {
        power += count * (armyUnits[unit].power || 0)
      }
    })
    return power + (city.army.experience / 10)
  }

  function calculateDefensePower(city = c) {
    let defense = city.defense || 0
    if (city.army) {
      defense += city.army.defense_systems * (armyUnits.defense_systems?.defense || 0)
    }
    return defense + (city.army?.morale || 0)
  }

  function calculateMaintenance() {
    let total = 0
    Object.entries(c.army).forEach(([unit, count]) => {
      if (armyUnits[unit]) {
        total += count * (armyUnits[unit].maintenance || 0)
      }
    })
    return total
  }
}

handler.help = ["army [recruit|attack|defend|train]"]
handler.tags = ["rpg", "game"]
handler.command = ["army", "militer"]
handler.group = true

export default handler