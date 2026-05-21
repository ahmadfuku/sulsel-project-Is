import {
  prepareWAMessageMedia,
  generateWAMessageFromContent,
  proto
} from 'baileys'

const handler = async (m, { fukusima }) => {
  const chatId = m.chat
  const db = global.db.data.chats

  if (!db[chatId] || !Array.isArray(db[chatId].payment) || db[chatId].payment.length === 0) {
    return fukusima.sendMessage(
      chatId,
      { text: '❌ Belum ada metode pembayaran di chat ini.' },
      { quoted: m }
    )
  }

  const cards = []

  for (const pay of db[chatId].payment) {
    const thumbMedia = global.thumb
      ? await prepareWAMessageMedia(
          { image: { url: global.thumb } },
          { upload: fukusima.waUploadToServer }
        )
      : null

    cards.push({
      body: proto.Message.InteractiveMessage.Body.fromObject({
        text: `💳 *${pay.name.toUpperCase()}*\n\n${pay.value}`
      }),
      footer: proto.Message.InteractiveMessage.Footer.fromObject({
        text: 'Payment'
      }),
      header: proto.Message.InteractiveMessage.Header.fromObject({
        title: pay.name.toUpperCase(),
        hasMediaAttachment: !!thumbMedia,
        imageMessage: thumbMedia?.imageMessage
      }),
      nativeFlowMessage:
        proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
          buttons: [
            {
              name: 'cta_copy',
              buttonParamsJson: JSON.stringify({
                display_text: '📋 Salin',
                copy_code: pay.value
              })
            }
          ]
        })
    })
  }

  const msgContent = generateWAMessageFromContent(
    chatId,
    {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: proto.Message.InteractiveMessage.Body.fromObject({
              text: '💰 *METODE PEMBAYARAN*'
            }),
            footer: proto.Message.InteractiveMessage.Footer.fromObject({
              text: 'Silakan pilih metode pembayaran'
            }),
            header: proto.Message.InteractiveMessage.Header.fromObject({
              hasMediaAttachment: false
            }),
            carouselMessage:
              proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                cards
              })
          })
        }
      }
    },
    {
      userJid: fukusima.user.id,
      quoted: m
    }
  )

  await fukusima.relayMessage(
    chatId,
    msgContent.message,
    { messageId: msgContent.key.id }
  )
}

handler.command = ['paymentku', 'paym']
handler.tags = ['main']
handler.help = ['payment']

export default handler