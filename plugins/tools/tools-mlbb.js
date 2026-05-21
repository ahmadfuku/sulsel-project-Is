import fetch from 'node-fetch';

let handler = async (m, { fukusima, args, usedPrefix, command }) => {
  if (!args[0]) return fukusima.sendMessage(m.chat, { text: `Contoh:\n${usedPrefix + command} Eudora` }, { quoted: m });
  await fukusima.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
  try {
    const name = args.join(' ');
    const res = await fetch(`https://fastrestapis.fasturl.cloud/character/mlbb?name=${encodeURIComponent(name)}`);
    const json = await res.json();
    if (!json || json.status !== 200 || !json.result?.name) throw new Error('Hero tidak ditemukan.');
    const hero = json.result;
    const caption = `*${hero.name}*\n\n` +
      `*ID:* ${hero.id}\n` +
      `*Story:* ${hero.story}\n` +
      `*Role:* ${hero.role.map(r => r.name).filter(n => n !== 'No role').join(', ') || '-'}\n` +
      `*Lane:* ${hero.lane.map(l => l.name).filter(n => n !== 'No lane').join(', ') || '-'}\n` +
      `*Specialty:* ${hero.speciality.join(', ') || '-'}\n\n` +
      `*Ability*\n` +
      `- Durability: ${hero.ability.durability}\n` +
      `- Offense: ${hero.ability.offense}\n` +
      `- Ability Effects: ${hero.ability.ability_effects}\n` +
      `- Difficulty: ${hero.ability.difficulty}\n\n` +
      `*Skill: ${hero.skills[0].name}*\n${hero.skills[0].desc}`;

    await fukusima.sendFile(m.chat, hero.media.potrait, 'hero.jpg', caption, m);
    await fukusima.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (e) {
    console.error('MLBB ERROR:', e);
    await fukusima.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    await fukusima.sendMessage(m.chat, { text: 'Terjadi kesalahan saat mencari data hero MLBB.', quoted: m });
  }
};

handler.help = ['mlbb <nama>'];
handler.tags = ['tools'];
handler.command = /^mlbb$/i;
handler.register = true


export default handler;