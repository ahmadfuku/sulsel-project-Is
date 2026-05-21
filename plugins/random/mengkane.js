let handler = async (m, { fukusima, command }) => {

    if (command === 'mengkane') {
        return m.reply('Mengkane tidak tersedia, hanya tersedia mengkane1 - mengkane52')
    }

    try {

        let audio

        if (
            command == 'mengkane1' ||
            command == 'mengkane2' ||
            command == 'mengkane3' ||
            command == 'mengkane4' ||
            command == 'mengkane5' ||
            command == 'mengkane6' ||
            command == 'mengkane7' ||
            command == 'mengkane8' ||
            command == 'mengkane9' ||
            command == 'mengkane10' ||
            command == 'mengkane11' ||
            command == 'mengkane12' ||
            command == 'mengkane13' ||
            command == 'mengkane14' ||
            command == 'mengkane15' ||
            command == 'mengkane16' ||
            command == 'mengkane17' ||
            command == 'mengkane18' ||
            command == 'mengkane19' ||
            command == 'mengkane20' ||
            command == 'mengkane21' ||
            command == 'mengkane22' ||
            command == 'mengkane23' ||
            command == 'mengkane24'
        ) {
            audio = `https://raw.githubusercontent.com/hyuura/Rest-Sound/main/HyuuraKane/${command}.mp3`
        } else {
            audio = `https://raw.githubusercontent.com/aisyah-rest/mangkane/main/Mangkanenya/${command}.mp3`
        }

        await fukusima.sendMessage(m.chat, {
            audio: { url: audio },
            mimetype: 'audio/mpeg',
            ptt: false
        }, { quoted: m })

    } catch (e) {
        console.log(e)
        m.reply('error bang')
    }
}

handler.help = [
    'mengkane',
    'mengkane1',
    'mengkane2',
    'mengkane3',
    'mengkane4',
    'mengkane5',
    'mengkane6',
    'mengkane7',
    'mengkane8',
    'mengkane9',
    'mengkane10',
    'mengkane11',
    'mengkane12',
    'mengkane13',
    'mengkane14',
    'mengkane15',
    'mengkane16',
    'mengkane17',
    'mengkane18',
    'mengkane19',
    'mengkane20',
    'mengkane21',
    'mengkane22',
    'mengkane23',
    'mengkane24',
    'mengkane25',
    'mengkane26',
    'mengkane27',
    'mengkane28',
    'mengkane29',
    'mengkane30',
    'mengkane31',
    'mengkane32',
    'mengkane33',
    'mengkane34',
    'mengkane35',
    'mengkane36',
    'mengkane37',
    'mengkane38',
    'mengkane39',
    'mengkane40',
    'mengkane41',
    'mengkane42',
    'mengkane43',
    'mengkane44',
    'mengkane45',
    'mengkane46',
    'mengkane47',
    'mengkane48',
    'mengkane49',
    'mengkane50',
    'mengkane51',
    'mengkane52'
]
handler.tags = ['media']

handler.command = [
    'mengkane',
    'mengkane1',
    'mengkane2',
    'mengkane3',
    'mengkane4',
    'mengkane5',
    'mengkane6',
    'mengkane7',
    'mengkane8',
    'mengkane9',
    'mengkane10',
    'mengkane11',
    'mengkane12',
    'mengkane13',
    'mengkane14',
    'mengkane15',
    'mengkane16',
    'mengkane17',
    'mengkane18',
    'mengkane19',
    'mengkane20',
    'mengkane21',
    'mengkane22',
    'mengkane23',
    'mengkane24',
    'mengkane25',
    'mengkane26',
    'mengkane27',
    'mengkane28',
    'mengkane29',
    'mengkane30',
    'mengkane31',
    'mengkane32',
    'mengkane33',
    'mengkane34',
    'mengkane35',
    'mengkane36',
    'mengkane37',
    'mengkane38',
    'mengkane39',
    'mengkane40',
    'mengkane41',
    'mengkane42',
    'mengkane43',
    'mengkane44',
    'mengkane45',
    'mengkane46',
    'mengkane47',
    'mengkane48',
    'mengkane49',
    'mengkane50',
    'mengkane51',
    'mengkane52'
]

handler.register = true
handler.limit = true

export default handler