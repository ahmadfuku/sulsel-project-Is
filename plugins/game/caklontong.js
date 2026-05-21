import fs from "fs"

const SESSION_TIMEOUT = 60000
const DATA_PATH = "./data/caklontong.json"
const SESSION_PATH = "./data/caklontong-sesi.json"

let handler = async (m, { fukusima }) => {
    if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, JSON.stringify([], null, 2))
    if (!fs.existsSync(SESSION_PATH)) fs.writeFileSync(SESSION_PATH, JSON.stringify({}, null, 2))

    const data = JSON.parse(fs.readFileSync(DATA_PATH))
    const sesi = JSON.parse(fs.readFileSync(SESSION_PATH))

    const fl = {
        key: {
            fromMe: false,
            participant: m.sender,
            ...(m.chat ? { remoteJid: m.sender } : {})
        },
        message: {
            newsletterAdminInviteMessage: {
                newsletterJid: "120363338102578213@newsletter",
                newsletterName: "Cak Lontong",
                caption: ".caklontong"
            }
        }
    }

    if (sesi.global) {
        return fukusima.sendMessage(
            m.chat,
            { text: "Masih ada sesi Cak Lontong yang sedang berlangsung." },
            { quoted: fl }
        )
    }

    const soal = data[Math.floor(Math.random() * data.length)]

    sesi.global = {
        soal: soal.soal,
        jawaban: soal.jawaban.toLowerCase(),
        deskripsi: soal.deskripsi,
        mulai: Date.now(),
        pemain: {}
    }

    fs.writeFileSync(SESSION_PATH, JSON.stringify(sesi, null, 2))

    const text = `
GAME CAK LONTONG

Soal:
${soal.soal}

Waktu menjawab: 60 detik
`

    await fukusima.sendMessage(m.chat, { text }, { quoted: fl })

    setTimeout(async () => {
        const sesiNow = JSON.parse(fs.readFileSync(SESSION_PATH))
        if (!sesiNow.global) return

        const { jawaban, deskripsi, pemain } = sesiNow.global
        const peserta = Object.keys(pemain)

        for (const u of peserta) {
            if (!global.db.data.users[u]) global.db.data.users[u] = { limit: 0 }
            global.db.data.users[u].limit -= 5
        }

        await fukusima.sendMessage(
            m.chat,
            {
                text: `WAKTU HABIS

Jawaban: ${jawaban}
${deskripsi}

dikenakan -5 limit`
            },
            { quoted: fl }
        )

        fs.writeFileSync(SESSION_PATH, JSON.stringify({}, null, 2))
    }, SESSION_TIMEOUT)
}

handler.before = async (m, { fukusima }) => {
    if (!m.text) return false
    if (!fs.existsSync(SESSION_PATH)) return false

    const sesi = JSON.parse(fs.readFileSync(SESSION_PATH))
    if (!sesi.global) return false

    const fl = {
        key: {
            fromMe: false,
            participant: m.sender,
            ...(m.chat ? { remoteJid: m.sender } : {})
        },
        message: {
            newsletterAdminInviteMessage: {
                newsletterJid: "120363338102578213@newsletter",
                newsletterName: "Cak Lontong",
                caption: ".caklontong"
            }
        }
    }

    const jawabanUser = m.text.toLowerCase().trim()
    const { jawaban, deskripsi } = sesi.global

    sesi.global.pemain[m.sender] = true

    if (jawabanUser === jawaban) {
        if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = { limit: 0 }
        global.db.data.users[m.sender].limit += 10

        await fukusima.sendMessage(
            m.chat,
            {
                text: `JAWABAN BENAR

Jawaban: ${jawaban}
${deskripsi}

Reward: +10 limit`
            },
            { quoted: fl }
        )

        fs.writeFileSync(SESSION_PATH, JSON.stringify({}, null, 2))
        return true
    }

    await fukusima.sendMessage(
        m.chat,
        { text: "Dasar Kroco" },
        { quoted: fl }
    )

    return true
}

handler.help = ["caklontong"]
handler.tags = ["game"]
handler.command = /^caklontong$/i

export default handler