import fs from 'fs'
import fetch from 'node-fetch'
import { createCanvas, loadImage } from 'canvas'

const WARTAKJIL_CONFIG = {
    market: {
        name: "🏪 WARTAKJIL - Pasar Takjil Digital",
        slogan: "Dari Ibu-Ibu Untuk Umat",
        currency: {
            coins: "Koin Berkah",
            diamonds: "Permata Iman",
            limit: "Pulsa Amal"
        }
    },

    categories: {
        takjil: {
            name: "🕌 Takjil Masjid",
            icon: "🍮",
            items: {
                kurma_ajwa: {
                    name: "🌴 Kurma Ajwa Premium",
                    description: "Kurma pilihan Rasulullah, +10 Iman",
                    price: { coins: 150, diamonds: 2, limit: 0 },
                    stock: 50,
                    effect: { iman: 10, stamina: 5 },
                    rarity: "rare",
                    source: "Madinah"
                },
                kolak_pisang: {
                    name: "🍌 Kolak Pisang Raja",
                    description: "Resep turun temurun, +15 Stamina",
                    price: { coins: 80, diamonds: 1, limit: 0 },
                    stock: 100,
                    effect: { stamina: 15, health: 10 },
                    rarity: "common",
                    source: "Nusantara"
                },
                es_buah: {
                    name: "🍉 Es Buah Spesial",
                    description: "Segarkan tubuh setelah puasa, +20 Health",
                    price: { coins: 120, diamonds: 1, limit: 0 },
                    stock: 75,
                    effect: { health: 20, refresh: 15 },
                    rarity: "uncommon",
                    source: "Bandung"
                },
                bubur_kampiun: {
                    name: "🥣 Bubur Kampiun Legendaris",
                    description: "Khas Surabaya, +25 Semua Stat",
                    price: { coins: 300, diamonds: 5, limit: 10 },
                    stock: 20,
                    effect: { all: 25 },
                    rarity: "epic",
                    source: "Surabaya"
                },
                martabak_manis: {
                    name: "🥮 Martabak Manis Istimewa",
                    description: "Lembut dan manis, +30 Stamina",
                    price: { coins: 200, diamonds: 3, limit: 5 },
                    stock: 30,
                    effect: { stamina: 30, happiness: 20 },
                    rarity: "rare",
                    source: "Bang Beling"
                }
            }
        },

        bahan: {
            name: "🛒 Bahan Pokok",
            icon: "🧺",
            items: {
                gula_aren: {
                    name: "🟤 Gula Aren Asli",
                    description: "Manis alami untuk takjil",
                    price: { coins: 40, diamonds: 0, limit: 0 },
                    stock: 200,
                    effect: { cooking: 5 },
                    rarity: "common",
                    source: "Jawa Barat"
                },
                santan_kental: {
                    name: "🥥 Santan Kental Premium",
                    description: "Santan peras pertama",
                    price: { coins: 60, diamonds: 0, limit: 0 },
                    stock: 150,
                    effect: { cooking: 8 },
                    rarity: "common",
                    source: "Riau"
                },
                kurma_mesir: {
                    name: "🌵 Kurma Mesir Export",
                    description: "Kurma ukuran jumbo",
                    price: { coins: 100, diamonds: 1, limit: 0 },
                    stock: 80,
                    effect: { iman: 5, cooking: 3 },
                    rarity: "uncommon",
                    source: "Mesir"
                },
                rempah_takjil: {
                    name: "🌿 Paket Rempah Takjil",
                    description: "Kayu manis, cengkeh, daun pandan",
                    price: { coins: 75, diamonds: 0, limit: 0 },
                    stock: 120,
                    effect: { cooking: 10, aroma: 15 },
                    rarity: "common",
                    source: "Nusantara"
                }
            }
        },

        peralatan: {
            name: "🔧 Peralatan Masak",
            icon: "👨‍🍳",
            items: {
                dandang_besar: {
                    name: "👑 Dandang Besar 50L",
                    description: "Untuk masak takjil massal",
                    price: { coins: 500, diamonds: 10, limit: 20 },
                    stock: 10,
                    effect: { capacity: 50, speed: 20 },
                    rarity: "epic",
                    source: "Magelang"
                },
                kompor_gas: {
                    name: "🔥 Kompor Gas 3 Tungku",
                    description: "Masak 3 takjil sekaligus",
                    price: { coins: 300, diamonds: 5, limit: 15 },
                    stock: 15,
                    effect: { speed: 30, efficiency: 15 },
                    rarity: "rare",
                    source: "China"
                },
                panci_stainless: {
                    name: "🥘 Set Panci Stainless",
                    description: "5 ukuran berbeda",
                    price: { coins: 150, diamonds: 2, limit: 5 },
                    stock: 25,
                    effect: { durability: 25, cooking: 10 },
                    rarity: "uncommon",
                    source: "Indonesia"
                },
                sendok_besar: {
                    name: "🥄 Sendok Besar Kayu Jati",
                    description: "Untuk aduk takjil",
                    price: { coins: 50, diamonds: 0, limit: 0 },
                    stock: 50,
                    effect: { cooking: 5 },
                    rarity: "common",
                    source: "Jepara"
                }
            }
        },

        paket: {
            name: "📦 Paket Spesial",
            icon: "🎁",
            items: {
                paket_buka_puasa: {
                    name: "🕌 Paket Buka Puasa 50 Orang",
                    description: "Lengkap untuk masjid kecil",
                    price: { coins: 1000, diamonds: 20, limit: 50 },
                    stock: 5,
                    effect: { all: 50, social: 30 },
                    contents: ["Kurma Ajwa", "Kolak Pisang", "Es Buah", "Air Mineral"],
                    rarity: "legendary",
                    source: "Wartakjil Official"
                },
                paket_sahur: {
                    name: "🌅 Paket Sahur Keluarga",
                    description: "Untuk 1 minggu sahur",
                    price: { coins: 600, diamonds: 12, limit: 30 },
                    stock: 10,
                    effect: { stamina: 40, health: 30 },
                    contents: ["Bubur Kampiun", "Roti Gandum", "Susu", "Buah"],
                    rarity: "epic",
                    source: "Wartakjil Official"
                },
                paket_sedekah: {
                    name: "🤲 Paket Sedekah 100 Takjil",
                    description: "Siap dibagikan ke mustahik",
                    price: { coins: 800, diamonds: 15, limit: 40 },
                    stock: 8,
                    effect: { pahala: 100, blessing: 50 },
                    contents: ["100 Takjil Box", "Air Mineral", "Kurma"],
                    rarity: "legendary",
                    source: "Wartakjil Official"
                }
            }
        },

        digital: {
            name: "💾 Produk Digital",
            icon: "📱",
            items: {
                resep_rahasia: {
                    name: "📜 Resep Rahasia Takjil",
                    description: "7 resep turun temurun",
                    price: { coins: 250, diamonds: 5, limit: 10 },
                    stock: 999,
                    effect: { cooking: 25, creativity: 20 },
                    rarity: "rare",
                    source: "Keluarga Keraton"
                },
                kursus_online: {
                    name: "🎓 Kursus Takjil Premium",
                    description: "Online course 30 hari",
                    price: { coins: 400, diamonds: 8, limit: 20 },
                    stock: 999,
                    effect: { skill: 40, knowledge: 35 },
                    rarity: "epic",
                    source: "Chef Ramadhan"
                },
                aplikasi_wartakjil: {
                    name: "📱 Aplikasi Wartakjil Pro",
                    description: "Full feature lifetime",
                    price: { coins: 600, diamonds: 12, limit: 25 },
                    stock: 999,
                    effect: { efficiency: 50, management: 40 },
                    rarity: "legendary",
                    source: "Wartakjil Dev Team"
                }
            }
        }
    },

    services: {
        jual: {
            name: "💰 Jual Item",
            fee: 0.1,
            minPrice: 10,
            maxItems: 10
        },
        tukar: {
            name: "🔄 Tukar Item",
            rate: {
                coins_to_limit: 5,
                limit_to_coins: 0.18,
                diamonds_to_coins: 50,
                coins_to_diamonds: 0.02
            }
        },
        upgrade: {
            name: "⚡ Upgrade Item",
            costMultiplier: 1.5,
            maxLevel: 10
        },
        lelang: {
            name: "🔨 Lelang Item",
            duration: 3600,
            fee: 0.05
        }
    },

    events: {
        daily: {
            name: "📅 Event Harian",
            time: "18:00-20:00",
            discount: 0.3,
            bonus: { coins: 50, diamonds: 1 }
        },
        weekend: {
            name: "🎪 Weekend Sale",
            days: ["Sabtu", "Minggu"],
            discount: 0.2,
            specialItems: true
        },
        flash_sale: {
            name: "⚡ Flash Sale",
            interval: 4,
            duration: 900,
            discount: 0.5
        }
    }
}

