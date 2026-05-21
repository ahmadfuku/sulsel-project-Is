import { createHash } from 'crypto'

import { prepareWAMessageMedia, generateWAMessageFromContent, proto } from 'baileys'

const SARUNG_PERANG_CONFIG = {
    gameName: "⚔️ PERANG SARUNG ⚔️",
    version: "2.0.0",
    maxPlayers: 2,
    battleDuration: 180000,
    cooldown: 30000,
    
    maps: {
        "masjid": {
            name: "🕌 Masjid Al-Falah",
            size: "30x30",
            obstacles: ["Mimbar", "Sajadah", "Tiang", "Kipas Angin"],
            weather: ["Normal", "Hujan", "Panas", "Angin"],
            bonus: { iman: 15, accuracy: 10 }
        },
        "pasar": {
            name: "🛒 Pasar Takjil",
            size: "40x40",
            obstacles: ["Gerobak Takjil", "Tenda", "Antrian", "Meja"],
            weather: ["Ramai", "Sepi", "Hujan", "Panas"],
            bonus: { agility: 20, luck: 15 }
        },
        "gang": {
            name: "🏘️ Gang Sempit",
            size: "25x25",
            obstacles: ["Motor", "Tempat Sampah", "Pohon", "Talang"],
            weather: ["Gelap", "Berkabut", "Hujan", "Bergegas"],
            bonus: { stealth: 25, critical: 15 }
        },
        "lapangan": {
            name: "⚽ Lapangan Bulan Sabit",
            size: "50x50",
            obstacles: ["Gawang", "Pohon", "Bangkau", "Tiang"],
            weather: ["Terang", "Berangin", "Dingin", "Berdarah"],
            bonus: { speed: 30, stamina: 20 }
        }
    },
    
    ranks: {
        1: { name: "Pemula Sarung", color: "#CD7F32", bonus: 0 },
        10: { name: "Jagoan Kampung", color: "#C0C0C0", bonus: 5 },
        20: { name: "Pendekar Masjid", color: "#FFD700", bonus: 10 },
        30: { name: "Sultan Sarung", color: "#E5E4E2", bonus: 15 },
        40: { name: "Raja Perang Sarung", color: "#B9F2FF", bonus: 20 },
        50: { name: "LEGEND SARUNG", color: "#FF0000", bonus: 25 }
    },
    
    skills: {
        "pukul_keras": {
            name: "👊 Pukul Keras",
            cost: 20,
            damage: 30,
            accuracy: 70,
            cooldown: 3,
            effect: "Stun 1 turn"
        },
        "tendang_licik": {
            name: "🦵 Tendang Licik",
            cost: 25,
            damage: 25,
            accuracy: 85,
            cooldown: 2,
            effect: "Reduce enemy accuracy"
        },
        "elakan_sakti": {
            name: "🌀 Elakan Sakti",
            cost: 15,
            damage: 0,
            accuracy: 100,
            cooldown: 4,
            effect: "Dodge next attack"
        },
        "serangan_kombo": {
            name: "💫 Serangan Kombo",
            cost: 35,
            damage: 45,
            accuracy: 65,
            cooldown: 5,
            effect: "2x hit chance"
        },
        "jurus_terakhir": {
            name: "☠️ Jurus Terakhir",
            cost: 50,
            damage: 60,
            accuracy: 50,
            cooldown: 8,
            effect: "Ignore defense"
        }
    },
    
    effects: {
        "stun": { turns: 1, effect: "Cannot attack" },
        "bleed": { turns: 3, effect: "Lose 10 HP per turn" },
        "poison": { turns: 4, effect: "Lose 15 HP per turn" },
        "burn": { turns: 2, effect: "Lose 20 HP per turn" },
        "freeze": { turns: 2, effect: "Speed reduced 50%" },
        "blind": { turns: 2, effect: "Accuracy reduced 30%" },
        "confuse": { turns: 2, effect: "May attack self" },
        "sleep": { turns: 1, effect: "Skip turn" }
    }
}

class SarungWeaponSystem {
    constructor() {
        this.weapons = {
            "sarung_bekas": {
                id: "sarung_bekas",
                name: "👕 Sarung Bekas",
                type: "default",
                rarity: "common",
                damage: 15,
                accuracy: 70,
                speed: 100,
                range: 1,
                effects: [],
                price: { limit: 0, coins: 0, diamonds: 0 },
                description: "Sarung lawasan yang masih bisa dipakai",
                unlocked: true,
                level: 1,
                maxLevel: 5,
                upgradeCost: { limit: 10, coins: 100 }
            },
            
            "sarung_wadimor": {
                id: "sarung_wadimor",
                name: "🌀 Sarung Wadimor",
                type: "special",
                rarity: "rare",
                damage: 25,
                accuracy: 82,
                speed: 112,
                range: 1,
                effects: ["attract+50", "rof+12", "accuracy+20%"],
                price: { limit: 50, coins: 500, diamonds: 5 },
                description: "Sarung mistis dengan daya tarik magis",
                unlocked: false,
                level: 1,
                maxLevel: 10,
                upgradeCost: { limit: 15, coins: 150 },
                special: "attract bonus"
            },
            
            "sarung_gajah_sakti": {
                id: "sarung_gajah_sakti",
                name: "🐘 Sarung Gajah Sakti",
                type: "special",
                rarity: "epic",
                damage: 45,
                accuracy: 75,
                speed: 85,
                range: 2,
                effects: ["attract+55", "reload+30%", "damage+20"],
                price: { limit: 78, coins: 780, diamonds: 8 },
                description: "Sarung legendaris dengan kekuatan gajah",
                unlocked: false,
                level: 1,
                maxLevel: 15,
                upgradeCost: { limit: 20, coins: 200 },
                special: "knockback effect"
            },
            
            "sarung_batik_mega": {
                id: "sarung_batik_mega",
                name: "🌌 Sarung Batik Mega Mendung",
                type: "range",
                rarity: "legendary",
                damage: 35,
                accuracy: 90,
                speed: 110,
                range: 3,
                effects: ["critical+25%", "evasion+15%", "damage+15"],
                price: { limit: 120, coins: 1200, diamonds: 12 },
                description: "Sarung batik dengan motif awan magis",
                unlocked: false,
                level: 1,
                maxLevel: 20,
                upgradeCost: { limit: 30, coins: 300 },
                special: "weather control"
            },
            
            "sarung_peci_keras": {
                id: "sarung_peci_keras",
                name: "🧢 Sarung Peci Keras",
                type: "defense",
                rarity: "epic",
                damage: 20,
                accuracy: 80,
                speed: 95,
                range: 1,
                effects: ["defense+40%", "stun_resist+30%", "hp+100"],
                price: { limit: 95, coins: 950, diamonds: 10 },
                description: "Sarung sekeras peci dengan pertahanan maksimal",
                unlocked: false,
                level: 1,
                maxLevel: 12,
                upgradeCost: { limit: 25, coins: 250 },
                special: "damage reflect"
            },
            
            "sarung_jagoan_bukber": {
                id: "sarung_jagoan_bukber",
                name: "🍗 Sarung Jagoan Bukber",
                type: "support",
                rarity: "rare",
                damage: 18,
                accuracy: 85,
                speed: 105,
                range: 2,
                effects: ["heal+20%", "stamina+30", "team_buff+15%"],
                price: { limit: 65, coins: 650, diamonds: 7 },
                description: "Sarung khusus untuk bertarung sambil bukber",
                unlocked: false,
                level: 1,
                maxLevel: 8,
                upgradeCost: { limit: 18, coins: 180 },
                special: "healing aura"
            },
            
            "sarung_debu_garukan": {
                id: "sarung_debu_garukan",
                name: "🧹 Sarung Debu Garukan",
                type: "stealth",
                rarity: "uncommon",
                damage: 22,
                accuracy: 75,
                speed: 120,
                range: 1,
                effects: ["stealth+40%", "dodge+25%", "speed+20%"],
                price: { limit: 35, coins: 350, diamonds: 4 },
                description: "Sarung yang membuatmu tak terlihat seperti debu",
                unlocked: false,
                level: 1,
                maxLevel: 6,
                upgradeCost: { limit: 12, coins: 120 },
                special: "invisibility"
            },
            
            "sarung_muadzin_kampung": {
                id: "sarung_muadzin_kampung",
                name: "📢 Sarung Muadzin Kampung",
                type: "aoe",
                rarity: "epic",
                damage: 40,
                accuracy: 70,
                speed: 90,
                range: 4,
                effects: ["aoe_damage", "stun_chance+20%", "range+1"],
                price: { limit: 110, coins: 1100, diamonds: 11 },
                description: "Sarung dengan suara adzan yang memekakkan",
                unlocked: false,
                level: 1,
                maxLevel: 18,
                upgradeCost: { limit: 28, coins: 280 },
                special: "area damage"
            },
            
            "sarung_ketupat_ajaib": {
                id: "sarung_ketupat_ajaib",
                name: "🎋 Sarung Ketupat Ajaib",
                type: "magic",
                rarity: "legendary",
                damage: 50,
                accuracy: 65,
                speed: 80,
                range: 3,
                effects: ["magic_damage", "heal_over_time", "buff_random"],
                price: { limit: 150, coins: 1500, diamonds: 15 },
                description: "Sarung dari anyaman ketupat magis",
                unlocked: false,
                level: 1,
                maxLevel: 25,
                upgradeCost: { limit: 35, coins: 350 },
                special: "random effects"
            },
            
            "sarung_ultima": {
                id: "sarung_ultima",
                name: "✨ Sarung Ultima",
                type: "ultimate",
                rarity: "mythic",
                damage: 75,
                accuracy: 95,
                speed: 150,
                range: 5,
                effects: ["all_stats+50%", "cooldown_reset", "invincible_turn"],
                price: { limit: 300, coins: 3000, diamonds: 30 },
                description: "Sarung terkuat yang pernah ada",
                unlocked: false,
                level: 1,
                maxLevel: 30,
                upgradeCost: { limit: 50, coins: 500 },
                special: "god mode"
            }
        }
    }
    
