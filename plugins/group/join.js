let handler = async (m, { text }) => {
  if (!text) return m.reply('Masukkan link grup!\nContoh: .joingc https://chat.whatsapp.com/xxxx')

  let link = text.trim()
  let code = link.split('https://chat.whatsapp.com/')[1]
  if (!code) return m.reply('Link grup tidak valid!')

  try {
    await fukusima.groupAcceptInvite(code)
    m.reply('Berhasil join grup 🎉')
  } catch (e) {
    m.reply('Gagal join grup 😔\nPastikan link masih aktif & bot belum di-kick')
  }
}

handler.help = ['joingc <link>']
handler.tags = ['group']
handler.command = /^(joingc|joinlinkgc)$/i
handler.owner = true

export default handler