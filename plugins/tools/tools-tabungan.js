import fs from 'fs'

const dbPath = './data/tabung.json'

if (!fs.existsSync('./data')) fs.mkdirSync('./data')
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}, null, 2))

const loadDB = () => JSON.parse(fs.readFileSync(dbPath))
const saveDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))

let handler = async (m, { text }) => {
    if (!text) return m.reply('contoh: .tabung 10000')

    let nominal = String(text).replace(/[^\d]/g, '')
    if (!nominal) return m.reply('nominal angka')

    nominal = Number(nominal)
    if (!Number.isFinite(nominal) || nominal <= 0) return m.reply('nominal tidak valid')

    const now = new Date()
    const wib = new Date(now.getTime() + (7 * 60 * 60 * 1000))

    const hari = wib.toLocaleDateString("id-ID", { weekday: "long" })
    const tanggal = wib.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })
    const jam = wib.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })

    let db = loadDB()
    let uid = m.sender

    if (!db[uid]) db[uid] = { total: 0, riwayat: [] }

    db[uid].total += nominal
    db[uid].riwayat.push({
        nominal,
        hari,
        tanggal,
        jam,
        zona: "WIB"
    })

    saveDB(db)

    let total = db[uid].total.toLocaleString('id-ID')
    let n = nominal.toLocaleString('id-ID')

    m.reply(`✅ Nabung masuk: Rp${n}\n🗓️ ${hari}, ${tanggal}\n🕒 ${jam} WIB\n\n💰 Total tabungan: Rp${total}`)
}

handler.help = ['tabung','menabung']
handler.tags = ['tools']
handler.command = /^(tabung|menabung)$/i

export default handler