let handler = async (m, { fukusima, command }) => {

let teks = `🌙 *Doa Berbuka Puasa*

اللَّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ

*Latin:*
Allahumma laka shumtu wa bika aamantu wa 'ala rizqika afthartu

*Artinya:*
Ya Allah, untuk-Mu aku berpuasa, kepada-Mu aku beriman, dan dengan rezeki-Mu aku berbuka.`

fukusima.sendMessage(m.chat, {
    audio: { url: "https://uploader.fuku-cloud.my.id/uploader/b321c2745ed1.mpeg"},
    mimetype: 'audio/mpeg'
}, { quoted: m})

fukusima.sendMessage(m.chat, { text: teks }, { quoted: m })
}



handler.command = ["doabuka"]
handler.tags = ["ramadhan"]
handler.help = ["doabuka"]
handler.register = true
export default handler