    getWeapon(id) {
        return this.weapons[id] ? { ...this.weapons[id] } : null
    }
    
    getAllWeapons() {
        return Object.values(this.weapons).map(w => ({ ...w }))
    }
    
    getWeaponsByType(type) {
        return Object.values(this.weapons).filter(w => w.type === type).map(w => ({ ...w }))
    }
    
    getWeaponsByRarity(rarity) {
        return Object.values(this.weapons).filter(w => w.rarity === rarity).map(w => ({ ...w }))
    }
    
    calculateUpgradeCost(weaponId, currentLevel) {
        const weapon = this.getWeapon(weaponId)
        if (!weapon) return null
        
        const multiplier = Math.pow(1.5, currentLevel - 1)
        return {
            limit: Math.floor(weapon.upgradeCost.limit * multiplier),
            coins: Math.floor(weapon.upgradeCost.coins * multiplier),
            diamonds: Math.floor((weapon.upgradeCost.limit / 10) * multiplier)
        }
    }
    
    calculateUpgradedStats(weaponId, level) {
        const weapon = this.getWeapon(weaponId)
        if (!weapon) return null
        
        const multiplier = 1 + (level - 1) * 0.1
        
        return {
            damage: Math.floor(weapon.damage * multiplier),
            accuracy: Math.min(100, Math.floor(weapon.accuracy * (1 + (level - 1) * 0.02))),
            speed: Math.floor(weapon.speed * multiplier),
            range: weapon.range + Math.floor((level - 1) / 5)
        }
    }
}

class SarungBattleSystem {
    constructor() {
        this.activeBattles = new Map()
        this.battleQueue = []
        this.weaponSystem = new SarungWeaponSystem()
    }
    
    generateBattleId(player1, player2) {
        const hash = createHash('md5')
            .update(player1 + player2 + Date.now())
            .digest('hex')
        return `battle_${hash.substring(0, 8)}`
    }
    
    createBattle(player1, player2, map = "masjid") {
        const battleId = this.generateBattleId(player1, player2)
        
        const battle = {
            id: battleId,
            players: {
                [player1]: {
                    hp: 100,
                    maxHp: 100,
                    stamina: 100,
                    attack: 10,
                    defense: 5,
                    speed: 10,
                    accuracy: 80,
                    critical: 10,
                    dodge: 5,
                    weapon: "sarung_bekas",
                    weaponLevel: 1,
                    skills: ["pukul_keras", "tendang_licik"],
                    cooldowns: {},
                    effects: [],
                    position: { x: 5, y: 5 },
                    actions: []
                },
                [player2]: {
                    hp: 100,
                    maxHp: 100,
                    stamina: 100,
                    attack: 10,
                    defense: 5,
                    speed: 10,
                    accuracy: 80,
                    critical: 10,
                    dodge: 5,
                    weapon: "sarung_bekas",
                    weaponLevel: 1,
                    skills: ["pukul_keras", "tendang_licik"],
                    cooldowns: {},
                    effects: [],
                    position: { x: 25, y: 25 },
                    actions: []
                }
            },
            map: map,
            weather: SARUNG_PERANG_CONFIG.maps[map]?.weather[0] || "Normal",
            turn: player1,
            turnNumber: 1,
            maxTurns: 20,
            startedAt: Date.now(),
            lastAction: Date.now(),
            status: "active",
            winner: null,
            log: []
        }
        
        this.activeBattles.set(battleId, battle)
        return battle
    }
    
