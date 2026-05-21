import { Client } from "ssh2"

let handler = async (m, { fukusima, text, command }) => {

if (!text) return fukusima.sendMessage(m.chat,{
text:`Contoh:\n.${command} ipvps|pwvps|panel.com|node.com|ramserver`
},{quoted:m})

let vii = text.split("|")
if (vii.length < 5) return fukusima.sendMessage(m.chat,{
text:`Contoh:\n.${command} ipvps|pwvps|panel.com|node.com|ramserver`
},{quoted:m})

const ssh = new Client()

const connSettings = {
host: vii[0].trim(),
port: 22,
username: "root",
password: vii[1].trim()
}

const user = "mrx"
const pass = "69"

const domainpanel = vii[2].trim()
const domainnode = vii[3].trim()
const ramserver = vii[4].trim()

const commandPanel = `bash <(curl -s https://pterodactyl-installer.se)`

function runCommand(cmd, autoInput = []) {

return new Promise((resolve,reject)=>{

console.log("\n==============================")
console.log("RUNNING COMMAND:")
console.log(cmd)
console.log("==============================\n")

ssh.exec(cmd,{pty:true},(err,stream)=>{

if(err) return reject(err)

stream.on("data",(data)=>{

let out = data.toString()

process.stdout.write(out)

for (let input of autoInput) {
if(out.includes(input.when)){
stream.write(input.send)
}
}

})

stream.stderr.on("data",(data)=>{
process.stderr.write(data.toString())
})

stream.on("close",(code)=>{
console.log("\nProcess finished with code:",code)
resolve()
})

})

})

}

async function instalPanel(){

await runCommand(commandPanel,[
{when:"Input 0-6",send:"0\n"},
{when:"(y/N)",send:"y\n"},
{when:"Database name",send:`${user}\n`},
{when:"Database username",send:`${user}\n`},
{when:"Password",send:`${pass}\n`},
{when:"Select timezone",send:"Asia/Jakarta\n"},
{when:"Provide the email",send:"mrx@gmail.com\n"},
{when:"Email address for the initial admin",send:"mrx@gmail.com\n"},
{when:"Username for the initial admin",send:`${user}\n`},
{when:"First name",send:"mr.x\n"},
{when:"Last name",send:"strezz\n"},
{when:"Set the FQDN",send:`${domainpanel}\n`},
{when:"UFW",send:"y\n"},
{when:"HTTPS",send:"y\n"},
{when:"Select the appropriate number",send:"1\n"},
{when:"I agree",send:"y\n"},
{when:"Proceed anyways",send:"y\n"},
{when:"(yes/no)",send:"yes\n"},
{when:"(A)gree",send:"A\n"}
])

}

async function instalWings(){

await runCommand(commandPanel,[
{when:"Input 0-6",send:"1\n"},
{when:"(y/N)",send:"y\n"},
{when:"Enter the panel address",send:`${domainpanel}\n`},
{when:"Database host username",send:`${user}\n`},
{when:"Database host password",send:`${pass}\n`},
{when:"node.example.com",send:`${domainnode}\n`},
{when:"Enter email",send:"fukugen@nodes.me\n"}
])

await runCommand(`bash <(curl -s https://raw.githubusercontent.com/Bangsano/Autoinstaller-Theme-Pterodactyl/main/createnode.sh)`,[
{when:"Masukkan nama lokasi",send:"SGP\n"},
{when:"Masukkan deskripsi lokasi",send:"Fuku Solution Distribution\n"},
{when:"Masukkan domain",send:`${domainnode}\n`},
{when:"Masukkan nama node",send:"NODE BY MR.X\n"},
{when:"Masukkan RAM",send:`${ramserver}\n`},
{when:"disk space",send:`${ramserver}\n`},
{when:"Masukkan Locid",send:"1\n"}
])

await runCommand(`cd /var/www/pterodactyl && php artisan p:node:configuration 1 > /etc/pterodactyl/config.yml && chmod 600 /etc/pterodactyl/config.yml && systemctl restart wings`)

}

ssh.on("ready", async()=>{

console.log("✅ SSH CONNECTED:",connSettings.host)

await fukusima.sendMessage(m.chat,{
text:"Memproses install panel...\nTunggu 5 menit hingga selesai"
},{quoted:m})

try{

await instalPanel()
await instalWings()

let teks = `🔐 *Sukses Membuat Akun Admin Panel!*

📊 *Informasi Akun*
▸ Username : ${user}
▸ Password : ${pass}

🌐 *Login Panel*
https://${domainpanel}

⚙️ Panel berhasil di install`

await fukusima.sendMessage(m.chat,{text:teks},{quoted:m})

}catch(e){

console.log("INSTALL ERROR:",e)

fukusima.sendMessage(m.chat,{
text:`❌ Error install:\n${e.message}`
},{quoted:m})

}

})

ssh.on("error",(err)=>{
console.log("SSH ERROR:",err.message)
})

ssh.connect(connSettings)

}

handler.help = ["installv2"]
handler.tags = ["owner"]
handler.command = /^installv2$/i
handler.owner = true

export default handler