import chalk from "chalk"
import axios from "axios"
import fs from "fs"
import os from "os"

const packageLocal = JSON.parse(
    fs.readFileSync("./package.json")
)

const urlPackageGithub = "https://raw.githubusercontent.com/ahmadfuku/sulsel-project-Is/main/package.json"

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function parseVersi(versi) {
    return versi
        .split(".")
        .map(angka => parseInt(angka))
}

function bandingkanVersi(lokal, github) {
    const versiLokal = parseVersi(lokal)
    const versiGithub = parseVersi(github)

    const panjang = Math.max(
        versiLokal.length,
        versiGithub.length
    )

    for (let i = 0; i < panjang; i++) {
        const a = versiLokal[i] || 0
        const b = versiGithub[i] || 0

        if (a < b) return -1
        if (a > b) return 1
    }

    return 0
}

function garis(panjang = 55) {
    return "═".repeat(panjang)
}

function randomHex(panjang = 8) {
    const karakter = "ABCDEF0123456789"
    let hasil = ""

    for (let i = 0; i < panjang; i++) {
        hasil += karakter.charAt(
            Math.floor(Math.random() * karakter.length)
        )
    }

    return hasil
}

function infoBar(label, isi, warna = "cyan") {
    console.log(
        chalk.gray("│"),
        chalk.white.bold(label.padEnd(14)),
        chalk.gray("→"),
        chalk[warna].bold(isi)
    )
}

async function loaderMatrix(teks, warna = "green", durasi = 1800) {
    const karakter = [
        "⠋","⠙","⠹","⠸","⠼",
        "⠴","⠦","⠧","⠇","⠏"
    ]

    const mulai = Date.now()
    let index = 0

    while (Date.now() - mulai < durasi) {
        const random1 = randomHex(6)
        const random2 = randomHex(4)

        process.stdout.write(
            `\r${chalk[warna].bold(karakter[index % karakter.length])} ` +
            chalk.green(`[${random1}] `) +
            chalk.white(teks) +
            chalk.gray(` :: ${random2}`)
        )

        await delay(70)

        index++
    }

    process.stdout.clearLine(0)
    process.stdout.cursorTo(0)

    console.log(
        chalk.green.bold("✔"),
        chalk.white(teks)
    )
}

function tampilkanMatrix() {
    const simbol = [
        "ア","イ","ウ","エ","オ",
        "カ","キ","ク","ケ","コ",
        "0","1","Z","X","9","7"
    ]

    console.log(
        chalk.green.bold(
            garis()
        )
    )

    for (let i = 0; i < 8; i++) {
        let baris = ""

        for (let j = 0; j < 70; j++) {
            baris += simbol[
                Math.floor(Math.random() * simbol.length)
            ]
        }

        console.log(
            chalk.green(baris)
        )
    }

    console.log(
        chalk.green.bold(
            garis()
        )
    )
}

function banner() {
    console.clear()

    tampilkanMatrix()

    console.log(
        chalk.cyan.bold(`
███████╗██╗   ██╗██╗  ██╗██╗   ██╗
██╔════╝██║   ██║██║ ██╔╝██║   ██║
█████╗  ██║   ██║█████╔╝ ██║   ██║
██╔══╝  ██║   ██║██╔═██╗ ██║   ██║
██║     ╚██████╔╝██║  ██╗╚██████╔╝
╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝
`)
    )

    console.log(
        chalk.magenta.bold(
            `╔${garis()}╗`
        )
    )

    infoBar(
        "SYSTEM",
        "FUKU GEN",
        "cyan"
    )

    infoBar(
        "VERSION",
        `v${packageLocal.version}`,
        "green"
    )

    infoBar(
        "STATUS",
        "INITIALIZING SECURITY",
        "yellow"
    )

    infoBar(
        "PLATFORM",
        os.platform(),
        "blue"
    )

    infoBar(
        "MEMORY",
        `${Math.round(os.totalmem() / 1024 / 1024 / 1024)} GB`,
        "magenta"
    )

    infoBar(
        "KERNEL",
        os.release(),
        "red"
    )

    console.log(
        chalk.magenta.bold(
            `╚${garis()}╝\n`
        )
    )
}

