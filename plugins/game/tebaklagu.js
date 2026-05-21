import fs from "fs"

const SESSION_TIMEOUT = 60000
const DATA_PATH = "./data/tebaklagu.json"
const SESSION_PATH = "./data/tebaklagu-sesi.json"
const REWARD_LIMIT = 10

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
                newsletterName: "Tebak Lagu",
                caption: ".tebaklagu"
            }
        }
    }

    if (sesi.global) {
        return fukusima.sendMessage(
            m.chat,
            { text: "Masih ada sesi tebak lagu yang berjalan." },
            { quoted: fl }
        )
    }

    const soal = data[Math.floor(Math.random() * data.length)]

    sesi.global = {
        jawaban: soal.jawaban.toLowerCase(),
        artis: soal.artis,
        waktu: Date.now()
    }

    fs.writeFileSync(SESSION_PATH, JSON.stringify(sesi, null, 2))

    await fukusima.sendMessage(
        m.chat,
        { audio: { url: soal.soal }, mimetype: "audio/mpeg", ptt: false },
        { quoted: fl }
    )

    setTimeout(async () => {
        const sesiNow = JSON.parse(fs.readFileSync(SESSION_PATH))
        if (!sesiNow.global) return

        await fukusima.sendMessage(
            m.chat,
            {
                text: `WAKTU HABIS

Judul: ${sesiNow.global.jawaban}
Artis: ${sesiNow.global.artis}`
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

    const jawabanUser = m.text.toLowerCase().trim()

    if (jawabanUser === sesi.global.jawaban) {
        if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = { limit: 0 }
        global.db.data.users[m.sender].limit += REWARD_LIMIT

        await fukusima.sendMessage(
            m.chat,
            { react: { text: "🔵", key: m.key } }
        )

        await fukusima.sendMessage(
            m.chat,
            {
                text: `BENAR

Judul: ${sesi.global.jawaban}
Artis: ${sesi.global.artis}

+${REWARD_LIMIT} limit`
            }
        )

        fs.writeFileSync(SESSION_PATH, JSON.stringify({}, null, 2))
        return true
    }

    await fukusima.sendMessage(
        m.chat,
        { react: { text: "😂", key: m.key } }
    )

    return true
}

handler.help = ["tebaklagu"]
handler.tags = ["games"]
handler.command = /^tebaklagu$/i

export default handler