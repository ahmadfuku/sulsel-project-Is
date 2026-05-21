import os from 'os'

function formatUptime(seconds) {
  seconds = Math.floor(seconds)
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${d} days, ${h} hours, ${m} minutes, ${s} seconds`
}

function formatBytes(bytes) {
  return (bytes / (1024 ** 3)).toFixed(2)
}

function cpuUsage() {
  const cpus = os.cpus()
  let user = 0, nice = 0, sys = 0, idle = 0, irq = 0
  for (const cpu of cpus) {
    user += cpu.times.user
    nice += cpu.times.nice
    sys += cpu.times.sys
    idle += cpu.times.idle
    irq += cpu.times.irq
  }
  const total = user + nice + sys + idle + irq
  return {
    user: (user / total * 100).toFixed(2),
    nice: (nice / total * 100).toFixed(2),
    sys: (sys / total * 100).toFixed(2),
    idle: (idle / total * 100).toFixed(2),
    irq: (irq / total * 100).toFixed(2)
  }
}

let handler = async (m) => {

  const start = process.hrtime()
  const diff = process.hrtime(start)
  const ping = (diff[0] * 1e9 + diff[1]) / 1e9

  const totalRam = formatBytes(os.totalmem())
  const usedRam = formatBytes(os.totalmem() - os.freemem())

  const uptime = formatUptime(os.uptime())

  const cpu = cpuUsage()
  const cpuModel = os.cpus()[0].model
  const core = os.cpus().length

  const text = `
*JARINGAN SERVER*
- Ping: ${ping.toFixed(4)} _Second_

*INFO SERVER*
- OS: Debian 12
- VPS: ${uptime}
- Type OS: ${os.type()}

*RAM :*
- Total: ${totalRam} GB
- Digunakan: ${usedRam} GB

*PENYIMPANAN :*
- Total: 376.0 GB
- Digunakan: 253.7 GB (67.5%)
- Tersedia: 122.3 GB (32.5%)

*RUNTIME SERVER*
Aktif:
${uptime}

*CPU USAGE (${core} CORE CPU)*
${cpuModel}
- *user* : ${cpu.user}%
- *nice* : ${cpu.nice}%
- *sys*  : ${cpu.sys}%
- *idle* : ${cpu.idle}%
- *irq*  : ${cpu.irq}%
`

  await m.reply(text.trim())
}

handler.command = /^(ping|speed)$/i
handler.tags = ['info']
handler.help = ['ping', 'speed']

export default handler