import axios from "axios"
import fs from "fs"

global.subdomain = { 
  "fuku-cloud.my.id": { 
    zone: "4f500478648773efa71c96fce87cd92d",
    apitoken: "WK9-d5psbMaGqkisl8P58L51Z6dhRyIhnBgbD2Ed",
  },
  "ahmadxyzcoders.my.id": { 
    zone: "fe324140eca6490d66d3da786aa0d922",
    apitoken: "WK9-d5psbMaGqkisl8P58L51Z6dhRyIhnBgbD2Ed",
  },
  "fuku-api.my.id": {
    zone: "6dba8f619c6358cf6dcf01a60f017a56",
    apitoken: "WK9-d5psbMaGqkisl8P58L51Z6dhRyIhnBgbD2Ed"
  },
  "fukugpt.my.id": {
    zone: "d9ecadda6827409d475a19eec6b87bef",
    apitoken: "WK9-d5psbMaGqkisl8P58L51Z6dhRyIhnBgbD2Ed"
  }
}

let handler = async (m, { fukusima, args, isROwner }) => {
  let text = args.join(" ")
  let dom = Object.keys(global.subdomain || {})

  if (!text || !text.includes(",")) {
    let list = dom.map((d, i) => `${i + 1}. ${d}`).join("\n")
    return m.reply(
`❌ Format salah!

Gunakan:
.subdo host,ip,nomor_domain

Contoh:
.subdo test,103.123.45.67,1

Daftar Domain:
${list}`
    )
  }

  let [host, ip, indexStr] = text.split(",").map(v => v.trim())

  if (!/^[a-z0-9-]+$/i.test(host))
    return m.reply("❌ Hostname tidak valid!")

  if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(ip))
    return m.reply("❌ IP VPS tidak valid!")

  let index = parseInt(indexStr) - 1
  if (isNaN(index) || index < 0 || index >= dom.length) {
    let list = dom.map((d, i) => `${i + 1}. ${d}`).join("\n")
    return m.reply(`❌ Pilihan domain tidak valid!\n\n${list}`)
  }

  let tld = dom[index]
  let sub = global.subdomain[tld]

  await m.reply(`⏳ Membuat subdomain *${host}.${tld}* ke IP *${ip}* ...`)

  try {
    let res = await axios.post(
      `https://api.cloudflare.com/client/v4/zones/${sub.zone}/dns_records`,
      {
        type: "A",
        name: `${host}.${tld}`,
        content: ip,
        ttl: 1,
        proxied: false
      },
      {
        headers: {
          Authorization: `Bearer ${sub.apitoken}`,
          "Content-Type": "application/json"
        }
      }
    )

    if (res.data.success) {
      let name = res.data.result.name
      let content = res.data.result.content

      fs.appendFileSync(
        "./data/subdomain.log",
        `[${new Date().toISOString()}] ${name} | ${content}\n`
      )

      m.reply(
`✅ *Subdomain Berhasil Dibuat!*

🌐 Subdomain: ${name}
📡 IP VPS: ${content}`
      )
    } else {
      m.reply("❌ Gagal membuat subdomain.")
    }
  } catch (e) {
    let err = e.response?.data?.errors?.[0]?.message || e.message
    m.reply("❌ Error: " + err)
  }
}

handler.help = ["subdo", "subdomain"]
handler.tags = ["owner"]
handler.command = /^(subdo|subdomain)$/i
handler.owner = true

export default handler