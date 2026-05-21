let handler = async (m, { fukusima }) => {
let user = global.db.data.users[m.sender]
    fukusima.sendMessage(m.chat, {
    react: {
      text: '🙂',
      key: m.key,
    }
  });    
   
}

handler.customPrefix = /^(botkontol|bot kontol|botasu|bot asu|botsters|bot gila|botnyagoblok|bot nya goblok|bot goblok|bot sters|bot kentang|gilabotnya|hadeh bot kontol|bot ngentod|botngentod)$/i 
handler.command = new RegExp

export default handler