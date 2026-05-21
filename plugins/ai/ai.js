import fetch from "node-fetch"
import fs from "fs"
import path from "path"

let handler = async (m, { text, fukusima }) => {

  if (!text) return

  function ambilSemuaKode(teks) {
    const regex = /```([\s\S]*?)```/g
    let hasil = []
    let match

    while ((match = regex.exec(teks)) !== null) {
      let isi = match[1].trim()
      let baris = isi.split("\n")

      let bahasa = "text"
      if (baris[0].match(/^[a-zA-Z0-9#+.-]+$/)) {
        bahasa = baris[0].toLowerCase()
        baris.shift()
      }

      hasil.push({
        bahasa,
        kode: baris.join("\n")
      })
    }

    return hasil
  }

  function deteksiBahasaOtomatis(kode) {
    if (/<[^>]+>/.test(kode)) return "html"
    if (/console\.log|function|=>|var |let |const /.test(kode)) return "javascript"
    if (/def |import |print\(/.test(kode)) return "python"
    if (/class .*{|public |private /.test(kode)) return "java"
    if (/SELECT |FROM |WHERE /i.test(kode)) return "sql"
    return "text"
  }

  try {

    await fukusima.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

    const res = await fetch(`https://api.zenzxz.my.id/ai/copilot?message=${encodeURIComponent(text)}&model=gpt-5`)
    const data = await res.json()

    const hasil = data?.result?.text || "Tidak ada respon"

    const listKode = ambilSemuaKode(hasil)

    await fukusima.sendMessage(m.chat, { react: { text: "🫪", key: m.key } })

    let teksBersih = hasil
    for (let item of listKode) {
      teksBersih = teksBersih.replace(/```[\s\S]*?```/, "").trim()
    }

    const submessages = []

    if (teksBersih) {
      submessages.push({
        messageType: 2,
        messageText: teksBersih
      })
    }

    for (let item of listKode) {

      const bahasaFix = item.bahasa !== "text"
        ? item.bahasa
        : deteksiBahasaOtomatis(item.kode)

      const baris = item.kode.split("\n")
      const blok = []

      for (let v of baris) {
        blok.push({
          highlightType: 0,
          codeContent: v + "\n"
        })
      }

      submessages.push({
        messageType: 5,
        codeMetadata: {
          codeLanguage: bahasaFix,
          codeBlocks: blok
        }
      })

      submessages.push({
        messageType: 4,
        tableMetadata: {
          title: "Ringkasan",
          rows: [
            { items: ["Info", "Detail"], isHeading: true },
            { items: ["Baris", String(baris.length)] },
            { items: ["Karakter", String(item.kode.length)] },
            { items: ["Bahasa", bahasaFix] }
          ]
        }
      })
    }

    if (submessages.length === 0) {
      await fukusima.sendMessage(m.chat, { text: hasil }, { quoted: m })
      return
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
            submessages
          }
        }
      }
    }

    await fukusima.relayMessage(m.chat, konten, {})

  } catch (e) {

    await fukusima.sendMessage(m.chat, { react: { text: "🩲", key: m.key } })

    await fukusima.sendMessage(m.chat, {
      text: "Terjadi kesalahan saat memproses AI"
    }, { quoted: m })

  }
}

handler.help = ["ai"]
handler.tags = ["ai"]
handler.command = ["ai", "ask", "copilot"]
handler.limit = true

export default handler