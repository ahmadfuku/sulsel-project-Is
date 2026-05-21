import fs from "fs"
import os from "os"
import path from "path"
import fetch from "node-fetch"
import ffmpeg from "fluent-ffmpeg"
import ffmpegPath from "ffmpeg-static"
import { fileTypeFromBuffer } from "file-type"
import canvacord from "canvacord"
import { createCanvas, loadImage } from "canvas"

ffmpeg.setFfmpegPath(ffmpegPath)

// ==================== KONFIGURASI DUNIA RAMADHAN ====================
const RAMADHAN_WORLD = {
  // Wilayah Petualangan (tanpa unsur sensitif)
  regions: {
    "kampung-sahur": {
      name: "🏡 Desa Sahur",
      levelReq: 1,
      activities: ["Menyiapkan Sahur", "Bangunkan Keluarga", "Sholat Tahajud"],
      resources: ["Bubur Berserat", "Buah Segar", "Air Mineral"],
      quests: ["Bantu Ibu Masak", "Bagikan Takjil"]
    },
    "pasar-takjil": {
      name: "🛒 Pasar Takjil",
      levelReq: 3,
      activities: ["Belanja Bahan", "Buat Takjil", "Sedekah Makanan"],
      resources: ["Gula Aren", "Santan Segar", "Bahan Kolak"],
      quests: ["Buat 50 Takjil", "Bagikan ke Tetangga"]
    },
    "masjid-utama": {
      name: "🕌 Masjid Utama",
      levelReq: 5,
      activities: ["Sholat Berjamaah", "Tadarus", "Kajian Ilmu"],
      resources: ["Ilmu Baru", "Semangat Ibadah", "Doa Bersama"],
      quests: ["Sholat 5 Waktu", "Khatam 1 Juz"]
    },
    "taman-tadarus": {
      name: "📚 Taman Tadarus",
      levelReq: 8,
      activities: ["Baca Quran", "Hafalan Surah", "Diskusi Agama"],
      resources: ["Pahala Banyak", "Pemahaman Baru", "Ketengan Hati"],
      quests: ["Hafal 1 Surah", "Tadarus 10 Halaman"]
    },
    "arena-sedekah": {
      name: "🤲 Arena Sedekah",
      levelReq: 12,
      activities: ["Bantu Sesama", "Donasi Makanan", "Bersih-bersih"],
      resources: ["Rasa Bahagia", "Teman Baru", "Berkah Hidup"],
      quests: ["Bantu 10 Orang", "Donasi 100rb"]
    }
  },
  
  // Peran/Job (tanpa unsur nabi/wali)
  roles: {
    "relawan-sahur": {
      name: "⏰ Relawan Sahur",
      skills: ["Bangun Cepat", "Masak Praktis", "Motivasi Ibadah"],
      specialty: "Membantu persiapan sahur"
    },
    "ahli-takjil": {
      name: "🍮 Ahli Takjil",
      skills: ["Memasak Cepat", "Kreasi Menu", "Manajemen Bahan"],
      specialty: "Membuat takjil enak"
    },
    "pengajar-quran": {
      name: "📖 Pengajar Quran",
      skills: ["Membaca Tartil", "Memahami Tajwid", "Mengajar Sabar"],
      specialty: "Membantu belajar Quran"
    },
    "juru-sedekah": {
      name: "🤝 Juru Sedekah",
      skills: ["Mencari Donatur", "Distribusi Tepat", "Transparansi"],
      specialty: "Mengelola sedekah"
    }
  },
  
  // Items dan Equipment (HALAL & AMAN)
  items: {
    tools: {
      "alat-masak": { name: "🍳 Alat Masak Dasar", function: "Memasak lebih cepat" },
      "buku-tajwid": { name: "📓 Buku Tajwid", function: "Belajar baca Quran" },
      "kotak-sedekah": { name: "🎁 Kotak Sedekah", function: "Kumpulkan sedekah" },
      "alat-kebersihan": { name: "🧹 Alat Kebersihan", function: "Bersihkan lingkungan" },
      "kit-dakwah": { name: "📦 Kit Dakwah", function: "Sarana berdakwah" }
    },
    
    consumables: {
      "paket-sahur": { name: "🥘 Paket Sahur", effect: "Energi +50", type: "food" },
      "takjil-sehat": { name: "🍌 Takjil Sehat", effect: "Stamina +40", type: "drink" },
      "air-mineral": { name: "💧 Air Mineral", effect: "Refresh +30", type: "water" },
      "vitamin-ramadhan": { name: "💊 Vitamin Ramadhan", effect: "Health +80", type: "medicine" },
      "kopi-tanpa-kafein": { name: "☕ Kopi Tanpa Kafein", effect: "Awet +60", type: "drink" }
    },
    
    upgrades: {
      "meja-kajian": { name: "📚 Meja Kajian", upgrade: "Kapasitas belajar +20%" },
      "dapur-besar": { name: "👨‍🍳 Dapur Besar", upgrade: "Produksi makanan +30%" },
      "gudang-sedekah": { name: "🏪 Gudang Sedekah", upgrade: "Kapasitas sedekah +50%" },
      "mobil-distribusi": { name: "🚗 Mobil Distribusi", upgrade: "Jangkauan +100%" }
    }
  },
  
  // Skill dan Kemampuan
  skills: {
    "memasak-cepat": {
      name: "⚡ Memasak Cepat",
      description: "Bisa masak untuk banyak orang",
      levelReq: 3,
      effect: "Waktu masak -30%"
    },
    "manajemen-waktu": {
      name: "⏱️ Manajemen Waktu",
      description: "Atur waktu ibadah & aktivitas",
      levelReq: 5,
      effect: "Efisiensi +25%"
    },
    "public-speaking": {
      name: "🎤 Public Speaking",
      description: "Berbicara di depan umum",
      levelReq: 8,
      effect: "Pengaruh +40%"
    },
    "network-builder": {
      name: "🕸️ Network Builder",
      description: "Membangun jaringan relawan",
      levelReq: 12,
      effect: "Relawan +50%"
    }
  },
  
  // Achievement (Pencapaian)
  achievements: {
    "sahur-perfect": {
      name: "🌟 Sahur Perfect 30 Hari",
      description: "Tidak bolong sahur sebulan",
      reward: "Title: 'Sultan Sahur'"
    },
    "takjil-master": {
      name: "🍛 Master Takjil",
      description: "Buat 1000 takjil",
      reward: "Title: 'Juragan Takjil'"
    },
    "quran-expert": {
      name: "📜 Quran Expert",
      description: "Khatam 3x dalam Ramadhan",
      reward: "Title: 'Hafiz Cepat'"
    },
    "sedekah-king": {
      name: "👑 Raja Sedekah",
      description: "Sedekah 10 juta",
      reward: "Title: 'Dermawan Sejati'"
    }
  },
  
  // Daily Challenges
  dailyChallenges: [
    {
      id: "dc1",
      name: "🌅 Challenge Sahur",
      tasks: ["Bangun sebelum imsak", "Sholat tahajud", "Makan sahur sehat"],
      reward: { exp: 100, coins: 50 }
    },
    {
      id: "dc2", 
      name: "📖 Challenge Quran",
      tasks: ["Baca 1 juz", "Hafal 1 ayat", "Pahami tafsir"],
      reward: { exp: 150, coins: 75 }
    },
    {
      id: "dc3",
      name: "🤲 Challenge Sedekah",
      tasks: ["Sedekah makanan", "Bantu tetangga", "Bersihkan masjid"],
      reward: { exp: 120, coins: 60 }
    }
  ]
}

