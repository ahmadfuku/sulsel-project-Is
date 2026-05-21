import { createHash } from "crypto"
import fs from "fs"

let handler = async (m, { text, usedPrefix, command, fukusima }) => {
  let user = global.db.data.users[m.sender]
  if (user.registered) {
    throw `Kamu sudah terdaftar.\nGunakan *${usedPrefix}unreg* untuk menghapus data lama.`
  }
  if (!text) {
    return m.reply(
      `Contoh penggunaan:\n${usedPrefix + command} Ahmad,17`
    )
  }
  let data = text.split(",")
  if (data.length < 2) {
    return m.reply(
      `Format salah.\n\nContoh:\n${usedPrefix + command} Ahmad,17`
    )
  }
  let nama = data[0].trim()
  let umur = parseInt(data[1])
  if (!nama) {
    return m.reply("Nama tidak boleh kosong.")
  }
  if (isNaN(umur)) {
    return m.reply("Umur harus berupa angka.")
  }
  if (umur < 10 || umur > 50) {
    return m.reply("Umur minimal 10 tahun dan maksimal 50 tahun.")
  }
  
  function getVerifiedQuoted() {
  return {
    key: {
      participant: `0@s.whatsapp.net`,
      remoteJid: `status@broadcast`,
    },
    message: {
      contactMessage: {
        displayName: `🪸 ${global.namebot}`,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;ttname,;;;\nFN:ttname\nitem1.TEL;waid=13135550002:+1 (313) 555-0002\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
        sendEphemeral: true,
      },
    },
  }
}
  let serial = createHash("md5")
    .update(m.sender)
    .digest("hex")
  user.name = nama
  user.age = umur
  user.level = 1
  user.exp = 0
  user.limit = 20
  user.money = 1000
  user.registered = true
  user.regTime = Date.now()
  user.serial = serial
  let thumbnail = fs.readFileSync("./assets/images/ourin2.jpg")
  let caption = `
╭━━━〔 ᴘᴇɴᴅᴀғᴛᴀʀᴀɴ ʙᴇʀʜᴀsɪʟ 〕━━━⬣
┃
┃◦  ɴᴀᴍᴀ
┃   ${nama}
┃◦ 🎂 ᴜᴍᴜʀ
┃   ${umur} Tahun
┃◦  sᴇʀɪᴀʟ
┃   ${serial}
┃◦  sᴛᴀᴛᴜs
┃   Verified User
┃◦  ᴡᴀᴋᴛᴜ
┃   ${new Date().toLocaleString("id-ID")}
┃
╰━━━━━━━━━━━━━━━━⬣
`
  await fukusima.sendMessage(m.chat, {
    text: caption,
    contextInfo: {
      forwardingScore: 9999999,
      isForwarded: true,
      externalAdReply: {
        title: "Nuevo usuario detectado",
        body: `${nama} berhasil terdaftar ke database ${global.namebot}`,
        thumbnail,
        mediaType: 1,
        renderLargerThumbnail: false,
        showAdAttribution: false
      }
    }
  }, { quoted: getVerifiedQuoted() })
}

handler.help = ["daftar nama,umur"]
handler.tags = ["main"]
handler.command = /^(daftar|register)$/i

export default handler