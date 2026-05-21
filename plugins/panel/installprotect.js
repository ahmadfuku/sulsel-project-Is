import { Client } from "ssh2"

let handler = async (m, { fukusima, args, isROwner }) => {
    if (!isROwner) return m.reply('Fitur ini khusus OWNER')

    let text = args.join(' ')
    if (!text.includes('|')) {
        return m.reply('Format salah\n\nContoh:\n.installprotectall ipvps|pwvps')
    }

    let [ipvps, pwvps] = text.split('|').map(v => v.trim())
    if (!ipvps || !pwvps) {
        return m.reply('Format salah\n\nContoh:\n.installprotectall ipvps|pwvps')
    }

    const scripts = [
        "https://raw.githubusercontent.com/fukuapisai/fuku_protect/refs/heads/main/installprotect/fukuos1.sh",
        "https://raw.githubusercontent.com/fukuapisai/fuku_protect/refs/heads/main/installprotect/fukuos2.sh",
        "https://raw.githubusercontent.com/fukuapisai/fuku_protect/refs/heads/main/installprotect/fukuos3.sh",
        "https://raw.githubusercontent.com/fukuapisai/fuku_protect/refs/heads/main/installprotect/fukuos4.sh",
        "https://raw.githubusercontent.com/fukuapisai/fuku_protect/refs/heads/main/installprotect/fukuos5.sh",
        "https://raw.githubusercontent.com/fukuapisai/fuku_protect/refs/heads/main/installprotect/fukuos6.sh",
        "https://raw.githubusercontent.com/fukuapisai/fuku_protect/refs/heads/main/installprotect/fukuos7.sh",
        "https://raw.githubusercontent.com/fukuapisai/fuku_protect/refs/heads/main/installprotect/fukuos8.sh",
        "https://raw.githubusercontent.com/fukuapisai/fuku_protect/refs/heads/main/installprotect/fukuos9.sh",
        "https://raw.githubusercontent.com/fukuapisai/fuku_protect/refs/heads/main/installprotect/fukuos10.sh",
        "https://raw.githubusercontent.com/fukuapisai/fuku_protect/refs/heads/main/installprotect/fukuos11.sh",
        "https://raw.githubusercontent.com/fukuapisai/fuku_protect/refs/heads/main/installprotect/fukuos12.sh",
        "https://raw.githubusercontent.com/fukuapisai/fuku_protect/refs/heads/main/installprotect/fukuos13.sh"
    ]

    await fukusima.reply(m.chat, `Menghubungkan ke VPS ${ipvps}\nMenjalankan ${scripts.length} script Protect Panel`, m)

    const conn = new Client()

    conn.on("ready", async () => {
        await fukusima.reply(m.chat, "Koneksi berhasil\nInstalasi dimulai", m)

        let log = ""

        for (let i = 0; i < scripts.length; i++) {
            let no = i + 1
            let progress = Math.round((no / scripts.length) * 100)

            await fukusima.reply(
                m.chat,
                `Menjalankan Protect ${no}/${scripts.length}\nProgress ${progress}%`,
                m
            )

            try {
                let out = await execSSH(conn, `curl -fsSL ${scripts[i]} | bash`)
                log += `\n\nScript ${no}:\n${out.slice(-1000)}`
            } catch (e) {
                log += `\n\nScript ${no} gagal:\n${e.message}`
            }
        }

        try { conn.end() } catch {}

        await fukusima.reply(
            m.chat,
            `Protect Panel Selesai\n\n${log.trim().slice(-3800)}`,
            m
        )
    })

    conn.on("error", async err => {
        try { conn.end() } catch {}
        m.reply(`Gagal terhubung ke VPS\n\n${err.message}`)
    })

    conn.connect({
        host: ipvps,
        port: 22,
        username: "root",
        password: pwvps,
        readyTimeout: 20000
    })
}

handler.help = ['installprotectall']
handler.tags = ['owner']
handler.command = /^installprotectall$/i
handler.owner = true

export default handler

function execSSH(conn, cmd) {
    return new Promise((resolve, reject) => {
        conn.exec(cmd, (err, stream) => {
            if (err) return reject(err)
            let data = ""
            stream.on("data", d => data += d.toString())
            stream.stderr.on("data", d => data += d.toString())
            stream.on("close", () => resolve(data.trim()))
        })
    })
}