// ==================== SISTEM DATABASE ====================
function initializeRamadhanData(user) {
  if (!user.ramadhan) {
    user.ramadhan = {
      // Statistik Dasar
      level: 1,
      exp: 0,
      coins: 100,
      diamonds: 10,
      
      // Peran & Skill
      role: "relawan-sahur",
      skills: [],
      roleLevel: 1,
      
      // Inventory
      inventory: {
        tools: [],
        consumables: [],
        upgrades: []
      },
      
      // Progress
      dailyChallenges: {},
      achievements: [],
      completedQuests: [],
      
      // Statistik Ibadah
      stats: {
        sahurCount: 0,
        puasaDays: 0,
        sholatJamaah: 0,
        quranPages: 0,
        sedekahAmount: 0,
        helpedPeople: 0
      },
      
      // Tim & Kolaborasi
      team: null,
      teamRole: null,
      collaborations: [],
      
      // Boosts & Buffs
      activeBoosts: [],
      buffs: {
        cookingSpeed: 0,
        learningSpeed: 0,
        sedekahMultiplier: 1.0,
        expMultiplier: 1.0
      },
      
      // Cooldowns
      cooldowns: {
        dailyReset: 0,
        challengeReset: 0,
        teamActivity: 0
      }
    }
  }
  
  // Reset harian otomatis
  const now = Date.now()
  const lastReset = user.ramadhan.cooldowns.dailyReset || 0
  const resetTime = 24 * 60 * 60 * 1000 // 24 jam
  
  if (now - lastReset > resetTime) {
    user.ramadhan.dailyChallenges = {}
    user.ramadhan.cooldowns.dailyReset = now
  }
  
  return user.ramadhan
}

