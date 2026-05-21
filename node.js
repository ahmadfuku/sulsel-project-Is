

import { join, dirname } from 'path'
import { createRequire } from "module"
import { fileURLToPath } from 'url'
import { setupMaster, fork } from 'cluster'
import chalk from "chalk"
import { createInterface } from 'readline'
console.log(chalk.cyan.bold(`
███████╗██╗   ██╗██╗  ██╗██╗   ██╗
██╔════╝██║   ██║██║ ██╔╝██║   ██║
█████╗  ██║   ██║█████╔╝ ██║   ██║
██╔══╝  ██║   ██║██╔═██╗ ██║   ██║
██║     ╚██████╔╝██║  ██╗╚██████╔╝
╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝
`))
const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname)
const { name, author } = require(join(__dirname, './package.json'))
const rl = createInterface(process.stdin, process.stdout)

let isRunning = false
let restartCount = 0

function start(file) {
  if (isRunning) return
  isRunning = true

  let args = [join(__dirname, file), ...process.argv.slice(2)]

  setupMaster({
    exec: args[0],
    args: args.slice(1),
  })

  let p = fork()

  p.on('message', data => {
    console.log('[RECEIVED]', data)
    switch (data) {
      case 'reset':
        p.process.kill()
        isRunning = false
        start(file)
        break
      case 'uptime':
        p.send(process.uptime())
        break
    }
  })

  p.on('exit', (_, code) => {
    isRunning = false
    console.error('[❗] Exited with code:', code)

    restartCount++

    if (restartCount > 5) {
      console.log('Fuku Client: Error Your System Crash.')
      return
    }

    setTimeout(() => {
      console.log('🔄 Restarting...')
      start(file)
    }, 2000)
  })

  if (!rl.listenerCount()) {
    rl.on('line', line => {
      p.emit('message', line.trim())
    })
  }
}

start('run.js')