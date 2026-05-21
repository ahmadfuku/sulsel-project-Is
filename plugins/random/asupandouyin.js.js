function getVerifiedQuoted(){return{key:{participant:"0@s.whatsapp.net",remoteJid:"status@broadcast"},message:{contactMessage:{displayName:`🪸 ${global.namebot}`,vcard:`BEGIN:VCARD\nVERSION:3.0\nN:XL;${global.namebot},;;;\nFN:${global.namebot}\nitem1.TEL;waid=13135550002:+1 (313) 555-0002\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,sendEphemeral:true}}}}

let handler = async (m,{ fukusima }) => {

  await m.reply(global.wait)

  await fukusima.sendMessage(m.chat,{
    video:{
      url:"https://api.betabotz.eu.org/api/asupan/douyin?apikey=Btz-AhmadXyz"
    },
    caption:"🎬 Random Douyin Video"
  },{ quoted:getVerifiedQuoted() })

}

handler.help = ["asdouyin"]
handler.tags = ["random"]
handler.command = /^(asdouyin|douyinasupan)$/i

export default handler