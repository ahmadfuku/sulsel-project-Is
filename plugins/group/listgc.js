let handler = async (m, { fukusima }) => {
  let groups = Object.values(await fukusima.groupFetchAllParticipating())

  if (!groups.length) return m.reply("Bot belum masuk grup manapun.")

  let teks = `📋 *LIST GROUP BOT*\n`
  teks += `Total: ${groups.length} grup\n\n`

  for (let i = 0; i < groups.length; i++) {
    let g = groups[i]
    teks += `${i + 1}. ${g.subject}\n`
    teks += `   ID: ${g.id}\n`
    teks += `   Member: ${g.participants.length}\n\n`
  }

  fukusima.reply(m.chat, teks.trim(), m)
}

handler.help = ['listgc']
handler.tags = ['owner']
handler.command = /^(listgc|listgroup|grouplist)$/i

handler.owner = true

export default handler