// ==================== FUNGSI UTAMA ====================
async function generateProfileImage(userData, ramadhanData) {
  try {
    // Create canvas
    const canvas = createCanvas(800, 600)
    const ctx = canvas.getContext('2d')
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 600)
    gradient.addColorStop(0, '#1a5e1a')
    gradient.addColorStop(1, '#0d2d0d')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 800, 600)
    
    // Add decorative elements
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 800
      const y = Math.random() * 600
      const radius = Math.random() * 3
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }
    
    // Title
    ctx.fillStyle = '#FFD700'
    ctx.font = 'bold 40px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('PROFIL RAMADHAN RPG', 400, 80)
    
    // User info
    ctx.fillStyle = '#FFFFFF'
    ctx.font = '30px Arial'
    ctx.fillText(`Nama: ${userData.name || 'Player'}`, 400, 150)
    ctx.fillText(`Level: ${ramadhanData.level}`, 400, 200)
    ctx.fillText(`Peran: ${RAMADHAN_WORLD.roles[ramadhanData.role]?.name || 'Relawan'}`, 400, 250)
    
    // Progress bar
    const expNeeded = ramadhanData.level * 100
    const expPercent = (ramadhanData.exp / expNeeded) * 100
    
    ctx.fillStyle = '#333333'
    ctx.fillRect(200, 300, 400, 30)
    ctx.fillStyle = '#4CAF50'
    ctx.fillRect(200, 300, (expPercent / 100) * 400, 30)
    
    ctx.fillStyle = '#FFFFFF'
    ctx.font = '20px Arial'
    ctx.fillText(`EXP: ${ramadhanData.exp}/${expNeeded}`, 400, 325)
    
    // Stats
    ctx.fillStyle = '#FFA500'
    ctx.font = 'bold 25px Arial'
    ctx.fillText('STATISTIK IBADAH', 400, 380)
    
    ctx.fillStyle = '#FFFFFF'
    ctx.font = '18px Arial'
    ctx.textAlign = 'left'
    
    const stats = [
      `Sahur: ${ramadhanData.stats.sahurCount} hari`,
      `Puasa: ${ramadhanData.stats.puasaDays} hari`,
      `Sholat Jamaah: ${ramadhanData.stats.sholatJamaah}x`,
      `Quran: ${ramadhanData.stats.quranPages} halaman`,
      `Sedekah: Rp${ramadhanData.stats.sedekahAmount.toLocaleString()}`,
      `Tertolong: ${ramadhanData.stats.helpedPeople} orang`
    ]
    
    stats.forEach((stat, i) => {
      ctx.fillText(stat, 250, 420 + (i * 30))
    })
    
    return canvas.toBuffer('image/png')
  } catch (e) {
    console.error('Error generating profile:', e)
    return null
  }
}

// ==================== SISTEM QUEST ====================
class QuestSystem {
  static getDailyQuest(ramadhanData) {
    const quests = RAMADHAN_WORLD.dailyChallenges
    const today = new Date().toDateString()
    
    if (ramadhanData.dailyChallenges[today]) {
      return ramadhanData.dailyChallenges[today]
    }
    
    const randomQuest = quests[Math.floor(Math.random() * quests.length)]
    const quest = {
      ...randomQuest,
      progress: 0,
      completedTasks: [],
      startedAt: Date.now()
    }
    
    ramadhanData.dailyChallenges[today] = quest
    return quest
  }
  
