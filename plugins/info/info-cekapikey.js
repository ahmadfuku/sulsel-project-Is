import fetch from 'node-fetch'

let handler = async (m, { args }) => {
    if (!args[0]) {
        return m.reply(
            `• *CEK API KEY*\n\n` +
            `Contoh penggunaan:\n` +
            `*.cekkey email@gmail.com*`
        )
    }

    let email = args[0]
    let url = `https://fukuku.vercel.app/api/mykey?email=${encodeURIComponent(email)}`

    try {
        let res = await fetch(url)
        let json = await res.json()

        if (!json.status || !json.keys || json.keys.length === 0) {
            return m.reply(`❌ Tidak ditemukan API Key untuk email:\n*${email}*`)
        }

        let response = `• *API KEY INFO*\n\n`
        response += `• Email: *${email}*\n`
        response += `• Total Key: *${json.total}*\n\n`

        json.keys.forEach((key, i) => {
            let lastUsed = key.lastUsed
                ? new Date(key.lastUsed).toLocaleString('id-ID')
                : '-'
            let created = new Date(key.created).toLocaleString('id-ID')

            response +=
                `∝───────•••───────\n` +
                `◦ *Key ${i + 1}*\n` +
                `• Name : ${key.name}\n` +
                `• Key : \`${key.key}\`\n` +
                `• Limit : ${key.limit}\n` +
                `• Sisa : ${key.remaining}\n` +
                `• Terpakai : ${key.totalUsed}\n` +
                `• Terakhir Dipakai : ${lastUsed}\n` +
                `• Dibuat : ${created}\n` +
                `∝───────•••───────\n`
        })

        m.reply(response)

    } catch (e) {
        console.error(e)
        m.reply('⚠️ Terjadi kesalahan saat mengambil data API Key.')
    }
}

handler.help = ['cekkey <email>', 'cekapikey <email>']
handler.tags = ['info']
handler.command = /^(cek(api)?key)$/i

export default handler