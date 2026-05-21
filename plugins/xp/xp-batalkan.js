let handler = async (m) => {
  let user = global.db.data.users[m.sender]
  if (!user._reg) return

  delete user._reg
  m.reply("Pendaftaran dibatalkan")
}

handler.command = /^unfinis$/i
export default handler