    processAction(battleId, playerId, action, target, extraData = {}) {
        const battle = this.activeBattles.get(battleId)
        if (!battle || battle.status !== "active") {
            return { success: false, message: "Battle tidak ditemukan atau sudah selesai" }
        }
        
        if (battle.turn !== playerId) {
            return { success: false, message: "Bukan giliranmu" }
        }
        
        const player = battle.players[playerId]
        const enemyId = Object.keys(battle.players).find(id => id !== playerId)
        const enemy = battle.players[enemyId]
        
        if (!enemy) {
            return { success: false, message: "Musuh tidak ditemukan" }
        }
        
        const weapon = this.weaponSystem.getWeapon(player.weapon)
        if (!weapon) {
            return { success: false, message: "Senjata tidak valid" }
        }
        
        const result = {
            success: true,
            action: action,
            attacker: playerId,
            target: target || enemyId,
            damage: 0,
            effects: [],
            critical: false,
            missed: false,
            message: ""
        }
        
        switch (action) {
            case "attack":
                const attackResult = this.calculateAttack(player, enemy, weapon)
                Object.assign(result, attackResult)
                
                if (!result.missed) {
                    enemy.hp = Math.max(0, enemy.hp - result.damage)
                    
                    if (result.effects.length > 0) {
                        enemy.effects.push(...result.effects)
                    }
                    
                    if (enemy.hp <= 0) {
                        battle.status = "finished"
                        battle.winner = playerId
                        result.message = `🎯 Serangan mengenai sasaran! ${result.damage} damage! ${enemyId} KO!`
                    } else {
                        result.message = `🎯 Serangan mengenai sasaran! ${result.damage} damage!`
                    }
                } else {
                    result.message = "❌ Serangan meleset!"
                }
                break
                
            case "skill":
                const skill = SARUNG_PERANG_CONFIG.skills[extraData.skill]
                if (!skill) {
                    return { success: false, message: "Skill tidak valid" }
                }
                
                if (player.stamina < skill.cost) {
                    return { success: false, message: "Stamina tidak cukup" }
                }
                
                if (player.cooldowns[extraData.skill] && player.cooldowns[extraData.skill] > Date.now()) {
                    return { success: false, message: "Skill dalam cooldown" }
                }
                
                player.stamina -= skill.cost
                player.cooldowns[extraData.skill] = Date.now() + (skill.cooldown * 1000)
                
                const skillResult = this.calculateSkill(player, enemy, skill, weapon)
                Object.assign(result, skillResult)
                
                if (!result.missed) {
                    enemy.hp = Math.max(0, enemy.hp - result.damage)
                    
                    if (skill.effect) {
                        enemy.effects.push({
                            type: skill.effect.toLowerCase().replace(/ /g, "_"),
                            turns: parseInt(skill.effect.match(/\d+/)?.[0]) || 1,
                            startTurn: battle.turnNumber
                        })
                    }
                    
                    result.message = `✨ ${skill.name} berhasil! ${result.damage} damage!`
                } else {
                    result.message = `❌ ${skill.name} meleset!`
                }
                break
                
            case "defend":
                player.effects.push({
                    type: "defend",
                    turns: 2,
                    defenseBonus: 50,
                    startTurn: battle.turnNumber
                })
                result.message = "🛡️ Berhasil bertahan! Defense +50%"
                break
                
            case "move":
                const newPosition = extraData.position
                if (!newPosition || !this.isValidPosition(battle, newPosition)) {
                    return { success: false, message: "Posisi tidak valid" }
                }
                
                player.position = newPosition
                result.message = `🏃 Berpindah ke posisi (${newPosition.x}, ${newPosition.y})`
                break
                
            default:
                return { success: false, message: "Aksi tidak valid" }
        }
        
        battle.lastAction = Date.now()
        battle.turn = enemyId
        battle.turnNumber++
        battle.log.push({
            turn: battle.turnNumber,
            player: playerId,
            action: action,
            result: result
        })
        
        this.processEffects(battle)
        
        if (battle.turnNumber > battle.maxTurns) {
            battle.status = "finished"
            battle.winner = this.determineWinner(battle)
        }
        
        return result
    }
    
    calculateAttack(attacker, defender, weapon) {
        const result = {
            damage: 0,
            critical: false,
            missed: false,
            effects: []
        }
        
        const baseAccuracy = weapon.accuracy + attacker.accuracy - defender.dodge
        const hitChance = Math.min(95, Math.max(5, baseAccuracy))
        const hitRoll = Math.random() * 100
        
        if (hitRoll > hitChance) {
            result.missed = true
            return result
        }
        
        const baseDamage = weapon.damage + attacker.attack - defender.defense
        const criticalChance = attacker.critical
        const criticalRoll = Math.random() * 100
        
        if (criticalRoll <= criticalChance) {
            result.critical = true
            result.damage = Math.floor(baseDamage * 1.5)
        } else {
            result.damage = Math.max(1, Math.floor(baseDamage))
        }
        
        const weaponLevel = attacker.weaponLevel || 1
        const levelMultiplier = 1 + (weaponLevel - 1) * 0.1
        result.damage = Math.floor(result.damage * levelMultiplier)
        
        if (weapon.effects && weapon.effects.length > 0) {
            weapon.effects.forEach(effect => {
                if (effect.includes("+") && Math.random() < 0.3) {
                    result.effects.push(effect.split("+")[0])
                }
            })
        }
        
        return result
    }
    
    calculateSkill(attacker, defender, skill, weapon) {
        const result = {
            damage: 0,
            critical: false,
            missed: false,
            effects: []
        }
        
        const hitChance = skill.accuracy
        const hitRoll = Math.random() * 100
        
        if (hitRoll > hitChance) {
            result.missed = true
            return result
        }
        
        const baseDamage = skill.damage + attacker.attack
        const criticalChance = attacker.critical + 10
        const criticalRoll = Math.random() * 100
        
        if (criticalRoll <= criticalChance) {
            result.critical = true
            result.damage = Math.floor(baseDamage * 1.8)
        } else {
            result.damage = Math.max(5, Math.floor(baseDamage))
        }
        
        const weaponLevel = attacker.weaponLevel || 1
        const levelMultiplier = 1 + (weaponLevel - 1) * 0.15
        result.damage = Math.floor(result.damage * levelMultiplier)
        
        return result
    }
    
    processEffects(battle) {
        Object.keys(battle.players).forEach(playerId => {
            const player = battle.players[playerId]
            const newEffects = []
            
            player.effects.forEach(effect => {
                const turnsLeft = effect.turns - (battle.turnNumber - effect.startTurn)
                
                if (turnsLeft > 0) {
                    newEffects.push(effect)
                    
                    switch (effect.type) {
                        case "bleed":
                            player.hp = Math.max(0, player.hp - 10)
                            break
                        case "poison":
                            player.hp = Math.max(0, player.hp - 15)
                            break
                        case "burn":
                            player.hp = Math.max(0, player.hp - 20)
                            break
                        case "stun":
                        case "sleep":
                            if (battle.turn === playerId) {
                                battle.turn = Object.keys(battle.players).find(id => id !== playerId)
                            }
                            break
                        case "defend":
                            player.defense += effect.defenseBonus || 0
                            break
                    }
                }
            })
            
            player.effects = newEffects
        })
    }
    
    determineWinner(battle) {
        const players = Object.keys(battle.players)
        const player1 = battle.players[players[0]]
        const player2 = battle.players[players[1]]
        
        if (player1.hp > player2.hp) {
            return players[0]
        } else if (player2.hp > player1.hp) {
            return players[1]
        } else {
            return null
        }
    }
    
    isValidPosition(battle, position) {
        const map = SARUNG_PERANG_CONFIG.maps[battle.map]
        if (!map) return false
        
        const [maxX, maxY] = map.size.split('x').map(Number)
        return position.x >= 0 && position.x < maxX && position.y >= 0 && position.y < maxY
    }
    
