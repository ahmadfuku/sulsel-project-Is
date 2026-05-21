// upscale.js — By ChatGPT Fix Version

let handler = async (m, { fukusima, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || "";

    if (!/image\/(jpe?g|png|webp)/.test(mime)) {
        return m.reply(`📸 *Kirim / Reply gambar*\nContoh:\n${usedPrefix + command} (reply foto)`);
    }

    await m.reply("⏳ *Mengupload gambar ke Uguu...*");
    let buffer = await q.download();
    const form = new FormData();
    form.append("files[]", new Blob([buffer]), "image.jpg");
    let up;
    try {
        up = await fetch("https://uguu.se/upload", {
            method: "POST",
            body: form
        }).then(res => res.json());
    } catch (e) {
        console.log(e);
        return m.reply("ʏᴀʜ ɢᴀɢᴀʟ ᴜᴘʟᴏᴀᴅ");
    }

    if (!up || !up.files || !up.files[0] || !up.files[0].url) {
        return m.reply("ɢᴀɢᴀʟ ᴜᴘʟᴏᴀᴅ ᴋᴇ ᴜɢᴜᴜ");
    }
    let imageUrl = up.files[0].url;
    await m.reply("🔍 ᴛᴜɴɢɢᴜ sᴇʙᴇɴᴛᴀʀ");
    let api;
    try {
        api = await fetch(`https://api.ootaizumi.web.id/tools/upscale?imageUrl=${encodeURIComponent(imageUrl)}`)
            .then(res => res.json());
    } catch (e) {
        console.log(e);
        return m.reply("ᴀᴘɪ ɢᴀɢᴀʟ ᴍᴇᴍᴘʀᴏsᴇs ɢᴀᴍʙᴀʀ ᴋᴀᴍᴜ");
    }

    if (!api.status || !api.result || !api.result.imageUrl) {
        return m.reply("ᴀᴘɪ ɢᴀɢᴀʟ ᴍᴇᴍᴘʀᴏsᴇs ɢᴀᴍʙᴀʀ");
    }

    let finalImageUrl = api.result.imageUrl;
    try {
        let hasil = await fetch(finalImageUrl);
        let buf = Buffer.from(await hasil.arrayBuffer());
        await fukusima.sendMessage(m.chat, {
            image: buf,
            caption: `✅ *sᴜᴋsᴇs ᴀʙᴀɴɢᴋᴜʜ*\n\n🖼️ sɪᴢᴇ: ${api.result.size || '-'}`
        }, { quoted: m });

    } catch (e) {
        console.log(e);
        await m.reply("*Gagal mengirim hasil gambar.*");
    }
};

handler.help = ["upscale"];
handler.tags = ["tools"];
handler.command = /^upscale$/i;
handler.register = false;

export default handler;