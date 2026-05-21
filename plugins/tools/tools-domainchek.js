let handler = async (m, { text, fukusima }) => {
    if (!text) return m.reply('Masukkan domain!\nContoh: .domain example.com')

    try {
        let api = `https://api.fukugpt.my.id/api/domainchek?api=${global.apifuku}&url=${encodeURIComponent(text)}`
        let res = await fetch(api)
        let json = await res.json()

        if (!json.success) {
            return m.reply('Domain tidak ditemukan atau tidak valid.')
        }

        let caption = `
🌐 Domain : ${json.domain}
🖥 IP      : ${json.ip}
🏢 ASN     : ${json.asn}
📡 Network : ${json.network}
🏷 Netname : ${json.netname}
🌍 Country : ${json.country}
📧 Abuse   : ${json.abuse_contact?.join(', ') || '-'}
🧩 IP Ver  : IPv${json.ip_version}`.trim()

        await fukusima.sendMessage(m.chat, {
            text: caption,
            contextInfo: {
                externalAdReply: {
                    title: "🔎 Domain Checker",
                    body: json.domain,
                    thumbnailUrl: global.thumb,
                    sourceUrl: `https://${json.domain}`,
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: m })

    } catch (e) {
        console.log(e)
        m.reply('Terjadi kesalahan saat cek domain.')
    }
}

handler.help = ['domain', 'domainchek']
handler.tags = ['tools']
handler.command = /^(domain|domainchek)$/i
handler.register = true
handler.limit = true

export default handler