    getBattleStatus(battleId) {
        const battle = this.activeBattles.get(battleId)
        if (!battle) return null
        
        const players = Object.keys(battle.players)
        const player1 = battle.players[players[0]]
        const player2 = battle.players[players[1]]
        
        return {
            id: battleId,
            status: battle.status,
            turn: battle.turn,
            turnNumber: battle.turnNumber,
            maxTurns: battle.maxTurns,
            map: battle.map,
            weather: battle.weather,
            players: {
                [players[0]]: {
                    hp: player1.hp,
                    maxHp: player1.maxHp,
                    stamina: player1.stamina,
                    weapon: player1.weapon,
                    position: player1.position
                },
                [players[1]]: {
                    hp: player2.hp,
                    maxHp: player2.maxHp,
                    stamina: player2.stamina,
                    weapon: player2.weapon,
                    position: player2.position
                }
            },
            winner: battle.winner
        }
    }
}

class SarungUserSystem {
    constructor() {
        this.weaponSystem = new SarungWeaponSystem()
    }
    
    initializeUser(user) {
        if (!user.sarungPerang) {
            user.sarungPerang = {
                level: 1,
                exp: 0,
                wins: 0,
                losses: 0,
                draws: 0,
                kills: 0,
                deaths: 0,
                streak: 0,
                maxStreak: 0,
                rank: 1,
                unlockedWeapons: ["sarung_bekas"],
                equippedWeapon: "sarung_bekas",
                weaponLevels: {
                    sarung_bekas: 1
                },
                skills: ["pukul_keras"],
                inventory: {
                    potions: 3,
                    energyDrinks: 2,
                    bandages: 5
                },
                stats: {
                    totalDamage: 0,
                    totalHealed: 0,
                    criticalHits: 0,
                    dodges: 0,
                    longestBattle: 0
                },
                achievements: [],
                lastBattle: 0,
                cooldown: 0
            }
        }
        
        return user.sarungPerang
    }
    
    addExp(user, exp) {
        const sarung = this.initializeUser(user)
        sarung.exp += exp
        
        const expNeeded = sarung.level * 100
        if (sarung.exp >= expNeeded) {
            sarung.exp -= expNeeded
            sarung.level++
            return { levelUp: true, newLevel: sarung.level }
        }
        
        return { levelUp: false }
    }
    
    updateRank(user) {
        const sarung = this.initializeUser(user)
        let newRank = 1
        
        for (const [level, rankData] of Object.entries(SARUNG_PERANG_CONFIG.ranks)) {
            if (sarung.level >= parseInt(level)) {
                newRank = parseInt(level)
            }
        }
        
        if (newRank > sarung.rank) {
            sarung.rank = newRank
            return { rankUp: true, newRank: newRank }
        }
        
        return { rankUp: false }
    }
    
    unlockWeapon(user, weaponId) {
        const sarung = this.initializeUser(user)
        const weapon = this.weaponSystem.getWeapon(weaponId)
        
        if (!weapon) {
            return { success: false, message: "Senjata tidak ditemukan" }
        }
        
        if (sarung.unlockedWeapons.includes(weaponId)) {
            return { success: false, message: "Senjata sudah terbuka" }
        }
        
        if (!this.canAfford(user, weapon.price)) {
            return { success: false, message: "Tidak cukup sumber daya" }
        }
        
        this.deductPayment(user, weapon.price)
        
        sarung.unlockedWeapons.push(weaponId)
        sarung.weaponLevels[weaponId] = 1
        
        return { 
            success: true, 
            message: `Berhasil membuka ${weapon.name}!`,
            weapon: weapon 
        }
    }
    
    upgradeWeapon(user, weaponId) {
        const sarung = this.initializeUser(user)
        
        if (!sarung.unlockedWeapons.includes(weaponId)) {
            return { success: false, message: "Senjata belum terbuka" }
        }
        
        const currentLevel = sarung.weaponLevels[weaponId] || 1
        const weapon = this.weaponSystem.getWeapon(weaponId)
        
        if (currentLevel >= weapon.maxLevel) {
            return { success: false, message: "Sudah level maksimal" }
        }
        
        const upgradeCost = this.weaponSystem.calculateUpgradeCost(weaponId, currentLevel)
        
        if (!this.canAfford(user, upgradeCost)) {
            return { success: false, message: "Tidak cukup sumber daya untuk upgrade" }
        }
        
        this.deductPayment(user, upgradeCost)
        
        sarung.weaponLevels[weaponId] = currentLevel + 1
        
        return {
            success: true,
            message: `Berhasil upgrade ${weapon.name} ke level ${currentLevel + 1}!`,
            newLevel: currentLevel + 1,
            cost: upgradeCost
        }
    }
    
    equipWeapon(user, weaponId) {
        const sarung = this.initializeUser(user)
        
        if (!sarung.unlockedWeapons.includes(weaponId)) {
            return { success: false, message: "Senjata belum terbuka" }
        }
        
        sarung.equippedWeapon = weaponId
        
        return {
            success: true,
            message: `Berhasil menggunakan ${this.weaponSystem.getWeapon(weaponId).name}!`,
            weapon: weaponId
        }
    }
    
    canAfford(user, price) {
        const ramadhan = user.ramadhan || { coins: 0, diamonds: 0 }
        return (
            (price.limit || 0) <= user.limit &&
            (price.coins || 0) <= ramadhan.coins &&
            (price.diamonds || 0) <= ramadhan.diamonds
        )
    }
    
    deductPayment(user, price) {
        const ramadhan = user.ramadhan || { coins: 0, diamonds: 0 }
        
        user.limit -= (price.limit || 0)
        ramadhan.coins -= (price.coins || 0)
        ramadhan.diamonds -= (price.diamonds || 0)
    }
    
    getBattleRewards(winner, loser) {
        const winnerSarung = this.initializeUser(winner)
        const loserSarung = this.initializeUser(loser)
        
        const baseExp = 50
        const expBonus = Math.floor(winnerSarung.level * 0.5)
        const totalExp = baseExp + expBonus
        
        const coinReward = 100 + (winnerSarung.level * 10)
        const limitReward = 5 + Math.floor(winnerSarung.level / 5)
        
        winnerSarung.wins++
        winnerSarung.kills++
        winnerSarung.streak++
        winnerSarung.maxStreak = Math.max(winnerSarung.maxStreak, winnerSarung.streak)
        
        loserSarung.losses++
        loserSarung.deaths++
        loserSarung.streak = 0
        
        const winnerResult = this.addExp(winner, totalExp)
        const winnerRank = this.updateRank(winner)
        
        if (winner.ramadhan) {
            winner.ramadhan.coins = (winner.ramadhan.coins || 0) + coinReward
            winner.ramadhan.exp = (winner.ramadhan.exp || 0) + (totalExp * 2)
        }
        
        winner.limit = (winner.limit || 0) + limitReward
        
        return {
            winner: {
                exp: totalExp,
                coins: coinReward,
                limit: limitReward,
                levelUp: winnerResult.levelUp,
                rankUp: winnerRank.rankUp,
                newRank: winnerSarung.rank
            },
            loser: {
                exp: Math.floor(totalExp * 0.3),
                coins: Math.floor(coinReward * 0.2),
                limit: Math.floor(limitReward * 0.2)
            }
        }
    }
}

