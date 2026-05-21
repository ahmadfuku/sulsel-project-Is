import fs from "fs"
import path from "path"
import os from "os"

const folderTarget = [
    "./tmp",
    "./temp",
    "./cache",
    "./session",
    "./storage/temp",
    "./storage/cache"
]

const ekstensiSampah = [
    ".tmp",
    ".temp",
    ".log",
    ".cache",
    ".bak",
    ".old"
]

const umurMaksimal = 1000 * 60 * 60 * 24

function formatUkuran(ukuran) {
    if (ukuran < 1024) return `${ukuran} B`
    if (ukuran < 1024 * 1024) return `${(ukuran / 1024).toFixed(2)} KB`
    if (ukuran < 1024 * 1024 * 1024) return `${(ukuran / 1024 / 1024).toFixed(2)} MB`
    return `${(ukuran / 1024 / 1024 / 1024).toFixed(2)} GB`
}

function amanHapus(pathFile) {
    try {
        if (fs.existsSync(pathFile)) {
            fs.unlinkSync(pathFile)
            return true
        }
        return false
    } catch {
        return false
    }
}

function scanFolder(folder, hasil = []) {
    try {
        if (!fs.existsSync(folder)) return hasil

        const daftar = fs.readdirSync(folder)

        for (const nama of daftar) {
            const lokasi = path.join(folder, nama)

            try {
                const stat = fs.statSync(lokasi)

                if (stat.isDirectory()) {
                    scanFolder(lokasi, hasil)
                    continue
                }

                hasil.push({
                    lokasi,
                    ukuran: stat.size,
                    dibuat: stat.mtimeMs
                })
            } catch {}
        }

        return hasil
    } catch {
        return hasil
    }
}

function fileSampah(data) {
    const nama = path.basename(data.lokasi).toLowerCase()
    const sekarang = Date.now()

    if (ekstensiSampah.some(v => nama.endsWith(v))) return true

    if (nama.includes("cache")) return true
    if (nama.includes("temp")) return true
    if (nama.includes("thumb")) return true
    if (nama.includes("debug")) return true

    if ((sekarang - data.dibuat) > umurMaksimal) {
        return true
    }

    return false
}

function bersihkanFolder() {
    let totalFile = 0
    let totalHapus = 0
    let totalUkuran = 0

    for (const folder of folderTarget) {
        const daftar = scanFolder(folder)

        for (const file of daftar) {
            totalFile++

            if (!fileSampah(file)) continue

            const sukses = amanHapus(file.lokasi)

            if (sukses) {
                totalHapus++
                totalUkuran += file.ukuran
            }
        }
    }

    return {
        totalFile,
        totalHapus,
        totalUkuran,
        ukuranFormat: formatUkuran(totalUkuran),
        ram: formatUkuran(os.freemem()),
        platform: os.platform()
    }
}

export async function before(m, { isOwner }) {
    try {
        if (!m.isGroup) return
        if (!isOwner) return

        const idBot = m.conn.user.id.split(":")[0]

        if (!global.db.data.settings[idBot]) return

        const pengaturan = global.db.data.settings[idBot]

        if (!pengaturan.autoClearCache) return

        if (!global.cacheProtection) {
            global.cacheProtection = {}
        }

        const sekarang = Date.now()

        if (!global.cacheProtection[idBot]) {
            global.cacheProtection[idBot] = 0
        }

        if ((sekarang - global.cacheProtection[idBot]) < 1000 * 60 * 15) {
            return
        }

        global.cacheProtection[idBot] = sekarang

        const hasil = bersihkanFolder()

        console.log(`
╭━━━〔 GROUP CACHE PROTECTION 〕━━━⬣
┃ Total Scan : ${hasil.totalFile}
┃ Total Clean : ${hasil.totalHapus}
┃ Space Free : ${hasil.ukuranFormat}
┃ RAM Free : ${hasil.ram}
┃ Platform : ${hasil.platform}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━⬣
`)
    } catch (error) {
        console.log("[CACHE PROTECTION ERROR]", error)
    }
}