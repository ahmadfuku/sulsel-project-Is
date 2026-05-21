import { Client } from "ssh2"

let handler = async (m, { args, command }) => {

    let text = args.join(" ")
    if (!text.includes("|")) {
        return m.reply(`Contoh:\n.${command} ipvps|password|token_node`)
    }

    let [ipvps, passwd, token] = text.split("|")

    let connSettings = {
        host: ipvps,
        port: 22,
        username: "root",
        password: passwd
    }

    let ssh = new Client()

    ssh.on("ready", () => {
        ssh.exec(`${token}`, (err, stream) => {
            if (err) {
                ssh.end()
                return m.reply("Gagal menjalankan token")
            }

            stream.on("close", async () => {
                try {
                    ssh.exec("systemctl start wings", () => {
                        m.reply("Berhasil menjalankan wings ✅\nStatus wings: aktif")
                        ssh.end()
                    })
                } catch {
                    ssh.end()
                }
            })

            stream.on("data", () => {})

            stream.stderr.on("data", async (data) => {
                let out = data.toString()
                if (out.includes("Override existing configuration file")) {
                    stream.write("y\n")
                }
            })
        })
    })

    ssh.on("error", () => {
        m.reply("Katasandi atau IP tidak valid")
    })

    ssh.connect(connSettings)
}

handler.help = ["startwings"]
handler.tags = ["panel"]
handler.command = /^startwings$/i
handler.owner = true

export default handler