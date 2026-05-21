let handler = async (m, { command, participants, fukusima }) => {
 

 let member = participants
  .map(u => u.id)
  .filter(v => v !== fukusima.user.jid)

 if (!member.length) return m.reply("Member tidak ditemukan")

 let org = member[Math.floor(Math.random() * member.length)]

 const teks = {
  sahur: "Paling susah bangun sahur",
  telatsahur: "Paling sering telat sahur",
  bukber: "Paling sering ngajak bukber tapi gak bayar",
  takjil: "Paling banyak nyolong takjil",
  batal: "Paling duluan batal puasanya",
  haus: "Paling gampang haus",
  lapar: "Paling gampang lapar",
  kuat: "Paling kuat puasanya",
  bolong: "Puasanya bolong bolong",
  imsak: "Masih makan pas imsak",
  taraweh: "Paling rajin taraweh",
  tarawihbolos: "Paling sering bolos taraweh",
  masjid: "Paling rajin ke masjid",
  ngaji: "Paling rajin ngaji",
  sedekah: "Paling rajin sedekah",
  pelit: "Paling pelit di bulan puasa",
  dermawan: "Paling dermawan di bulan puasa",
  tidur: "Puasa tapi tidur mulu",
  rebahan: "Paling rajin rebahan",
  gamer: "Puasa tapi mabar terus",
  jualtakjil: "Cocok jualan takjil",
  bukapalingcepat: "Paling gak sabar buka",
  bukapalinglama: "Paling santai nunggu buka",
  bukanyolong: "Paling sering nyolong makanan sebelum buka",
  cheframadhan: "Chef terbaik saat ramadhan",
  tukangmakan: "Paling barbar pas buka",
  doyanes: "Paling doyan es pas buka",
  doyangorengan: "Paling doyan gorengan",
  sultanbukber: "Sultan traktir bukber",
  penunggubedug: "Paling setia nunggu bedug",
  alarmrusak: "Alarm sahurnya gak pernah bunyi",
  rajinsahur: "Paling rajin sahur",
  mageribadah: "Paling mager ibadah",
  rajinibadah: "Paling rajin ibadah",
  calonustadz: "Calon ustadz grup",
  calonimam: "Calon imam masjid",
  voiceadzan: "Suaranya cocok jadi muadzin",
  tukangdoa: "Paling rajin kirim doa",
  ratuimsyak: "Ratu imsak grup",
  rajingrupsahur: "Paling rajin bangunin sahur di grup"
 }

 let caption = teks[command] || `Paling ${command} di bulan ramadhan`

 await fukusima.sendMessage(m.chat, {
  text: `🌙 ${caption} adalah @${org.split("@")[0]}`,
  mentions: [org]
 }, { quoted: m })
}

handler.help = [
"sahur","telatsahur","bukber","takjil","batal","haus","lapar","kuat",
"bolong","imsak","taraweh","tarawihbolos","masjid","ngaji","sedekah",
"pelit","dermawan","tidur","rebahan","gamer","jualtakjil",
"bukapalingcepat","bukapalinglama","bukanyolong","cheframadhan",
"tukangmakan","doyanes","doyangorengan","sultanbukber","penunggubedug",
"alarmrusak","rajinsahur","mageribadah","rajinibadah","calonustadz",
"calonimam","voiceadzan","tukangdoa","ratuimsyak","rajingrupsahur"
]

handler.tags = ["fun","ramadhan"]
handler.command = /^(sahur|telatsahur|bukber|takjil|batal|haus|lapar|kuat|bolong|imsak|taraweh|tarawihbolos|masjid|ngaji|sedekah|pelit|dermawan|tidur|rebahan|gamer|jualtakjil|bukapalingcepat|bukapalinglama|bukanyolong|cheframadhan|tukangmakan|doyanes|doyangorengan|sultanbukber|penunggubedug|alarmrusak|rajinsahur|mageribadah|rajinibadah|calonustadz|calonimam|voiceadzan|tukangdoa|ratuimsyak|rajingrupsahur)$/i

handler.group = true
export default handler