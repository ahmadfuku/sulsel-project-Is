import {
  prepareWAMessageMedia,
  generateWAMessageFromContent,
  proto
} from 'baileys'

const handler = async (m, { fukusima }) => {
  const chatId = m.chat

  try {
    if (!global.payment || Object.keys(global.payment).length === 0) {
      return fukusima.sendMessage(
        chatId,
        { text: '❌ Metode pembayaran belum tersedia.' },
        { quoted: m }
      )
    }

    const cards = []

    for (const [key, value] of Object.entries(global.payment)) {
      const thumbMedia = global.thumb
        ? await prepareWAMessageMedia(
            { image: { url: global.thumb } },
            { upload: fukusima.waUploadToServer }
          )
        : null

      cards.push({
        body: proto.Message.InteractiveMessage.Body.fromObject({
          text: `💳 *${key.toUpperCase()}*\n\n${value}`
        }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({
          text: 'Payment Information'
        }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
          title: key.toUpperCase(),
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
                  copy_code: value
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

  } catch (e) {
    await fukusima.sendMessage(
      chatId,
      {
        text: `❌ Terjadi kesalahan saat memproses payment.\n\n📄 Error:\n${e?.message || e}`
      },
      { quoted: m }
    )
  }
}

handler.command = ['pay', 'paym', 'payment']
handler.tags = ['main']
handler.help = ['payment']

export default handler