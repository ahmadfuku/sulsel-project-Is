import fs from 'fs'
import { createCanvas, loadImage } from 'canvas'

class TukarSystem {
    constructor() {
        // Rate tukar
        this.rates = {
            // EXP ke lainnya
            'exp_to_coins': 0.5,    // 1 EXP = 0.5 koin
            'exp_to_limit': 0.02,   // 1 EXP = 0.02 limit
            'exp_to_diamonds': 0.005, // 1 EXP = 0.005 diamond
            
            // Koin ke lainnya  
            'coins_to_exp': 2,      // 1 koin = 2 EXP
            'coins_to_limit': 0.2,  // 1 koin = 0.2 limit
            'coins_to_diamonds': 0.01, // 100 koin = 1 diamond
            
            // Limit ke lainnya
            'limit_to_exp': 50,     // 1 limit = 50 EXP
            'limit_to_coins': 5,    // 1 limit = 5 koin
            'limit_to_diamonds': 0.05, // 1 limit = 0.05 diamond
            
            // Diamond ke lainnya
            'diamonds_to_exp': 200,  // 1 diamond = 200 EXP
            'diamonds_to_coins': 100, // 1 diamond = 100 koin
            'diamonds_to_limit': 20   // 1 diamond = 20 limit
        }
        
        // Fee untuk setiap transaksi (5%)
        this.fee = 0.05
    }
    
    fixUserData(user) {
        // Fix data user yang null/undefined
        if (!user.ramadhan) {
            user.ramadhan = {
                level: 1,
                exp: 0,
                coins: 0,
                diamonds: 10,
                inventory: { tools: [], consumables: [], upgrades: [] },
                stats: {
                    sahurCount: 0,
                    puasaDays: 0,
                    sholatJamaah: 0,
                    quranPages: 0,
                    sedekahAmount: 0,
                    helpedPeople: 0
                }
            }
        }
        
        // Fix exp yang null
        if (user.ramadhan.exp === null || user.ramadhan.exp === undefined) {
            user.ramadhan.exp = 0
        }
        
        // Fix coins yang null  
        if (user.ramadhan.coins === null || user.ramadhan.coins === undefined) {
            user.ramadhan.coins = 0
        }
        
        // Fix diamonds yang null
        if (user.ramadhan.diamonds === null || user.ramadhan.diamonds === undefined) {
            user.ramadhan.diamonds = 10  // Default 10
        }
        
        // Fix limit yang null
        if (user.limit === null || user.limit === undefined) {
            user.limit = 20  // Default 20
        }
        
        return user
    }
    
    checkBalance(user, currency, amount) {
        user = this.fixUserData(user)
        
        switch(currency) {
            case 'exp':
                return user.ramadhan.exp >= amount
            case 'coins':
                return user.ramadhan.coins >= amount
            case 'limit':
                return user.limit >= amount
            case 'diamonds':
                return user.ramadhan.diamonds >= amount
            default:
                return false
        }
    }
    
    calculateExchange(fromCurrency, toCurrency, amount) {
        const rateKey = `${fromCurrency}_to_${toCurrency}`
        const rate = this.rates[rateKey]
        
        if (!rate) {
            return { success: false, message: "Konversi tidak tersedia" }
        }
        
        // Hitung hasil sebelum fee
        const rawResult = amount * rate
        
        // Hitung fee
        const feeAmount = rawResult * this.fee
        
        // Hasil setelah fee
        const finalResult = Math.floor(rawResult - feeAmount)
        
        // Minimal hasil 1
        const actualResult = Math.max(1, finalResult)
        
        return {
            success: true,
            fromAmount: amount,
            toAmount: actualResult,
            rate: rate,
            fee: feeAmount,
            rateKey: rateKey
        }
    }
    