const sarungBattleSystem = new SarungBattleSystem()
const sarungUserSystem = new SarungUserSystem()
const weaponSystem = new SarungWeaponSystem()

const command = "perangsarung"
async function createWeaponCard(weapon, userWeapon, usedPrefix, fukusima) {
    const isUnlocked = userWeapon.unlockedWeapons.includes(weapon.id)
    const isEquipped = userWeapon.equippedWeapon === weapon.id
    const currentLevel = userWeapon.weaponLevels?.[weapon.id] || 1
    
    const stats = weaponSystem.calculateUpgradedStats(weapon.id, currentLevel)

    const bodyText = `*${weapon.name}*\n` +
        `📊 Level: ${currentLevel}/${weapon.maxLevel}\n` +
        `⚔️ Damage: ${stats.damage}\n` +
        `🎯 Accuracy: ${stats.accuracy}%\n` +
        `⚡ Speed: ${stats.speed}\n` +
        `📏 Range: ${stats.range}\n` +
        `⭐ Rarity: ${weapon.rarity}\n\n` +
        `📝 ${weapon.description}`
    
    const buttons = []
    
    if (!isUnlocked) {
        buttons.push({
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
                display_text: `🛒 Beli (${weapon.price.limit}📞)`,
                id: `${usedPrefix + command} buy ${weapon.id}`
            })
        })
    } else {
        if (!isEquipped) {
            buttons.push({
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "⚔️ Gunakan",
                    id: `${usedPrefix + command} equip ${weapon.id}`
                })
            })
        }
        
        if (currentLevel < weapon.maxLevel) {
            const upgradeCost = weaponSystem.calculateUpgradeCost(weapon.id, currentLevel)
            buttons.push({
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: `⬆️ Upgrade (${upgradeCost.limit}📞)`,
                    id: `${usedPrefix + command} upgrade ${weapon.id}`
                })
            })
        }
    }
    
    buttons.push({
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
            display_text: "📋 Detail",
            id: `${usedPrefix + command} detail ${weapon.id}`
        })
    })

    // ===== THUMBNAIL GLOBAL =====
    let thumbMedia = null
    if (global.thumb) {
        thumbMedia = await prepareWAMessageMedia(
            { image: { url: global.thumb } },
            { upload: fukusima.waUploadToServer }
        )
    }
    
    const card = {
        body: proto.Message.InteractiveMessage.Body.fromObject({
            text: bodyText
        }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({
            text: `${isUnlocked ? '✅ Terbuka' : '🔒 Terkunci'} | ${isEquipped ? '⚔️ Digunakan' : '🎒 Inventory'}`
        }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
            title: weapon.name,
            hasMediaAttachment: !!thumbMedia,
            ...(thumbMedia ? { imageMessage: thumbMedia.imageMessage } : {})
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
            buttons
        })
    }
    
    return card
}

