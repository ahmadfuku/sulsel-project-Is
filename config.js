import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

const pengaturanTambahan = {
  bot: {
    pairingNumber: "6285696573023",
    owner: [
      ['6281527100923', 'AhmadaXyz', true]
    ],
    mods: [],
    versi: "7.3.1",
    versioning: "Atualização dupla",
    namebot: "Fuku",
    author: "Ahmad",
    self: false
  },

  pesan: {
    wait: "Wait...",
    eror: "Terjadi kesalahan"
  },

  media: {
    thumb: "https://raw.githubusercontent.com/NdikzDatabase/Database/main/Database/1769755471949-b8a8sy.jpg",
    musikMenu: "https://uploader.fuku-cloud.my.id/uploader/b9d2e35e7be0.opus",
    qris: "https://cloud-fukushima.vercel.app/uploader/eijqtuogtb.jpg"
  },

  channel: {
    chid: "120363392230713530@newsletter"
  },

  panel: {
    egg: "15",
    nestid: "5",
    loc: "1",
    domain: "-",
    apikey: "ptla_xxxxxRqOFD",
    capikey: "ptlc_xxxTxAuF"
  },

  api: {
    apifuku: "fukuxyz_xxxx",
    vno: "v1",
    nokosApi: "-",
    doToken: "-",
    pakasirKey: "-"
  },

  akses: {
    aksesKey: "adminku"
  },

  token: {
    linodeToken: "TOKEN",
    githubToken: "TOKEN",
    githubUser: "NAME"
  },

  payment: {
    dana: "089xxxxxxxx",
    ovo: "089xxxxxxxx",
    gopay: "089xxxxxxxx",
    bca: "123456789 - A/N Store",
    bri: "123456789 - A/N Store",
    mandiri: "123456789 - A/N Store"
  },

  sticker: {
    stickpack: "ʙʏ ᴀʜᴍᴀᴅxʏᴢ",
    stickauth: "ʟʙᴋ ғᴜᴋᴜ ғᴀᴍɪʟʟʏ"
  },

  game: {
    multiplier: 38,
    varian: 15
  }

}

Object.assign(global, {
  ...pengaturanTambahan.bot,
  ...pengaturanTambahan.pesan,
  ...pengaturanTambahan.media,
  ...pengaturanTambahan.channel,
  ...pengaturanTambahan.panel,
  ...pengaturanTambahan.api,
  ...pengaturanTambahan.akses,
  ...pengaturanTambahan.token,
  ...pengaturanTambahan.payment,
  ...pengaturanTambahan.sticker,
  ...pengaturanTambahan.game
})

global.re = async (m, emoji = "🐦") => {
  await fukusima.sendMessage(m.chat, {
    react: {
      text: emoji,
      key: m.key
    }
  })
}

global.rpg = {
  emoticon(string) {

    string = string.toLowerCase()

    let emot = {
      level: '📊',
      limit: '🎫',
      health: '❤️',
      stamina: '🔋',
      exp: '✨',
      money: '💹',
      bank: '🏦',
      potion: '🥤',
      diamond: '💎',
      common: '📦',
      uncommon: '🛍️',
      mythic: '🎁',
      legendary: '🗃️',
      superior: '💼',
      pet: '🔖',
      trash: '🗑',
      armor: '🥼',
      sword: '⚔️',
      pickaxe: '⛏️',
      fishingrod: '🎣',
      wood: '🪵',
      rock: '🪨',
      string: '🕸️',
      horse: '🐴',
      cat: '🐱',
      dog: '🐶',
      fox: '🦊',
      petFood: '🍖',
      iron: '⛓️',
      gold: '🪙',
      emerald: '❇️',
      upgrader: '🧰'
    }

    let hasil = Object.keys(emot)
      .map(v => [v, new RegExp(v, 'gi')])
      .filter(v => v[1].test(string))

    if (!hasil.length) return ''

    return emot[hasil[0][0]]
  }
}

let file = fileURLToPath(import.meta.url)

watchFile(file, () => {
  unwatchFile(file)
  console.log(
    chalk.black.bgGreenBright(" CONFIG UPDATE "),
    chalk.white("config.js berhasil diperbarui")
  )
  import(`${file}?update=${Date.now()}`)
})