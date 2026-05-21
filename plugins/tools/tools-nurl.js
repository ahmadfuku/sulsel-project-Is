import FormData from "form-data";
import axios from "axios";
import moment from "moment-timezone";
import mime from "mime-types";

const unitLabel = { minutes: "menit", hours: "jam", days: "hari" };
const ensureExt = (name, mimeType) => {
  if (/\.[a-z0-9]{1,5}$/i.test(name)) return name;
  const ext = mime.extension(mimeType);
  return name + (ext ? `.${ext}` : "");
};
const toSize = s =>
  s < 1024 ? `${s} B` : s < 1048576 ? `${(s / 1024).toFixed(1)} KB` : `${(s / 1048576).toFixed(2)} MB`;

let handler = async (m, { fukusima, text, command }) => {
  const q = m.quoted ? m.quoted : m;
  const mimeType = (q.msg || q).mimetype || "";
  const isReply = !!m.quoted;
  if (!mimeType && !isReply) {
    return m.reply(
`📤 *Cara pakai .${command}*

1️⃣ Reply media ➜ \`.${command} fileku|30|minutes\`
2️⃣ Reply teks   ➜ \`.${command} catatan|1|hours\`
3️⃣ Kirim media + caption ➜ \`.${command} dokumentasi|2|days\`

📌 expire_unit: minutes | hours | days
📦 Maks. 100 MB`
    );
  }

  let buffer, filename;
  let rawName = text?.split("|")[0]?.trim();
  if (mimeType) {
    buffer = await q.download();
    if (!rawName) rawName = `file_${Date.now()}`;
    filename = ensureExt(rawName, mimeType);
  } else if (isReply && q.text) {
    buffer = Buffer.from(q.text, "utf-8");
    if (!rawName) rawName = `text_${Date.now()}`;
    filename = rawName.endsWith(".txt") ? rawName : `${rawName}.txt`;
  } else {
    return m.reply(`⚠️ Harap reply media/teks.\nContoh: \`.${command} laporan|10|hours\``);
  }
  const [name = filename, expVal = "30", expUnit = "minutes"] =
    (text || "").split("|").map(v => v.trim().toLowerCase());
  if (!["minutes", "hours", "days"].includes(expUnit))
    return m.reply("❗ *expire_unit* hanya: minutes | hours | days");
  const form = new FormData();
  form.append("file", buffer, { filename, contentType: mimeType || "text/plain" });
  form.append("filename", name);
  form.append("expire_value", expVal);
  form.append("expire_unit", expUnit);
  try {
    const { data: up } = await axios.post("https://nauval.cloud/upload", form, {
      headers: { ...form.getHeaders(), "User-Agent": "TixoBot" }
    });
    const ext = filename.split(".").pop().toLowerCase();
    const icon =
      /audio/.test(mimeType) ? "🎵" :
      /image/.test(mimeType) ? "🖼️" :
      /video/.test(mimeType) ? "🎞️" :
      ["pdf"].includes(ext)     ? "📕" :
      ["ppt", "pptx"].includes(ext) ? "📊" :
      ["doc", "docx"].includes(ext) ? "📝" :
      ["xls", "xlsx"].includes(ext) ? "📈" :
      ["zip", "rar"].includes(ext)  ? "🗂️" :
      ["js", "html", "css", "json", "py", "cpp", "sh"].includes(ext) ? "🧩" :
      "📄";
    const expiredWIB = up.expires_at
      ? moment.utc(up.expires_at).tz("Asia/Jakarta").format("D MMM YYYY, HH.mm [WIB]")
      : "Tidak ditentukan";

    const caption =
`${icon} *File berhasil diupload!*

🔗 *URL*        : ${up.file_url}
🕓 *Expired At* : ${expiredWIB}
📆 *Expired in* : ${expVal} ${unitLabel[expUnit]}
📄 *Filename*   : ${up.filename}
📦 *Size*       : ${toSize(up.size)}`;

    const qrBuf = Buffer.from(up.qr_code_base64.split(",")[1], "base64");

    await fukusima.sendMessage(m.chat, {
      image: qrBuf,
      caption,
      footer: "QR Code aktif hingga file expired.",
      buttons: [
        { buttonId: up.file_url, buttonText: { displayText: "📥 Download" }, type: 1 },
        { buttonId: "menu", buttonText: { displayText: "🏠 Menu" }, type: 1 }
      ],
      headerType: 4
    }, { quoted: m });

  } catch (e) {
    console.error("[Upload Error]", e);
    m.reply("Gagal mengupload file.");
  }
};

handler.help = ["nurl"];
handler.tags = ["tools"];
handler.command = /^nurl$/i;

export default handler;