const handler = async (m, { fukusima, text }) => {
  const chatId = m.chat
  const db = global.db.data.chats

  if (!db[chatId]) db[chatId] = {}
  if (!Array.isArray(db[chatId].payment)) db[chatId].payment = []

  if (!text || !text.includes('|')) {
    return fukusima.sendMessage(
      chatId,
      { text: 'Contoh:\n.addpay Gopay|08123456789' },
      { quoted: m }
    )
  }

  const [name, value] = text.split('|').map(v => v.trim())
  if (!name || !value) {
    return fukusima.sendMessage(
      chatId,
      { text: 'Format tidak valid.' },
      { quoted: m }
    )
  }

  db[chatId].payment.push({ name, value })

  await fukusima.sendMessage(
    chatId,
    { text: `✅ Payment *${name}* berhasil ditambahkan.` },
    { quoted: m }
  )
}

handler.command = ['addpay']
handler.tags = ['main']
handler.help = ['addpay Nama|Nomor']

export default handler