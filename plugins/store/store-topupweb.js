import axios from "axios"
import QRCode from "qrcode"

const HARGA_PER_LIMIT = 30
const APIKEY_ADMIN = "doi"

let handler = async (m, { text }) => {
    if (!text) {
        return m.reply(
            `TOPUP FUKU API\n\n` +
            `Format:\n` +
            `.topupfuku email,limit\n\n` +
            `Contoh:\n` +
            `.topupfuku email@gmail.com,100\n\n` +
            `Harga: Rp${HARGA_PER_LIMIT} / limit`
        )
    }

    let [email, limitStr] = text.split(",")
    if (!email || !limitStr) return m.reply("Format salah")

    let limit = parseInt(limitStr)
    if (isNaN(limit) || limit <= 0) return m.reply("Jumlah limit tidak valid")

    const harga = limit * HARGA_PER_LIMIT

    try {
        let create = await axios.get(
            `https://www.fuku-api.my.id/api/gateaway?harga=${harga}`
        )

        if (!create.data.status) {
            return m.reply("Gagal membuat transaksi")
        }

        let { qr_string, transactionId, totalAmount, expiredAt } = create.data
        let qrBuffer = await QRCode.toBuffer(qr_string, { width: 400 })

        await m.reply(
            `PEMBAYARAN TOPUP FUKU\n\n` +
            `Email: ${email}\n` +
            `Limit: ${limit}\n` +
            `Harga: Rp${totalAmount}\n` +
            `Expired: ${new Date(expiredAt).toLocaleTimeString("id-ID")}\n\n` +
            `Silakan scan QR berikut`
        )

        await m.reply(qrBuffer, null, { mimetype: "image/png" })

        let cek = setInterval(async () => {
            try {
                let res = await axios.get(
                    `https://www.fuku-api.my.id/api/gatcheck?transactionId=${transactionId}`
                )

                let data = res.data
                if (data.status && data.paymentStatus === "paid") {
                    clearInterval(cek)

                    let topup = await axios.get(
                        `https://api.fukugpt.my.id/api/topupkey?email=${encodeURIComponent(email)}&limitkey=${limit}&apikeyAdmin=${APIKEY_ADMIN}`
                    )

                    if (!topup.data.status) {
                        return m.reply("Pembayaran berhasil, namun topup gagal")
                    }

                    await m.reply(
                        `TOPUP BERHASIL\n\n` +
                        `Email: ${email}\n` +
                        `Limit ditambah: ${topup.data.added}\n` +
                        `Sisa limit: ${topup.data.remaining}\n\n` +
                        `Silakan masuk web dan refresh halaman`
                    )
                }
            } catch (e) {
                console.error(e)
            }
        }, 5000)

        setTimeout(() => {
            clearInterval(cek)
            m.reply("Transaksi dibatalkan karena tidak dibayar")
        }, 15 * 60 * 1000)

    } catch (err) {
        console.error(err)
        m.reply("Terjadi kesalahan sistem")
    }
}

handler.help = ["topupfuku"]
handler.tags = ["store"]
handler.command = /^topupfuku$/i

export default handler