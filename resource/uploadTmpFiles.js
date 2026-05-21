import chalk from "chalk"

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function loading(teks, warna = "cyan", durasi = 1200) {
    const animasi = [
        "⠋",
        "⠙",
        "⠹",
        "⠸",
        "⠼",
        "⠴",
        "⠦",
        "⠧",
        "⠇",
        "⠏"
    ]

    const mulai = Date.now()
    let index = 0

    while (Date.now() - mulai < durasi) {
        process.stdout.write(
            `\r${chalk[warna].bold(animasi[index % animasi.length])} ${chalk.white(teks)}`
        )

        await delay(80)
        index++
    }

    process.stdout.write("\r")
    console.log(
        `${chalk.green.bold("✔")} ${chalk.white(teks)}`
    )
}

function banner() {
    console.log(
        chalk.blue.bold(`
███████╗██╗   ██╗██╗  ██╗██╗   ██╗
██╔════╝██║   ██║██║ ██╔╝██║   ██║
█████╗  ██║   ██║█████╔╝ ██║   ██║
██╔══╝  ██║   ██║██╔═██╗ ██║   ██║
██║     ╚██████╔╝██║  ██╗╚██████╔╝
╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝
`)
    )

    console.log(
        chalk.magenta.bold("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    )

    console.log(
        chalk.white.bold(" SYSTEM "),
        chalk.gray("→"),
        chalk.cyan("Modo de voo Fuku")
    )

    console.log(
        chalk.white.bold(" VERSION "),
        chalk.gray("→"),
        chalk.green("v7.3.2")
    )

    console.log(
        chalk.white.bold(" STATUS "),
        chalk.gray("→"),
        chalk.yellow("Verificando")
    )

    console.log(
        chalk.magenta.bold("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
    )
}

export async function doyoukotoga(fukusima, pairingNumber) {
    if (fukusima.authState.creds.registered) return

    console.clear()

    banner()

    await loading("Vamos verificar a velocidade da conexão.", "blue")
    await loading("Sistema de sessão criado com sucesso", "cyan")
    await loading("Sistema anticolisão", "magenta")
    await loading("Por favor, aguarde memonto", "yellow")
    await loading("Número do bot pronto", "red")
    await loading("Menghubungkan ke WhatsApp", "green")

    console.log()

    console.log(
        chalk.black.bgBlue.bold(" BOT NAME "),
        chalk.white.bold(" FUKU GEN")
    )

    console.log(
        chalk.black.bgMagenta.bold(" OWNER "),
        chalk.white.bold(" AhmadXyz")
    )

    console.log(
        chalk.black.bgGreen.bold(" BOT NUMBER "),
        chalk.white.bold(` ${pairingNumber}`)
    )

    console.log(
        chalk.black.bgYellow.bold(" STATUS "),
        chalk.black.bold(" Sistema Pronto para Combater")
    )

    console.log()

    await delay(2000)

    let code = await fukusima.requestPairingCode(pairingNumber)

    code = code?.match(/.{1,4}/g)?.join("-") || code

    console.log(
        chalk.magenta.bold("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    )

    console.log(
        chalk.black.bgGreen.bold(" KODE PAIRING "),
        chalk.black.bgWhite.bold(` ${code} `)
    )

    console.log(
        chalk.magenta.bold("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    )

    console.log()

    console.log(
        chalk.green.bold("✔ Pairing berhasil dibuat")
    )

    console.log(
        chalk.cyan.bold("✔ Bot siap digunakan\n")
    )
}


