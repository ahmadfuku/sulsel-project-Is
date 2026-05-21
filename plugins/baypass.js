import puppeteer from "puppeteer"

let handler = async (m) => {

  try {

    m.reply("⏳ Mengambil Turnstile Token...")

    const browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox"
      ]
    })

    const page = await browser.newPage()

    await page.goto("https://image-editor.org", {
      waitUntil: "networkidle2"
    })

    await page.waitForSelector('[name="cf-turnstile-response"]', { timeout: 15000 })

    const token = await page.evaluate(() => {
      return document.querySelector('[name="cf-turnstile-response"]')?.value
    })

    await browser.close()

    if (!token) return m.reply("❌ Token tidak ditemukan")

    m.reply("✅ Token:\n\n" + token)

  } catch (err) {
    m.reply("❌ Error:\n" + err.message)
  }

}

handler.help = ["turnstile"]
handler.tags = ["tools"]
handler.command = ["turnstile"]

export default handler