import fs from "fs"

const SESSION_TIMEOUT = 60000
const DATA_PATH = "./data/tebakanime.json"
const SESSION_PATH = "./data/tebakanime-sesi.json"
const REWARD_LIMIT = 12

let tebakanimeTimeout = null

let handler = async (m, { fukusima }) => {
    if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, JSON.stringify([], null, 2))
    if (!fs.existsSync(SESSION_PATH)) fs.writeFileSync(SESSION_PATH, JSON.stringify({}, null, 2))

    let data = JSON.parse(fs.readFileSync(DATA_PATH))
    let sesi = JSON.parse(fs.readFileSync(SESSION_PATH))

    let fl = {
        key: {
            fromMe: false,
            participant: m.sender,
            ...(m.chat ? { remoteJid: m.sender } : {})
        },
        message: {
            newsletterAdminInviteMessage: {
                newsletterJid: "120363338102578213@newsletter",
                newsletterName: "Game Bot",
                caption: ".tebakanime"
            }
        }
    }

    if (sesi.global) {
        return fukusima.sendMessage(
            m.chat,
            { text: "Masih ada sesi Tebak Anime yang berlangsung." },
            { quoted: fl }
        )
    }

    let soal = data[Math.floor(Math.random() * data.length)]

    sesi.global = {
        jawaban: soal.jawaban.toLowerCase().trim(),
        selesai: false
    }

    fs.writeFileSync(SESSION_PATH, JSON.stringify(sesi, null, 2))

    await fukusima.sendMessage(
        m.chat,
        {
            image: { url: soal.image },
            caption: `🎌 *TEBAK ANIME* 🎌

Siapakah karakter anime pada gambar di atas?

🧩 Petunjuk:
${soal.desc.split("\n")[0]}

⏳ Waktu: 60 detik
🎁 Hadiah: +${REWARD_LIMIT} Limit

Ketik jawabannya di chat`,
            contextInfo: {
                externalAdReply: {
                    title: "Tebak Anime",
                    body: "Uji insting wibu sejati",
                    thumbnailUrl: soal.image,
                    sourceUrl: soal.url,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        },
        { quoted: fl }
    )

    tebakanimeTimeout = setTimeout(async () => {
        let sesiNow = JSON.parse(fs.readFileSync(SESSION_PATH))
        if (!sesiNow.global || sesiNow.global.selesai) return

        sesiNow.global.selesai = true

        await fukusima.sendMessage(
            m.chat,
            {
                text: `⏰ *WAKTU HABIS!*

✅ Jawaban:
*${sesiNow.global.jawaban}*`
            },
            { quoted: fl }
        )

        fs.writeFileSync(SESSION_PATH, JSON.stringify({}, null, 2))
        tebakanimeTimeout = null
    }, SESSION_TIMEOUT)
}

handler.before = async (m, { fukusima }) => {
    if (!m.text) return false
    if (!fs.existsSync(SESSION_PATH)) return false

    let sesi = JSON.parse(fs.readFileSync(SESSION_PATH))
    if (!sesi.global || sesi.global.selesai) return false

    let fl = {
        key: {
            fromMe: false,
            participant: m.sender,
            ...(m.chat ? { remoteJid: m.sender } : {})
        },
        message: {
            newsletterAdminInviteMessage: {
                newsletterJid: "120363338102578213@newsletter",
                newsletterName: "Game Bot",
                caption: ".tebakanime"
            }
        }
    }

    let jawab = m.text.toLowerCase().trim()

    if (jawab === sesi.global.jawaban) {
        if (tebakanimeTimeout) {
            clearTimeout(tebakanimeTimeout)
            tebakanimeTimeout = null
        }

        sesi.global.selesai = true

        if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = { limit: 0 }
        global.db.data.users[m.sender].limit += REWARD_LIMIT

        await fukusima.sendMessage(
            m.chat,
            { react: { text: "🔵", key: m.key } }
        )

        await fukusima.sendMessage(
            m.chat,
            {
                text: `✨ *BENAR!* ✨

🎌 ${sesi.global.jawaban}
🎁 +${REWARD_LIMIT} Limit`
            },
            { quoted: fl }
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

handler.help = ["tebakanime"]
handler.tags = ["games"]
handler.command = /^tebakanime$/i

export default handler