class WartakjilSystem {
    constructor() {
        this.marketItems = {}
        this.initializeMarket()
    }

    initializeMarket() {
        for (const [category, data] of Object.entries(WARTAKJIL_CONFIG.categories)) {
            for (const [itemId, itemData] of Object.entries(data.items)) {
                this.marketItems[itemId] = {
                    ...itemData,
                    category: category,
                    id: itemId,
                    sold: 0,
                    rating: 5.0,
                    reviews: []
                }
            }
        }
    }

    getItem(itemId) {
        return this.marketItems[itemId]
    }

    getCategoryItems(category) {
        return Object.values(this.marketItems).filter(item => item.category === category)
    }

    calculatePrice(itemId, quantity = 1, userLevel = 1) {
        const item = this.getItem(itemId)
        if (!item) return null

        let price = {
            coins: item.price.coins * quantity,
            diamonds: item.price.diamonds * quantity,
            limit: item.price.limit * quantity
        }

        const discount = this.getCurrentDiscount()
        price.coins = Math.floor(price.coins * (1 - discount))
        price.diamonds = Math.floor(price.diamonds * (1 - discount))
        price.limit = Math.floor(price.limit * (1 - discount))

        const levelBonus = 1 - (userLevel * 0.005)
        price.coins = Math.floor(price.coins * levelBonus)
        price.diamonds = Math.floor(price.diamonds * levelBonus)
        price.limit = Math.floor(price.limit * levelBonus)

        return price
    }

    getCurrentDiscount() {
        const now = new Date()
        const hour = now.getHours()
        const day = now.getDay()

        let discount = 0

        if (hour >= 18 && hour < 20) {
            discount += WARTAKJIL_CONFIG.events.daily.discount
        }

        if (day === 6 || day === 0) {
            discount += WARTAKJIL_CONFIG.events.weekend.discount
        }

        if (now.getMinutes() < 15 && now.getHours() % WARTAKJIL_CONFIG.events.flash_sale.interval === 0) {
            discount += WARTAKJIL_CONFIG.events.flash_sale.discount
        }

        return Math.min(discount, 0.7)
    }

    canAfford(user, price) {
        const ramadhan = user.ramadhan || { coins: 0, diamonds: 0 }
        return (
            ramadhan.coins >= price.coins &&
            ramadhan.diamonds >= price.diamonds &&
            user.limit >= price.limit
        )
    }

    processPurchase(user, itemId, quantity = 1) {
        const item = this.getItem(itemId)
        if (!item || item.stock < quantity) {
            return { success: false, message: "Stok habis atau item tidak ada" }
        }

        const price = this.calculatePrice(itemId, quantity, user.ramadhan?.level || 1)
        if (!this.canAfford(user, price)) {
            return { success: false, message: "Saldo tidak cukup" }
        }

        if (!user.ramadhan) {
            user.ramadhan = {
                level: 1,
                exp: 0,
                coins: 0,
                diamonds: 0,
                inventory: { tools: [], consumables: [], upgrades: [] }
            }
        }

        if (!user.ramadhan.inventory) {
            user.ramadhan.inventory = { tools: [], consumables: [], upgrades: [] }
        }

        user.ramadhan.coins -= price.coins
        user.ramadhan.diamonds -= price.diamonds
        user.limit -= price.limit

        item.stock -= quantity
        item.sold += quantity

        const purchasedItem = {
            id: itemId,
            name: item.name,
            quantity: quantity,
            purchasedAt: Date.now(),
            price: price,
            category: item.category,
            effect: item.effect
        }

        const category = item.category
        if (['takjil', 'bahan'].includes(category)) {
            if (!user.ramadhan.inventory.consumables) user.ramadhan.inventory.consumables = []
            const existing = user.ramadhan.inventory.consumables.find(i => i.id === itemId)
            if (existing) {
                existing.quantity += quantity
            } else {
                user.ramadhan.inventory.consumables.push({
                    ...purchasedItem,
                    quantity: quantity
                })
            }
        } else if (['peralatan', 'digital'].includes(category)) {
            if (!user.ramadhan.inventory.tools) user.ramadhan.inventory.tools = []
            user.ramadhan.inventory.tools.push(purchasedItem)
        } else if (category === 'paket') {
            if (!user.ramadhan.inventory.upgrades) user.ramadhan.inventory.upgrades = []
            user.ramadhan.inventory.upgrades.push(purchasedItem)
        }

        const expGain = Math.floor(price.coins * 0.1 + price.diamonds * 5 + price.limit * 2)
        user.ramadhan.exp += expGain
        user.exp += Math.floor(expGain * 0.5)

        if (user.ngabuburit && user.ngabuburit.tas) {
            if (!user.ngabuburit.tas[itemId]) {
                user.ngabuburit.tas[itemId] = 0
            }
            user.ngabuburit.tas[itemId] += quantity
        }

        return {
            success: true,
            message: `Berhasil membeli ${quantity}x ${item.name}`,
            item: purchasedItem,
            price: price,
            expGain: expGain
        }
    }