  static completeTask(ramadhanData, taskIndex) {
    const today = new Date().toDateString()
    const quest = ramadhanData.dailyChallenges[today]
    
    if (!quest || quest.completedTasks.includes(taskIndex)) {
      return { success: false, message: "Task sudah selesai atau tidak ada" }
    }
    
    quest.completedTasks.push(taskIndex)
    quest.progress = (quest.completedTasks.length / quest.tasks.length) * 100
    
    // Beri reward per task
    const taskReward = {
      exp: quest.reward.exp / quest.tasks.length,
      coins: quest.reward.coins / quest.tasks.length
    }
    
    ramadhanData.exp += taskReward.exp
    ramadhanData.coins += taskReward.coins
    
    // Cek level up
    const neededExp = ramadhanData.level * 100
    if (ramadhanData.exp >= neededExp) {
      ramadhanData.exp -= neededExp
      ramadhanData.level++
      return { 
        success: true, 
        message: "Task selesai! Level up!",
        levelUp: true,
        reward: taskReward
      }
    }
    
    return { 
      success: true, 
      message: "Task selesai!",
      reward: taskReward
    }
  }
  
  static claimQuestReward(ramadhanData) {
    const today = new Date().toDateString()
    const quest = ramadhanData.dailyChallenges[today]
    
    if (!quest || quest.progress < 100 || quest.rewardClaimed) {
      return { success: false, message: "Quest belum selesai" }
    }
    
    quest.rewardClaimed = true
    ramadhanData.exp += quest.reward.exp * 2 // Bonus
    ramadhanData.coins += quest.reward.coins * 2
    
    // Tambahkan achievement jika perfect
    if (quest.completedTasks.length === quest.tasks.length) {
      ramadhanData.achievements.push(`daily-perfect-${today}`)
    }
    
    return {
      success: true,
      message: "Quest reward diterima!",
      reward: {
        exp: quest.reward.exp * 2,
        coins: quest.reward.coins * 2
      }
    }
  }
}

// ==================== SISTEM INVENTORY ====================
class InventorySystem {
  static addItem(ramadhanData, itemType, itemId) {
    const item = RAMADHAN_WORLD.items[itemType]?.[itemId]
    if (!item) return false
    
    if (itemType === 'tools' || itemType === 'upgrades') {
      ramadhanData.inventory[itemType].push({
        id: itemId,
        ...item,
        obtainedAt: Date.now()
      })
    } else if (itemType === 'consumables') {
      // Cek apakah sudah ada
      const existing = ramadhanData.inventory.consumables.find(i => i.id === itemId)
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1
      } else {
        ramadhanData.inventory.consumables.push({
          id: itemId,
          ...item,
          quantity: 1,
          obtainedAt: Date.now()
        })
      }
    }
    
    return true
  }
  
  static useItem(ramadhanData, itemType, itemId) {
    let items, index
    
    if (itemType === 'consumables') {
      items = ramadhanData.inventory.consumables
      index = items.findIndex(i => i.id === itemId)
      
      if (index === -1 || items[index].quantity <= 0) {
        return { success: false, message: "Item tidak ada" }
      }
      
      // Kurangi quantity
      items[index].quantity--
      if (items[index].quantity <= 0) {
        items.splice(index, 1)
      }
      
      // Apply effect
      const effect = this.applyConsumableEffect(items[index])
      return {
        success: true,
        message: `Menggunakan ${items[index].name}`,
        effect: effect
      }
    }
    
    return { success: false, message: "Item tidak bisa digunakan" }
  }
  
  static applyConsumableEffect(item) {
    // Ini contoh sederhana, bisa dikembangkan lebih kompleks
    const effects = {
      'paket-sahur': { stamina: 50 },
      'takjil-sehat': { health: 40 },
      'air-mineral': { refresh: 30 },
      'vitamin-ramadhan': { health: 80, stamina: 20 },
      'kopi-tanpa-kafein': { stamina: 60 }
    }
    
    return effects[item.id] || { stamina: 20 }
  }
}

// ==================== SISTEM TEAM ====================
class TeamSystem {
  static createTeam(ramadhanData, teamName, userData) {
    if (ramadhanData.team) {
      return { success: false, message: "Sudah dalam team" }
    }
    
    // Simpan di global (simulasi)
    if (!global.ramadhanTeams) global.ramadhanTeams = {}
    
    global.ramadhanTeams[teamName] = {
      name: teamName,
      leader: userData.id || m.sender,
      members: [{
        id: userData.id || m.sender,
        name: userData.name,
        role: ramadhanData.role,
        level: ramadhanData.level
      }],
      createdAt: Date.now(),
      level: 1,
      exp: 0,
      achievements: []
    }
    
    ramadhanData.team = teamName
    ramadhanData.teamRole = 'leader'
    
    return { 
      success: true, 
      message: `Team ${teamName} berhasil dibuat!`,
      team: global.ramadhanTeams[teamName]
    }
  }
  
