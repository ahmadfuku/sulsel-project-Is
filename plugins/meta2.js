import crypto from "crypto"

let handler = async (m, { fukusima }) => {

  await fukusima.sendMessage(m.chat, { react: { text: "🧠", key: m.key } })

  const gambar = "https://litter.catbox.moe/hn6oo0.jpg"

  const full = m.text || m.body || ""
  let kode = full.replace(/^\.meta4\s*/i, "").trim()

  if (!kode && m.quoted) {
    kode = m.quoted.text || m.quoted.body || ""
  }

  if (!kode) {
    return m.reply("Contoh: .meta4 console.log('AI Mode')")
  }

  const baris = kode.split("\n")

  const blok = baris.map(v => ({
    highlightType: 0,
    codeContent: v + "\n"
  }))

  const submessages = [
    {
      messageType: 2,
      messageText: `Analisis Kode (${baris.length} baris)`
    },
    {
      messageType: 5,
      codeMetadata: {
        codeLanguage: "javascript",
        codeBlocks: blok
      }
    },
    {
      messageType: 4,
      tableMetadata: {
        title: "Ringkasan",
        rows: [
          { items: ["Info", "Detail"], isHeading: true },
          { items: ["Baris", String(baris.length)] },
          { items: ["Karakter", String(kode.length)] },
          { items: ["Status", "Diproses"] }
        ]
      }
    }
  ]

  const unified = {
    response_id: crypto.randomUUID(),
    sections: [
      {
        view_model: {
          primitive: {
            text: "Sistem AI mendeteksi dan memproses input",
            __typename: "GenAIMarkdownTextUXPrimitive"
          },
          __typename: "GenAISingleLayoutViewModel"
        }
      },
      {
        view_model: {
          primitives: [
            {
              reels_url: "https://instagram.com/reel/xxx",
              thumbnail_url: gambar,
              creator: "Fuku AI",
              avatar_url: gambar,
              reels_title: "Processing Preview",
              likes_count: 999,
              shares_count: 99,
              view_count: 5000,
              reel_source: "AI",
              is_verified: false,
              __typename: "GenAIReelPrimitive"
            }
          ],
          __typename: "GenAIHScrollLayoutViewModel"
        }
      }
    ]
  }

  const konten = {
    messageContextInfo: {
      deviceListMetadata: {},
      deviceListMetadataVersion: 2
    },
    botForwardedMessage: {
      message: {
        richResponseMessage: {
          messageType: 1,
          submessages,
          unifiedResponse: {
            data: JSON.stringify(unified)
          }
        }
      }
    }
  }

  await fukusima.relayMessage(m.chat, konten, {})

}

handler.help = ["meta4 <kode>"]
handler.tags = ["tools"]
handler.command = ["meta4"]

export default handler