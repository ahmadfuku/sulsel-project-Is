import os from "os"

const batasCpu = 85
const batasRam = 90
const cooldownProteksi = 1000 * 60 * 5

function persenCpu() {
    const cpu = os.cpus()

    let idle = 0
    let total = 0

    for (const inti of cpu) {
        for (const tipe in inti.times) {
            total += inti.times[tipe]
        }

        idle += inti.times.idle
    }

    return Math.round(100 - (idle / total) * 100)
}

function persenRam() {
    const total = os.totalmem()
    const bebas = os.freemem()
    const dipakai = total - bebas

    return Math.round((dipakai / total) * 100)
}

function formatUkuran(ukuran) {
    if (ukuran < 1024) return `${ukuran} B`
    if (ukuran < 1024 * 1024) return `${(ukuran / 1024).toFixed(2)} KB`
    if (ukuran < 1024 * 1024 * 1024) return `${(ukuran / 1024 / 1024).toFixed(2)} MB`
    return `${(ukuran / 1024 / 1024 / 1024).toFixed(2)} GB`
}

export async function before(m) {
    try {
        if (!m.isGroup) return

        const idBot = m.conn.user.id.split(":")[0]

        if (!global.db.data.settings[idBot]) return

        const pengaturan = global.db.data.settings[idBot]

        if (!pengaturan.cpuProtection) return

        if (!global.proteksiCpu) {
            global.proteksiCpu = {}
        }

        const sekarang = Date.now()

        if (!global.proteksiCpu[idBot]) {
            global.proteksiCpu[idBot] = 0
        }

        if ((sekarang - global.proteksiCpu[idBot]) < cooldownProteksi) {
            return
        }

        const cpu = persenCpu()
        const ram = persenRam()

        const totalRam = os.totalmem()
        const bebasRam = os.freemem()

        if (cpu >= batasCpu || ram >= batasRam) {
            global.proteksiCpu[idBot] = sekarang

            console.log(`
╭━━━〔 SERVER PROTECTION 〕━━━⬣
┃ CPU Usage : ${cpu}%
┃ RAM Usage : ${ram}%
┃ Free RAM  : ${formatUkuran(bebasRam)}
┃ Total RAM : ${formatUkuran(totalRam)}
┃ Core CPU  : ${os.cpus().length}
┃ Hostname  : ${os.hostname()}
┃ Action    : Protection Enabled
╰━━━━━━━━━━━━━━━━━━━━━━━━⬣
`)

            return !0
        }

    } catch (error) {
        console.log("[SERVER PROTECTION ERROR]", error)
    }
}