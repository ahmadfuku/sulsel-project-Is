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

  const researchTree = {
    energy: [
      { id: "solar_tech", name: "Teknologi Solar", cost: 500, effect: "solar_farm efficiency +50%", requirement: { research: 100 } },
      { id: "nuclear_tech", name: "Teknologi Nuklir", cost: 2000, effect: "nuclear_plant pollution -30%", requirement: { research: 500, technology: 20 } },
      { id: "fusion", name: "Fusion Energy", cost: 10000, effect: "unlock fusion_plant", requirement: { research: 2000, technology: 50 } }
    ],
    environment: [
      { id: "recycling", name: "Daur Ulang", cost: 300, effect: "pollution -10%", requirement: { research: 50 } },
      { id: "clean_air", name: "Teknologi Udara Bersih", cost: 800, effect: "pollution -25%, happiness +5", requirement: { research: 200 } },
      { id: "carbon_capture", name: "Penangkapan Karbon", cost: 2500, effect: "pollution -50%", requirement: { research: 800, technology: 30 } }
    ],
    infrastructure: [
      { id: "smart_grid", name: "Smart Grid", cost: 600, effect: "power efficiency +20%", requirement: { research: 150 } },
      { id: "water_recycling", name: "Daur Ulang Air", cost: 900, effect: "water consumption -30%", requirement: { research: 300 } },
      { id: "vertical_farming", name: "Pertanian Vertikal", cost: 1200, effect: "unlock vertical_farm", requirement: { research: 400 } }
    ],
    military: [
      { id: "defense_system", name: "Sistem Pertahanan", cost: 1500, effect: "defense +50", requirement: { research: 600 } },
      { id: "drone_tech", name: "Teknologi Drone", cost: 3000, effect: "crime -20%, defense +30", requirement: { research: 1200, technology: 40 } },
      { id: "laser_defense", name: "Pertahanan Laser", cost: 8000, effect: "defense +100", requirement: { research: 3000 } }
    ],
    social: [
      { id: "edu_tech", name: "Teknologi Pendidikan", cost: 400, effect: "education +20", requirement: { research: 100 } },
      { id: "health_ai", name: "AI Kesehatan", cost: 1500, effect: "health +30", requirement: { research: 500 } },
      { id: "happiness_tech", name: "Teknologi Kebahagiaan", cost: 2000, effect: "happiness +25", requirement: { research: 800 } }
    ]
  }

  if (!cmd) {
    let researchList = `
🔬 *PUSAT RISET ${c.name}*
💡 Research Points: ${c.research}
⚙️ Technology Level: ${c.technology}

*RISET TERSEDIA:*

⚡ *ENERGI*
${researchTree.energy.map(r => 
  `• ${r.name} (${r.cost} RP)${c.technology >= (r.requirement.technology || 0) && c.research >= r.requirement.research ? ' ✅' : ' 🔒'}`
).join('\n')}

🌿 *LINGKUNGAN*
${researchTree.environment.map(r => 
  `• ${r.name} (${r.cost} RP)${c.technology >= (r.requirement.technology || 0) && c.research >= r.requirement.research ? ' ✅' : ' 🔒'}`
).join('\n')}

🏗️ *INFRASTRUKTUR*
${researchTree.infrastructure.map(r => 
  `• ${r.name} (${r.cost} RP)${c.technology >= (r.requirement.technology || 0) && c.research >= r.requirement.research ? ' ✅' : ' 🔒'}`
).join('\n')}

⚔️ *MILITER*
${researchTree.military.map(r => 
  `• ${r.name} (${r.cost} RP)${c.technology >= (r.requirement.technology || 0) && c.research >= r.requirement.research ? ' ✅' : ' 🔒'}`
).join('\n')}

👥 *SOSIAL*
${researchTree.social.map(r => 
  `• ${r.name} (${r.cost} RP)${c.technology >= (r.requirement.technology || 0) && c.research >= r.requirement.research ? ' ✅' : ' 🔒'}`
).join('\n')}

Perintah:
${usedPrefix}research start [nama_riset] - Mulai riset
${usedPrefix}research complete - Selesaikan riset
${usedPrefix}research points - Hasilkan research points
    `.trim()
    
    return fukusima.reply(m.chat, researchList, m)
  }

  if (cmd === "start") {
    let researchName = args.slice(1).join(' ').toLowerCase()
    let research = null
    let category = null
    
    for (let cat in researchTree) {
      let found = researchTree[cat].find(r => 
        r.name.toLowerCase().includes(researchName) || 
        r.id.toLowerCase().includes(researchName)
      )
      if (found) {
        research = found
        category = cat
        break
      }
    }
    
    if (!research) return fukusima.reply(m.chat, "❌ Riset tidak ditemukan!", m)
    
    if (c.research < research.cost) {
      return fukusima.reply(m.chat, `❌ Research points tidak cukup! Butuh ${research.cost}, punya ${c.research}`, m)
    }
    
    if (research.requirement) {
      if (c.technology < (research.requirement.technology || 0)) {
        return fukusima.reply(m.chat, `❌ Butuh technology level ${research.requirement.technology}!`, m)
      }
      if (c.research < research.requirement.research) {
        return fukusima.reply(m.chat, `❌ Butuh ${research.requirement.research} research points!`, m)
      }
    }
    
    if (!user.city.researchQueue) user.city.researchQueue = []
    if (user.city.researchQueue.length >= 3) {
      return fukusima.reply(m.chat, "❌ Antrian riset penuh! Maks 3 riset", m)
    }
    
    user.city.researchQueue.push({
      id: research.id,
      name: research.name,
      cost: research.cost,
      category: category,
      started: Date.now(),
      duration: research.cost * 60000 // 1 menit per RP
    })
    
    c.research -= research.cost
    
    return fukusima.reply(m.chat, `🔬 *Riset Dimulai!*\n📝 ${research.name}\n⏰ Durasi: ${Math.floor(research.cost)} menit\n💰 Cost: ${research.cost} RP\n\nGunakan *${usedPrefix}research complete* untuk menyelesaikan`, m)
  }

  if (cmd === "complete") {
    if (!user.city.researchQueue || user.city.researchQueue.length === 0) {
      return fukusima.reply(m.chat, "❌ Tidak ada riset dalam antrian!", m)
    }
    
    let completed = []
    let now = Date.now()
    
    for (let i = user.city.researchQueue.length - 1; i >= 0; i--) {
      let research = user.city.researchQueue[i]
      if (now - research.started >= research.duration) {
        completed.push(research)
        user.city.researchQueue.splice(i, 1)
        
        c.technology += 5
        c.logs.push(`🔬 Riset ${research.name} selesai`)
      }
    }
    
    if (completed.length === 0) {
      let nextResearch = user.city.researchQueue[0]
      let timeLeft = Math.ceil((nextResearch.duration - (now - nextResearch.started)) / 60000)
      return fukusima.reply(m.chat, `⏳ Riset masih berjalan...\n⏰ Sisa waktu: ${timeLeft} menit`, m)
    }
    
    let result = `✅ *Riset Selesai!*\n\n`
    completed.forEach(r => {
      result += `• ${r.name}\n  ⚙️ +5 Technology Level\n\n`
    })
    
    result += `Total Technology Level: ${c.technology}`
    
    return fukusima.reply(m.chat, result, m)
  }

  if (cmd === "points") {
    let points = Math.floor(c.buildings.lab * 50 + c.buildings.university * 30 + c.zones.scientific * 20)
    c.research += points
    
    return fukusima.reply(m.chat, `🧪 *Research Points Diperoleh!*\n➕ ${points} RP\n📊 Total: ${c.research} RP\n\nSumber:\n• Lab: ${c.buildings.lab * 50}\n• Universitas: ${c.buildings.university * 30}\n• Zona Ilmiah: ${c.zones.scientific * 20}`, m)
  }

  if (cmd === "queue") {
    if (!user.city.researchQueue || user.city.researchQueue.length === 0) {
      return fukusima.reply(m.chat, "📭 Antrian riset kosong!", m)
    }
    
    let queueList = `📋 *ANTRIAN RISET*\n\n`
    let now = Date.now()
    
    user.city.researchQueue.forEach((r, i) => {
      let timeLeft = Math.ceil((r.duration - (now - r.started)) / 60000)
      let progress = Math.min(100, Math.floor(((now - r.started) / r.duration) * 100))
      queueList += `${i + 1}. ${r.name}\n   ⏰ ${timeLeft}m | 📊 ${progress}%\n   💰 ${r.cost} RP\n\n`
    })
    
    return fukusima.reply(m.chat, queueList, m)
  }
}

handler.help = ["research [start|complete|points|queue]"]
handler.tags = ["rpg", "game"]
handler.command = ["research", "riset"]
handler.group = true

export default handler