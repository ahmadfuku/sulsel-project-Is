import axios from "axios";
import FormData from "form-data";

let handler = async (m, { fukusima }) => {
    let loading;
    try {
        const q = m.quoted && (m.quoted.mimetype || m.quoted.mediaType) ? m.quoted : m;
        const mime = (q.msg || q).mimetype || q.mediaType || "";
        if (!mime) return m.reply("Reply ke media yang ingin diupload.");

        loading = await fukusima.sendMessage(
            m.chat,
            { text: "_Uploading to Nekohime CDN..._" },
            { quoted: m }
        );

        const buffer = await q.download?.();
        if (!Buffer.isBuffer(buffer))
            return editLoading(fukusima, loading, "Gagal mengambil buffer media.");

        const ext = mime.split("/")[1] || "bin";
        const filename = "media_" + Date.now() + "." + ext;

        const sizeKB = (buffer.length / 1024).toFixed(2);
        const sizeMB = (buffer.length / 1024 / 1024).toFixed(2);
        const size = buffer.length > 1048576 ? `${sizeMB} MB` : `${sizeKB} KB`;

        const form = new FormData();
        form.append("file", buffer, filename);

        let res = await axios.post("https://cdn.nekohime.site/upload", form, {
            headers: form.getHeaders(),
        });

        let file = res?.data?.files?.[0];
        let url = file?.url || file;

        if (url) {
            return editLoading(
                fukusima,
                loading,
                `✔ *Uploaded to Nekohime CDN*\nFile: ${filename}\nMime: ${mime}\nSize: ${size}\n\n${url}`
            );
        }

        return editLoading(fukusima, loading, `Upload gagal.\nSize: ${size}`);
    } catch (e) {
        if (loading) editLoading(fukusima, loading, `Error: ${e.message}`);
        else m.reply(`Error: ${e.message}`);
    }
};

async function editLoading(fukusima, msg, newText) {
    try {
        return fukusima.sendMessage(msg.key.remoteJid, { text: newText, edit: msg.key });
    } catch {
        return fukusima.sendMessage(msg.key.remoteJid, { text: newText });
    }
}

handler.help = ["tourlv2 nekohime"];
handler.tags = ["tools"];
handler.command = /^(tourlv2|nkh|uploadnkh)$/i;
handler.register = true


export default handler;