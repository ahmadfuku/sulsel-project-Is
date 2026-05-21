let handler = async (m, { command, participants, fukusima }) => {
 

 let member = participants
  .map(u => u.id)
  .filter(v => v !== fukusima.user.jid)

 if (!member.length) return m.reply("Member tidak ditemukan")

 let org = member[Math.floor(Math.random() * member.length)]

 await fukusima.sendMessage(m.chat, {
  text: `Anak ${command} di sini adalah @${org.split("@")[0]}`,
  mentions: [org]
 }, { quoted: m })
}

handler.help = [
"bego","goblok","janda","perawan","babi","tolol","pinter","pintar","asu",
"bodoh","gay","lesby","bajingan","jancok","anjing","ngentod","ngentot",
"monyet","mastah","newbie","bangsat","bangke","sange","sangean","dakjal",
"horny","wibu","puki","peak","pantex","pantek","setan","iblis","cacat",
"yatim","piatu"
]

handler.tags = ["fun"]
handler.command = /^(bego|goblok|janda|perawan|babi|tolol|pinter|pintar|asu|bodoh|gay|lesby|bajingan|jancok|anjing|ngentod|ngentot|monyet|mastah|newbie|bangsat|bangke|sange|sangean|dakjal|horny|wibu|puki|peak|pantex|pantek|setan|iblis|cacat|yatim|piatu)$/i
handler.group = true
handler.limit = true
handler.register = true
export default handler