async function cekVersiGithub() {
    try {
        console.log(
            chalk.cyan.bold(
                "\n🔍 MEMULAI PEMINDAIAN VERSI SISTEM\n"
            )
        )

        await loaderMatrix(
            "Menghubungkan ke server utama",
            "cyan",
            1500
        )

        const { data } = await axios.get(
            urlPackageGithub
        )

        const versiGithub = data.version
        const versiLocal = packageLocal.version

        const hasil = bandingkanVersi(
            versiLocal,
            versiGithub
        )

        console.log()

        console.log(
            chalk.black.bgBlue.bold(" LOCAL "),
            chalk.white.bold(` v${versiLocal} `)
        )

        console.log(
            chalk.black.bgMagenta.bold(" OFFICIAL "),
            chalk.white.bold(` v${versiGithub} `)
        )

        console.log()

        if (hasil === -1) {
            console.log(
                chalk.red.bold(
                    "⚠ TERDETEKSI MENGGUNAKAN SISTEM LAWAS"
                )
            )

            console.log(
                chalk.yellow.bold(
                    `⚠ SILAHKAN UPDATE KE v${versiGithub}`
                )
            )

            console.log()

            infoBar(
                "SECURITY",
                "LOW PROTECTION",
                "red"
            )

            infoBar(
                "PATCH",
                "UPDATE AVAILABLE",
                "yellow"
            )

            console.log()
        }

        else {
            console.log(
                chalk.green.bold(
                    "✔ SISTEM BERHASIL DIVERIFIKASI"
                )
            )

            infoBar(
                "SECURITY",
                "MAXIMUM PROTECTION",
                "green"
            )

            infoBar(
                "PATCH",
                "NO UPDATE REQUIRED",
                "cyan"
            )

            console.log()
        }

    } catch (error) {
        console.log(
            chalk.red.bold(
                "✖ GAGAL MEMERIKSA SISTEM"
            )
        )

        console.log(
            chalk.gray(
                error.toString()
            )
        )
    }
}

export async function doyoukotoga(
    fukusima,
    pairingNumber
) {
    if (fukusima.authState.creds.registered) return

    banner()

    await loaderMatrix(
        "Bypassing firewall",
        "green"
    )

    await loaderMatrix(
        "Menganalisa session",
        "cyan"
    )

    await loaderMatrix(
        "Mengaktifkan anti collision",
        "magenta"
    )

    await loaderMatrix(
        "Menghubungkan ke server WhatsApp",
        "yellow"
    )

    await loaderMatrix(
        "Menginisialisas pairing",
        "blue"
    )

    await loaderMatrix(
        "verifikasi Pairing code",
        "red"
    )

    await loaderMatrix(
        "Finalisasi autentikasi sistem",
        "green"
    )

    console.log()

    await cekVersiGithub()

    console.log(
        chalk.magenta.bold(
            `╔${garis()}╗`
        )
    )

    infoBar(
        "SCRIPT",
        "FUKU GEN",
        "cyan"
    )

    infoBar(
        "DEVELOPER",
        "AhmadXyz",
        "green"
    )

    infoBar(
        "BOT NUMBER",
        pairingNumber,
        "yellow"
    )

    infoBar(
        "NETWORK",
        "CONNECTED",
        "blue"
    )

    infoBar(
        "PROTECTION",
        "ACTIVE",
        "magenta"
    )

    console.log(
        chalk.magenta.bold(
            `╚${garis()}╝`
        )
    )

    console.log()

    await delay(2500)

    await loaderMatrix(
        "Membuat encrypted pairing",
        "cyan",
        2500
    )

    let code = await fukusima.requestPairingCode(
        pairingNumber
    )

    code = code?.match(/.{1,4}/g)?.join("-") || code

    console.log()

    console.log(
        chalk.green.bold(
            "╔══════════════════════════════════════════════╗"
        )
    )

    console.log(
        chalk.black.bgGreen.bold(
            "            PAIRING CODE               "
        )
    )

    console.log()

    console.log(
        chalk.white.bold(
            "        " + code
        )
    )

    console.log()

    console.log(
        chalk.green.bold(
            "╚══════════════════════════════════════════════╝"
        )
    )

    console.log()

    console.log(
        chalk.green.bold(
            "✔ Pairing token berhasil dibuat"
        )
    )

    console.log(
        chalk.cyan.bold(
            "✔ Sistem siap digunakan\n"
        )
    )
}

