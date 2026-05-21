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

  const projects = {
    spaceport: {
      name: "Spaceport",
      cost: 500000,
      duration: 30,
      requirements: { level: 25, technology: 100, money: 100000 },
      effects: { research: 500, tourism: 100, reputation: 50 },
      description: "Pelabuhan antariksa untuk penelitian dan turis"
    },
    megamall: {
      name: "Megamall",
      cost: 200000,
      duration: 20,
      requirements: { level: 15, population: 50000, commercial: 10 },
      effects: { happiness: 30, money: 10000 },
      description: "Pusat perbelanjaan terbesar di dunia"
    },
    ai_city: {
      name: "AI Powered City",
      cost: 1000000,
      duration: 60,
      requirements: { level: 40, technology: 200, research: 5000 },
      effects: { efficiency: 50, crime: -50, education: 40 },
      description: "Kota cerdas dengan AI mengelola semua sistem"
    },
    undersea_base: {
      name: "Undersea Research Base",
      cost: 750000,
      duration: 45,
      requirements: { level: 30, technology: 150, defense: 100 },
      effects: { research: 300, defense: 100, reputation: 30 },
      description: "Basis penelitian bawah laut rahasia"
    },
    fusion_reactor: {
      name: "Fusion Reactor",
      cost: 300000,
      duration: 25,
      requirements: { level: 20, technology: 80, powerplant: 5 },
      effects: { power: 5000, pollution: -50 },
      description: "Sumber energi bersih tak terbatas"
    },
    maglev_network: {
      name: "Maglev Network",
      cost: 400000,
      duration: 35,
      requirements: { level: 22, transport: 50, technology: 120 },
      effects: { happiness: 25, efficiency: 30 },
      description: "Jaringan transportasi ultra-cepat"
    },
    orbital_elevator: {
      name: "Orbital Elevator",
      cost: 2000000,
      duration: 90,
      requirements: { level: 50, technology: 300, spaceport: 1 },
      effects: { tourism: 500, research: 1000, reputation: 100 },
      description: "Elevator menuju orbit bumi"
    },
    bio_dome: {
      name: "Bio-Dome Ecosystem",
      cost: 150000,
      duration: 15,
      requirements: { level: 12, environment: 50, park: 10 },
      effects: { pollution: -80, happiness: 40, health: 30 },
      description: "Ekosistem tertutup dengan udara bersih"
    },
    quantum_computer: {
      name: "Quantum Computer",
      cost: 600000,
      duration: 40,
      requirements: { level: 35, technology: 250, lab: 5 },
      effects: { research: 1000, efficiency: 40, technology: 50 },
      description: "Komputer kuantum untuk penelitian"
    },
    disaster_shield: {
      name: "Disaster Shield",
      cost: 800000,
      duration: 50,
      requirements: { level: 28, defense: 150, technology: 180 },
      effects: { disasters: -90, defense: 200, happiness: 20 },
      description: "Perisai pelindung dari semua bencana"
    }
  }

  if (!cmd) {
    let projectList = `
🏗️ *PROYEK BESAR ${c.name}*

📋 *PROYEK TERSEDIA:*
${Object.entries(projects).map(([id, proj]) => {
  let canBuild = true
  let missing = []
  
  for (let req in proj.requirements) {
    if (req === 'level' && c.level < proj.requirements[req]) {
      canBuild = false
      missing.push(`Level ${proj.requirements[req]}`)
    } else if (req === 'technology' && c.technology < proj.requirements[req]) {
      canBuild = false
      missing.push(`Tech ${proj.requirements[req]}`)
    } else if (req === 'population' && c.population < proj.requirements[req]) {
      canBuild = false
      missing.push(`Pop ${proj.requirements[req]}`)
    } else if (req === 'money' && c.money < proj.requirements[req]) {
      canBuild = false
      missing.push(`$${proj.requirements[req]}`)
    } else if (c[req] < proj.requirements[req]) {
      canBuild = false
      missing.push(`${req} ${proj.requirements[req]}`)
    }
  }
  
  return `• *${proj.name}*${canBuild ? ' ✅' : ' 🔒'}\n  💰 $${proj.cost.toLocaleString()} | ⏰ ${proj.duration} hari\n  📝 ${proj.description}\n  ${!canBuild ? `❌ Butuh: ${missing.join(', ')}\n` : ''}`
}).join('\n')}

📊 *PROYEK BERJALAN:*
${c.projects && c.projects.length > 0 ? 
  c.projects.map(p => `• ${p.name} (${p.progress}/${p.duration} hari)`).join('\n') : 
  'Tidak ada proyek berjalan'}

🎯 *PERINTAH:*
${usedPrefix}project start [nama] - Mulai proyek
${usedPrefix}project check - Cek progress
${usedPrefix}project cancel [nama] - Batalkan proyek
${usedPrefix}project speedup [nama] - Percepat proyek
    `.trim()
    
    return fukusima.reply(m.chat, projectList, m)
  }

  if (cmd === "start") {
    let projectName = args.slice(1).join(' ').toLowerCase()
    let project = null
    let projectId = null
    
    for (let id in projects) {
      if (projects[id].name.toLowerCase().includes(projectName) || 
          id.toLowerCase().includes(projectName)) {
        project = projects[id]
        projectId = id
        break
      }
    }
    
    if (!project) return fukusima.reply(m.chat, "❌ Proyek tidak ditemukan!", m)
    
    if (!c.projects) c.projects = []
    if (c.projects.length >= 3) {
      return fukusima.reply(m.chat, "❌ Maksimal 3 proyek berjalan bersamaan!", m)
    }
    
    if (c.projects.some(p => p.id === projectId)) {
      return fukusima.reply(m.chat, "❌ Proyek ini sudah berjalan!", m)
    }
    
    for (let req in project.requirements) {
      if (req === 'level' && c.level < project.requirements[req]) {
        return fukusima.reply(m.chat, `❌ Butuh level ${project.requirements[req]}!`, m)
      } else if (req === 'technology' && c.technology < project.requirements[req]) {
        return fukusima.reply(m.chat, `❌ Butuh technology ${project.requirements[req]}!`, m)
      } else if (req === 'population' && c.population < project.requirements[req]) {
        return fukusima.reply(m.chat, `❌ Butuh populasi ${project.requirements[req]}!`, m)
      } else if (req === 'money' && c.money < project.requirements[req]) {
        return fukusima.reply(m.chat, `❌ Butuh $${project.requirements[req]}!`, m)
      } else if (c[req] < project.requirements[req]) {
        return fukusima.reply(m.chat, `❌ Butuh ${req} ${project.requirements[req]}!`, m)
      }
    }
    
    if (c.money < project.cost) {
      return fukusima.reply(m.chat, `❌ Uang tidak cukup! Butuh $${project.cost.toLocaleString()}`, m)
    }
    
    c.money -= project.cost
    c.projects.push({
      id: projectId,
      name: project.name,
      cost: project.cost,
      duration: project.duration,
      progress: 0,
      started: Date.now(),
      effects: project.effects
    })
    
    c.logs.push(`🏗️ Memulai proyek ${project.name} ($${project.cost.toLocaleString()})`)
    
    return fukusima.reply(m.chat, `🏗️ *PROYEK DIMULAI!*\n\n📝 ${project.name}\n💰 Biaya: $${project.cost.toLocaleString()}\n⏰ Durasi: ${project.duration} hari\n📊 Progress: 0/${project.duration}\n\nGunakan *${usedPrefix}project check* untuk melihat progress`, m)
  }

  if (cmd === "check") {
    if (!c.projects || c.projects.length === 0) {
      return fukusima.reply(m.chat, "📭 Tidak ada proyek berjalan!", m)
    }
    
    let now = Date.now()
    let projectInfo = `🏗️ *PROYEK BERJALAN*\n\n`
    
    c.projects.forEach((proj, i) => {
      let daysPassed = Math.floor((now - proj.started) / (1000 * 60 * 60 * 24))
      proj.progress = Math.min(proj.duration, daysPassed)
      
      let remaining = proj.duration - proj.progress
      let percentage = Math.floor((proj.progress / proj.duration) * 100)
      
      projectInfo += `${i + 1}. *${proj.name}*\n`
      projectInfo += `   📊 Progress: ${proj.progress}/${proj.duration} hari (${percentage}%)\n`
      projectInfo += `   ⏰ Sisa: ${remaining} hari\n`
      projectInfo += `   💰 Biaya: $${proj.cost.toLocaleString()}\n`
      
      if (proj.progress >= proj.duration) {
        projectInfo += `   ✅ *SELESAI!*\n\n`
        
        Object.keys(proj.effects).forEach(effect => {
          c[effect] = (c[effect] || 0) + proj.effects[effect]
        })
        
        c.logs.push(`🎉 Proyek ${proj.name} selesai!`)
        c.projects.splice(i, 1)
      } else {
        projectInfo += `   🏗️ Masih berjalan...\n\n`
      }
    })
    
    return fukusima.reply(m.chat, projectInfo, m)
  }

  if (cmd === "cancel") {
    let projectName = args.slice(1).join(' ').toLowerCase()
    
    if (!c.projects || c.projects.length === 0) {
      return fukusima.reply(m.chat, "❌ Tidak ada proyek berjalan!", m)
    }
    
    let projectIndex = c.projects.findIndex(p => 
      p.name.toLowerCase().includes(projectName) || 
      p.id.toLowerCase().includes(projectName)
    )
    
    if (projectIndex === -1) {
      return fukusima.reply(m.chat, "❌ Proyek tidak ditemukan!", m)
    }
    
    let project = c.projects[projectIndex]
    let refund = Math.floor(project.cost * 0.5)
    
    c.money += refund
    c.projects.splice(projectIndex, 1)
    
    c.logs.push(`❌ Proyek ${project.name} dibatalkan (+$${refund})`)
    
    return fukusima.reply(m.chat, `❌ Proyek *${project.name}* dibatalkan!\n💰 Refund: $${refund.toLocaleString()}`, m)
  }

  if (cmd === "speedup") {
    let projectName = args.slice(1).join(' ').toLowerCase()
    
    if (!c.projects || c.projects.length === 0) {
      return fukusima.reply(m.chat, "❌ Tidak ada proyek berjalan!", m)
    }
    
    let project = c.projects.find(p => 
      p.name.toLowerCase().includes(projectName) || 
      p.id.toLowerCase().includes(projectName)
    )
    
    if (!project) {
      return fukusima.reply(m.chat, "❌ Proyek tidak ditemukan!", m)
    }
    
    let speedupCost = Math.floor(project.cost * 0.1)
    if (c.money < speedupCost) {
      return fukusima.reply(m.chat, `❌ Butuh $${speedupCost} untuk mempercepat!`, m)
    }
    
    c.money -= speedupCost
    project.progress = Math.min(project.duration, project.progress + 3)
    
    c.logs.push(`⚡ Mempercepat proyek ${project.name} ($${speedupCost})`)
    
    return fukusima.reply(m.chat, `⚡ Proyek *${project.name}* dipercepat!\n📊 Progress: +3 hari\n💰 Biaya: $${speedupCost}`, m)
  }
}

handler.help = ["project [start|check|cancel|speedup]"]
handler.tags = ["rpg", "game"]
handler.command = ["project", "proyek"]
handler.group = true

export default handler