    processSell(user, itemType, itemId, quantity = 1) {
        if (!user.ramadhan?.inventory) {
            return { success: false, message: "Inventory kosong" }
        }

        let inventory, itemIndex, itemData

        switch (itemType) {
            case 'consumables':
                inventory = user.ramadhan.inventory.consumables || []
                itemIndex = inventory.findIndex(i => i.id === itemId)
                if (itemIndex === -1) {
                    return { success: false, message: "Item tidak ditemukan" }
                }
                itemData = inventory[itemIndex]
                if (itemData.quantity < quantity) {
                    return { success: false, message: "Jumlah tidak mencukupi" }
                }
                itemData.quantity -= quantity
                if (itemData.quantity <= 0) {
                    inventory.splice(itemIndex, 1)
                }
                break

            case 'tools':
                inventory = user.ramadhan.inventory.tools || []
                itemIndex = inventory.findIndex(i => i.id === itemId)
                if (itemIndex === -1) {
                    return { success: false, message: "Item tidak ditemukan" }
                }
                itemData = inventory[itemIndex]
                inventory.splice(itemIndex, 1)
                break

            case 'upgrades':
                inventory = user.ramadhan.inventory.upgrades || []
                itemIndex = inventory.findIndex(i => i.id === itemId)
                if (itemIndex === -1) {
                    return { success: false, message: "Item tidak ditemukan" }
                }
                itemData = inventory[itemIndex]
                inventory.splice(itemIndex, 1)
                break

            default:
                return { success: false, message: "Tipe item tidak valid" }
        }

        const marketItem = this.getItem(itemId)
        if (!marketItem) {
            return { success: false, message: "Item tidak terdaftar di pasar" }
        }

        const basePrice = marketItem.price
        const sellPrice = {
            coins: Math.floor(basePrice.coins * quantity * 0.7),
            diamonds: Math.floor(basePrice.diamonds * quantity * 0.7),
            limit: Math.floor(basePrice.limit * quantity * 0.7)
        }

        const fee = {
            coins: Math.floor(sellPrice.coins * WARTAKJIL_CONFIG.services.jual.fee),
            diamonds: Math.floor(sellPrice.diamonds * WARTAKJIL_CONFIG.services.jual.fee),
            limit: Math.floor(sellPrice.limit * WARTAKJIL_CONFIG.services.jual.fee)
        }

        const finalPrice = {
            coins: sellPrice.coins - fee.coins,
            diamonds: sellPrice.diamonds - fee.diamonds,
            limit: sellPrice.limit - fee.limit
        }

        user.ramadhan.coins += finalPrice.coins
        user.ramadhan.diamonds += finalPrice.diamonds
        user.limit += finalPrice.limit

        const expGain = Math.floor(finalPrice.coins * 0.05)
        user.ramadhan.exp += expGain
        user.exp += Math.floor(expGain * 0.3)

        return {
            success: true,
            message: `Berhasil menjual ${quantity}x ${marketItem.name}`,
            price: finalPrice,
            fee: fee,
            expGain: expGain
        }
    }

    processExchange(user, fromType, toType, amount) {
        const rates = WARTAKJIL_CONFIG.services.tukar.rate

        let fromValue, toValue, rateKey

        switch (fromType) {
            case 'coins':
                fromValue = user.ramadhan?.coins || 0
                if (toType === 'limit') {
                    rateKey = 'coins_to_limit'
                    toValue = Math.floor(amount / rates[rateKey])
                } else if (toType === 'diamonds') {
                    rateKey = 'coins_to_diamonds'
                    toValue = Math.floor(amount * rates[rateKey])
                } else {
                    return { success: false, message: "Konversi tidak didukung" }
                }
                break

            case 'limit':
                fromValue = user.limit || 0
                if (toType === 'coins') {
                    rateKey = 'limit_to_coins'
                    toValue = Math.floor(amount * rates[rateKey])
                } else {
                    return { success: false, message: "Konversi tidak didukung" }
                }
                break

            case 'diamonds':
                fromValue = user.ramadhan?.diamonds || 0
                if (toType === 'coins') {
                    rateKey = 'diamonds_to_coins'
                    toValue = Math.floor(amount * rates[rateKey])
                } else {
                    return { success: false, message: "Konversi tidak didukung" }
                }
                break

            default:
                return { success: false, message: "Mata uang tidak valid" }
        }

        if (fromValue < amount) {
            return { success: false, message: "Saldo tidak cukup" }
        }

        if (toValue < 1) {
            return { success: false, message: "Jumlah terlalu kecil" }
        }

        switch (fromType) {
            case 'coins':
                user.ramadhan.coins -= amount
                break
            case 'limit':
                user.limit -= amount
                break
            case 'diamonds':
                user.ramadhan.diamonds -= amount
                break
        }

        switch (toType) {
            case 'coins':
                user.ramadhan.coins += toValue
                break
            case 'limit':
                user.limit += toValue
                break
            case 'diamonds':
                user.ramadhan.diamonds += toValue
                break
        }

        const fee = Math.floor(toValue * 0.05)
        toValue -= fee

        return {
            success: true,
            message: `Berhasil menukar ${amount} ${fromType} → ${toValue} ${toType}`,
            from: { type: fromType, amount: amount },
            to: { type: toType, amount: toValue },
            fee: fee
        }
    }

