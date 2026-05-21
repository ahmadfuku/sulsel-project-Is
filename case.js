/* C R E D I T S - A H M A D XYZ
* FUKU GEN V7.3.2
* SYSTEM: MODULAR
* TYPE: PLUGINS - ESM
* ID UPDATE: FOX1XYOr02
* SUPPORT TEAM: MRX, HIKAM, AFIF, JAN
*/
import os from "os"
import { performance } from "perf_hooks"

function formatUkuran(angka) {
    if (angka < 1024) return `${angka} B`
    if (angka < 1024 ** 2) return `${(angka / 1024).toFixed(2)} KB`
    if (angka < 1024 ** 3) return `${(angka / 1024 ** 2).toFixed(2)} MB`
    return `${(angka / 1024 ** 3).toFixed(2)} GB`
}

function formatDurasi(ms) {
    let detik = Math.floor(ms / 1000)
    let hari = Math.floor(detik / 86400)
    detik %= 86400
    let jam = Math.floor(detik / 3600)
    detik %= 3600
    let menit = Math.floor(detik / 60)
    detik %= 60

    let hasil = []
    if (hari) hasil.push(`${hari} hari`)
    if (jam) hasil.push(`${jam} jam`)
    if (menit) hasil.push(`${menit} menit`)
    if (detik) hasil.push(`${detik} detik`)

    return hasil.length ? hasil.join(", ") : "0 detik"
}

function ambilCpu() {
    const daftarCpu = os.cpus()

    let idle = 0
    let total = 0

    for (const cpu of daftarCpu) {
        for (const tipe in cpu.times) {
            total += cpu.times[tipe]
        }

        idle += cpu.times.idle
    }

    const pakai = 100 - Math.floor((idle / total) * 100)

    return {
        model: daftarCpu[0]?.model || "Unknown",
        core: daftarCpu.length,
        speed: daftarCpu[0]?.speed || 0,
        pakai
    }
}

function ambilRam() {
    const total = os.totalmem()
    const bebas = os.freemem()
    const pakai = total - bebas
    const persen = Math.round((pakai / total) * 100)

    return {
        total,
        bebas,
        pakai,
        persen
    }
}

function ambilInfoServer() {
    const cpu = ambilCpu()
    const ram = ambilRam()
    const proses = process.memoryUsage()

    return `╭━━━〔 *SERVER STATUS* 〕━━━⬣
┃ *Hostname* : ${os.hostname()}
┃ *Platform* : ${os.platform()}
┃ *Arch*     : ${os.arch()}
┃ *Uptime*   : ${formatDurasi(os.uptime() * 1000)}
┃
┃ *CPU*
┃ Model      : ${cpu.model}
┃ Core       : ${cpu.core}
┃ Speed      : ${cpu.speed} MHz
┃ Usage      : ${cpu.pakai}%
┃
┃ *RAM*
┃ Total      : ${formatUkuran(ram.total)}
┃ Used       : ${formatUkuran(ram.pakai)}
┃ Free       : ${formatUkuran(ram.bebas)}
┃ Usage      : ${ram.persen}%
┃
┃ *PROCESS*
┃ RSS        : ${formatUkuran(proses.rss)}
┃ Heap Total : ${formatUkuran(proses.heapTotal)}
┃ Heap Used  : ${formatUkuran(proses.heapUsed)}
┃ External   : ${formatUkuran(proses.external)}
╰━━━━━━━━━━━━━━━━━━━━⬣`
}

async function cekSpeed(m, fukusima) {
    const mulai = performance.now()
    const pesan = await fukusima.reply(m.chat, "*Mengukur speed bot...*", m)
    const selesai = performance.now()
    const latensi = (selesai - mulai).toFixed(3)

    return fukusima.reply(
        m.chat,
        `╭━━━〔 *SPEED TEST* 〕━━━⬣
┃ Response : ${latensi} ms
┃ Status   : ONLINE
┃ Runtime  : ${formatDurasi(process.uptime() * 1000)}
╰━━━━━━━━━━━━━━━━━━⬣`,
        m
    )
}

export default async function caseHandler(m, fukusima) {
    const text = (m.text || "").toLowerCase().trim()

    switch (text) {
        case "halo":
            return fukusima.reply(m.chat, "Halo juga!", m)

        case "tes":
            return fukusima.reply(m.chat, "*ONLINE*", m)

        case "speed":
        case "ping":
            return cekSpeed(m, fukusima)

        case "cpu": {
            const cpu = ambilCpu()

            return fukusima.reply(
                m.chat,
                `╭━━━〔 *CPU SERVER* 〕━━━⬣
┃ Model : ${cpu.model}
┃ Core  : ${cpu.core}
┃ Speed : ${cpu.speed} MHz
┃ Usage : ${cpu.pakai}%
╰━━━━━━━━━━━━━━━━⬣`,
                m
            )
        }

        case "ram": {
            const ram = ambilRam()

            return fukusima.reply(
                m.chat,
                `╭━━━〔 *RAM SERVER* 〕━━━⬣
┃ Total : ${formatUkuran(ram.total)}
┃ Used  : ${formatUkuran(ram.pakai)}
┃ Free  : ${formatUkuran(ram.bebas)}
┃ Usage : ${ram.persen}%
╰━━━━━━━━━━━━━━━━⬣`,
                m
            )
        }

        case "server":
        case "status":
        case "runtime":
            return fukusima.reply(m.chat, ambilInfoServer(), m)
    }
}
