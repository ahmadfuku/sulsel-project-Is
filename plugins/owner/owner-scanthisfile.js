import { scanCommand } from "../../mods/behavior_pack/scancommand.js"

let handler = async (m, { args }) => {

  if (!args[0]) {
    return m.reply("Gunakan:\n.scancommand namacommand")
  }

  const commandName = args[0]

  const data = await scanCommand(commandName)

  if (!data.totalFound) {
    return m.reply(`Command *${commandName}* tidak ditemukan.`)
  }

  let text = `Hasil pencarian command: ${commandName}\n\n`
  text += `Total file discan: ${data.scannedFiles}\n`
  text += `Ditemukan di:\n\n`

  data.results.forEach((r, i) => {
    text += `${i + 1}. ${r.folder}/${r.file} (line ${r.line})\n`
  })

  m.reply(text)
}

handler.help = ["scancommand"]
handler.tags = ["owner"]
handler.command = /^scancommand$/i
handler.owner = true

export default handler