    processUpgrade(user, itemType, itemId) {
        if (!user.ramadhan?.inventory) {
            return { success: false, message: "Inventory kosong" }
        }

        let inventory, itemIndex, itemData

        switch (itemType) {
            case 'tools':
                inventory = user.ramadhan.inventory.tools || []
                itemIndex = inventory.findIndex(i => i.id === itemId)
                if (itemIndex === -1) {
                    return { success: false, message: "Item tidak ditemukan" }
                }
                itemData = inventory[itemIndex]
                break

            case 'upgrades':
                inventory = user.ramadhan.inventory.upgrades || []
                itemIndex = inventory.findIndex(i => i.id === itemId)
                if (itemIndex === -1) {
                    return { success: false, message: "Item tidak ditemukan" }
                }
                itemData = inventory[itemIndex]
                break

            default:
                return { success: false, message: "Tipe item tidak bisa diupgrade" }
        }

        const currentLevel = itemData.level || 1
        if (currentLevel >= WARTAKJIL_CONFIG.services.upgrade.maxLevel) {
            return { success: false, message: "Sudah level maksimal" }
        }

        const upgradeCost = {
            coins: Math.floor(100 * Math.pow(WARTAKJIL_CONFIG.services.upgrade.costMultiplier, currentLevel - 1)),
            diamonds: Math.floor(2 * Math.pow(WARTAKJIL_CONFIG.services.upgrade.costMultiplier, currentLevel - 1)),
            limit: Math.floor(5 * Math.pow(WARTAKJIL_CONFIG.services.upgrade.costMultiplier, currentLevel - 1))
        }

        if (!this.canAfford(user, upgradeCost)) {
            return { success: false, message: "Biaya upgrade tidak cukup" }
        }

        user.ramadhan.coins -= upgradeCost.coins
        user.ramadhan.diamonds -= upgradeCost.diamonds
        user.limit -= upgradeCost.limit

        itemData.level = currentLevel + 1
        itemData.effect = this.calculateUpgradedEffect(itemData.effect, currentLevel + 1)

        const expGain = Math.floor(upgradeCost.coins * 0.2)
        user.ramadhan.exp += expGain
        user.exp += Math.floor(expGain * 0.5)

        return {
            success: true,
            message: `Berhasil upgrade ${itemData.name} ke level ${itemData.level}`,
            item: itemData,
            cost: upgradeCost,
            expGain: expGain
        }
    }

    calculateUpgradedEffect(baseEffect, level) {
        const multiplier = 1 + (level - 1) * 0.2
        const upgradedEffect = {}

        for (const [stat, value] of Object.entries(baseEffect)) {
            if (stat === 'all') {
                upgradedEffect.all = Math.floor(value * multiplier)
            } else {
                upgradedEffect[stat] = Math.floor(value * multiplier)
            }
        }

        return upgradedEffect
    }

    getAuctionItems() {
        const now = Date.now()
        if (!global.wartakjilAuctions) {
            global.wartakjilAuctions = []
        }

        return global.wartakjilAuctions.filter(auction => auction.endTime > now)
    }