    processExchange(user, fromCurrency, toCurrency, amount) {
        // Fix data user dulu
        user = this.fixUserData(user)
        
        // Validasi input
        if (!amount || amount <= 0) {
            return { success: false, message: "Jumlah harus lebih dari 0" }
        }
        
        // Cek saldo cukup
        if (!this.checkBalance(user, fromCurrency, amount)) {
            const balance = this.getBalance(user, fromCurrency)
            return { 
                success: false, 
                message: `Saldo ${fromCurrency} tidak cukup!\nSaldo kamu: ${balance}\nButuh: ${amount}` 
            }
        }
        
        // Hitung hasil tukar
        const calculation = this.calculateExchange(fromCurrency, toCurrency, amount)
        if (!calculation.success) {
            return calculation
        }
        
        // Kurangi saldo dari
        switch(fromCurrency) {
            case 'exp':
                user.ramadhan.exp -= amount
                break
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
        
        // Tambah saldo ke
        switch(toCurrency) {
            case 'exp':
                user.ramadhan.exp += calculation.toAmount
                break
            case 'coins':
                user.ramadhan.coins += calculation.toAmount
                break
            case 'limit':
                user.limit += calculation.toAmount
                break
            case 'diamonds':
                user.ramadhan.diamonds += calculation.toAmount
                break
        }
        
        return {
            success: true,
            message: `✅ Tukar berhasil!`,
            details: {
                from: `${amount} ${fromCurrency}`,
                to: `${calculation.toAmount} ${toCurrency}`,
                rate: `1 ${fromCurrency} = ${calculation.rate} ${toCurrency}`,
                fee: `${calculation.fee.toFixed(2)} ${toCurrency}`,
                final: calculation.toAmount
            },
            newBalances: {
                exp: user.ramadhan.exp,
                coins: user.ramadhan.coins,
                limit: user.limit,
                diamonds: user.ramadhan.diamonds
            }
        }
    }
    
    getBalance(user, currency = 'all') {
        user = this.fixUserData(user)
        
        if (currency === 'all') {
            return {
                exp: user.ramadhan.exp,
                coins: user.ramadhan.coins,
                limit: user.limit,
                diamonds: user.ramadhan.diamonds
            }
        }
        
        switch(currency) {
            case 'exp':
                return user.ramadhan.exp
            case 'coins':
                return user.ramadhan.coins
            case 'limit':
                return user.limit
            case 'diamonds':
                return user.ramadhan.diamonds
            default:
                return 0
        }
    }
    
    getExchangeRates() {
        return this.rates
    }
    
    suggestBestExchange(user) {
        user = this.fixUserData(user)
        const balances = this.getBalance(user)
        
        const suggestions = []
        
        // Jika punya banyak EXP, tukar ke coins
        if (balances.exp >= 1000) {
            const coinsResult = this.calculateExchange('exp', 'coins', 1000)
            suggestions.push({
                from: 'exp',
                to: 'coins',
                amount: 1000,
                result: coinsResult.toAmount,
                reason: 'EXP banyak, tukar ke koin untuk belanja'
            })
        }
        
        // Jika punya banyak coins, tukar ke limit
        if (balances.coins >= 500) {
            const limitResult = this.calculateExchange('coins', 'limit', 500)
            suggestions.push({
                from: 'coins', 
                to: 'limit',
                amount: 500,
                result: limitResult.toAmount,
                reason: 'Koin banyak, tukar ke limit untuk beli item eksklusif'
            })
        }
        
        // Jika limit banyak, tukar ke diamonds
        if (balances.limit >= 100) {
            const diamondsResult = this.calculateExchange('limit', 'diamonds', 100)
            suggestions.push({
                from: 'limit',
                to: 'diamonds',
                amount: 100,
                result: diamondsResult.toAmount,
                reason: 'Limit banyak, tukar ke diamonds untuk item premium'
            })
        }
        
        return suggestions
    }
}

const tukarSystem = new TukarSystem()

async function generateExchangeImage(user, result) {
    try {
        const canvas = createCanvas(800, 500)
        const ctx = canvas.getContext('2d')
        
        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, 800, 500)
        gradient.addColorStop(0, '#2C3E50')
        gradient.addColorStop(1, '#4A235A')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 800, 500)
        
