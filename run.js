//process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
import './config.js';
import fetch from "node-fetch"
import { createRequire } from "module"; // Bring in the ability to create the 'require' method
import path, { join } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { platform } from 'process'
global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') { return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString() }; global.__dirname = function dirname(pathURL) { return path.dirname(global.__filename(pathURL, true)) }; global.__require = function require(dir = import.meta.url) { return createRequire(dir) }

import fs from 'fs';
import { spawn } from 'child_process';
import { tmpdir } from 'os';
import { format } from 'util';
import { makeWASocket, protoType, serialize } from './resource/simple.js';
import chalk from 'chalk';
import pino from 'pino';
import syntaxerror from 'syntax-error';
import { Low, JSONFile } from 'lowdb';

import {
  useMultiFileAuthState,
  Browsers,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  DisconnectReason
} from 'baileys'

protoType()
serialize()

const __dirname = global.__dirname(import.meta.url)

global.prefix = new RegExp('^[' + '‎xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-'.replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')
global.db = new Low(new JSONFile(`database.json`));

process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);

global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) return new Promise((resolve) => setInterval(async function () {
    if (!global.db.READ) {
      clearInterval(this)
      resolve(global.db.data == null ? global.loadDatabase() : global.db.data)
    }
  }, 1 * 1000))
  if (global.db.data !== null) return
  global.db.READ = true
  await global.db.read().catch(console.error)
  global.db.READ = null
  global.db.data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
    ...(global.db.data || {})
  }
}
loadDatabase()

const { state, saveCreds } = await useMultiFileAuthState('sessions')
const { version } = await fetchLatestBaileysVersion()

import { doyoukotoga } from "./resource/uploadTmpFiles.js"
let isAuthorized = false;


const connectionOptions = ({
    auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(
            state.keys,
            pino().child({ level: 'fatal', stream: 'store' })
        )
    },
    version,
    logger: pino({ level: 'silent' }),
    browser: Browsers.ubuntu('Edge'),
    generateHighQualityLinkPreview: true,
    syncFullHistory: false,
    shouldSyncHistoryMessage: () => true,
    markOnlineOnConnect: true,
    connectTimeoutMs: 60_000,
	keepAliveIntervalMs: 30_000,
	retryRequestDelayMs: 250,
	maxMsgRetryCount: 5
})

global.fukusima = makeWASocket(connectionOptions)
registerBaseSocketListeners()
isAuthorized = await doyoukotoga(global.fukusima, global.pairingNumber);

if (global.db) {
  setInterval(async () => {
    if (global.db.data) {
      await global.db.write().catch(console.error);
    }
    // if ((global.support || {}).find) {
    //   const tmp = [tmpdir(), 'tmp'];
    //   tmp.forEach(filename => spawn('find', [filename, '-amin', '3', '-type', 'f', '-delete']));
    // }
  }, 2000);
}

async function connectionUpdate(update) {
  const { receivedPendingNotifications, connection, lastDisconnect, isOnline, isNewLogin } = update;

  if (connection == 'connecting') {
    console.log(chalk.redBright('⚡ Mengaktifkan Bot, Mohon tunggu sebentar...'));
  } else if (connection == 'open') {
    await startRuntime();
    console.log(chalk.green('✅ Tersambung'));
  }

  if (isOnline == true) {
    console.log(chalk.green('Status Aktif'));
  } else if (isOnline == false) {
    console.log(chalk.red('Status Mati'));
  }

  if (receivedPendingNotifications) {
    console.log(chalk.yellow('Menunggu Pesan Baru'));
  }

  if (connection == 'close') {
    console.log(chalk.red('⏱️ Koneksi terputus & mencoba menyambung ulang...'));
  }

  if (lastDisconnect && lastDisconnect.error && lastDisconnect.error.output && lastDisconnect.error.output.payload) {
    console.log(chalk.red(lastDisconnect.error.output.payload.message))
    const statusCode = lastDisconnect.error.output.statusCode;
    if (statusCode !== DisconnectReason.loggedOut && global.reloadHandler && fukusima.authState.creds.registered) {
      await global.reloadHandler(true);
    }
  }

  if (global.db.data == null) {
    await global.loadDatabase();
  }
}

process.on('uncaughtException', console.error)
// let strQuot = /(["'])(?:(?=(\\?))\2.)*?\1/

