function getVerifiedQuoted(){return{key:{participant:"0@s.whatsapp.net",remoteJid:"status@broadcast"},message:{contactMessage:{displayName:`🪸 ${global.namebot}`,vcard:`BEGIN:VCARD\nVERSION:3.0\nN:XL;${global.namebot},;;;\nFN:${global.namebot}\nitem1.TEL;waid=13135550002:+1 (313) 555-0002\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,sendEphemeral:true}}}}

let handler = async (m,{ fukusima }) => {

  await m.reply(global.wait)

  await fukusima.sendMessage(m.chat,{
    video:{
      url:"https://api.betabotz.eu.org/api/asupan/anony?apikey=Btz-AhmadXyz"
    },
    caption:"Done"
  },{ quoted:getVerifiedQuoted() })

}

handler.help = ["anony"]
handler.tags = ["random"]
handler.command = /^(anony|randomanony)$/i

export default handler