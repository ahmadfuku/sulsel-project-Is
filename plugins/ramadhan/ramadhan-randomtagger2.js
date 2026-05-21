let handler = async (m, { command, participants, fukusima }) => {
 

 let member = participants
  .map(u => u.id)
  .filter(v => v !== fukusima.user.jid)

 if (!member.length) return m.reply("Member tidak ditemukan")

 let org = member[Math.floor(Math.random() * member.length)]

 const teks = {
  taraweh: "Paling rajin taraweh",
  imamtaraweh: "Calon imam taraweh",
  makmumsetia: "Makmum paling setia",
  safdepan: "Paling sering di saf depan",
  safbelakang: "Spesialis saf belakang",
  telattaraweh: "Paling sering telat taraweh",
  bolostaraweh: "Sering bolos taraweh",
  ketidurantaraweh: "Paling sering ketiduran pas taraweh",
  ngantuk: "Paling ngantuk saat taraweh",
  merdu: "Suaranya cocok jadi imam",
  muadzin: "Cocok jadi muadzin masjid",
  doapalinglama: "Doanya paling lama",
  dzikir: "Paling khusyuk dzikir",
  fokusibadah: "Paling fokus ibadah",
  ganggushaf: "Paling bikin saf goyang",
  hpterus: "Taraweh tapi pegang HP terus",
  selfimasjid: "Tukang selfie di masjid",
  parfum: "Paling wangi ke masjid",
  sarung: "Sarung paling aesthetic",
  peci: "Peci paling rapi",
  ustadzmode: "Mode ustadz aktif",
  alim: "Paling alim di grup",
  khusyuk: "Paling khusyuk sholat",
  cepat: "Paling cepat salam",
  lamasujud: "Sujud paling lama",
  doabuka: "Paling semangat doa setelah taraweh",
  ngopisetelah: "Abis taraweh langsung ngopi",
  nongkrongmasjid: "Nongkrong masjid sampai sahur",
  penunggumasjid: "Penunggu setia masjid",
  rajinmalam: "Ibadah malam paling rajin"
 }

 let caption = teks[command] || `Paling ${command} saat taraweh`

 await fukusima.sendMessage(m.chat, {
  text: `🕌 ${caption} adalah @${org.split("@")[0]}`,
  mentions: [org]
 }, { quoted: m })
}

handler.help = [
"taraweh","imamtaraweh","makmumsetia","safdepan","safbelakang",
"telattaraweh","bolostaraweh","ketidurantaraweh","ngantuk","merdu",
"muadzin","doapalinglama","dzikir","fokusibadah","ganggushaf",
"hpterus","selfimasjid","parfum","sarung","peci","ustadzmode","alim",
"khusyuk","cepat","lamasujud","doabuka","ngopisetelah","nongkrongmasjid",
"penunggumasjid","rajinmalam"
]

handler.tags = ["fun","ramadhan"]
handler.command = /^(taraweh|imamtaraweh|makmumsetia|safdepan|safbelakang|telattaraweh|bolostaraweh|ketidurantaraweh|ngantuk|merdu|muadzin|doapalinglama|dzikir|fokusibadah|ganggushaf|hpterus|selfimasjid|parfum|sarung|peci|ustadzmode|alim|khusyuk|cepat|lamasujud|doabuka|ngopisetelah|nongkrongmasjid|penunggumasjid|rajinmalam)$/i

handler.group = true
export default handler
