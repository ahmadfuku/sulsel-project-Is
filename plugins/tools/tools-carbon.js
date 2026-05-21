let handler = async (m, { text, fukusima }) => {
    if (!text) return m.reply('kirim kode')

    async function createCarbon(code) {
        let opt = {
            bg: 'rgba(171, 184, 195, 1)',
            t: 'seti',
            wt: 'none',
            l: 'auto',
            width: 680,
            ds: true,
            dsyoff: '20px',
            dsblur: '68px',
            wc: true,
            wa: true,
            pv: '56px',
            ph: '56px',
            ln: false,
            fl: 1,
            fm: 'Hack',
            fs: '14px',
            lh: '133%',
            si: false,
            es: '2x',
            wm: false
        }

        let params = new URLSearchParams()
        for (let k in opt) params.append(k, opt[k])
        params.append('code', code)

        let res = await fetch(`https://carbon.now.sh/?${params.toString()}`, {
            headers: {
                'user-agent': 'Mozilla/5.0'
            }
        })

        let html = await res.text()
        let img = html.match(/id="export-container".*?src="([^"]+)"/)?.[1] 
               || html.match(/id="export-png".*?src="([^"]+)"/)?.[1]
               || html.match(/imageURL:\s*["']([^"']+)["']/)?.[1]

        if (!img) throw 'gagal ambil'

        if (!img.startsWith('http')) img = 'https://carbon.now.sh' + img
        return img
    }

    try {
        await m.reply('processing...')

        let img = await createCarbon(text)

        await fukusima.sendMessage(m.chat, {
            image: { url: img },
            caption: 'Carbon Code'
        }, { quoted: m })

    } catch (e) {
        console.log(e)
        m.reply('error bang')
    }
}

handler.help = ['carbon']
handler.tags = ['tools']
handler.command = /^(carbon)$/i
handler.register = true
handler.limit = true
export default handler