let handler = async (m, { fukusima, usedPrefix, command }) => {
    const user = global.db.data.users[m.sender]
    const args = m.text ? m.text.trim().split(' ') : []
    const subcmd = args[1]?.toLowerCase()
    
    const sarung = sarungUserSystem.initializeUser(user)
    
    if (!subcmd || subcmd === 'help') {
        const helpText = `⚔️ *PERANG SARUNG - BANTUAN*\n\n` +
            `🎮 *PERINTAH UTAMA:*\n` +
            `${usedPrefix}${command} - Dashboard\n` +
            `${usedPrefix}${command} challenge @tag - Tantang teman\n` +
            `${usedPrefix}${command} accept <id> - Terima tantangan\n` +
            `${usedPrefix}${command} battle - Cari pertarungan acak\n\n` +
            `⚔️ *SENJATA:*\n` +
            `${usedPrefix}${command} senjata list - Lihat semua senjata\n` +
            `${usedPrefix}${command} senjata equip <id> - Gunakan senjata\n` +
            `${usedPrefix}${command} senjata upgrade <id> - Upgrade senjata\n` +
            `${usedPrefix}${command} senjata buy <id> - Beli senjata baru\n\n` +
            `🏆 *STATS:*\n` +
            `${usedPrefix}${command} stats - Statistik pemain\n` +
            `${usedPrefix}${command} rank - Peringkat dan level\n` +
            `${usedPrefix}${command} leaderboard - Top 10 pemain\n\n` +
            `⚙️ *BATTLE:*\n` +
            `${usedPrefix}${command} turn <aksi> - Aksi dalam pertarungan\n` +
            `${usedPrefix}${command} status - Status pertarungan\n` +
            `${usedPrefix}${command} surrender - Menyerah\n\n` +
            `💡 *AKSI DALAM BATTLE:* attack, defend, skill <nama>, move <x> <y>`
        
        await fukusima.sendMessage(m.chat, { text: helpText }, { quoted: m })
        return
    }
    
    if (!subcmd || subcmd === 'dashboard') {
        const rankData = SARUNG_PERANG_CONFIG.ranks[sarung.rank] || SARUNG_PERANG_CONFIG.ranks[1]
        const expNeeded = sarung.level * 100
        const expPercent = (sarung.exp / expNeeded) * 100
        
        const equippedWeapon = weaponSystem.getWeapon(sarung.equippedWeapon)
        const weaponLevel = sarung.weaponLevels?.[sarung.equippedWeapon] || 1
        const weaponStats = weaponSystem.calculateUpgradedStats(sarung.equippedWeapon, weaponLevel)
        
        const dashboardText = `⚔️ *PERANG SARUNG DASHBOARD*\n\n` +
            `👤 *Pemain:* ${user.name}\n` +
            `🏆 *Rank:* ${rankData.name}\n` +
            `⭐ *Level:* ${sarung.level} (${sarung.exp}/${expNeeded} EXP)\n` +
            `📊 *Progress:* [${'█'.repeat(Math.floor(expPercent/10))}${'░'.repeat(10-Math.floor(expPercent/10))}] ${expPercent.toFixed(1)}%\n\n` +
            `⚔️ *Senjata Aktif:* ${equippedWeapon?.name || 'Tidak ada'}\n` +
            `📈 *Level Senjata:* ${weaponLevel}\n` +
            `⚡ *Damage:* ${weaponStats?.damage || 0}\n` +
            `🎯 *Accuracy:* ${weaponStats?.accuracy || 0}%\n\n` +
            `🏅 *Statistik:*\n` +
            `✅ Menang: ${sarung.wins} | ❌ Kalah: ${sarung.losses}\n` +
            `☠️ Kills: ${sarung.kills} | 💀 Deaths: ${sarung.deaths}\n` +
            `🔥 Streak: ${sarung.streak} (Max: ${sarung.maxStreak})\n\n` +
            `🎒 *Inventory:*\n` +
            `💊 Potion: ${sarung.inventory.potions}\n` +
            `🥤 Energy: ${sarung.inventory.energyDrinks}\n` +
            `🩹 Bandage: ${sarung.inventory.bandages}\n\n` +
            `Gunakan *${usedPrefix}${command} help* untuk bantuan`
        
        const buttons = [
            { buttonId: `${usedPrefix}${command} senjata list`, buttonText: { displayText: '⚔️ Senjata' }, type: 1 },
            { buttonId: `${usedPrefix}${command} challenge`, buttonText: { displayText: '⚡ Challenge' }, type: 1 },
            { buttonId: `${usedPrefix}${command} stats`, buttonText: { displayText: '📊 Stats' }, type: 1 }
        ]
        
        await fukusima.sendMessage(m.chat, {
            text: dashboardText,
            footer: '⚔️ PERANG SARUNG v2.0',
            buttons: buttons,
            headerType: 1
        }, { quoted: m })
        return
    }
    
  if (subcmd === 'senjata') {
    const senjataCmd = args[2]?.toLowerCase()

    // ================= LIST =================
    if (!senjataCmd || senjataCmd === 'list') {
        const weapons = weaponSystem.getAllWeapons()

        const cards = await Promise.all(
            weapons.map(weapon =>
                createWeaponCard(
                    weapon,
                    sarung,
                    usedPrefix + command + ' ',
                    fukusima
                )
            )
        )

        const msg = generateWAMessageFromContent(
            m.chat,
            {
                viewOnceMessage: {
                    message: {
                        interactiveMessage:
                            proto.Message.InteractiveMessage.fromObject({
                                body: proto.Message.InteractiveMessage.Body.fromObject({
                                    text: "⚔️ *DAFTAR SENJATA PERANG SARUNG*\n\nPilih senjata untuk melihat detail dan aksi"
                                }),
                                footer: proto.Message.InteractiveMessage.Footer.fromObject({
                                    text: `Total: ${weapons.length} senjata | Terbuka: ${sarung.unlockedWeapons.length}`
                                }),
                                header: proto.Message.InteractiveMessage.Header.fromObject({
                                    title: "SENJATA PERANG SARUNG",
                                    hasMediaAttachment: false
                                }),
                                carouselMessage:
                                    proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                                        cards: cards.slice(0, 10)
                                    })
                            })
                    }
                }
            },
            { quoted: m, userJid: fukusima.user.id }
        )

        await fukusima.relayMessage(
            m.chat,
            msg.message,
            { messageId: msg.key.id }
        )
        return
    }

    // ================= EQUIP =================
    if (senjataCmd === 'equip') {
        const weaponId = args[3]

        if (!weaponId) {
            await m.reply(`❌ Format: ${usedPrefix}${command} senjata equip <weapon_id>`)
            return
        }

        const result = sarungUserSystem.equipWeapon(user, weaponId)

        if (result.success) {
            await m.reply(`✅ ${result.message}`)
        } else {
            await m.reply(`❌ ${result.message}`)
        }
        return
    }

    // ================= UPGRADE =================
    if (senjataCmd === 'upgrade') {
        const weaponId = args[3]

        if (!weaponId) {
            await m.reply(`❌ Format: ${usedPrefix}${command} senjata upgrade <weapon_id>`)
            return
        }

        const result = sarungUserSystem.upgradeWeapon(user, weaponId)

        if (result.success) {
            await m.reply(
                `✅ ${result.message}\n` +
                `💰 Biaya: ${result.cost.limit}📞, ${result.cost.coins}🪙, ${result.cost.diamonds}💎`
            )
        } else {
            await m.reply(`❌ ${result.message}`)
        }
        return
    }

    // ================= BUY =================
    if (senjataCmd === 'buy') {
        const weaponId = args[3]

        if (!weaponId) {
            await m.reply(`❌ Format: ${usedPrefix}${command} senjata buy <weapon_id>`)
            return
        }

        const result = sarungUserSystem.unlockWeapon(user, weaponId)

        if (result.success) {
            await m.reply(
                `✅ ${result.message}\n` +
                `💰 Harga: ${result.weapon.price.limit}📞, ${result.weapon.price.coins}🪙, ${result.weapon.price.diamonds}💎`
            )
        } else {
            await m.reply(`❌ ${result.message}`)
        }
        return
    }

    await m.reply(`❌ Perintah senjata tidak valid.\nGunakan: list, equip, upgrade, buy`)
    return
}
    
    if (subcmd === 'challenge') {
        const mentioned = m.mentionedJid?.[0]
        
        if (!mentioned) {
            await m.reply(`❌ Tag teman yang ingin ditantang!\nContoh: ${usedPrefix}${command} challenge @teman`)
            return
        }
        
        if (mentioned === m.sender) {
            await m.reply('❌ Tidak bisa menantang diri sendiri!')
            return
        }
        
        const targetUser = global.db.data.users[mentioned]
        if (!targetUser) {
            await m.reply('❌ User tidak ditemukan!')
            return
        }
        
        const challengeId = `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        if (!global.sarungChallenges) {
            global.sarungChallenges = {}
        }
        
        global.sarungChallenges[challengeId] = {
            id: challengeId,
            challenger: m.sender,
            target: mentioned,
            createdAt: Date.now(),
            status: 'pending',
            map: 'masjid'
        }
        
        const challengeText = `⚔️ *TANTANGAN PERANG SARUNG!*\n\n` +
            `👤 Penantang: ${user.name}\n` +
            `🎯 Target: ${targetUser.name}\n` +
            `🗺️ Map: Masjid Al-Falah\n` +
            `🆔 ID: ${challengeId}\n\n` +
            `Target bisa menerima dengan:\n` +
            `${usedPrefix}${command} accept ${challengeId}`
        
        const buttons = [
            { buttonId: `${usedPrefix}${command} accept ${challengeId}`, buttonText: { displayText: '✅ Terima Tantangan' }, type: 1 },
            { buttonId: `${usedPrefix}${command}`, buttonText: { displayText: '❌ Tolak' }, type: 1 }
        ]
        
        await fukusima.sendMessage(mentioned, {
            text: challengeText,
            footer: '⚔️ PERANG SARUNG',
            buttons: buttons,
            headerType: 1
        })
        
        await m.reply(`✅ Tantangan berhasil dikirim ke @${mentioned.split('@')[0]}!`)
        return
    }
    
    if (subcmd === 'accept') {
        const challengeId = args[2]
        
        if (!challengeId) {
            await m.reply(`❌ Format: ${usedPrefix}${command} accept <challenge_id>`)
            return
        }
        
        if (!global.sarungChallenges || !global.sarungChallenges[challengeId]) {
            await m.reply('❌ Tantangan tidak ditemukan atau sudah kadaluarsa!')
            return
        }
        
        const challenge = global.sarungChallenges[challengeId]
        
        if (challenge.target !== m.sender) {
            await m.reply('❌ Tantangan ini bukan untukmu!')
            return
        }
        
        if (challenge.status !== 'pending') {
            await m.reply('❌ Tantangan sudah diproses!')
            return
        }
        
        const challengerUser = global.db.data.users[challenge.challenger]
        const targetUser = global.db.data.users[challenge.target]
        
        const battle = sarungBattleSystem.createBattle(challenge.challenger, challenge.target, challenge.map)
        
        challenge.status = 'accepted'
        challenge.battleId = battle.id
        
        const battleText = `⚔️ *BATTLE DIMULAI!*\n\n` +
            `🆔 Battle ID: ${battle.id}\n` +
            `🗺️ Map: ${SARUNG_PERANG_CONFIG.maps[battle.map].name}\n` +
            `🌤️ Cuaca: ${battle.weather}\n\n` +
            `👥 *PEMAIN:*\n` +
            `⚡ ${challengerUser.name}\n` +
            `⚡ ${targetUser.name}\n\n` +
            `Giliran pertama: ${challengerUser.name}\n` +
            `Gunakan ${usedPrefix}${command} turn <aksi> untuk bergerak!`
        
        await fukusima.sendMessage(challenge.challenger, { text: battleText })
        await fukusima.sendMessage(challenge.target, { text: battleText })
        
        await m.reply('✅ Tantangan diterima! Pertarungan dimulai!')
        return
    }
    
    if (subcmd === 'battle') {
        const activeBattles = Array.from(sarungBattleSystem.activeBattles.entries())
            .filter(([id, battle]) => battle.status === 'active')
            .slice(0, 5)
        
        if (activeBattles.length === 0) {
            await m.reply('🎮 Tidak ada pertarungan aktif. Buat tantangan dengan .perangsarung challenge @teman')
            return
        }
        
        const battleList = activeBattles.map(([id, battle], index) => {
            const players = Object.keys(battle.players)
            const player1 = global.db.data.users[players[0]]?.name || 'Unknown'
            const player2 = global.db.data.users[players[1]]?.name || 'Unknown'
            
            return `${index + 1}. ${player1} 🆚 ${player2}\n   🆔 ${id}\n   🗺️ ${battle.map}\n   🔄 Turn: ${battle.turnNumber}`
        }).join('\n\n')
        
        await m.reply(`⚔️ *PERTARUNGAN AKTIF*\n\n${battleList}\n\n` +
            `Gunakan ${usedPrefix}${command} watch <battle_id> untuk menonton`)
        return
    }
    
    if (subcmd === 'turn') {
        const battleId = Array.from(sarungBattleSystem.activeBattles.entries())
            .find(([id, battle]) => 
                Object.keys(battle.players).includes(m.sender) && 
                battle.status === 'active'
            )?.[0]
        
        if (!battleId) {
            await m.reply('❌ Kamu tidak sedang dalam pertarungan aktif!')
            return
        }
        
        const action = args[2]?.toLowerCase()
        
        if (!action) {
            await m.reply(`❌ Format: ${usedPrefix}${command} turn <aksi>\n` +
                `Aksi: attack, defend, skill <nama>, move <x> <y>`)
            return
        }
        
        let result
        
        if (action === 'attack') {
            result = sarungBattleSystem.processAction(battleId, m.sender, 'attack')
        } else if (action === 'defend') {
            result = sarungBattleSystem.processAction(battleId, m.sender, 'defend')
        } else if (action === 'skill') {
            const skillName = args[3]
            if (!skillName) {
                await m.reply(`❌ Format: ${usedPrefix}${command} turn skill <skill_name>`)
                return
            }
            result = sarungBattleSystem.processAction(battleId, m.sender, 'skill', null, { skill: skillName })
        } else if (action === 'move') {
            const x = parseInt(args[3])
            const y = parseInt(args[4])
            
            if (isNaN(x) || isNaN(y)) {
                await m.reply(`❌ Format: ${usedPrefix}${command} turn move <x> <y>`)
                return
            }
            
            result = sarungBattleSystem.processAction(battleId, m.sender, 'move', null, { position: { x, y } })
        } else {
            await m.reply('❌ Aksi tidak valid!')
            return
        }
        
        if (result.success) {
            const battle = sarungBattleSystem.activeBattles.get(battleId)
            
            if (battle.status === 'finished') {
                const winner = global.db.data.users[battle.winner]
                const loserId = Object.keys(battle.players).find(id => id !== battle.winner)
                const loser = global.db.data.users[loserId]
                
                const rewards = sarungUserSystem.getBattleRewards(winner, loser)
                
                await fukusima.sendMessage(battle.winner, {
                    text: `🎉 *KAMU MENANG!*\n\n` +
                        `🏆 Kemenangan melawan ${loser?.name || 'Unknown'}\n` +
                        `⭐ EXP: +${rewards.winner.exp}\n` +
                        `💰 Koin: +${rewards.winner.coins}\n` +
                        `📞 Limit: +${rewards.winner.limit}\n` +
                        `${rewards.winner.levelUp ? `🎊 LEVEL UP! Level ${sarungUserSystem.initializeUser(winner).level}` : ''}`
                })
                
                await fukusima.sendMessage(loserId, {
                    text: `😔 *KAMU KALAH*\n\n` +
                        `⚔️ Kekalahan melawan ${winner?.name || 'Unknown'}\n` +
                        `⭐ EXP: +${rewards.loser.exp}\n` +
                        `💰 Koin: +${rewards.loser.coins}\n` +
                        `📞 Limit: +${rewards.loser.limit}`
                })
                
                sarungBattleSystem.activeBattles.delete(battleId)
            }
            
            await m.reply(result.message)
        } else {
            await m.reply(`❌ ${result.message}`)
        }
        return
    }
    
    if (subcmd === 'status') {
        const battleId = Array.from(sarungBattleSystem.activeBattles.entries())
            .find(([id, battle]) => 
                Object.keys(battle.players).includes(m.sender) && 
                battle.status === 'active'
            )?.[0]
        
        if (!battleId) {
            await m.reply('❌ Kamu tidak sedang dalam pertarungan aktif!')
            return
        }
        
        const status = sarungBattleSystem.getBattleStatus(battleId)
        const battle = sarungBattleSystem.activeBattles.get(battleId)
        
        const players = Object.keys(status.players)
        const player1 = global.db.data.users[players[0]]?.name || 'Unknown'
        const player2 = global.db.data.users[players[1]]?.name || 'Unknown'
        
        const hpBar1 = '█'.repeat(Math.floor(status.players[players[0]].hp / 10)) + '░'.repeat(10 - Math.floor(status.players[players[0]].hp / 10))
        const hpBar2 = '█'.repeat(Math.floor(status.players[players[1]].hp / 10)) + '░'.repeat(10 - Math.floor(status.players[players[1]].hp / 10))
        
        const statusText = `⚔️ *STATUS PERTARUNGAN*\n\n` +
            `🆔 ${battleId}\n` +
            `🗺️ ${SARUNG_PERANG_CONFIG.maps[battle.map].name}\n` +
            `🌤️ ${battle.weather}\n` +
            `🔄 Turn: ${status.turnNumber}/${status.maxTurns}\n\n` +
            `👥 *PEMAIN:*\n` +
            `⚡ ${player1}\n` +
            `   ❤️ ${hpBar1} ${status.players[players[0]].hp}%\n` +
            `   ⚡ Stamina: ${battle.players[players[0]].stamina}\n` +
            `   🗡️ Senjata: ${weaponSystem.getWeapon(battle.players[players[0]].weapon)?.name}\n\n` +
            `⚡ ${player2}\n` +
            `   ❤️ ${hpBar2} ${status.players[players[1]].hp}%\n` +
            `   ⚡ Stamina: ${battle.players[players[1]].stamina}\n` +
            `   🗡️ Senjata: ${weaponSystem.getWeapon(battle.players[players[1]].weapon)?.name}\n\n` +
            `${status.turn === m.sender ? '🎯 *GILIRANMU!*' : '⏳ *TUNGGU GILIRAN*'}\n` +
            `Gunakan ${usedPrefix}${command} turn <aksi>`
        
        await m.reply(statusText)
        return
    }
    
    if (subcmd === 'surrender') {
        const battleId = Array.from(sarungBattleSystem.activeBattles.entries())
            .find(([id, battle]) => 
                Object.keys(battle.players).includes(m.sender) && 
                battle.status === 'active'
            )?.[0]
        
        if (!battleId) {
            await m.reply('❌ Kamu tidak sedang dalam pertarungan aktif!')
            return
        }
        
        const battle = sarungBattleSystem.activeBattles.get(battleId)
        battle.status = 'finished'
        battle.winner = Object.keys(battle.players).find(id => id !== m.sender)
        
        const winner = global.db.data.users[battle.winner]
        const loser = global.db.data.users[m.sender]
        
        const rewards = sarungUserSystem.getBattleRewards(winner, loser)
        
        await fukusima.sendMessage(battle.winner, {
            text: `🏆 *MUSUH MENYERAH!*\n\n` +
                `⚔️ ${loser?.name || 'Unknown'} menyerah!\n` +
                `⭐ EXP: +${rewards.winner.exp}\n` +
                `💰 Koin: +${rewards.winner.coins}\n` +
                `📞 Limit: +${rewards.winner.limit}`
        })
        
        await fukusima.sendMessage(m.sender, {
            text: `🏳️ *KAMU MENYERAH*\n\n` +
                `😔 Kamu menyerah kepada ${winner?.name || 'Unknown'}\n` +
                `⭐ EXP: +${rewards.loser.exp}\n` +
                `💰 Koin: +${rewards.loser.coins}\n` +
                `📞 Limit: +${rewards.loser.limit}`
        })
        
        sarungBattleSystem.activeBattles.delete(battleId)
        await m.reply('🏳️ Kamu menyerah dari pertarungan!')
        return
    }
    
    if (subcmd === 'stats') {
        const rankData = SARUNG_PERANG_CONFIG.ranks[sarung.rank] || SARUNG_PERANG_CONFIG.ranks[1]
        const expNeeded = sarung.level * 100
        
        const equippedWeapon = weaponSystem.getWeapon(sarung.equippedWeapon)
        const weaponLevel = sarung.weaponLevels?.[sarung.equippedWeapon] || 1
        
        const statsText = `📊 *STATISTIK PERANG SARUNG*\n\n` +
            `👤 ${user.name}\n` +
            `🏆 ${rankData.name} (Level ${sarung.level})\n` +
            `⭐ EXP: ${sarung.exp}/${expNeeded}\n\n` +
            `⚔️ *BATTLE STATS:*\n` +
            `✅ Wins: ${sarung.wins}\n` +
            `❌ Losses: ${sarung.losses}\n` +
            `🤝 Draws: ${sarung.draws}\n` +
            `☠️ Kills: ${sarung.kills}\n` +
            `💀 Deaths: ${sarung.deaths}\n` +
            `🔥 Streak: ${sarung.streak}\n` +
            `💎 Max Streak: ${sarung.maxStreak}\n\n` +
            `🎯 *COMBAT STATS:*\n` +
            `⚔️ Total Damage: ${sarung.stats.totalDamage}\n` +
            `❤️ Total Healed: ${sarung.stats.totalHealed}\n` +
            `💥 Critical Hits: ${sarung.stats.criticalHits}\n` +
            `🌀 Dodges: ${sarung.stats.dodges}\n` +
            `⏱️ Longest Battle: ${sarung.stats.longestBattle} turn\n\n` +
            `🗡️ *SENJATA:* ${equippedWeapon?.name || 'Tidak ada'} (Lv. ${weaponLevel})\n` +
            `🎒 Unlocked Weapons: ${sarung.unlockedWeapons.length}/${Object.keys(weaponSystem.weapons).length}`
        
        await m.reply(statsText)
        return
    }
    
    if (subcmd === 'rank') {
        const rankData = SARUNG_PERANG_CONFIG.ranks[sarung.rank] || SARUNG_PERANG_CONFIG.ranks[1]
        const nextRankLevel = Object.keys(SARUNG_PERANG_CONFIG.ranks)
            .sort((a, b) => b - a)
            .find(level => parseInt(level) > sarung.level)
        
        const nextRank = nextRankLevel ? SARUNG_PERANG_CONFIG.ranks[nextRankLevel] : null
        
        const rankText = `🏆 *RANK PERANG SARUNG*\n\n` +
            `👤 ${user.name}\n` +
            `🎖️ Rank Saat Ini: ${rankData.name}\n` +
            `🎨 Warna: ${rankData.color}\n` +
            `⭐ Bonus: +${rankData.bonus}% semua stat\n\n` +
            `📊 Level: ${sarung.level}\n` +
            `⭐ EXP: ${sarung.exp}/${sarung.level * 100}\n\n` +
            `${nextRank ? `🎯 Next Rank: ${nextRank.name} (Level ${nextRankLevel})` : '✨ Sudah rank tertinggi!'}`
        
        await m.reply(rankText)
        return
    }
    
    if (subcmd === 'leaderboard') {
        const users = Object.entries(global.db.data.users)
            .filter(([id, u]) => u.sarungPerang)
            .map(([id, u]) => ({
                id,
                name: u.name,
                level: u.sarungPerang.level,
                rank: u.sarungPerang.rank,
                wins: u.sarungPerang.wins,
                kills: u.sarungPerang.kills,
                streak: u.sarungPerang.streak,
                score: (u.sarungPerang.level * 100) + (u.sarungPerang.wins * 50) + (u.sarungPerang.kills * 10) + u.sarungPerang.streak
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
        
        if (users.length === 0) {
            await m.reply('📭 Leaderboard kosong! Mainkan dulu!')
            return
        }
        
        let leaderboardText = '🏆 *LEADERBOARD PERANG SARUNG*\n\n'
        
        users.forEach((u, i) => {
            const rankData = SARUNG_PERANG_CONFIG.ranks[u.rank] || SARUNG_PERANG_CONFIG.ranks[1]
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`
            
            leaderboardText += `${medal} ${u.name}\n`
            leaderboardText += `   🏆 ${rankData.name} | ⭐ Level ${u.level}\n`
            leaderboardText += `   ✅ ${u.wins} Wins | ☠️ ${u.kills} Kills\n`
            leaderboardText += `   🔥 Streak: ${u.streak} | 📊 Score: ${u.score}\n\n`
        })
        
        await m.reply(leaderboardText)
        return
    }
    
    await m.reply(`❌ Perintah tidak dikenal. Gunakan *${usedPrefix}${command} help*`)
}

handler.help = ['perangsarung', 'sarungperang']
handler.tags = ['ramadhan', 'rpg']
handler.command = /^(perangsarung|sarungperang|ps)$/i
handler.register = true
handler.limit = true

export default handler