  static joinTeam(ramadhanData, teamName, userData) {
    if (ramadhanData.team) {
      return { success: false, message: "Sudah dalam team" }
    }
    
    const team = global.ramadhanTeams?.[teamName]
    if (!team) {
      return { success: false, message: "Team tidak ditemukan" }
    }
    
    if (team.members.length >= 10) {
      return { success: false, message: "Team sudah penuh" }
    }
    
    team.members.push({
      id: userData.id || m.sender,
      name: userData.name,
      role: ramadhanData.role,
      level: ramadhanData.level
    })
    
    ramadhanData.team = teamName
    ramadhanData.teamRole = 'member'
    
    return {
      success: true,
      message: `Bergabung dengan team ${teamName}!`,
      team: team
    }
  }
}

// ==================== EVENT SYSTEM ====================
class EventSystem {
  static getCurrentEvent() {
    const now = new Date()
    const events = {
      // Event khusus jam-jam tertentu
      "04:00-06:00": {
        name: "🌅 Event Sahur Bersama",
        bonus: { exp: 1.5, coins: 1.3 },
        description: "Bonus untuk aktivitas sahur"
      },
      "12:00-15:00": {
        name: "📚 Event Tadarus Massal",
        bonus: { exp: 1.8, coins: 1.2 },
        description: "Bonus baca Quran"
      },
      "18:00-20:00": {
        name: "🤲 Event Buka Bersama",
        bonus: { exp: 2.0, coins: 1.5 },
        description: "Bonus sedekah dan buka puasa"
      }
    }
    
    const currentTime = now.getHours().toString().padStart(2, '0') + ':' + 
                       now.getMinutes().toString().padStart(2, '0')
    
    for (const [timeRange, event] of Object.entries(events)) {
      const [start, end] = timeRange.split('-')
      if (currentTime >= start && currentTime <= end) {
        return event
      }
    }
    
    return null
  }
}