        // Title
        ctx.fillStyle = '#F1C40F'
        ctx.font = 'bold 40px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('💰 SISTEM TUKAR MATA UANG', 400, 60)
        
        // Exchange details
        ctx.fillStyle = '#2ECC71'
        ctx.font = 'bold 28px Arial'
        ctx.fillText('✅ TUKAR BERHASIL!', 400, 120)
        
        ctx.fillStyle = '#FFFFFF'
        ctx.font = '24px Arial'
        ctx.textAlign = 'left'
        
        const details = [
            `🔄 ${result.details.from} → ${result.details.to}`,
            `📊 Rate: ${result.details.rate}`,
            `💸 Fee: ${result.details.fee}`,
            `🎯 Hasil: ${result.details.final} ${result.details.to.split(' ')[1]}`
        ]
        
        details.forEach((text, i) => {
            ctx.fillText(text, 200, 180 + (i * 50))
        })
        
        // New balances
        ctx.fillStyle = '#3498DB'
        ctx.font = 'bold 28px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('💳 SALDO BARU', 400, 380)
        
        ctx.fillStyle = '#FFFFFF'
        ctx.font = '20px Arial'
        ctx.textAlign = 'left'
        
        const balances = [
            `⭐ EXP: ${result.newBalances.exp}`,
            `💰 Koin: ${result.newBalances.coins}`,
            `📞 Limit: ${result.newBalances.limit}`,
            `💎 Diamond: ${result.newBalances.diamonds}`
        ]
        
        balances.forEach((text, i) => {
            ctx.fillText(text, 200 + (i % 2) * 300, 420 + Math.floor(i / 2) * 40)
        })
        
