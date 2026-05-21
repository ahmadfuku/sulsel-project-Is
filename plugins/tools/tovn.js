import fs from"fs";
import path from"path";
import ffmpeg from"fluent-ffmpeg";
import ffmpegPath from"ffmpeg-static";
import {fileTypeFromBuffer} from"file-type";
ffmpeg.setFfmpegPath(ffmpegPath);

let handler=async(m,{fukusima,text,command})=>{
if(text){
await fukusima.sendMessage(m.chat,{text:text},{quoted:m});
return;
}
if(!m.quoted)return m.reply(`Contoh: .${command} teks atau reply media`);
const q=m.quoted;
if(!q.download)return m.reply("Media tidak bisa di-download");
try{
const media=await q.download();
if(!media||media.length===0)return m.reply("Gagal mengunduh media");
const tmpDir=path.join(process.cwd(),"tmp");
if(!fs.existsSync(tmpDir))fs.mkdirSync(tmpDir,{recursive:true});
const ft=await fileTypeFromBuffer(media);
const mime=ft?ft.mime:q.mimetype||"application/octet-stream";
const inputPath=path.join(tmpDir,`dl_${Date.now()}.${mime.includes("audio")?"mp3":"tmp"}`);
fs.writeFileSync(inputPath,media);
if(mime==="audio/ogg"||mime==="audio/ogg; codecs=opus"){
await fukusima.sendMessage(m.chat,{audio:media,mimetype:"audio/ogg; codecs=opus",ptt:true},{quoted:m});
fs.unlinkSync(inputPath);
return;
}
const outputPath=path.join(tmpDir,`dl_${Date.now()}.opus`);
await new Promise((resolve,reject)=>{
ffmpeg(inputPath).format("opus").audioCodec("libopus").on("error",reject).on("end",resolve).save(outputPath);
});
const buffer=fs.readFileSync(outputPath);
await fukusima.sendMessage(m.chat,{audio:buffer,mimetype:"audio/ogg; codecs=opus",ptt:true},{quoted:m});
fs.unlinkSync(inputPath);
fs.unlinkSync(outputPath);
}catch(e){console.error(e);m.reply("Terjadi kesalahan: "+e.message)}
};

handler.help=["tovn"];
handler.tags=["fun"];
handler.command=/^(tovn)$/i;
handler.register=true;
export default handler;