// ==================== HANDLER UTAMA ====================
let handler = async (m, { fukusima, text, usedPrefix, command }) => {
  const user = global.db.data.users[m.sender]
  const ramadhan = initializeRamadhanData(user)
  
  const args = text ? text.trim().split(' ') : []
  const subcmd = args[0]?.toLowerCase()
  
  // ========== PROFILE ==========
  if (!subcmd || subcmd === 'profile') {
    const profileBuffer = await generateProfileImage(user, ramadhan)
    
    if (profileBuffer) {
      await fukusima.sendFile(m.chat, profileBuffer, 'profile.png', 
        `📊 *PROFIL RAMADHAN RPG*\n\n` +
        `👤 Nama: ${user.name || 'Player'}\n` +
        `⭐ Level: ${ramadhan.level}\n` +
        `📈 EXP: ${ramadhan.exp}/${ramadhan.level * 100}\n` +
        `💰 Koin: ${ramadhan.coins}\n` +
        `💎 Diamond: ${ramadhan.diamonds}\n` +
        `👷 Peran: ${RAMADHAN_WORLD.roles[ramadhan.role]?.name || 'Relawan'}\n` +
        `🏆 Achievement: ${ramadhan.achievements.length}\n` +
        `🛡️ Team: ${ramadhan.team || 'Belum join'}\n\n` +
        `Gunakan *${usedPrefix}ramadhan help* untuk bantuan`,
        m
      )
    } else {
      await m.reply(`📊 *PROFIL RAMADHAN RPG*\n\n` +
        `👤 Nama: ${user.name || 'Player'}\n` +
        `⭐ Level: ${ramadhan.level}\n` +
        `📈 EXP: ${ramadhan.exp}/${ramadhan.level * 100}\n` +
        `💰 Koin: ${ramadhan.coins}\n` +
        `💎 Diamond: ${ramadhan.diamonds}\n` +
        `👷 Peran: ${RAMADHAN_WORLD.roles[ramadhan.role]?.name || 'Relawan'}\n` +
        `🏆 Achievement: ${ramadhan.achievements.length}\n` +
        `🛡️ Team: ${ramadhan.team || 'Belum join'}`
      )
    }
    return
  }
  
  // ========== DAILY QUEST ==========
  if (subcmd === 'daily' || subcmd === 'quest') {
    const quest = QuestSystem.getDailyQuest(ramadhan)
    const progressBar = '█'.repeat(Math.floor(quest.progress / 10)) + 
                      '░'.repeat(10 - Math.floor(quest.progress / 10))
    
    let tasksText = quest.tasks.map((task, i) => {
      const completed = quest.completedTasks.includes(i)
      return `${completed ? '✅' : '⬜'} ${task}`
    }).join('\n')
    
    await m.reply(`📅 *DAILY QUEST*\n\n` +
      `🎯 ${quest.name}\n` +
      `📊 Progress: ${progressBar} ${quest.progress.toFixed(1)}%\n\n` +
      `${tasksText}\n\n` +
      `🏆 Reward: ${quest.reward.exp} EXP + ${quest.reward.coins} Koin\n\n` +
      `Gunakan *${usedPrefix}ramadhan complete <nomor>* untuk selesaikan task`
    )
    return
  }
  
  // ========== COMPLETE TASK ==========
  if (subcmd === 'complete') {
    const taskNum = parseInt(args[1])
    if (isNaN(taskNum) || taskNum < 1 || taskNum > 3) {
      await m.reply('❌ Format: *.ramadhan complete <1-3>*')
      return
    }
    
    const result = QuestSystem.completeTask(ramadhan, taskNum - 1)
    
    if (result.success) {
      let msg = `✅ *Task ${taskNum} Selesai!*\n\n`
      msg += `📊 Progress bertambah!\n`
      msg += `🎁 Mendapat: ${result.reward.exp} EXP + ${result.reward.coins} Koin\n`
      
      if (result.levelUp) {
        msg += `\n🎉 *LEVEL UP!* Sekarang level ${ramadhan.level}!`
      }
      
      await m.reply(msg)
    } else {
      await m.reply(`❌ ${result.message}`)
    }
    return
  }
  
  // ========== INVENTORY ==========
  if (subcmd === 'inventory' || subcmd === 'inv') {
    const tools = ramadhan.inventory.tools.map(t => t.name).join(', ') || 'Kosong'
    const consumables = ramadhan.inventory.consumables
      .map(c => `${c.name} (x${c.quantity})`)
      .join(', ') || 'Kosong'
    const upgrades = ramadhan.inventory.upgrades.map(u => u.name).join(', ') || 'Kosong'
    
    await m.reply(`🎒 *INVENTORY*\n\n` +
      `🛠️ Tools:\n${tools}\n\n` +
      `🍽️ Consumables:\n${consumables}\n\n` +
      `⚡ Upgrades:\n${upgrades}\n\n` +
      `Gunakan *${usedPrefix}ramadhan use <item>* untuk pakai item`
    )
    return
  }
  
  // ========== USE ITEM ==========
  if (subcmd === 'use') {
    const itemName = args.slice(1).join(' ').toLowerCase()
    if (!itemName) {
      await m.reply('❌ Format: *.ramadhan use <nama item>*')
      return
    }
    
    // Cari item di inventory
    let itemType = null
    let itemId = null
    
    // Cek di consumables
    const consumable = ramadhan.inventory.consumables.find(c => 
      c.name.toLowerCase().includes(itemName) || c.id.includes(itemName)
    )
    
    if (consumable) {
      itemType = 'consumables'
      itemId = consumable.id
    }
    
    if (!itemType) {
      await m.reply('❌ Item tidak ditemukan di inventory')
      return
    }
    
    const result = InventorySystem.useItem(ramadhan, itemType, itemId)
    
    if (result.success) {
      await m.reply(`✅ ${result.message}\n` +
        `💪 Effect: ${JSON.stringify(result.effect)}`
      )
    } else {
      await m.reply(`❌ ${result.message}`)
    }
    return
  }
  
  // ========== TEAM SYSTEM ==========
  if (subcmd === 'team') {
    const teamAction = args[1]?.toLowerCase()
    
    if (!teamAction || teamAction === 'info') {
      if (!ramadhan.team) {
        await m.reply(`🛡️ *TEAM INFO*\n\nBelum join team.\n` +
          `Gunakan:\n• *.ramadhan team create <nama>*\n• *.ramadhan team join <nama>*`
        )
        return
      }
      
      const team = global.ramadhanTeams?.[ramadhan.team]
      if (!team) {
        await m.reply('❌ Team tidak ditemukan')
        return
      }
      
      const members = team.members.map(m => 
        `• ${m.name} (Lv. ${m.level}) - ${m.role}`
      ).join('\n')
      
      await m.reply(`🛡️ *TEAM INFO*\n\n` +
        `🏷️ Nama: ${team.name}\n` +
        `👑 Leader: ${team.leader}\n` +
        `⭐ Level: ${team.level}\n` +
        `📊 EXP: ${team.exp}\n` +
        `👥 Members (${team.members.length}/10):\n${members}`
      )
      return
    }
    
    if (teamAction === 'create') {
      const teamName = args.slice(2).join(' ')
      if (!teamName) {
        await m.reply('❌ Format: *.ramadhan team create <nama team>*')
        return
      }
      
      const result = TeamSystem.createTeam(ramadhan, teamName, {
        id: m.sender,
        name: user.name
      })
      
      await m.reply(result.success ? 
        `✅ ${result.message}` : 
        `❌ ${result.message}`
      )
      return
    }
    
    if (teamAction === 'join') {
      const teamName = args.slice(2).join(' ')
      if (!teamName) {
        await m.reply('❌ Format: *.ramadhan team join <nama team>*')
        return
      }
      
      const result = TeamSystem.joinTeam(ramadhan, teamName, {
        id: m.sender,
        name: user.name
      })
      
      await m.reply(result.success ? 
        `✅ ${result.message}` : 
        `❌ ${result.message}`
      )
      return
    }
  }
  
  // ========== LEADERBOARD ==========
  if (subcmd === 'leaderboard' || subcmd === 'lb') {
    // Ambil semua user dengan data ramadhan
    const users = Object.entries(global.db.data.users)
      .filter(([id, u]) => u.ramadhan)
      .map(([id, u]) => ({
        id,
        name: u.name,
        level: u.ramadhan.level,
        exp: u.ramadhan.exp,
        coins: u.ramadhan.coins,
        achievements: u.ramadhan.achievements.length
      }))
      .sort((a, b) => b.level - a.level || b.exp - a.exp)
      .slice(0, 10)
    
    let leaderboardText = '🏆 *LEADERBOARD RAMADHAN*\n\n'
    
    users.forEach((u, i) => {
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`
      leaderboardText += `${medal} ${u.name}\n`
      leaderboardText += `   Level: ${u.level} | EXP: ${u.exp}\n`
      leaderboardText += `   Koin: ${u.coins} | Achievement: ${u.achievements}\n\n`
    })
    
    await m.reply(leaderboardText)
    return
  }
  
  // ========== EVENT INFO ==========
  if (subcmd === 'event') {
    const currentEvent = EventSystem.getCurrentEvent()
    
    if (currentEvent) {
      await m.reply(`🎪 *EVENT AKTIF*\n\n` +
        `🎯 ${currentEvent.name}\n` +
        `📝 ${currentEvent.description}\n` +
        `🎁 Bonus: EXP x${currentEvent.bonus.exp}, Koin x${currentEvent.bonus.coins}\n\n` +
        `Ayo manfaatkan event ini!`
      )
    } else {
      await m.reply('ℹ️ Tidak ada event aktif saat ini.\nCek lagi nanti!')
    }
    return
  }
  
  // ========== STATS IBADAH ==========
  if (subcmd === 'stats') {
    const stats = ramadhan.stats
    const totalDays = 30 // Asumsi Ramadhan 30 hari
    
    const progress = {
      sahur: (stats.sahurCount / totalDays) * 100,
      puasa: (stats.puasaDays / totalDays) * 100,
      sholat: (stats.sholatJamaah / (totalDays * 5)) * 100,
      quran: (stats.quranPages / 600) * 100 // Asumsi 600 halaman Quran
    }
    
    await m.reply(`📊 *STATISTIK IBADAH*\n\n` +
      `⏰ Sahur: ${stats.sahurCount}/${totalDays} hari (${progress.sahur.toFixed(1)}%)\n` +
      `☀️ Puasa: ${stats.puasaDays}/${totalDays} hari (${progress.puasa.toFixed(1)}%)\n` +
      `🕌 Sholat Jamaah: ${stats.sholatJamaah}x\n` +
      `📖 Quran: ${stats.quranPages} halaman (${progress.quran.toFixed(1)}%)\n` +
      `💰 Sedekah: Rp${stats.sedekahAmount.toLocaleString()}\n` +
      `🤝 Tertolong: ${stats.helpedPeople} orang\n\n` +
      `Terus tingkatkan ibadahmu!`
    )
    return
  }
  
  // ========== UPDATE STATS ==========
  if (subcmd === 'update') {
    const statType = args[1]?.toLowerCase()
    const value = parseInt(args[2]) || 1
    
    if (!statType) {
      await m.reply(`❌ Format: *.ramadhan update <stat> <jumlah>*\n` +
        `Contoh: .ramadhan update sahur 1\n` +
        `Stats: sahur, puasa, sholat, quran, sedekah, bantu`
      )
      return
    }
    
    const statMap = {
      'sahur': 'sahurCount',
      'puasa': 'puasaDays',
      'sholat': 'sholatJamaah',
      'quran': 'quranPages',
      'sedekah': 'sedekahAmount',
      'bantu': 'helpedPeople'
    }
    
    const statKey = statMap[statType]
    if (!statKey) {
      await m.reply('❌ Stat tidak valid')
      return
    }
    
    // Update stat
    ramadhan.stats[statKey] += value
    
    // Beri reward berdasarkan stat
    let rewardExp = 0
    let rewardCoins = 0
    
    switch (statType) {
      case 'sahur':
        rewardExp = 20 * value
        rewardCoins = 10 * value
        break
      case 'puasa':
        rewardExp = 30 * value
        rewardCoins = 15 * value
        break
      case 'sholat':
        rewardExp = 15 * value
        rewardCoins = 5 * value
        break
      case 'quran':
        rewardExp = 5 * value
        rewardCoins = 2 * value
        break
      case 'sedekah':
        rewardExp = Math.min(value / 1000, 50) // Max 50 exp
        rewardCoins = 0 // Sedekah dapat pahala, bukan koin
        break
      case 'bantu':
        rewardExp = 25 * value
        rewardCoins = 10 * value
        break
    }
    
    ramadhan.exp += rewardExp
    ramadhan.coins += rewardCoins
    
    // Cek level up
    const neededExp = ramadhan.level * 100
    let levelUp = false
    if (ramadhan.exp >= neededExp) {
      ramadhan.exp -= neededExp
      ramadhan.level++
      levelUp = true
    }
    
    let replyMsg = `✅ Stat ${statType} ditambah ${value}!\n`
    replyMsg += `🎁 Mendapat: ${rewardExp} EXP`
    
    if (rewardCoins > 0) {
      replyMsg += ` + ${rewardCoins} Koin`
    }
    
    if (levelUp) {
      replyMsg += `\n🎉 LEVEL UP! Sekarang level ${ramadhan.level}!`
    }
    
    await m.reply(replyMsg)
    return
  }
  
  // ========== HELP ==========
  if (subcmd === 'help') {
    await m.reply(`🕌 *RAMADHAN RPG - HELP*\n\n` +
      `📊 *Profile & Statistik:*\n` +
      `.ramadhan - Lihat profil\n` +
      `.ramadhan stats - Statistik ibadah\n` +
      `.ramadhan update <stat> <jumlah> - Update stat\n\n` +
      
      `🎯 *Quest & Challenges:*\n` +
      `.ramadhan daily - Quest harian\n` +
      `.ramadhan complete <1-3> - Selesaikan task\n\n` +
      
      `🎒 *Inventory & Items:*\n` +
      `.ramadhan inventory - Lihat inventory\n` +
      `.ramadhan use <item> - Pakai item\n\n` +
      
      `🛡️ *Team & Kolaborasi:*\n` +
      `.ramadhan team info - Info team\n` +
      `.ramadhan team create <nama> - Buat team\n` +
      `.ramadhan team join <nama> - Join team\n\n` +
      
      `🏆 *Lainnya:*\n` +
      `.ramadhan leaderboard - Top 10 player\n` +
      `.ramadhan event - Info event aktif\n\n` +
      
      `💡 *Tips:* Update stat ibadahmu setiap hari untuk naik level cepat!`
    )
    return
  }
  
  // ========== DEFAULT ==========
  await m.reply(`Perintah tidak dikenal. Gunakan *${usedPrefix}ramadhan help* untuk bantuan.`)
}

handler.help = ['ramadhan [subcommand]', 'rpg [subcommand]']
handler.tags = ['rpg', 'ramadhan']
handler.command = /^(ramadhan|rpg)$/i
handler.register = true
handler.limit = true

export default handler