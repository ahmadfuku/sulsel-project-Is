import axios from "axios";

let handler = async (m, { fukusima, text, command, usedPrefix }) => {
    try {
        if (!text) return m.reply(`Contoh: ${usedPrefix + command} pink halo`);

        const COLORS = {
            pink: '#f68ac9', blue: '#6cace4', red: '#f44336', green: '#4caf50',
            white: '#ffffff'
        };

        let split = text.trim().split(" ");
        let colorKey = split[0].toLowerCase();
        let message = COLORS[colorKey] ? split.slice(1).join(" ") : text;
        let backgroundColor = COLORS[colorKey] || COLORS.white;

        if (!message) return m.reply("Teks tidak boleh kosong!");
        if (message.length > 80) message = message.slice(0, 80) + "...";
        const messageLines = message.match(/.{1,40}/g) || [message];

        const username = global.db.data.users[m.sender]?.nama || "User";
        const avatar = await fukusima.profilePictureUrl(m.sender, "image")
            .catch(() => "https://files.catbox.moe/nwvkbt.png");

        const messages = messageLines.map(line => ({
            entities: [],
            avatar: true,
            from: { id: 1, name: username, photo: { url: avatar } },
            text: line,
            replyMessage: {},
            fontSize: 28
        }));

        const json = {
            type: "quote",
            format: "png",
            backgroundColor,
            width: 512,
            height: 768,
            scale: 2,
            messages
        };

        const res = await axios.post("https://bot.lyo.su/quote/generate", json, {
            headers: { "Content-Type": "application/json" },
        });

        const buffer = Buffer.from(res.data.result.image, "base64");

        // Pake fukusima.sendSticker langsung
        const packname = `${global.namebot} Qc Sticker`;
        const author = `${global.author}`;
        const exif = { packName: packname, packPublish: author };

        await fukusima.sendSticker(m.chat, buffer, m, exif);

    } catch (err) {
        console.error(err);
        m.reply("Terjadi kesalahan: " + err.message);
    }
};

handler.help = ["qc", "qcstick"];
handler.tags = ["sticker"];
handler.command = /^(qc|qcstick|qcstic)$/i;
handler.register = true;
export default handler;