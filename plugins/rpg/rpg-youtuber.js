let handler = async (m, { fukusima }) => {
  let user = global.db.data.users[m.sender]

  if (!user.youtube) {
    user.youtube = {
      subscriber: 0,
      view: 0,
      like: 0,
      status: 'Pemula'
    }
  }

  let yt = user.youtube
  let delay = ms => new Promise(res => setTimeout(res, ms))

  let subs = Math.floor(Math.random() * 121) + 30
  let views = Math.floor(Math.random() * 5000) + 8000
  let likes = Math.floor(Math.random() * 229) + 400

  await fukusima.reply(m.chat, '📹 Menyiapkan kamera...', m)
  await delay(1200)

  await fukusima.reply(m.chat, '🎬 Rekaman dimulai...', m)
  await delay(1200)

  await fukusima.reply(m.chat, '✂️ Mengedit video...', m)
  await delay(1200)

  await fukusima.reply(m.chat, '🚀 Upload ke YouTube...', m)
  await delay(1500)

  yt.subscriber += subs
  yt.view += views
  yt.like += likes

  if (yt.subscriber >= 20000) {
    yt.status = 'Artis'
  } else if (yt.subscriber >= 5000) {
    yt.status = 'Seleb'
  } else {
    yt.status = 'Pemula'
  }

  await fukusima.reply(
    m.chat,
    `📊 *HASIL CHANNEL*\n\n👥 Subscriber: +${subs}\n👀 View: +${views}\n❤️ Like: +${likes}`,
    m
  )

  await delay(800)
  fukusima.reply(
    m.chat,
    `🏷️ Status Channel: *${yt.status}*\n\nTotal Subscriber: ${yt.subscriber}\nTotal View: ${yt.view}\nTotal Like: ${yt.like}`,
    m
  )
}

handler.help = ['youtuber','youtube']
handler.tags = ['rpg']
handler.command = ['youtuber','youtube']

export default handler