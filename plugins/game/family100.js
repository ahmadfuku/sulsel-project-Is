import fs from "fs"

const SESSION_TIMEOUT = 60000
const DATA_PATH = "./data/family100.json"
const SESSION_PATH = "./data/family100-sesi.json"

const rewardByOrder = (n) => {
    if (n === 1) return 20
    if (n === 2) return 15
    if (n === 3) return 10
    return 5
}

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
                newsletterName: "Family 100",
                caption: ".f100"
            }
        }
    }

    if (sesi.global) {
        return fukusima.sendMessage(
            m.chat,
            { text: "Masih ada sesi Family 100 yang sedang berlangsung." },
            { quoted: fl }
        )
    }

    const soal = data[Math.floor(Math.random() * data.length)]

    sesi.global = {
        soal: soal.soal,
        jawaban: soal.jawaban.map(v => v.toLowerCase()),
        terjawab: {},
        skor: {},
        nyawa: {},
        mulai: Date.now()
    }

    fs.writeFileSync(SESSION_PATH, JSON.stringify(sesi, null, 2))

    await fukusima.sendMessage(
        m.chat,
        {
            text: `FAMILY 100

Pertanyaan:
${soal.soal}

Waktu: 60 detik
Setiap jawaban punya nilai berbeda
Salah 3x = gugur`
        },
        { quoted: fl }
    )

    setTimeout(async () => {
        const sesiNow = JSON.parse(fs.readFileSync(SESSION_PATH))
        if (!sesiNow.global) return

        const { jawaban, skor } = sesiNow.global

        const semuaJawaban = jawaban.map(v => `- ${v}`).join("\n")

        const ranking = Object.entries(skor)
            .sort((a, b) => b[1] - a[1])
            .map(([u, s], i) => `${i + 1}. @${u.split("@")[0]} (${s} limit)`)
            .join("\n") || "-"

        await fukusima.sendMessage(
            m.chat,
            {
                text: `WAKTU HABIS

Semua Jawaban:
${semuaJawaban}

Peringkat:
${ranking}`,
                mentions: Object.keys(skor)
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
                newsletterName: "Family 100",
                caption: ".f100"
            }
        }
    }

    const g = sesi.global
    const jawabanUser = m.text.toLowerCase().trim()

    g.nyawa[m.sender] ??= 3
    g.skor[m.sender] ??= 0

    if (g.nyawa[m.sender] <= 0) return true

    if (!g.jawaban.includes(jawabanUser) || g.terjawab[jawabanUser]) {
        g.nyawa[m.sender] -= 1

        if (g.nyawa[m.sender] <= 0) {
            await fukusima.sendMessage(
                m.chat,
                { text: "Jawaban salah. Nyawa habis, tolol🤣 tolol🤣" },
                { quoted: fl }
            )
        } else {
            await fukusima.sendMessage(
                m.chat,
                { text: `Jawaban salah, dasar kroco.\nSisa nyawa: ${g.nyawa[m.sender]}` },
                { quoted: fl }
            )
        }

        fs.writeFileSync(SESSION_PATH, JSON.stringify(sesi, null, 2))
        return true
    }

    g.terjawab[jawabanUser] = m.sender

    const urutan = Object.keys(g.terjawab).length
    const reward = rewardByOrder(urutan)

    if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = { limit: 0 }
    global.db.data.users[m.sender].limit += reward
    g.skor[m.sender] += reward

    const list = Object.entries(g.terjawab)
        .map(([j, u], i) => `- ${j} = @${u.split("@")[0]} +${rewardByOrder(i + 1)} limit`)
        .join("\n")

    await fukusima.sendMessage(
        m.chat,
        {
            text: `Jawaban benar:
${list}`,
            mentions: Object.values(g.terjawab)
        },
        { quoted: fl }
    )

    fs.writeFileSync(SESSION_PATH, JSON.stringify(sesi, null, 2))
    return true
}

handler.help = ["family100", "f100"]
handler.tags = ["games"]
handler.command = /^(family100|f100)$/i

export default handler