import fs from "fs"

const MENFES_PATH = "./data/menfes-session.json"
const MENFES_TIMEOUT = 20 * 60 * 1000

let menfesTimers = {}

let handler = async (m, { text, fukusima }) => {
    if (!fs.existsSync(MENFES_PATH)) {
        fs.writeFileSync(MENFES_PATH, JSON.stringify({}, null, 2))
    }

    const sessions = JSON.parse(fs.readFileSync(MENFES_PATH))

    const existing = Object.values(sessions).find(s =>
        s && (s.sender === m.sender || s.target === m.sender)
    )

    if (existing) {
        return fukusima.sendMessage(m.chat, { text: "Kamu sedang dalam sesi menfes" }, { quoted: m })
    }

    const args = text.trim().split(" ")
    if (!args[0]) {
        return fukusima.sendMessage(m.chat, { text: "Format:\n.menfes 62xxxxx" }, { quoted: m })
    }

    const target = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net"

    if (target === m.sender) {
        return fukusima.sendMessage(m.chat, { text: "Tidak bisa menfes ke diri sendiri" }, { quoted: m })
    }

    const targetBusy = Object.values(sessions).find(s =>
        s && (s.sender === target || s.target === target)
    )

    if (targetBusy) {
        return fukusima.sendMessage(m.chat, { text: "Target sedang dalam sesi menfes" }, { quoted: m })
    }

    const sessionId = "menfes_" + Date.now() + "_" + Math.random().toString(36).slice(2)

    sessions[sessionId] = {
        sessionId,
        sender: m.sender,
        target,
        status: "waiting",
        createdAt: Date.now()
    }

    menfesTimers[sessionId] = setTimeout(() => {
        if (sessions[sessionId]) {
            delete sessions[sessionId]
            delete menfesTimers[sessionId]
            fs.writeFileSync(MENFES_PATH, JSON.stringify(sessions, null, 2))
        }
    }, MENFES_TIMEOUT)

    fs.writeFileSync(MENFES_PATH, JSON.stringify(sessions, null, 2))

    await fukusima.sendMessage(target, {
        text: `@${m.sender.split("@")[0]} mengundang kamu mengobrol di menfes\n\nKetik *terima* untuk menerima\nKetik *tolakmenfes* untuk menolak`,
        mentions: [m.sender],
        forwardingScore: 10,
        isForwarded: true
    })

    await fukusima.sendMessage(m.chat, { text: "Undangan menfes terkirim" }, { quoted: m })
}

handler.before = async (m, { fukusima }) => {
    if (!fs.existsSync(MENFES_PATH)) return false

    const sessions = JSON.parse(fs.readFileSync(MENFES_PATH))
    const text = (m.text || "").toLowerCase().trim()

    const waitingSession = Object.values(sessions).find(s =>
        s && s.target === m.sender && s.status === "waiting"
    )

    const activeSession = Object.values(sessions).find(s =>
        s && (s.sender === m.sender || s.target === m.sender) &&
        s.status === "active"
    )

    if (waitingSession && text === "terima") {
        const session = waitingSession

        session.status = "active"
        clearTimeout(menfesTimers[session.sessionId])

        await fukusima.sendMessage(session.sender, {
            text: "Undangan menfes diterima\n\nSekarang kamu bisa ngobrol lewat bot",
            forwardingScore: 10,
            isForwarded: true
        })

        await fukusima.sendMessage(session.target, {
            text: "Menfes aktif\n\nSekarang kamu bisa ngobrol lewat bot",
            forwardingScore: 10,
            isForwarded: true
        })

        menfesTimers[session.sessionId] = setTimeout(() => {
            if (sessions[session.sessionId]) {
                fukusima.sendMessage(session.sender, { text: "Sesi menfes berakhir", forwardingScore: 10, isForwarded: true })
                fukusima.sendMessage(session.target, { text: "Sesi menfes berakhir", forwardingScore: 10, isForwarded: true })
                delete sessions[session.sessionId]
                delete menfesTimers[session.sessionId]
                fs.writeFileSync(MENFES_PATH, JSON.stringify(sessions, null, 2))
            }
        }, MENFES_TIMEOUT)

        fs.writeFileSync(MENFES_PATH, JSON.stringify(sessions, null, 2))
        return true
    }

    if (waitingSession && text === "tolakmenfes") {
        const session = waitingSession

        await fukusima.sendMessage(session.sender, { text: "Undangan menfes ditolak", forwardingScore: 10, isForwarded: true })

        clearTimeout(menfesTimers[session.sessionId])
        delete sessions[session.sessionId]
        delete menfesTimers[session.sessionId]
        fs.writeFileSync(MENFES_PATH, JSON.stringify(sessions, null, 2))
        return true
    }

    if (activeSession && text === "stopmenfes") {
        const session = activeSession
        const other = m.sender === session.sender ? session.target : session.sender

        await fukusima.sendMessage(m.sender, { text: "Sesi menfes dihentikan", forwardingScore: 10, isForwarded: true })
        await fukusima.sendMessage(other, { text: "Sesi menfes dihentikan oleh lawan", forwardingScore: 10, isForwarded: true })

        clearTimeout(menfesTimers[session.sessionId])
        delete sessions[session.sessionId]
        delete menfesTimers[session.sessionId]
        fs.writeFileSync(MENFES_PATH, JSON.stringify(sessions, null, 2))
        return true
    }

    if (activeSession) {
        const session = activeSession
        const targetJid = m.sender === session.sender ? session.target : session.sender

        if (m.text) {
            await fukusima.sendMessage(targetJid, {
                text: m.text,
                forwardingScore: 10,
                isForwarded: true
            })
        } else if (m.message) {
            await fukusima.sendMessage(targetJid, m.message, {
                forwardingScore: 10,
                isForwarded: true
            })
        }

        return true
    }

    return false
}

handler.help = ["menfes 62xxxxx"]
handler.tags = ["fun"]
handler.command = /^menfes$/i

export default handler