let handler = async (m, { fukusima }) => {

let teks = `🕌 *Doa Setelah Tarawih*

اللّهُمَّ اجْعَلْنَا فِي لَيْلَتِنَا هَذِهِ مِنَ الْمَقْبُولِينَ وَلا تَجْعَلْنَا مِنَ الْمَرْدُودِينَ

*Artinya:*
Ya Allah jadikanlah kami pada malam ini termasuk orang-orang yang Engkau terima amalnya dan jangan Engkau jadikan kami termasuk orang-orang yang tertolak.`

fukusima.sendMessage(m.chat, { text: teks }, { quoted: m })
}

handler.command = ["doatarawih"]
handler.tags = ["ramadhan"]
handler.help = ["doatarawih"]
handler.register = true

export default handler