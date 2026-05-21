import axios from "axios"

let handler = async (m, { text, fukusima }) => {
  let user = global.db.data.users[m.sender]
  

  if (!text) return m.reply("format: .order kode|nomor")

  let [kodeNgaco, nomorTujuan] = text.split("|")
  if (!kodeNgaco || !nomorTujuan) return m.reply("format salah, jangan asal ngetik")

  let keySakti = "8B1hLF2EdWV9AvR3KZAzIFQljKgWUGS0WWjaRJ9K5IIe1JawkQNq90X7KVD2gA9t"
  let signJadi = "6353843c64d39649b484709436f5f663"

  try {

    // ambil produk
    let badanRandom = new URLSearchParams()
    badanRandom.append("key", keySakti)
    badanRandom.append("sign", signJadi)
    badanRandom.append("type", "services")

    let { data } = await axios.post(
      "https://vip-reseller.co.id/api/prepaid",
      badanRandom.toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    )

    let produkKepilih = data.data.find(x => x.code.toLowerCase() === kodeNgaco.toLowerCase())

    if (!produkKepilih) return m.reply("kode kagak ada, jangan sotoy")

    let hargaAsli = produkKepilih.price.special

    // bikin pembayaran
    let { data: bayar } = await axios.get(`https://api.fukugpt.my.id/api/pakasirtrx?harga=${hargaAsli}&api=fukuxyz_7ca5a1`)

    let hasil = bayar.result
    let idOrderNgawur = hasil.order_id

    let qr = `https://larabert-qrgen.hf.space/v1/create-qr-code?size=500x500&data=${encodeURIComponent(hasil.payment_number)}`

    await fukusima.sendMessage(m.chat, {
      image: { url: qr },
      caption: `💸 ᴘᴇᴍʙᴀʏᴀʀᴀɴ

ᴘʀᴏᴅᴜᴋ: ${produkKepilih.name}
ʜᴀʀɢᴀ: Rp${hargaAsli}
ᴛᴏᴛᴀʟ: Rp${hasil.total_payment}

ɪᴅ: ${idOrderNgawur}

ʙᴀʏᴀʀ ᴅᴜʟᴜ ʏᴀ, ʙᴏᴛ ɴᴏɴɢᴏɴɢɪɴ`,
    }, { quoted: m })

    // ================= AUTO CEK =================
    let hitungNapas = 0

    let intervalNgopi = setInterval(async () => {
  try {

    hitungNapas++

    let { data: cek } = await axios.get(`https://api.fukugpt.my.id/api/pakasirstatus?harga=${hargaAsli}&order_id=${idOrderNgawur}&api=fukuxyz_7ca5a1`)

    let res = cek?.transaction

    if (!res) return

    let status = res.status

    if (status === "success") {
      clearInterval(intervalNgopi)

      let badanOrder = new URLSearchParams()
      badanOrder.append("key", keySakti)
      badanOrder.append("sign", signJadi)
      badanOrder.append("type", "order")
      badanOrder.append("service", produkKepilih.code)
      badanOrder.append("data_no", nomorTujuan)

      let { data: gas } = await axios.post(
        "https://vip-reseller.co.id/api/prepaid",
        badanOrder.toString(),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      )

      return m.reply(`🔥 ᴏʀᴅᴇʀ ʙᴇʀʜᴀsɪʟ

ᴘʀᴏᴅᴜᴋ: ${produkKepilih.name}
ɴᴏᴍᴏʀ: ${nomorTujuan}
sᴛᴀᴛᴜs: ${gas.data.status}
ᴛʀx: ${gas.data.trxid}`)
    }

    if (hitungNapas >= 24) {
      clearInterval(intervalNgopi)
      return m.reply("⏰ pembayaran expired / belum dibayar")
    }

  } catch (err) {
    clearInterval(intervalNgopi)
    m.reply("error cek: " + err.message)
  }
}, 5000)
    
  } catch (e) {
    m.reply("error: " + e.message)
  }
}

handler.command = /^pulsa$/i
export default handler