let isInit = true;
let handler = await import('./handler.js')
global.reloadHandler = async function (restatConn) {
  if (fukusima.connectionUpdate) fukusima.ev.off('connection.update', fukusima.connectionUpdate)
  if (fukusima.credsUpdate) fukusima.ev.off('creds.update', fukusima.credsUpdate)
  try {
    const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error)
    if (Object.keys(Handler || {}).length) handler = Handler
  } catch (e) {
    console.error(e)
  }
  if (restatConn) {
    const oldChats = global.fukusima.chats
    try { global.fukusima.ws.close() } catch { }
    fukusima.ev.removeAllListeners()
    global.fukusima = makeWASocket(connectionOptions, { chats: oldChats })
    isInit = true
  }
  if (!isInit) {
    fukusima.ev.off('messages.upsert', fukusima.handler)
    fukusima.ev.off('group-participants.update', fukusima.participantsUpdate)
    fukusima.ev.off('groups.update', fukusima.groupsUpdate)
    fukusima.ev.off('message.delete', fukusima.onDelete)
    fukusima.ev.off('connection.update', fukusima.connectionUpdate)
    fukusima.ev.off('creds.update', fukusima.credsUpdate)
  }

  fukusima.welcome = '✦━━━━━━[ *WELCOME* ]━━━━━━✦\n\n┏––––––━━━━━━━━•\n│⫹⫺ @subject\n┣━━━━━━━━┅┅┅\n│( 👋 Hallo @user)\n├[ *INTRO* ]—\n│ *Nama:* \n│ *Umur:* \n│ *Gender:*\n┗––––––━━┅┅┅\n\n––––––┅┅ *DESCRIPTION* ┅┅––––––\n@desc'
  fukusima.bye = '✦━━━━━━[ *GOOD BYE* ]━━━━━━✦\nSayonara *@user* 👋( ╹▽╹ )'
  fukusima.spromote = '@user sekarang admin!'
  fukusima.sdemote = '@user sekarang bukan admin!'
  fukusima.sDesc = 'Deskripsi telah diubah ke \n@desc'
  fukusima.sSubject = 'Judul grup telah diubah ke \n@subject'
  fukusima.sIcon = 'Icon grup telah diubah!'
  fukusima.sRevoke = 'Link group telah diubah ke \n@revoke'
  fukusima.handler = handler.handler.bind(global.fukusima)
  fukusima.participantsUpdate = handler.participantsUpdate.bind(global.fukusima)
  fukusima.groupsUpdate = handler.groupsUpdate.bind(global.fukusima)
  fukusima.onDelete = handler.deleteUpdate.bind(global.fukusima)
  fukusima.connectionUpdate = connectionUpdate.bind(global.fukusima)
  fukusima.credsUpdate = saveCreds.bind(global.fukusima)

  fukusima.ev.on('call', async (calls) => {
    for (const call of calls) {
      const { id, from, status } = call;
      const settings = global.db.data.settings[fukusima.user.jid]
      if (call.status === 'offer' && settings.anticall) {
        await fukusima.rejectCall(id, from);
        console.log('Menolak panggilan dari', from);
      }
    }
  })

  setInterval(async () => {
    let now = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
    let jam = now.split(' ')[1].slice(0, 5) // 21:00

    for (let id in global.db.data.chats) {
      let chat = global.db.data.chats[id]
      if (!chat.autogroup) continue // off → skip

      // TUTUP GRUP JAM 21:00
      if (jam === "21:00") {
        try {
          await fukusima.groupSettingUpdate(id, 'announcement')
          await fukusima.sendMessage(id, { text: '🔒 *Grup ditutup otomatis (21.00)*' })
        } catch { }
      }

      // BUKA GRUP JAM 04:00
      if (jam === "04:00") {
        try {
          await fukusima.groupSettingUpdate(id, 'not_announcement')
          await fukusima.sendMessage(id, { text: '🔓 *Grup dibuka otomatis (04.00)*' })
        } catch { }
      }
    }
  }, 60 * 1000) // cek tiap 1 menit

  fukusima.ev.on('messages.upsert', fukusima.handler)
  fukusima.ev.on('group-participants.update', fukusima.participantsUpdate)
  fukusima.ev.on('groups.update', fukusima.groupsUpdate)
  fukusima.ev.on('message.delete', fukusima.onDelete)
  fukusima.ev.on('connection.update', fukusima.connectionUpdate)
  fukusima.ev.on('creds.update', fukusima.credsUpdate)
  isInit = false
  return true
}

const pluginFolder = join(__dirname, 'plugins')
const pluginFilter = filename => /\.js$/.test(filename)
const nativeRiskPattern = /from\s+['"](?:canvas|@napi-rs\/canvas|sharp|canvacord)['"]|import\s+.*['"](?:canvas|@napi-rs\/canvas|sharp|canvacord)['"]/
global.plugins = {}

const walkSync = dir => {
  let results = []
  for (let item of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, item.name)
    if (item.isDirectory()) results = results.concat(walkSync(fullPath))
    else if (pluginFilter(item.name)) results.push(fullPath)
  }
  return results
}

