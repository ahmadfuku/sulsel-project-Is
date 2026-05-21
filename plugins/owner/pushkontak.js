let handler = async (m, { fukusima, args }) => { 
  let baseName = args[0] || "kontak"

  let meta = await fukusima.groupMetadata(m.chat)

  let numbers = meta.participants
    .map(p => (p.jid || p.id).replace(/@.+/, ""))
    .filter(v => v.length >= 10 && v.length <= 15)

  let vcard = ""

  numbers.forEach((num, i) => {
    let name = `${baseName}${i+1}`
    vcard += `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL;type=CELL;type=VOICE;waid=${num}:${num}
END:VCARD
`
  })

  let buffer = Buffer.from(vcard)

  await fukusima.sendMessage(m.chat, {
    document: buffer,
    mimetype: "text/vcard",
    fileName: `${baseName}.vcf`
  }, { quoted: m })
}

handler.help = ['pushkontak <nama>']
handler.tags = ['group']
handler.command = /^pushkontak$/i
handler.group = true
handler.owner = true 

export default handler