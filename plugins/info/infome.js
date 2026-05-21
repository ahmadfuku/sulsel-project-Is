import fetch from "node-fetch";
let handler = async (m, { fukusima }) => {
  const u = global.db.data.users[m.sender];
  if (!u) return m.reply("Data pengguna tidak ditemukan.");
  const bool = v => v ? "✔️" : "❌";
  const afkStatus = u.afk && u.afk !== -1 ? "✔️" : "❌";
  const name = u.name || m.pushName || "-";
  const age = u.age || "-";
  let avatar;
  try {
    avatar = await fukusima.profilePictureUrl(m.sender, "image");
    if (Buffer.isBuffer(avatar)) throw "BUFFER";
  } catch {
    avatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  }
  const bg = "https://cloud-fukushima.vercel.app/uploader/5wc9e7nnjg.jpg";
  const thumb =
    `https://anabot.my.id/api/maker/levelup?avatar=${encodeURIComponent(avatar)}` +
    `&background=${encodeURIComponent(bg)}` +
    `&username=${encodeURIComponent(name)}` +
    `&description=User+Profile` +
    `&borderColor=000000` +
    `&avatarBorderColor=00ffcc` +
    `&overlayOpacity=0.7` +
    `&currentLevel=${u.level || 0}` +
    `&nextLevel=${(u.level || 0) + 1}` +
    `&apikey=freeApikey`;
  const cafe = u.cafe || {};
  const openHours = cafe.openHours
    ? `${cafe.openHours.start}:00 - ${cafe.openHours.end}:00`
    : "-";
  const teks = `
⛩️ *I N F O* ⛩️
- *ɴᴀᴍᴀ:* ${name}
- *ᴜᴍᴜʀ:* ${age}
- *ɪᴅ:* ${m.sender}
- *ʟᴇᴠᴇʟ:* ${u.level || 0}
- *ᴇxᴘ:* ${u.exp || 0}
- *ᴀᴜᴛᴏ ʟᴇᴠᴇʟ:* ${bool(u.autolevelup)}
- *ᴍᴏɴᴇʏ:* ${u.money || 0}
- *ʟɪᴍɪᴛ:* ${u.limit || 0}
- *ᴅᴇᴘᴏsɪᴛ:* ${u.deposit || 0}
- *sᴀᴍᴘᴀʜ:* ${u.sampah || 0}
- *ᴋᴀʏᴜ:* ${u.kayu || 0}
- *ʙᴀᴛᴜ:* ${u.batu || 0}
- *ᴘᴇʟᴜʀᴜ:* ${u.peluru || 0}
- *ᴘʀᴇᴍɪᴜᴍ:* ${bool(u.premium)}
- *ᴛᴇʀᴅᴀғᴛᴀʀ:* ${bool(u.registered)}
- *ʙᴀɴɴᴇᴅ:* ${bool(u.banned)}
- *ᴡᴀʀɴ:* ${u.warn || 0}
- *ᴀғᴋ:* ${afkStatus}
- *ᴀғᴋ ʀᴇᴀsᴏɴ:* ${u.afkReason || "-"}
- *ʀᴏʟᴇ:* ${u.role || "-"}
- *ᴊᴏʙ:* ${u.job || "-"}
- *ʀᴇɢɪsᴛᴇʀ:* ${u.regTime ? new Date(u.regTime).toLocaleString("id-ID") : "-"}
- *ʟᴀsᴛ ᴄʟᴀɪᴍ:* ${u.lastclaim ? new Date(u.lastclaim).toLocaleString("id-ID") : "-"}
- *ʟᴀsᴛ ʜᴜɴᴛ:* ${u.lastberbru ? new Date(u.lastberbru).toLocaleString("id-ID") : "-"}
- *ᴄᴀғᴇ ɴᴀᴍᴀ:* ${cafe.name || "-"}
- *ᴄᴀғᴇ ʟᴇᴠᴇʟ:* ${cafe.level || 0}
- *ᴄᴜsᴛᴏᴍᴇʀ:* ${cafe.customers || 0}
- *sᴛᴏᴄᴋ:* ${cafe.stock || 0}/${cafe.maxStock || 0}
- *ʀᴇᴠᴇɴᴜᴇ:* ${cafe.revenue || 0}
- *ʀᴀᴛɪɴɢ:* ${cafe.rating || 0}
- *ᴘᴏᴘᴜʟᴀʀɪᴛʏ:* ${cafe.popularity || 0}
- *ᴊᴀᴍ ʙᴜᴋᴀ:* ${openHours}

*${global.namebot}*
`.trim();

  await fukusima.sendMessage(
    m.chat,
    {
      image: { url: thumb },
      caption: teks
    },
    { quoted: m }
  );
};

handler.command = ["me", "profile", "infome"];
handler.tags = ["info"];
handler.help = ["me", "profile", "infome"];
handler.register = true;

export default handler;