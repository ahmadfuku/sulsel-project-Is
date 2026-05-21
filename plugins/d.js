import fetch from "node-fetch"

let handler = async (m, { fukusima }) => {
  try {
    if (!global.domain || !global.apikey) {
      return m.reply("❌ Domain / API key belum di set.")
    }

    if (!global.owner || !global.owner.length) {
      return m.reply("❌ Owner tidak ditemukan di config.")
    }

    await m.reply("📦 Memulai backup semua server...")

    // ==============================
    // AMBIL SEMUA SERVER (APPLICATION API)
    // ==============================
    let srvRes = await fetch(`${global.domain}/api/application/servers`, {
      headers: {
        "Authorization": "Bearer " + global.apikey,
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    })

    let srvData = await srvRes.json()

    if (!srvData.data || !srvData.data.length) {
      return m.reply("❌ Tidak ada server ditemukan.")
    }

    // ==============================
    // LOOP SEMUA SERVER
    // ==============================
    for (let server of srvData.data) {

      let serverIdentifier = server.attributes.identifier // WAJIB identifier
      let serverName = server.attributes.name

      await m.reply(`🔄 Backup server: ${serverName}`)

      try {
        // ==============================
        // AMBIL LIST FILE ROOT
        // ==============================
        let fileRes = await fetch(
          `${global.domain}/api/client/servers/${serverIdentifier}/files/list?directory=/`,
          {
            headers: {
              "Authorization": "Bearer " + global.apikey,
              "Accept": "application/json"
            }
          }
        )

        let fileData = await fileRes.json()

        if (!fileData.data) continue

        // ==============================
        // LOOP FILE SATU PER SATU
        // ==============================
        for (let file of fileData.data) {

          if (file.attributes.is_file !== true) continue

          let fileName = file.attributes.name

          try {
            // Ambil URL download
            let dlRes = await fetch(
              `${global.domain}/api/client/servers/${serverIdentifier}/files/download?file=/` + encodeURIComponent(fileName),
              {
                headers: {
                  "Authorization": "Bearer " + global.apikey,
                  "Accept": "application/json"
                }
              }
            )

            let dlData = await dlRes.json()

            if (!dlData.attributes?.url) {
              await m.reply("File not found")
              continue
            }

            // Download file
            let fileFetch = await fetch(dlData.attributes.url)

            if (!fileFetch.ok) {
              await m.reply("File not found")
              continue
            }

            let buffer = await fileFetch.buffer()

            // ==============================
            // KIRIM KE OWNER
            // ==============================
            for (let owner of global.owner) {
              let jid = owner[0] + "@s.whatsapp.net"

              await fukusima.sendMessage(jid, {
                document: buffer,
                fileName: `${serverName}-${fileName}`,
                mimetype: "application/octet-stream"
              })
            }

          } catch (err) {
            await m.reply("File not found")
            continue
          }
        }

      } catch (err) {
        continue
      }
    }

    m.reply("✅ Backup semua server selesai.")

  } catch (err) {
    console.log(err)
    m.reply("❌ Terjadi kesalahan saat backup.")
  }
}

handler.help = ["bksrv"]
handler.tags = ["owner"]
handler.command = /^bksrv$/i
handler.owner = true

export default handler