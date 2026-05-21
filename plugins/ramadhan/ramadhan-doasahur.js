let handler = async (m, { fukusima }) => {

let teks = `🥣 *Doa Sahur*

نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ لِلَّهِ تَعَالَى

*Latin:*
Nawaitu shauma ghadin 'an adaa'i fardhi syahri ramadhana lillahi ta'ala

*Artinya:*
Aku niat berpuasa esok hari untuk menunaikan kewajiban di bulan Ramadhan karena Allah Ta'ala.`

await fukusima.sendMessage(m.chat, { text: teks }, { quoted: m })
}

handler.command = ["doasahur"]
handler.help = ["doasahur"]
handler.tags = ["ramadhan"]
handler.register = true
export default handler