import fs from "fs"

const SESSION_TIMEOUT = 60000
const dataPath = "./data/siapakahaku.json"
const sesiPath = "./data/siapakahaku-sesi.json"

let handler = async (m, { fukusima, command }) => {
    if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify([], null, 2))
    if (!fs.existsSync(sesiPath)) fs.writeFileSync(sesiPath, JSON.stringify({}, null, 2))
    let data = JSON.parse(fs.readFileSync(dataPath))
    let sesi = JSON.parse(fs.readFileSync(sesiPath))
    let fl = {
        key: {
            fromMe: false,
            participant: m.sender,
            ...(m.chat ? { remoteJid: m.sender } : {})
        },
        message: {
            newsletterAdminInviteMessage: {
                newsletterJid: '120363338102578213@newsletter',
                newsletterName: 'Anjay',
                caption: '.siapakahaku'
            }
        }
    }

    if (Object.keys(sesi).length > 0) {
        return fukusima.sendMessage(
            m.chat,
            { text: "⏳ *Masih ada sesi Siapakah Aku yang belum selesai!*" },
            { quoted: fl }
        )
    }
    let soal = data[Math.floor(Math.random() * data.length)]

    sesi.global = {
        soal: soal.soal,
        jawaban: String(soal.jawaban).toLowerCase(),
        waktu: Date.now(),
        pemain: {}
    }

    fs.writeFileSync(sesiPath, JSON.stringify(sesi, null, 2))

    let caption = 
`
 \`SIAPKAH AKU?\`

⛩️ *Pertanyaan:*
${soal.soal}

🕒 Waktu: *60 detik*
✍️ Jawab langsung di chat
😉 Jawaban benar lanjut ke babak berikutnya`

    await fukusima.sendMessage(m.chat, { text: caption }, { quoted: fl })

    setTimeout(async () => {
        let sesiNow = JSON.parse(fs.readFileSync(sesiPath))
        if (!sesiNow.global) return

        let jawaban = sesiNow.global.jawaban
        let pemain = Object.keys(sesiNow.global.pemain)
        for (let u of pemain) {
            if (!global.db.data.users[u]) global.db.data.users[u] = { limit: 0 }
            global.db.data.users[u].limit -= 5
        }

        await fukusima.sendMessage(
            m.chat,
            { text: `⏰ *WAKTU HABIS!*\n\n🧠 Jawaban: *${jawaban}*\n💀 Semua peserta -5 limit` },
            { quoted: fl }
        )

        fs.writeFileSync(sesiPath, JSON.stringify({}, null, 2))
    }, SESSION_TIMEOUT)
}

handler.before = async (m, { fukusima }) => {
    if (!m.text) return false
    if (!fs.existsSync(sesiPath)) return false
    let sesi = JSON.parse(fs.readFileSync(sesiPath))
    if (!sesi.global) return false
    let fl = {
        key: {
            fromMe: false,
            participant: m.sender,
            ...(m.chat ? { remoteJid: m.sender } : {})
        },
        message: {
            newsletterAdminInviteMessage: {
                newsletterJid: '120363338102578213@newsletter',
                newsletterName: 'Anjay',
                caption: `.siapakahaku`
            }
        }
    }
    let jawabanUser = m.text.toLowerCase().trim()
    let jawabanBenar = sesi.global.jawaban
    sesi.global.pemain[m.sender] = true
    if (jawabanUser === jawabanBenar) {
        if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = { limit: 0 }
        global.db.data.users[m.sender].limit += 10
        await fukusima.sendMessage(
            m.chat,
            { text: `❤️ *BENAR!* ❤️\n\n🧠 Jawaban: *${jawabanBenar}*\n🎁 +10 Limit\n🔥 Kamu hebat!` },
            { quoted: fl }
        )

        await fukusima.sendMessage(
            m.chat,
            { react: { text: "❤️", key: m.key } }
        )

        fs.writeFileSync(sesiPath, JSON.stringify({}, null, 2))
        return true
    } else {
        await fukusima.sendMessage(
            m.chat,
            { react: { text: "😂", key: m.key } }
        )

        await fukusima.sendMessage(
            m.chat,
            { text: `_Jawaban salah.. Dasar kroco_ 🤡` },
            { quoted: fl }
        )
        return true
    }
}

handler.help = ["siapakahaku"]
handler.tags = ["games"]
handler.command = /^siapakahaku$/i

export default handler