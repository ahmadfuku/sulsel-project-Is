let handler = async (m, { fukusima }) => {
  let groups = Object.values(await fukusima.groupFetchAllParticipating())

  if (!groups.length) return m.reply("Bot belum masuk grup manapun.")

  m.reply(`𝚂𝚒𝚊𝚗𝚐 ke ${groups.length} grup...`)

const delay = ms => new Promise(res => setTimeout(res, ms))

  const fl = {
    key: {
      fromMe: false,
      participant: m.sender,
      ...(m.chat ? { remoteJid: m.sender } : {})
    },
    message: {
      newsletterAdminInviteMessage: {
        newsletterJid: "120363338102578213@newsletter",
        newsletterName: "𝚂𝚒𝚊𝚗𝚐",
        caption: "𝚂𝚎𝚕𝚊𝚖𝚊𝚝 𝚂𝚒𝚊𝚗𝚐"
      }
    }
  }

  for (let i = 0; i < groups.length; i++) {
    let g = groups[i]

    try {
      await fukusima.sendMessage(g.id, {
        audio: { url: 'https://cloud-fukushima.vercel.app/uploader/ogm6zwtm7s.opus' },
        mimetype: 'audio/ogg; codecs=opus',
        ptt: true,
        contextInfo: {
          externalAdReply: {
            title: "𝚂𝚎𝚕𝚊𝚖𝚊𝚝 𝚜𝚒𝚊𝚗𝚐",
            body: "𝚂𝚎𝚖𝚘𝚐𝚊 𝚑𝚊𝚛𝚒𝚖𝚞 𝚖𝚎𝚗𝚢𝚎𝚗𝚊𝚗𝚐𝚔𝚊𝚗",
            thumbnailUrl: global.thumb,
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: true
          }
        }
      }, { quoted: fl })

      await delay(1000) 
    } catch (e) {
      console.log(`Gagal kirim ke ${g.id}:`, e.message)
    }
  }

  m.reply("Siang berhasil dikirim ke semua grup.")
}

handler.help = ['siang']
handler.tags = ['owner']
handler.command = /^(siang)$/i
handler.owner = true

export default handler