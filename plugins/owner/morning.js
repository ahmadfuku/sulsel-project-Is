let handler = async (m, { fukusima }) => {
  let groups = Object.values(await fukusima.groupFetchAllParticipating())

  if (!groups.length) return m.reply("Bot belum masuk grup manapun.")

  m.reply(`☀️ Mengirim morning ke ${groups.length} grup...`)
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
        newsletterName: "Cak Lontong",
        caption: ".caklontong"
      }
    }
  }

  for (let i = 0; i < groups.length; i++) {
    let g = groups[i]

    try {
      await fukusima.sendMessage(g.id, {
        audio: { url: 'https://cloud-fukushima.vercel.app/uploader/zjo3scaxfx.opus' },
        mimetype: 'audio/ogg; codecs=opus',
        ptt: true,
        contextInfo: {
          externalAdReply: {
            title: "Selamat Pagi ☀️",
            body: "Semoga harimu menyenangkan",
            thumbnailUrl: global.thumb,
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: true
          }
        }
      }, { quoted: fl })

      await delay(1000) // delay 1 detik per grup
    } catch (e) {
      console.log(`Gagal kirim ke ${g.id}:`, e.message)
    }
  }

  m.reply("✅ Morning berhasil dikirim ke semua grup.")
}

handler.help = ['morning']
handler.tags = ['owner']
handler.command = /^(morning)$/i
handler.owner = true

export default handler

