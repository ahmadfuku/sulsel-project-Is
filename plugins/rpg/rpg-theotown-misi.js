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

  const missions = {
    daily: [
      { id: "collect_taxes", name: "Kumpulkan Pajak", target: 10000, reward: { money: 5000, exp: 100 }, description: "Kumpulkan $10,000 dari pajak" },
      { id: "build_house", name: "Bangun Perumahan", target: 5, reward: { population: 100, happiness: 5 }, description: "Bangun 5 rumah" },
      { id: "reduce_pollution", name: "Kurangi Polusi", target: 20, reward: { happiness: 15, environment: 10 }, description: "Kurangi polusi 20 poin" },
      { id: "increase_population", name: "Tambah Populasi", target: 500, reward: { money: 3000, exp: 150 }, description: "Tambah 500 populasi" }
    ],
    weekly: [
      { id: "complete_project", name: "Selesaikan Proyek", target: 1, reward: { money: 20000, research: 200 }, description: "Selesaikan 1 proyek besar" },
      { id: "reach_level", name: "Capai Level", target: 5, reward: { money: 10000, reputation: 25 }, description: "Naik 5 level kota" },
      { id: "build_infrastructure", name: "Bangun Infrastruktur", target: 10, reward: { money: 15000, technology: 10 }, description: "Bangun 10 bangunan" }
    ],
    achievement: [
      { id: "million_city", name: "Kota Sejuta", target: 1000000, reward: { money: 100000, reputation: 100 }, description: "Capai 1 juta populasi" },
      { id: "zero_pollution", name: "Nol Polusi", target: 0, reward: { happiness: 50, environment: 50 }, description: "Capai 0 polusi" },
      { id: "perfect_city", name: "Kota Sempurna", target: 100, reward: { money: 50000, reputation: 75 }, description: "Capai 100% kebahagiaan" },
      { id: "tech_leader", name: "Pemimpin Teknologi", target: 100, reward: { research: 1000, technology: 25 }, description: "Capai tech level 100" }
    ]
  }

  if (!c.missions) {
    c.missions = {
      daily: [],
      weekly: [],
      achievement: [],
      completed: [],
      lastDaily: 0,
      lastWeekly: 0
    }
  }

  if (!cmd) {
    let now = Date.now()
    let dailyReset = 24 * 60 * 60 * 1000
    let weeklyReset = 7 * 24 * 60 * 60 * 1000
    
    if (now - c.missions.lastDaily > dailyReset) {
      c.missions.daily = []
      c.missions.lastDaily = now
    }
    
    if (now - c.missions.lastWeekly > weeklyReset) {
      c.missions.weekly = []
      c.missions.lastWeekly = now
    }
    
    if (c.missions.daily.length < 3) {
      let available = missions.daily.filter(m => !c.missions.daily.some(cm => cm.id === m.id))
      while (c.missions.daily.length < 3 && available.length > 0) {
        let mission = available[Math.floor(Math.random() * available.length)]
        c.missions.daily.push({ ...mission, progress: 0 })
        available = available.filter(m => m.id !== mission.id)
      }
    }
    
    if (c.missions.weekly.length < 2) {
      let available = missions.weekly.filter(m => !c.missions.weekly.some(cm => cm.id === m.id))
      while (c.missions.weekly.length < 2 && available.length > 0) {
        let mission = available[Math.floor(Math.random() * available.length)]
        c.missions.weekly.push({ ...mission, progress: 0 })
        available = available.filter(m => m.id !== mission.id)
      }
    }
    
    if (c.missions.achievement.length < 4) {
      missions.achievement.forEach(mission => {
        if (!c.missions.achievement.some(m => m.id === mission.id) && 
            !c.missions.completed.some(m => m.id === mission.id)) {
          c.missions.achievement.push({ ...mission, progress: 0 })
        }
      })
    }

    let missionDisplay = `
🎯 *MISI KOTA ${c.name}*

📅 *MISI HARIAN:* (Reset setiap 24 jam)
${c.missions.daily.map((m, i) => 
  `${i + 1}. ${m.name}\n   📝 ${m.description}\n   📊 ${m.progress}/${m.target}\n   🎁 Reward: ${Object.entries(m.reward).map(([k, v]) => `${k} +${v}`).join(', ')}`
).join('\n\n') || 'Tidak ada misi harian'}

📆 *MISI MINGGUAN:* (Reset setiap 7 hari)
${c.missions.weekly.map((m, i) => 
  `${i + 1}. ${m.name}\n   📝 ${m.description}\n   📊 ${m.progress}/${m.target}\n   🎁 Reward: ${Object.entries(m.reward).map(([k, v]) => `${k} +${v}`).join(', ')}`
).join('\n\n') || 'Tidak ada misi mingguan'}

🏆 *PENCAPAIAN:*
${c.missions.achievement.map((m, i) => 
  `${i + 1}. ${m.name}\n   📝 ${m.description}\n   📊 ${getProgress(m.id)}/${m.target}\n   🎁 Reward: ${Object.entries(m.reward).map(([k, v]) => `${k} +${v}`).join(', ')}`
).join('\n\n') || 'Tidak ada pencapaian'}

✅ *SELESAI:* ${c.missions.completed.length}

🎯 *PERINTAH:*
${usedPrefix}mission check - Update progress
${usedPrefix}mission claim [nomor] - Klaim reward
${usedPrefix}mission list - Lihat semua misi
    `.trim()
    
    return fukusima.reply(m.chat, missionDisplay, m)
  }

  if (cmd === "check") {
    updateMissionProgress()
    
    return fukusima.reply(m.chat, "✅ Progress misi telah diperbarui!", m)
  }

  if (cmd === "claim") {
    let missionNum = parseInt(args[1]) - 1
    let type = args[2]?.toLowerCase() || 'daily'
    
    if (isNaN(missionNum) || missionNum < 0) {
      return fukusima.reply(m.chat, "❌ Berikan nomor misi yang valid!", m)
    }
    
    let missionList = c.missions[type]
    if (!missionList || missionNum >= missionList.length) {
      return fukusima.reply(m.chat, "❌ Misi tidak ditemukan!", m)
    }
    
    let mission = missionList[missionNum]
    updateMissionProgress()
    
    let currentProgress = getProgress(mission.id, type)
    if (currentProgress < mission.target) {
      return fukusima.reply(m.chat, `❌ Misi belum selesai! Progress: ${currentProgress}/${mission.target}`, m)
    }
    
    Object.entries(mission.reward).forEach(([key, value]) => {
      if (key === 'money') c.money += value
      else if (key === 'exp') c.exp += value
      else if (key === 'population') c.population += value
      else c[key] = (c[key] || 0) + value
    })
    
    c.missions.completed.push({
      id: mission.id,
      name: mission.name,
      completed: Date.now()
    })
    
    missionList.splice(missionNum, 1)
    
    c.logs.push(`🎯 Menyelesaikan misi ${mission.name}`)
    
    return fukusima.reply(m.chat, `✅ *MISI SELESAI!*\n\n🏆 ${mission.name}\n🎁 Reward diterima:\n${Object.entries(mission.reward).map(([k, v]) => `• ${k}: +${v}`).join('\n')}`, m)
  }

  if (cmd === "list") {
    let allMissions = `
📋 *SEMUA MISI TERSEDIA*

📅 *HARIAN:*
${missions.daily.map((m, i) => `${i + 1}. ${m.name} - ${m.description}`).join('\n')}

📆 *MINGGUAN:*
${missions.weekly.map((m, i) => `${i + 1}. ${m.name} - ${m.description}`).join('\n')}

🏆 *PENCAPAIAN:*
${missions.achievement.map((m, i) => `${i + 1}. ${m.name} - ${m.description}`).join('\n')}
    `.trim()
    
    return fukusima.reply(m.chat, allMissions, m)
  }

  function getProgress(missionId, type) {
    switch (missionId) {
      case 'collect_taxes': return Math.floor(c.population * c.tax * 0.1)
      case 'build_house': return c.buildings.house || 0
      case 'reduce_pollution': return 100 - c.pollution
      case 'increase_population': return c.population
      case 'complete_project': return c.projects?.filter(p => p.progress >= p.duration).length || 0
      case 'reach_level': return c.level
      case 'build_infrastructure': return Object.values(c.buildings).reduce((a, b) => a + b, 0)
      case 'million_city': return c.population
      case 'zero_pollution': return 100 - c.pollution
      case 'perfect_city': return c.happiness
      case 'tech_leader': return c.technology
      default: return 0
    }
  }

  function updateMissionProgress() {
    c.missions.daily.forEach(mission => {
      mission.progress = getProgress(mission.id, 'daily')
    })
    
    c.missions.weekly.forEach(mission => {
      mission.progress = getProgress(mission.id, 'weekly')
    })
    
    c.missions.achievement.forEach(mission => {
      mission.progress = getProgress(mission.id, 'achievement')
    })
  }
}

handler.help = ["mission [check|claim|list]"]
handler.tags = ["rpg", "game"]
handler.command = ["mission", "misi"]
handler.group = true

export default handler