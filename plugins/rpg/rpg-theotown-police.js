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

  const policies = {
    economic: [
      { id: "tax_cut", name: "Pemotongan Pajak", cost: 10000, effect: { tax: -5, happiness: 15, money: -2000 }, duration: 7, description: "Turunkan pajak untuk meningkatkan kebahagiaan" },
      { id: "subsidy", name: "Subsidi Perusahaan", cost: 15000, effect: { money: -3000, population: 500, unemployment: -3 }, duration: 10, description: "Beri subsidi untuk menarik perusahaan" },
      { id: "infrastructure_spending", name: "Belanja Infrastruktur", cost: 25000, effect: { money: -5000, happiness: 10, efficiency: 20 }, duration: 14, description: "Investasi besar di infrastruktur" },
      { id: "research_grant", name: "Grant Riset", cost: 20000, effect: { money: -4000, research: 300, technology: 15 }, duration: 12, description: "Dana untuk penelitian" }
    ],
    social: [
      { id: "free_healthcare", name: "Kesehatan Gratis", cost: 18000, effect: { money: -3500, health: 25, happiness: 20 }, duration: 15, description: "Layanan kesehatan gratis untuk semua" },
      { id: "education_reform", name: "Reformasi Pendidikan", cost: 12000, effect: { money: -2500, education: 30, research: 150 }, duration: 10, description: "Perbaiki sistem pendidikan" },
      { id: "social_housing", name: "Perumahan Sosial", cost: 8000, effect: { money: -2000, population: 1000, happiness: 15 }, duration: 8, description: "Bangun perumahan terjangkau" },
      { id: "cultural_funding", name: "Dana Budaya", cost: 6000, effect: { money: -1500, culture: 40, happiness: 10 }, duration: 7, description: "Dukung seni dan budaya" }
    ],
    environmental: [
      { id: "green_energy", name: "Energi Hijau", cost: 30000, effect: { money: -6000, pollution: -30, environment: 25 }, duration: 20, description: "Transisi ke energi terbarukan" },
      { id: "recycling_program", name: "Program Daur Ulang", cost: 5000, effect: { money: -1000, pollution: -15, efficiency: 10 }, duration: 5, description: "Program daur ulang kota" },
      { id: "pollution_tax", name: "Pajak Polusi", cost: 0, effect: { money: 2000, pollution: -20, happiness: -10 }, duration: 7, description: "Pajak untuk perusahaan polutan" },
      { id: "green_space", name: "Ruang Hijau", cost: 7000, effect: { money: -1500, happiness: 25, pollution: -10 }, duration: 9, description: "Tambah taman dan ruang hijau" }
    ],
    security: [
      { id: "police_funding", name: "Dana Polisi", cost: 10000, effect: { money: -2000, crime: -25, happiness: 5 }, duration: 8, description: "Tambah anggaran kepolisian" },
      { id: "surveillance", name: "Sistem Pengawasan", cost: 15000, effect: { money: -3000, crime: -40, happiness: -15 }, duration: 12, description: "Sistem pengawasan menyeluruh" },
      { id: "community_police", name: "Polisi Masyarakat", cost: 8000, effect: { money: -1500, crime: -20, happiness: 10 }, duration: 6, description: "Program polisi komunitas" },
      { id: "disaster_preparedness", name: "Kesiapan Bencana", cost: 12000, effect: { money: -2500, defense: 50, happiness: 8 }, duration: 10, description: "Persiapan menghadapi bencana" }
    ]
  }

  if (!c.activePolicies) c.activePolicies = []
  if (!c.policyHistory) c.policyHistory = []

  if (!cmd) {
    updatePolicies()
    
    let policyDisplay = `
🏛️ *KEBIJAKAN PEMERINTAHAN ${c.name}*

💰 *ANGGARAN:* $${c.money.toLocaleString()}

📋 *KEBIJAKAN AKTIF:* (${c.activePolicies.length}/5)
${c.activePolicies.map((p, i) => 
  `${i + 1}. ${p.name}\n   ⏰ Sisa: ${p.duration} hari\n   📝 ${p.description}\n   📊 Effect: ${Object.entries(p.effect).map(([k, v]) => `${k} ${v > 0 ? '+' : ''}${v}`).join(', ')}`
).join('\n\n') || 'Tidak ada kebijakan aktif'}

🏛️ *KEBIJAKAN TERSEDIA:*

💰 *EKONOMI:*
${policies.economic.map(p => 
  `• ${p.name} ($${p.cost})\n  ${p.description}\n  Effect: ${Object.entries(p.effect).map(([k, v]) => `${k} ${v > 0 ? '+' : ''}${v}`).join(', ')}`
).join('\n\n')}

👥 *SOSIAL:*
${policies.social.map(p => 
  `• ${p.name} ($${p.cost})\n  ${p.description}\n  Effect: ${Object.entries(p.effect).map(([k, v]) => `${k} ${v > 0 ? '+' : ''}${v}`).join(', ')}`
).join('\n\n')}

🌿 *LINGKUNGAN:*
${policies.environmental.map(p => 
  `• ${p.name} ($${p.cost})\n  ${p.description}\n  Effect: ${Object.entries(p.effect).map(([k, v]) => `${k} ${v > 0 ? '+' : ''}${v}`).join(', ')}`
).join('\n\n')}

🛡️ *KEAMANAN:*
${policies.security.map(p => 
  `• ${p.name} ($${p.cost})\n  ${p.description}\n  Effect: ${Object.entries(p.effect).map(([k, v]) => `${k} ${v > 0 ? '+' : ''}${v}`).join(', ')}`
).join('\n\n')}

🎯 *PERINTAH:*
${usedPrefix}policy enact [nama_kebijakan] - Terapkan kebijakan
${usedPrefix}policy revoke [nomor] - Cabut kebijakan
${usedPrefix}policy history - Riwayat kebijakan
${usedPrefix}policy budget - Atur anggaran
    `.trim()
    
    return fukusima.reply(m.chat, policyDisplay, m)
  }

  if (cmd === "enact") {
    let policyName = args.slice(1).join(' ').toLowerCase()
    if (!policyName) return fukusima.reply(m.chat, "❌ Berikan nama kebijakan!", m)
    
    let policy = null
    let category = null
    
    for (let cat in policies) {
      let found = policies[cat].find(p => 
        p.name.toLowerCase().includes(policyName) || 
        p.id.toLowerCase().includes(policyName)
      )
      if (found) {
        policy = found
        category = cat
        break
      }
    }
    
    if (!policy) return fukusima.reply(m.chat, "❌ Kebijakan tidak ditemukan!", m)
    
    if (c.activePolicies.length >= 5) {
      return fukusima.reply(m.chat, "❌ Maksimal 5 kebijakan aktif bersamaan!", m)
    }
    
    if (c.activePolicies.some(p => p.id === policy.id)) {
      return fukusima.reply(m.chat, "❌ Kebijakan ini sudah aktif!", m)
    }
    
    if (c.money < policy.cost) {
      return fukusima.reply(m.chat, `❌ Anggaran tidak cukup! Butuh $${policy.cost}`, m)
    }
    
    c.money -= policy.cost
    c.activePolicies.push({
      ...policy,
      enacted: Date.now(),
      duration: policy.duration
    })
    
    Object.entries(policy.effect).forEach(([key, value]) => {
      if (key === 'money') c.money += value
      else if (key === 'tax') c.tax += value
      else if (key === 'happiness') c.happiness += value
      else c[key] = (c[key] || 0) + value
    })
    
    c.policyHistory.push({
      id: policy.id,
      name: policy.name,
      enacted: Date.now(),
      category: category
    })
    
    c.logs.push(`🏛️ Menerapkan kebijakan ${policy.name} ($${policy.cost})`)
    
    return fukusima.reply(m.chat, `🏛️ *KEBIJAKAN DITERAPKAN!*\n\n📝 ${policy.name}\n💰 Biaya: $${policy.cost}\n⏰ Durasi: ${policy.duration} hari\n\nEffect:\n${Object.entries(policy.effect).map(([k, v]) => `• ${k}: ${v > 0 ? '+' : ''}${v}`).join('\n')}`, m)
  }

  if (cmd === "revoke") {
    let policyNum = parseInt(args[1]) - 1
    
    if (isNaN(policyNum) || policyNum < 0 || policyNum >= c.activePolicies.length) {
      return fukusima.reply(m.chat, "❌ Nomor kebijakan tidak valid!", m)
    }
    
    let policy = c.activePolicies[policyNum]
    let refund = Math.floor(policy.cost * 0.5)
    
    c.money += refund
    c.activePolicies.splice(policyNum, 1)
    
    c.logs.push(`🏛️ Mencabut kebijakan ${policy.name} (+$${refund})`)
    
    return fukusima.reply(m.chat, `🏛️ *KEBIJAKAN DICABUT!*\n\n📝 ${policy.name}\n💰 Refund: $${refund}\n\nEffect kebijakan dihentikan`, m)
  }

  if (cmd === "history") {
    if (c.policyHistory.length === 0) {
      return fukusima.reply(m.chat, "📭 Belum ada riwayat kebijakan!", m)
    }
    
    let history = `📜 *RIWAYAT KEBIJAKAN*\n\n`
    
    c.policyHistory.slice(-20).forEach((policy, i) => {
      let daysAgo = Math.floor((Date.now() - policy.enacted) / (1000 * 60 * 60 * 24))
      history += `${i + 1}. ${policy.name} [${policy.category}]\n   ⏰ ${daysAgo} hari yang lalu\n\n`
    })
    
    return fukusima.reply(m.chat, history, m)
  }

  if (cmd === "budget") {
    let amount = parseInt(args[1])
    
    if (!amount) {
      let budgetInfo = `
💰 *PENGATURAN ANGGARAN*

Saat ini: $${c.money.toLocaleString()}

Opsi:
1. *Alokasi Pendidikan* (20% dari income)
   • Education +30, Research +100
   
2. *Alokasi Kesehatan* (15% dari income)
   • Health +25, Happiness +10
   
3. *Alokasi Keamanan* (10% dari income)
   • Crime -20, Defense +30
   
4. *Alokasi Infrastruktur* (25% dari income)
   • Efficiency +20, Happiness +15
   
5. *Alokasi Riset* (30% dari income)
   • Research +200, Technology +10
   
Pilih 1-5: ${usedPrefix}policy budget [nomor]
      `.trim()
      
      return fukusima.reply(m.chat, budgetInfo, m)
    }
    
    if (amount < 1 || amount > 5) return fukusima.reply(m.chat, "❌ Pilih 1-5!", m)
    
    const budgetOptions = [
      { name: "Pendidikan", effect: { education: 30, research: 100 }, cost: Math.floor(c.money * 0.2) },
      { name: "Kesehatan", effect: { health: 25, happiness: 10 }, cost: Math.floor(c.money * 0.15) },
      { name: "Keamanan", effect: { crime: -20, defense: 30 }, cost: Math.floor(c.money * 0.1) },
      { name: "Infrastruktur", effect: { efficiency: 20, happiness: 15 }, cost: Math.floor(c.money * 0.25) },
      { name: "Riset", effect: { research: 200, technology: 10 }, cost: Math.floor(c.money * 0.3) }
    ]
    
    let option = budgetOptions[amount - 1]
    
    if (c.money < option.cost) {
      return fukusima.reply(m.chat, `❌ Anggaran tidak cukup! Butuh $${option.cost}`, m)
    }
    
    c.money -= option.cost
    
    Object.entries(option.effect).forEach(([key, value]) => {
      c[key] = (c[key] || 0) + value
    })
    
    c.logs.push(`💰 Mengalokasikan anggaran untuk ${option.name} ($${option.cost})`)
    
    return fukusima.reply(m.chat, `💰 *ANGGARAN DIALOKASIKAN!*\n\n📝 ${option.name}\n💰 Biaya: $${option.cost}\n\nEffect:\n${Object.entries(option.effect).map(([k, v]) => `• ${k}: ${v > 0 ? '+' : ''}${v}`).join('\n')}`, m)
  }

  function updatePolicies() {
    let now = Date.now()
    let dayInMs = 24 * 60 * 60 * 1000
    
    for (let i = c.activePolicies.length - 1; i >= 0; i--) {
      let policy = c.activePolicies[i]
      let daysPassed = Math.floor((now - policy.enacted) / dayInMs)
      
      if (daysPassed >= policy.duration) {
        c.activePolicies.splice(i, 1)
        c.logs.push(`⏰ Kebijakan ${policy.name} berakhir`)
      } else {
        policy.duration = policy.duration - daysPassed
      }
    }
  }
}

handler.help = ["policy [enact|revoke|history|budget]"]
handler.tags = ["rpg", "game"]
handler.command = ["policy", "kebijakan"]
handler.group = true

export default handler