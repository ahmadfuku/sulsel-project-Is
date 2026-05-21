let handler = async (m, { fukusima, args }) => {
  let text = args.join(" ")
  if (!text.includes("|")) return m.reply(".pushkontakgc pesan|delay")

  let [pesan, delay] = text.split("|")
  delay = Number(delay) || 2000

  let meta = await fukusima.groupMetadata(m.chat)

  let numbers = meta.participants
    .map(p => (p.jid || p.id).replace(/@.+/, ""))
    .filter(v => v.length >= 10 && v.length <= 15)

  m.reply(`Total target: ${numbers.length}`)

  for (let num of numbers) {
    try {
      await fukusima.sendMessage(num + "@s.whatsapp.net", {
        text: pesan
      })
      await new Promise(r => setTimeout(r, delay))
    } catch (e) {
      console.log("gagal kirim:", num)
    }
  }

  let vcard = ""

  numbers.forEach((num, i) => {
    vcard += `BEGIN:VCARD
VERSION:3.0
FN:member${i+1}
TEL;type=CELL;type=VOICE;waid=${num}:${num}
END:VCARD
`
  })

  let buffer = Buffer.from(vcard)

  let owner = global.owner[0][0] + "@s.whatsapp.net"

  await fukusima.sendMessage(owner, {
    document: buffer,
    mimetype: "text/vcard",
    fileName: "member_grup.vcf"
  })

  m.reply("Push kontak selesai")
}

handler.command = /^pushkontakgc$/i
handler.group = true
handler.owner = true

export default handler