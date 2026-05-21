const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let handler = async (m, { fukusima, usedPrefix, command, isAdmin }) => {
  if (!isAdmin) return m.reply("❌ Only Admin")
  if (!m.quoted) return m.reply(`❌ Balas pesan/media dengan *${usedPrefix + command}*`)

  try {

    // ambil pesan yang direply
    const msg = JSON.parse(JSON.stringify({
      [m.quoted.mtype]: m.quoted
    }))

    // ambil semua grup
    const groups = Object.values(await fukusima.groupFetchAllParticipating())

    m.reply(`🚀 Mengirim SW ke ${groups.length} grup\n⏳ Delay 2 detik tiap grup`)

    for (let group of groups) {

      try {

        await fukusima.relayMessage(group.id, {
          groupStatusMessageV2: {
            message: msg
          }
        }, {})

        console.log("SW terkirim ke:", group.subject)

      } catch (err) {
        console.log("❌ Gagal kirim:", group.subject)
      }

      await delay(2000) // delay 2 detik
    }

    m.reply("✅ JP Tag SW selesai")

  } catch (err) {
    console.error(err)
    m.reply("⚠️ Error saat menjalankan jpmtagsw")
  }
}

handler.help = ["jpmtagsw"]
handler.tags = ["owner"]
handler.command = ["jpmtagsw"]
handler.admin = true

export default handler