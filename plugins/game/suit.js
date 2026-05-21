import fs from "fs"
import crypto from "crypto"

const SUIT_DATA_PATH = "./data/suit-sesi.json"
const SUIT_TIMEOUT = 60000
const WIN_LIMIT = 8
const LOSE_LIMIT = 5

let suit = {}

let handler = async (m, { fukusima }) => {
    if (!fs.existsSync(SUIT_DATA_PATH)) fs.writeFileSync(SUIT_DATA_PATH, JSON.stringify({}, null, 2))

    const suitSessions = JSON.parse(fs.readFileSync(SUIT_DATA_PATH))
    const target = m.mentionedJid && m.mentionedJid[0]

    if (!target) return fukusima.sendMessage(m.chat, { text: "Tag lawan kamu\n\nContoh:\n.suit @user" })

    if (target === m.sender) return fukusima.sendMessage(m.chat, { text: "Gak bisa suit sama diri sendiri" })

    if (Object.values(suitSessions).find(s => s.player1 === m.sender || s.player2 === m.sender)) {
        return fukusima.sendMessage(m.chat, { text: "Kamu masih ada sesi suit aktif" })
    }

    const sessionId = crypto.randomBytes(8).toString("hex")

    suitSessions[sessionId] = {
        sessionId,
        groupChat: m.chat,
        player1: m.sender,
        player2: target,
        status: "waiting",
        player1Choice: null,
        player2Choice: null,
        player1Text: null,
        player2Text: null
    }

    fs.writeFileSync(SUIT_DATA_PATH, JSON.stringify(suitSessions, null, 2))

    await fukusima.sendMessage(target, {
        text: `Hai @${target.split("@")[0]} kamu ditantang oleh @${m.sender.split("@")[0]}\n\nKetik gas untuk menerima suit\nKetik tolak untuk menolak`,
        mentions: [m.sender, target]
    })

    await fukusima.sendMessage(m.chat, {
        text: `Tantangan suit dikirim ke @${target.split("@")[0]}\nMenunggu respon...`,
        mentions: [target]
    })

    suit[sessionId] = setTimeout(async () => {
        if (suitSessions[sessionId]) {
            await fukusima.sendMessage(m.chat, { text: "Tantangan suit expired" })
            delete suitSessions[sessionId]
            delete suit[sessionId]
            fs.writeFileSync(SUIT_DATA_PATH, JSON.stringify(suitSessions, null, 2))
        }
    }, SUIT_TIMEOUT)
}

handler.before = async (m, { fukusima }) => {
    if (!m.text || !fs.existsSync(SUIT_DATA_PATH)) return false

    const suitSessions = JSON.parse(fs.readFileSync(SUIT_DATA_PATH))

    const waitingSession = Object.values(suitSessions).find(s =>
        s && s.player2 === m.sender && s.status === "waiting"
    )

    const playingSession = Object.values(suitSessions).find(s =>
        s && (s.player1 === m.sender || s.player2 === m.sender) &&
        s.status === "playing"
    )

    const text = m.text.toLowerCase().trim()

    if (waitingSession && text === "gas") {
        const session = waitingSession

        session.status = "playing"
        clearTimeout(suit[session.sessionId])

        await fukusima.sendMessage(session.groupChat, {
            text: `@${session.player2.split("@")[0]} telah sedia melawan @${session.player1.split("@")[0]}\n\nSilahkan pilih:\n\n.suit kertas\n.suit batu\n.suit gunting`,
            mentions: [session.player1, session.player2]
        })

        await fukusima.sendMessage(session.player1, {
            text: `Suit dimulai!\n\nKetik salah satu:\n\nbatu\ngunting\nkertas`
        })

        await fukusima.sendMessage(session.player2, {
            text: `Suit dimulai!\n\nKetik salah satu:\n\nbatu\ngunting\nkertas`
        })

        suit[session.sessionId] = setTimeout(async () => {
            if (suitSessions[session.sessionId]) {
                await fukusima.sendMessage(session.groupChat, { text: "Waktu memilih habis" })
                delete suitSessions[session.sessionId]
                delete suit[session.sessionId]
                fs.writeFileSync(SUIT_DATA_PATH, JSON.stringify(suitSessions, null, 2))
            }
        }, SUIT_TIMEOUT)

        fs.writeFileSync(SUIT_DATA_PATH, JSON.stringify(suitSessions, null, 2))
        return true
    }

    if (waitingSession && text === "tolak") {
        const session = waitingSession

        await fukusima.sendMessage(session.groupChat, {
            text: `@${m.sender.split("@")[0]} menolak tantangan suit`,
            mentions: [m.sender]
        })

        clearTimeout(suit[session.sessionId])
        delete suit[session.sessionId]
        delete suitSessions[session.sessionId]
        fs.writeFileSync(SUIT_DATA_PATH, JSON.stringify(suitSessions, null, 2))
        return true
    }

    if (playingSession && ["batu", "gunting", "kertas"].includes(text)) {
        const session = playingSession

        let chooser = null
        let waiting = null

        if (m.sender === session.player1 && !session.player1Choice) {
            session.player1Choice = text
            session.player1Text = m.text
            chooser = session.player1
            waiting = session.player2
        } else if (m.sender === session.player2 && !session.player2Choice) {
            session.player2Choice = text
            session.player2Text = m.text
            chooser = session.player2
            waiting = session.player1
        } else {
            return true
        }

        if (!session.player1Choice || !session.player2Choice) {
            await fukusima.sendMessage(session.groupChat, {
                text: `@${chooser.split("@")[0]} telah memilih menunggu @${waiting.split("@")[0]} untuk memilih`,
                mentions: [chooser, waiting]
            })
        }

        if (session.player1Choice && session.player2Choice) {
            clearTimeout(suit[session.sessionId])

            let winner = null
            let loser = null

            const rules = {
                batu: "gunting",
                gunting: "kertas",
                kertas: "batu"
            }

            if (session.player1Choice !== session.player2Choice) {
                if (rules[session.player1Choice] === session.player2Choice) {
                    winner = session.player1
                    loser = session.player2
                } else {
                    winner = session.player2
                    loser = session.player1
                }
            }

            let resultMessage =
                `HASIL SUIT:\n\n` +
                `@${session.player1.split("@")[0]}: ${session.player1Text}\n` +
                `@${session.player2.split("@")[0]}: ${session.player2Text}\n\n`

            if (winner) {
                resultMessage += `@${winner.split("@")[0]} menang + ${WIN_LIMIT} limit\n@${loser.split("@")[0]} kroco - ${LOSE_LIMIT} limit`
            } else {
                resultMessage += `SERI! Tidak ada limit berubah`
            }

            await fukusima.sendMessage(session.groupChat, {
                text: resultMessage,
                mentions: [session.player1, session.player2]
            })

            await fukusima.sendMessage(session.player1, {
                text: "Sesi suit selesai"
            })

            await fukusima.sendMessage(session.player2, {
                text: "Sesi suit selesai"
            })

            delete suitSessions[session.sessionId]
            delete suit[session.sessionId]
        }

        fs.writeFileSync(SUIT_DATA_PATH, JSON.stringify(suitSessions, null, 2))
        return true
    }

    return false
}

handler.help = ["suit @tag"]
handler.tags = ["game"]
handler.command = ["suit"]

export default handler