        return canvas.toBuffer('image/png')
    } catch (e) {
        console.error('Error generating image:', e)
        return null
    }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const user = global.db.data.users[m.sender]
    const args = text ? text.trim().split(' ') : []
    
    // Fix user data first
    tukarSystem.fixUserData(user)
    
    if (!args[0] || args[0] === 'help') {
        const helpText = `💰 *SISTEM TUKAR MATA UANG*\n\n` +
            `📋 *Format:* ${usedPrefix}tukar <dari> <ke> <jumlah>\n\n` +
            `🔄 *CONTOH:*\n` +
            `${usedPrefix}tukar exp coins 1000\n` +
            `${usedPrefix}tukar coins limit 500\n` +
            `${usedPrefix}tukar limit diamonds 50\n` +
            `${usedPrefix}tukar diamonds exp 5\n\n` +
            `💱 *MATA UANG:*\n` +
            `⭐ exp     - Experience points\n` +
            `💰 coins   - Koin berdagang\n` +
            `📞 limit   - Pulsa amal\n` +
            `💎 diamonds - Permata iman\n\n` +
            `📊 *RATE TUKAR:*\n` +
            `1 EXP = 0.5 koin\n` +
            `1 koin = 2 EXP\n` +
            `1 EXP = 0.02 limit\n` +
            `1 limit = 50 EXP\n` +
            `100 koin = 1 diamond\n` +
            `1 diamond = 200 EXP\n\n` +
            `💡 *TIPS:*\n` +
            `• Fee 5% untuk setiap transaksi\n` +
            `• Gunakan ${usedPrefix}tukar saldo untuk cek saldo\n` +
            `• ${usedPrefix}tukar saran untuk saran terbaik`
        
        await m.reply(helpText)
        return
    }
    
    if (args[0] === 'saldo' || args[0] === 'balance') {
        const balances = tukarSystem.getBalance(user)
        
        const balanceText = `💳 *SALDO ${user.name}*\n\n` +
            `⭐ EXP: ${balances.exp}\n` +
            `💰 Koin: ${balances.coins}\n` +
            `📞 Limit: ${balances.limit}\n` +
            `💎 Diamond: ${balances.diamonds}\n\n` +
            `📊 *NILAI TOTAL:*\n` +
            `💰 Dalam koin: ${Math.floor(balances.exp * 0.5 + balances.coins + balances.limit * 5 + balances.diamonds * 100)} koin\n` +
            `📞 Dalam limit: ${Math.floor(balances.exp * 0.02 + balances.coins * 0.2 + balances.limit + balances.diamonds * 20)} limit`
        
        await m.reply(balanceText)
        return
    }
    
    if (args[0] === 'saran' || args[0] === 'suggestion') {
        const suggestions = tukarSystem.suggestBestExchange(user)
        const balances = tukarSystem.getBalance(user)
        
        if (suggestions.length === 0) {
            await m.reply(`📊 *ANALISIS SALDO*\n\n` +
                `⭐ EXP: ${balances.exp}\n` +
                `💰 Koin: ${balances.coins}\n` +
                `📞 Limit: ${balances.limit}\n` +
                `💎 Diamond: ${balances.diamonds}\n\n` +
                `💡 *SARAN:* Saldo seimbang, tidak perlu tukar sekarang.`)
            return
        }
        
        let suggestionText = `💡 *SARAN TUKAR TERBAIK*\n\n`
        
        suggestions.forEach((s, i) => {
            suggestionText += `*${i + 1}. ${s.from.toUpperCase()} → ${s.to.toUpperCase()}*\n`
            suggestionText += `   Jumlah: ${s.amount} ${s.from}\n`
            suggestionText += `   Hasil: ${s.result} ${s.to}\n`
            suggestionText += `   Alasan: ${s.reason}\n\n`
        })
        
        suggestionText += `Contoh: ${usedPrefix}tukar ${suggestions[0].from} ${suggestions[0].to} ${suggestions[0].amount}`
        
        await m.reply(suggestionText)
        return
    }
    
    if (args[0] === 'rate' || args[0] === 'kurs') {
        const rates = tukarSystem.getExchangeRates()
        
        let rateText = `📊 *RATE TUKAR MATA UANG*\n\n`
        
        // Group by from currency
        const groupedRates = {}
        for (const [key, value] of Object.entries(rates)) {
            const [from, to] = key.split('_to_')
            if (!groupedRates[from]) groupedRates[from] = []
            groupedRates[from].push({ to, rate: value })
        }
        
        for (const [from, conversions] of Object.entries(groupedRates)) {
            const fromEmoji = from === 'exp' ? '⭐' : from === 'coins' ? '💰' : from === 'limit' ? '📞' : '💎'
            rateText += `${fromEmoji} *${from.toUpperCase()}*:\n`
            
            conversions.forEach(conv => {
                const toEmoji = conv.to === 'exp' ? '⭐' : conv.to === 'coins' ? '💰' : conv.to === 'limit' ? '📞' : '💎'
                rateText += `  ${toEmoji} 1 ${from} = ${conv.rate} ${conv.to}\n`
            })
            rateText += '\n'
        }
        
        rateText += `💸 *Fee:* 5% setiap transaksi\n`
        rateText += `📝 *Format:* ${usedPrefix}tukar <dari> <ke> <jumlah>`
        
        await m.reply(rateText)
        return
    }
    
    // Proses tukar: tukar <dari> <ke> <jumlah>
    if (args.length < 3) {
        await m.reply(`❌ Format salah!\nGunakan: ${usedPrefix}tukar <dari> <ke> <jumlah>\nContoh: ${usedPrefix}tukar exp coins 1000`)
        return
    }
    
    const fromCurrency = args[0].toLowerCase()
    const toCurrency = args[1].toLowerCase()
    const amount = parseInt(args[2])
    
    // Validasi mata uang
    const validCurrencies = ['exp', 'coins', 'limit', 'diamonds']
    if (!validCurrencies.includes(fromCurrency)) {
        await m.reply(`❌ Mata uang "${fromCurrency}" tidak valid!\nPilih: exp, coins, limit, diamonds`)
        return
    }
    
    if (!validCurrencies.includes(toCurrency)) {
        await m.reply(`❌ Mata uang "${toCurrency}" tidak valid!\nPilih: exp, coins, limit, diamonds`)
        return
    }
    
    if (fromCurrency === toCurrency) {
        await m.reply(`❌ Tidak bisa tukar ${fromCurrency} ke ${toCurrency} yang sama!`)
        return
    }
    
    if (isNaN(amount) || amount <= 0) {
        await m.reply('❌ Jumlah harus angka dan lebih dari 0!')
        return
    }
    
    // Minimal amount berdasarkan currency
    const minAmounts = {
        'exp': 10,
        'coins': 10,
        'limit': 1,
        'diamonds': 1
    }
    
    if (amount < minAmounts[fromCurrency]) {
        await m.reply(`❌ Minimal tukar ${fromCurrency} adalah ${minAmounts[fromCurrency]}!`)
        return
    }
    
    // Proses tukar
    const result = tukarSystem.processExchange(user, fromCurrency, toCurrency, amount)
    
    if (!result.success) {
        await m.reply(`❌ ${result.message}`)
        return
    }
    
    // Generate image jika berhasil
    const imageBuffer = await generateExchangeImage(user, result)
    
    if (imageBuffer) {
        await conn.sendFile(m.chat, imageBuffer, 'tukar.png', 
            `💰 *TUKAR BERHASIL!*\n\n` +
            `🔄 ${result.details.from} → ${result.details.to}\n` +
            `📊 Rate: ${result.details.rate}\n` +
            `💸 Fee: ${result.details.fee}\n` +
            `🎯 Hasil: ${result.details.final} ${toCurrency}\n\n` +
            `💳 *SALDO BARU:*\n` +
            `⭐ EXP: ${result.newBalances.exp}\n` +
            `💰 Koin: ${result.newBalances.coins}\n` +
            `📞 Limit: ${result.newBalances.limit}\n` +
            `💎 Diamond: ${result.newBalances.diamonds}`,
            m
        )
    } else {
        await m.reply(
            `💰 *TUKAR BERHASIL!*\n\n` +
            `🔄 ${result.details.from} → ${result.details.to}\n` +
            `📊 Rate: ${result.details.rate}\n` +
            `💸 Fee: ${result.details.fee}\n` +
            `🎯 Hasil: ${result.details.final} ${toCurrency}\n\n` +
            `💳 *SALDO BARU:*\n` +
            `⭐ EXP: ${result.newBalances.exp}\n` +
            `💰 Koin: ${result.newBalances.coins}\n` +
            `📞 Limit: ${result.newBalances.limit}\n` +
            `💎 Diamond: ${result.newBalances.diamonds}\n\n` +
            `✅ Data kamu sudah difix dari null!`
        )
    }
}