async function filesInit() {
  for (let fullPath of walkSync(pluginFolder)) {
    const filename = path.relative(pluginFolder, fullPath).replace(/\\/g, '/')
    try {
      const source = fs.readFileSync(fullPath, 'utf8')
      if (nativeRiskPattern.test(source)) {
        console.log(chalk.yellow(`Skipped native plugin ${filename}`))
        continue
      }
      const file = global.__filename(fullPath)
      const module = await import(file)
      global.plugins[filename] = module.default || module
    } catch (e) {
      fukusima.logger.error(`Failed to load plugin ${fullPath}: ${e}`)
      delete global.plugins[filename]
    }
  }
}

let runtimeStarted = false
let pluginWatcher = null

function registerBaseSocketListeners() {
  if (fukusima.connectionUpdate) fukusima.ev.off('connection.update', fukusima.connectionUpdate)
  if (fukusima.credsUpdate) fukusima.ev.off('creds.update', fukusima.credsUpdate)

  fukusima.connectionUpdate = connectionUpdate.bind(global.fukusima)
  fukusima.credsUpdate = saveCreds.bind(global.fukusima)
  fukusima.ev.on('connection.update', fukusima.connectionUpdate)
  fukusima.ev.on('creds.update', fukusima.credsUpdate)
}

global.reload = async function reload(_event, filename) {
  if (!filename || !pluginFilter(filename)) return
  const fullPath = join(pluginFolder, filename)
  const pluginName = path.relative(pluginFolder, fullPath).replace(/\\/g, '/')

  try {
    if (fs.existsSync(fullPath)) {
      const source = fs.readFileSync(fullPath, 'utf8')
      if (nativeRiskPattern.test(source)) {
        delete global.plugins[pluginName]
        console.log(chalk.yellow(`Skipped native plugin ${pluginName}`))
        return
      }
      const file = global.__filename(fullPath)
      const module = await import(`${file}?update=${Date.now()}`)
      global.plugins[pluginName] = module.default || module
      console.log(chalk.green(`Reloaded plugin ${pluginName}`))
    } else {
      delete global.plugins[pluginName]
      console.log(chalk.yellow(`Removed plugin ${pluginName}`))
    }
  } catch (e) {
    fukusima.logger.error(`Failed to reload plugin ${pluginName}: ${e}`)
  }
}

async function startRuntime() {
  if (runtimeStarted || !fukusima.authState.creds.registered) return false
  runtimeStarted = true

  try {
    await filesInit()
    console.log(`Successfully Loaded ${Object.keys(global.plugins).length} Plugins`)

    if (!pluginWatcher) {
      pluginWatcher = fs.watch(pluginFolder, { recursive: true }, global.reload)
    }

    await global.reloadHandler()
    return true
  } catch (e) {
    runtimeStarted = false
    console.error(e)
    return false
  }
}


if (fukusima.authState.creds.registered) {
    await startRuntime()
} else {
    console.log(chalk.yellow('\n [!] Menunda loading plugin sampai proses pairing selesai...'));
}

async function _quickTest() {
  let test = await Promise.all([
    spawn('ffmpeg'),
    spawn('ffprobe'),
    spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
    spawn('convert'),
    spawn('magick'),
    spawn('gm'),
    // spawn('find', ['--version'])
  ].map(p => {
    return Promise.race([
      new Promise(resolve => {
        p.on('close', code => {
          resolve(code !== 127)
        })
      }),
      new Promise(resolve => {
        p.on('error', _ => resolve(false))
      })
    ])
  }))
  let [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test
  //console.log(test)
  let s = global.support = {
    ffmpeg,
    ffprobe,
    ffmpegWebp,
    convert,
    magick,
    gm,
    find
  }
  // require('./resource/sticker').support = s
  Object.freeze(global.support)

  if (!s.ffmpeg) fukusima.logger.warn('Please install ffmpeg for sending videos (pkg install ffmpeg)')
  if (s.ffmpeg && !s.ffmpegWebp) fukusima.logger.warn('Stickers may not animated without libwebp on ffmpeg (--enable-ibwebp while compiling ffmpeg)')
  if (!s.convert && !s.magick && !s.gm) fukusima.logger.warn('Stickers may not work without imagemagick if libwebp on ffmpeg doesnt isntalled (pkg install imagemagick)')
}

// _quickTest()
//   .then(() => fukusima.logger.info('☑️ Quick Test Done'))
//   .catch(console.error)