    createAuction(user, itemType, itemId, quantity, startPrice, durationHours = 24) {
        if (!user.ramadhan?.inventory) {
            return { success: false, message: "Inventory kosong" }
        }

        const sellResult = this.processSell(user, itemType, itemId, quantity)
        if (!sellResult.success) {
            return sellResult
        }

        const marketItem = this.getItem(itemId)
        const endTime = Date.now() + (durationHours * 3600 * 1000)

        const auction = {
            id: `auction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            seller: {
                id: m.sender,
                name: user.name
            },
            item: {
                id: itemId,
                name: marketItem.name,
                type: itemType,
                quantity: quantity,
                originalPrice: marketItem.price
            },
            startPrice: startPrice,
            currentPrice: startPrice,
            currentBidder: null,
            bids: [],
            startTime: Date.now(),
            endTime: endTime,
            status: 'active'
        }

        if (!global.wartakjilAuctions) {
            global.wartakjilAuctions = []
        }

        global.wartakjilAuctions.push(auction)

        return {
            success: true,
            message: `Lelang ${marketItem.name} dibuat`,
            auction: auction,
            auctionId: auction.id
        }
    }

    placeBid(user, auctionId, bidAmount) {
        const auctions = this.getAuctionItems()
        const auctionIndex = auctions.findIndex(a => a.id === auctionId)

        if (auctionIndex === -1) {
            return { success: false, message: "Lelang tidak ditemukan" }
        }

        const auction = auctions[auctionIndex]

        if (auction.status !== 'active') {
            return { success: false, message: "Lelang sudah berakhir" }
        }

        if (Date.now() > auction.endTime) {
            auction.status = 'ended'
            return { success: false, message: "Lelang sudah berakhir" }
        }

        if (bidAmount <= auction.currentPrice) {
            return { success: false, message: "Bid harus lebih tinggi dari harga sekarang" }
        }

        const requiredCoins = bidAmount
        if (user.ramadhan?.coins < requiredCoins) {
            return { success: false, message: "Koin tidak cukup" }
        }

        if (auction.currentBidder) {
            const previousBidder = global.db.data.users[auction.currentBidder.id]
            if (previousBidder && previousBidder.ramadhan) {
                previousBidder.ramadhan.coins += auction.currentPrice
            }
        }

        user.ramadhan.coins -= bidAmount

        auction.currentPrice = bidAmount
        auction.currentBidder = {
            id: m.sender,
            name: user.name
        }

        auction.bids.push({
            bidder: { id: m.sender, name: user.name },
            amount: bidAmount,
            time: Date.now()
        })

        return {
            success: true,
            message: `Bid berhasil! Harga sekarang: ${bidAmount} koin`,
            auction: auction
        }
    }

    checkExpiredAuctions() {
        const now = Date.now()
        if (!global.wartakjilAuctions) return []

        const expired = global.wartakjilAuctions.filter(a => a.endTime <= now && a.status === 'active')
        
        expired.forEach(auction => {
            auction.status = 'ended'
            
            if (auction.currentBidder) {
                const seller = global.db.data.users[auction.seller.id]
                if (seller && seller.ramadhan) {
                    const fee = Math.floor(auction.currentPrice * WARTAKJIL_CONFIG.services.lelang.fee)
                    const finalAmount = auction.currentPrice - fee
                    
                    seller.ramadhan.coins += finalAmount
                    seller.exp += Math.floor(finalAmount * 0.1)
                    
                    const winner = global.db.data.users[auction.currentBidder.id]
                    if (winner && winner.ramadhan) {
                        if (!winner.ramadhan.inventory.consumables) {
                            winner.ramadhan.inventory.consumables = []
                        }
                        
                        winner.ramadhan.inventory.consumables.push({
                            id: auction.item.id,
                            name: auction.item.name,
                            quantity: auction.item.quantity,
                            purchasedAt: Date.now(),
                            fromAuction: true,
                            auctionId: auction.id
                        })
                    }
                }
            } else {
                const seller = global.db.data.users[auction.seller.id]
                if (seller && seller.ramadhan) {
                    if (!seller.ramadhan.inventory.consumables) {
                        seller.ramadhan.inventory.consumables = []
                    }
                    
                    seller.ramadhan.inventory.consumables.push({
                        id: auction.item.id,
                        name: auction.item.name,
                        quantity: auction.item.quantity,
                        purchasedAt: Date.now(),
                        returned: true
                    })
                }
            }
        })

        return expired
    }

    getUserStats(user) {
        const ramadhan = user.ramadhan || {}
        const ngabuburit = user.ngabuburit || {}
        
        let totalSpent = 0
        let totalSold = 0
        let totalItems = 0
        
        if (ramadhan.inventory) {
            if (ramadhan.inventory.consumables) {
                totalItems += ramadhan.inventory.consumables.reduce((sum, item) => sum + (item.quantity || 1), 0)
            }
            if (ramadhan.inventory.tools) {
                totalItems += ramadhan.inventory.tools.length
            }
            if (ramadhan.inventory.upgrades) {
                totalItems += ramadhan.inventory.upgrades.length
            }
        }
        
        return {
            username: user.name,
            level: user.level,
            ramadhanLevel: ramadhan.level || 1,
            coins: ramadhan.coins || 0,
            diamonds: ramadhan.diamonds || 0,
            limit: user.limit || 0,
            totalItems: totalItems,
            ngabuburitLevel: ngabuburit.level || 0,
            ngabuburitExp: ngabuburit.exp || 0,
            tasItems: Object.keys(ngabuburit.tas || {}).length
        }
    }

    getMarketStats() {
        let totalItems = 0
        let totalStock = 0
        let totalSold = 0
        let totalValue = 0
        
        for (const item of Object.values(this.marketItems)) {
            totalItems++
            totalStock += item.stock
            totalSold += item.sold
            totalValue += (item.price.coins + item.price.diamonds * 50 + item.price.limit * 10) * item.stock
        }
        
        return {
            totalItems: totalItems,
            totalStock: totalStock,
            totalSold: totalSold,
            totalValue: totalValue,
            activeAuctions: this.getAuctionItems().length,
            discount: this.getCurrentDiscount() * 100
        }
    }
}

const wartakjil = new WartakjilSystem()

async function generateMarketImage(stats) {
    try {
        const canvas = createCanvas(800, 600)
        const ctx = canvas.getContext('2d')

        const gradient = ctx.createLinearGradient(0, 0, 800, 600)
        gradient.addColorStop(0, '#1a5276')
        gradient.addColorStop(1, '#0e3b5c')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 800, 600)

        ctx.fillStyle = '#f39c12'
        ctx.font = 'bold 48px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('🏪 WARTAKJIL', 400, 80)

        ctx.fillStyle = '#ffffff'
        ctx.font = '24px Arial'
        ctx.fillText('Pasar Takjil Digital Ramadhan', 400, 120)

        ctx.fillStyle = '#f1c40f'
        ctx.font = 'bold 32px Arial'
        ctx.fillText('📊 STATISTIK PASAR', 400, 180)

        ctx.fillStyle = '#ffffff'
        ctx.font = '20px Arial'
        ctx.textAlign = 'left'

        const marketStats = [
            `🛍️ Total Item: ${stats.market.totalItems}`,
            `📦 Stok Tersedia: ${stats.market.totalStock}`,
            `💰 Total Terjual: ${stats.market.totalSold}`,
            `🎪 Lelang Aktif: ${stats.market.activeAuctions}`,
            `🎁 Diskon: ${stats.market.discount.toFixed(1)}%`
        ]

        marketStats.forEach((stat, i) => {
            ctx.fillText(stat, 200, 230 + (i * 40))
        })

        ctx.textAlign = 'left'
        ctx.font = 'bold 20px Arial'
        ctx.fillStyle = '#2ecc71'
        ctx.fillText('👤 STATISTIK PLAYER', 400, 230)

        ctx.font = '18px Arial'
        ctx.fillStyle = '#ffffff'
        
        const playerStats = [
            `👤 ${stats.player.username}`,
            `⭐ Level: ${stats.player.level}`,
            `🕌 Level Ramadhan: ${stats.player.ramadhanLevel}`,
            `💰 Koin: ${stats.player.coins}`,
            `💎 Diamond: ${stats.player.diamonds}`,
            `📞 Limit: ${stats.player.limit}`,
            `🎒 Total Item: ${stats.player.totalItems}`
        ]

        playerStats.forEach((stat, i) => {
            ctx.fillText(stat, 400, 260 + (i * 30))
        })

        const now = new Date()
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
        ctx.font = '16px Arial'
        ctx.textAlign = 'right'
        ctx.fillText(`🕒 ${now.toLocaleDateString('id-ID')} ${now.toLocaleTimeString('id-ID')}`, 780, 580)

        return canvas.toBuffer('image/png')
    } catch (e) {
        console.error('Error generating image:', e)
        return null
    }
}

let handler = async (m, { fukusima, text, usedPrefix, command }) => {
    const user = global.db.data.users[m.sender]
    const args = text ? text.trim().split(' ') : []
    const subcmd = args[0]?.toLowerCase()

    if (!subcmd || subcmd === 'help') {
        const helpText = `🏪 *WARTAKJIL - PASAR TAKJIL DIGITAL*

📋 *PERINTAH UTAMA:*
${usedPrefix}wartakjil - Dashboard pasar
${usedPrefix}wartakjil beli <item> [jumlah] - Beli item
${usedPrefix}wartakjil jual <tipe> <item> [jumlah] - Jual item
${usedPrefix}wartakjil tukar <dari> <ke> <jumlah> - Tukar mata uang
${usedPrefix}wartakjil upgrade <tipe> <item> - Upgrade item

🛍️ *BROWSE:*
${usedPrefix}wartakjil kategori <nama> - Lihat per kategori
${usedPrefix}wartakjil cari <nama> - Cari item
${usedPrefix}wartakjil item <id> - Detail item

💰 *LELANG:*
${usedPrefix}wartakjil lelang list - Lihat lelang aktif
${usedPrefix}wartakjil lelang buat <tipe> <item> <jumlah> <harga> - Buat lelang
${usedPrefix}wartakjil lelang bid <id> <harga> - Bid lelang

📊 *STATS:*
${usedPrefix}wartakjil stats - Statistik pasar
${usedPrefix}wartakjil inventory - Inventory kamu

🎪 *KATEGORI:* takjil, bahan, peralatan, paket, digital

💰 *MATA UANG:* coins, diamonds, limit

💡 *TIPS:* Manfaatkan diskon waktu buka puasa (18:00-20:00)`
        
        await m.reply(helpText)
        return
    }

    if (subcmd === 'dashboard' || !subcmd) {
        const userStats = wartakjil.getUserStats(user)
        const marketStats = wartakjil.getMarketStats()
        
        const imageBuffer = await generateMarketImage({
            player: userStats,
            market: marketStats
        })
        
        if (imageBuffer) {
            await fukusima.sendFile(m.chat, imageBuffer, 'wartakjil.png', 
                `🏪 *WARTAKJIL DASHBOARD*\n\n` +
                `👤 *Player:* ${user.name}\n` +
                `💰 *Koin:* ${userStats.coins}\n` +
                `💎 *Diamond:* ${userStats.diamonds}\n` +
                `📞 *Limit:* ${userStats.limit}\n` +
                `🎒 *Total Item:* ${userStats.totalItems}\n\n` +
                `📊 *Market Stats:*\n` +
                `🛍️ Items: ${marketStats.totalItems}\n` +
                `📦 Stock: ${marketStats.totalStock}\n` +
                `💰 Terjual: ${marketStats.totalSold}\n` +
                `🎁 Diskon: ${marketStats.discount.toFixed(1)}%\n\n` +
                `Gunakan *${usedPrefix}wartakjil help* untuk bantuan`,
                m
            )
        } else {
            await m.reply(
                `🏪 *WARTAKJIL DASHBOARD*\n\n` +
                `👤 Player: ${user.name}\n` +
                `💰 Koin: ${userStats.coins}\n` +
                `💎 Diamond: ${userStats.diamonds}\n` +
                `📞 Limit: ${userStats.limit}\n` +
                `🎒 Total Item: ${userStats.totalItems}\n\n` +
                `📊 Market Stats:\n` +
                `🛍️ Items: ${marketStats.totalItems}\n` +
                `📦 Stock: ${marketStats.totalStock}\n` +
                `💰 Terjual: ${marketStats.totalSold}\n` +
                `🎁 Diskon: ${marketStats.discount.toFixed(1)}%`
            )
        }
        return
    }

    if (subcmd === 'beli') {
        const itemId = args[1]
        const quantity = parseInt(args[2]) || 1
        
        if (!itemId) {
            await m.reply(`❌ Format: ${usedPrefix}wartakjil beli <item_id> [jumlah]\n` +
                `Contoh: ${usedPrefix}wartakjil beli kurma_ajwa 2`)
            return
        }
        
        const result = wartakjil.processPurchase(user, itemId, quantity)
        
        if (result.success) {
            await m.reply(`✅ *PEMBELIAN BERHASIL!*\n\n` +
                `🛍️ Item: ${result.item.name}\n` +
                `📦 Jumlah: ${quantity}\n` +
                `💰 Harga: ${result.price.coins} koin, ${result.price.diamonds} 💎, ${result.price.limit} 📞\n` +
                `📈 EXP: +${result.expGain}\n\n` +
                `💳 Sisa Saldo:\n` +
                `• Koin: ${user.ramadhan?.coins || 0}\n` +
                `• Diamond: ${user.ramadhan?.diamonds || 0}\n` +
                `• Limit: ${user.limit || 0}`)
        } else {
            await m.reply(`❌ ${result.message}`)
        }
        return
    }

    if (subcmd === 'jual') {
        const itemType = args[1]
        const itemId = args[2]
        const quantity = parseInt(args[3]) || 1
        
        if (!itemType || !itemId) {
            await m.reply(`❌ Format: ${usedPrefix}wartakjil jual <tipe> <item_id> [jumlah]\n` +
                `Tipe: consumables, tools, upgrades\n` +
                `Contoh: ${usedPrefix}wartakjil jual consumables kurma_ajwa 2`)
            return
        }
        
        const result = wartakjil.processSell(user, itemType, itemId, quantity)
        
        if (result.success) {
            await m.reply(`✅ *PENJUALAN BERHASIL!*\n\n` +
                `🛍️ Item: ${itemId}\n` +
                `📦 Jumlah: ${quantity}\n` +
                `💰 Diterima: ${result.price.coins} koin, ${result.price.diamonds} 💎, ${result.price.limit} 📞\n` +
                `💸 Fee: ${result.fee.coins} koin, ${result.fee.diamonds} 💎, ${result.fee.limit} 📞\n` +
                `📈 EXP: +${result.expGain}\n\n` +
                `💳 Total Saldo:\n` +
                `• Koin: ${user.ramadhan?.coins || 0}\n` +
                `• Diamond: ${user.ramadhan?.diamonds || 0}\n` +
                `• Limit: ${user.limit || 0}`)
        } else {
            await m.reply(`❌ ${result.message}`)
        }
        return
    }

    if (subcmd === 'tukar') {
        const fromType = args[1]
        const toType = args[2]
        const amount = parseInt(args[3])
        
        if (!fromType || !toType || !amount || amount < 1) {
            await m.reply(`❌ Format: ${usedPrefix}wartakjil tukar <dari> <ke> <jumlah>\n` +
                `Contoh: ${usedPrefix}wartakjil tukar coins limit 1000\n` +
                `Tersedia: coins, diamonds, limit`)
            return
        }
        
        const result = wartakjil.processExchange(user, fromType, toType, amount)
        
        if (result.success) {
            await m.reply(`✅ *TUKAR BERHASIL!*\n\n` +
                `🔄 ${result.from.amount} ${result.from.type} → ${result.to.amount} ${result.to.type}\n` +
                `💸 Fee: ${result.fee} ${result.to.type}\n\n` +
                `💳 Saldo Sekarang:\n` +
                `• Koin: ${user.ramadhan?.coins || 0}\n` +
                `• Diamond: ${user.ramadhan?.diamonds || 0}\n` +
                `• Limit: ${user.limit || 0}`)
        } else {
            await m.reply(`❌ ${result.message}`)
        }
        return
    }

    if (subcmd === 'upgrade') {
        const itemType = args[1]
        const itemId = args[2]
        
        if (!itemType || !itemId) {
            await m.reply(`❌ Format: ${usedPrefix}wartakjil upgrade <tipe> <item_id>\n` +
                `Tipe: tools, upgrades\n` +
                `Contoh: ${usedPrefix}wartakjil upgrade tools dandang_besar`)
            return
        }
        
        const result = wartakjil.processUpgrade(user, itemType, itemId)
        
        if (result.success) {
            await m.reply(`✅ *UPGRADE BERHASIL!*\n\n` +
                `⚡ Item: ${result.item.name}\n` +
                `📈 Level: ${result.item.level}\n` +
                `💰 Biaya: ${result.cost.coins} koin, ${result.cost.diamonds} 💎, ${result.cost.limit} 📞\n` +
                `📊 Effect Baru: ${JSON.stringify(result.item.effect)}\n` +
                `📈 EXP: +${result.expGain}`)
        } else {
            await m.reply(`❌ ${result.message}`)
        }
        return
    }

    if (subcmd === 'kategori') {
        const category = args[1]
        
        if (!category || !WARTAKJIL_CONFIG.categories[category]) {
            const categories = Object.keys(WARTAKJIL_CONFIG.categories)
                .map(cat => `${WARTAKJIL_CONFIG.categories[cat].icon} ${cat}`)
                .join('\n')
            
            await m.reply(`📁 *KATEGORI WARTAKJIL*\n\n${categories}\n\n` +
                `Gunakan: ${usedPrefix}wartakjil kategori <nama>`)
            return
        }
        
        const items = wartakjil.getCategoryItems(category)
        const categoryData = WARTAKJIL_CONFIG.categories[category]
        
        let itemsText = items.map(item => {
            const price = wartakjil.calculatePrice(item.id, 1, user.ramadhan?.level || 1)
            return `• ${item.icon || '📦'} ${item.name}\n  💰 ${price.coins} koin, ${price.diamonds} 💎, ${price.limit} 📞\n  📦 Stock: ${item.stock} | ⭐ ${item.rarity}`
        }).join('\n\n')
        
        await m.reply(`${categoryData.icon} *${categoryData.name}*\n\n${itemsText}\n\n` +
            `Gunakan: ${usedPrefix}wartakjil beli <item_id>`)
        return
    }

    if (subcmd === 'cari') {
        const searchTerm = args.slice(1).join(' ').toLowerCase()
        
        if (!searchTerm) {
            await m.reply(`❌ Format: ${usedPrefix}wartakjil cari <nama_item>`)
            return
        }
        
        const results = Object.values(wartakjil.marketItems)
            .filter(item => 
                item.name.toLowerCase().includes(searchTerm) ||
                item.id.toLowerCase().includes(searchTerm) ||
                item.description.toLowerCase().includes(searchTerm)
            )
            .slice(0, 10)
        
        if (results.length === 0) {
            await m.reply('❌ Item tidak ditemukan')
            return
        }
        
        let resultsText = results.map(item => {
            const price = wartakjil.calculatePrice(item.id, 1, user.ramadhan?.level || 1)
            return `• ${item.name}\n  🆔 ${item.id}\n  💰 ${price.coins} koin\n  📦 Stock: ${item.stock}\n  📍 ${item.source}`
        }).join('\n\n')
        
        await m.reply(`🔍 *HASIL PENCARIAN:* "${searchTerm}"\n\n${resultsText}`)
        return
    }

    if (subcmd === 'item') {
        const itemId = args[1]
        
        if (!itemId) {
            await m.reply(`❌ Format: ${usedPrefix}wartakjil item <item_id>`)
            return
        }
        
        const item = wartakjil.getItem(itemId)
        if (!item) {
            await m.reply('❌ Item tidak ditemukan')
            return
        }
        
        const price = wartakjil.calculatePrice(itemId, 1, user.ramadhan?.level || 1)
        const discount = wartakjil.getCurrentDiscount() * 100
        
        await m.reply(`📋 *DETAIL ITEM*\n\n` +
            `🏷️ Nama: ${item.name}\n` +
            `🆔 ID: ${item.id}\n` +
            `📝 Deskripsi: ${item.description}\n` +
            `🏷️ Kategori: ${item.category}\n` +
            `⭐ Rarity: ${item.rarity}\n` +
            `📍 Asal: ${item.source}\n\n` +
            `💰 *HARGA:*\n` +
            `• Koin: ${price.coins} ${discount > 0 ? `(Diskon ${discount.toFixed(1)}%)` : ''}\n` +
            `• Diamond: ${price.diamonds}\n` +
            `• Limit: ${price.limit}\n\n` +
            `📊 *STATS:*\n` +
            `• Stock: ${item.stock}\n` +
            `• Terjual: ${item.sold}\n` +
            `• Rating: ${item.rating}/5.0\n\n` +
            `🎯 *EFFECT:* ${JSON.stringify(item.effect)}\n\n` +
            `🛒 Beli: ${usedPrefix}wartakjil beli ${item.id}`)
        return
    }

    if (subcmd === 'inventory') {
        const ramadhan = user.ramadhan || {}
        const inventory = ramadhan.inventory || {}
        
        let inventoryText = ''
        
        if (inventory.consumables && inventory.consumables.length > 0) {
            inventoryText += `🍽️ *CONSUMABLES:*\n`
            inventory.consumables.forEach(item => {
                inventoryText += `• ${item.name} (${item.quantity}x) - ${item.id}\n`
            })
            inventoryText += '\n'
        }
        
        if (inventory.tools && inventory.tools.length > 0) {
            inventoryText += `🔧 *TOOLS:*\n`
            inventory.tools.forEach(item => {
                inventoryText += `• ${item.name} - Level ${item.level || 1}\n`
            })
            inventoryText += '\n'
        }
        
        if (inventory.upgrades && inventory.upgrades.length > 0) {
            inventoryText += `⚡ *UPGRADES:*\n`
            inventory.upgrades.forEach(item => {
                inventoryText += `• ${item.name} - Level ${item.level || 1}\n`
            })
        }
        
        if (!inventoryText) {
            inventoryText = '📭 Inventory kosong'
        }
        
        await m.reply(`🎒 *INVENTORY ${user.name}*\n\n${inventoryText}\n\n` +
            `💰 Koin: ${ramadhan.coins || 0}\n` +
            `💎 Diamond: ${ramadhan.diamonds || 0}\n` +
            `📞 Limit: ${user.limit || 0}`)
        return
    }

    if (subcmd === 'stats') {
        const marketStats = wartakjil.getMarketStats()
        const userStats = wartakjil.getUserStats(user)
        
        await m.reply(`📊 *STATISTIK WARTAKJIL*\n\n` +
            `🏪 *MARKET STATS:*\n` +
            `🛍️ Total Item: ${marketStats.totalItems}\n` +
            `📦 Total Stock: ${marketStats.totalStock}\n` +
            `💰 Total Terjual: ${marketStats.totalSold}\n` +
            `💎 Total Nilai: ${marketStats.totalValue.toLocaleString()}\n` +
            `🎪 Lelang Aktif: ${marketStats.activeAuctions}\n` +
            `🎁 Diskon Aktif: ${marketStats.discount.toFixed(1)}%\n\n` +
            `👤 *PLAYER STATS:*\n` +
            `🏷️ Nama: ${userStats.username}\n` +
            `⭐ Level: ${userStats.level}\n` +
            `🕌 Level Ramadhan: ${userStats.ramadhanLevel}\n` +
            `💰 Koin: ${userStats.coins}\n` +
            `💎 Diamond: ${userStats.diamonds}\n` +
            `📞 Limit: ${userStats.limit}\n` +
            `🎒 Total Item: ${userStats.totalItems}`)
        return
    }

    if (subcmd === 'lelang') {
        const lelangCmd = args[1]?.toLowerCase()
        
        if (lelangCmd === 'list') {
            const auctions = wartakjil.getAuctionItems()
            
            if (auctions.length === 0) {
                await m.reply('📭 Tidak ada lelang aktif')
                return
            }
            
            let auctionText = auctions.map(auction => {
                const timeLeft = Math.max(0, auction.endTime - Date.now())
                const hours = Math.floor(timeLeft / (3600 * 1000))
                const minutes = Math.floor((timeLeft % (3600 * 1000)) / (60 * 1000))
                
                return `• ${auction.item.name} (${auction.item.quantity}x)\n` +
                       `  💰 Harga: ${auction.currentPrice} koin\n` +
                       `  ⏳ Sisa: ${hours}j ${minutes}m\n` +
                       `  🆔 ID: ${auction.id}`
            }).join('\n\n')
            
            await m.reply(`🔨 *LELANG AKTIF*\n\n${auctionText}\n\n` +
                `Bid: ${usedPrefix}wartakjil lelang bid <id> <harga>`)
            return
        }
        
        if (lelangCmd === 'buat') {
            const itemType = args[2]
            const itemId = args[3]
            const quantity = parseInt(args[4])
            const startPrice = parseInt(args[5])
            
            if (!itemType || !itemId || !quantity || !startPrice) {
                await m.reply(`❌ Format: ${usedPrefix}wartakjil lelang buat <tipe> <item> <jumlah> <harga>\n` +
                    `Contoh: ${usedPrefix}wartakjil lelang buat consumables kurma_ajwa 5 1000`)
                return
            }
            
            const result = wartakjil.createAuction(user, itemType, itemId, quantity, startPrice)
            
            if (result.success) {
                await m.reply(`✅ *LELANG DIBUAT!*\n\n` +
                    `🛍️ Item: ${result.auction.item.name}\n` +
                    `📦 Jumlah: ${quantity}\n` +
                    `💰 Harga Awal: ${startPrice} koin\n` +
                    `🆔 Auction ID: ${result.auctionId}\n` +
                    `⏳ Berakhir: 24 jam\n\n` +
                    `📢 Lelang sudah aktif!`)
            } else {
                await m.reply(`❌ ${result.message}`)
            }
            return
        }
        
        if (lelangCmd === 'bid') {
            const auctionId = args[2]
            const bidAmount = parseInt(args[3])
            
            if (!auctionId || !bidAmount) {
                await m.reply(`❌ Format: ${usedPrefix}wartakjil lelang bid <id> <harga>\n` +
                    `Contoh: ${usedPrefix}wartakjil lelang bid auction_123456789 1500`)
                return
            }
            
            const result = wartakjil.placeBid(user, auctionId, bidAmount)
            
            if (result.success) {
                await m.reply(`✅ *BID BERHASIL!*\n\n` +
                    `💰 Harga Sekarang: ${bidAmount} koin\n` +
                    `👤 Bidder: ${user.name}\n\n` +
                    `Lelang akan berakhir dalam 24 jam sejak dibuat.`)
            } else {
                await m.reply(`❌ ${result.message}`)
            }
            return
        }
        
        await m.reply(`🔨 *LELANG SYSTEM*\n\n` +
            `${usedPrefix}wartakjil lelang list - Lihat lelang aktif\n` +
            `${usedPrefix}wartakjil lelang buat <tipe> <item> <jumlah> <harga> - Buat lelang\n` +
            `${usedPrefix}wartakjil lelang bid <id> <harga> - Bid lelang`)
        return
    }

    await m.reply(`Perintah tidak dikenal. Gunakan *${usedPrefix}wartakjil help*`)
}

handler.help = ['wartakjil', 'rebutakjil']
handler.tags = ['rpg', 'ramadhan']
handler.command = /^(wartakjil|rebutakjil)$/i
handler.register = true
handler.limit = true

export default handler