// Quick commands untuk common exchanges
handler.before = async (m, { conn, usedPrefix }) => {
    const text = m.text || ''
    
    // Shortcut commands
    const shortcuts = {
        'tukar exp ke koin': `${usedPrefix}tukar exp coins`,
        'tukar koin ke exp': `${usedPrefix}tukar coins exp`,
        'tukar exp ke limit': `${usedPrefix}tukar exp limit`,
        'tukar limit ke exp': `${usedPrefix}tukar limit exp`,
        'tukar koin ke limit': `${usedPrefix}tukar coins limit`,
        'tukar limit ke koin': `${usedPrefix}tukar limit coins`
    }
    
    for (const [shortcut, command] of Object.entries(shortcuts)) {
        if (text.toLowerCase().includes(shortcut)) {
            const args = text.split(' ').slice(3) // Ambil angka setelah "tukar exp ke koin 100"
            const amount = args[0] || '100'
            await m.reply(`💡 Gunakan: ${command} ${amount}`)
            return true
        }
    }
    
    return false
}

handler.help = ['tukar [dari] [ke] [jumlah]', 'tukar saldo', 'tukar saran', 'tukar rate']
handler.tags = ['economy', 'wartakjil']
handler.command = /^tukar$/i
handler.register = true
handler.limit = false

export default handler