let handler = async (m, { fukusima, command }) => {
    const galau = [
        "https://telegra.ph/file/c83205eeeecceb9e4db87.mp4",
        "https://telegra.ph/file/a001c30cafa587a3bef2c.mp4",
        "https://telegra.ph/file/09cf5ac786cbfda551617.mp4",
        "https://telegra.ph/file/e696afd2cfe29a199be11.mp4",
        "https://telegra.ph/file/5be5e3696c03edff2772b.mp4",
        "https://telegra.ph/file/b9b3dece43e557b4addc1.mp4",
        "https://telegra.ph/file/a33e23d6736f8cb40b4fb.mp4",
        "https://telegra.ph/file/3426da3a67bdc0238bd46.mp4",
        "https://telegra.ph/file/394386e5dff94ccff2323.mp4",
        "https://telegra.ph/file/1a1cf22235249f0a459e5.mp4",
        "https://telegra.ph/file/a5578746d1abf176894ed.mp4",
        "https://telegra.ph/file/99dcebf89c97f13f4f657.mp4",
        "https://telegra.ph/file/6a808e89640f23ecfc936.mp4",
        "https://telegra.ph/file/2e35480077a5eae3b2a1e.mp4",
        "https://telegra.ph/file/6c5ba9ed473f188a963b2.mp4"
    ]

    let nomor = command.replace('video', '')
    let index = parseInt(nomor) - 1
    if (!galau[index]) return m.reply('Video tidak tersedia')

    fukusima.sendMessage(m.chat, { 
        video: { url: galau[index] }, 
        mimetype: 'video/mp4' 
    }, { quoted: m })
}

handler.help = ['video1','video2','video3','video4','video5','video6','video7','video8','video9','video10','video11','video12','video13','video14','video15']
handler.tags = ['random']
handler.command = /^(video1|video2|video3|video4|video5|video6|video7|video8|video9|video10|video11|video12|video13|video14|video15)$/i
handler.register = true
handler.limit = true

export default handler