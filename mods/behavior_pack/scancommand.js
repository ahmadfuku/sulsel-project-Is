import fs from "fs"
import path from "path"

export async function scanCommand(commandName = "") {

  const folder = "./plugins"
  let results = []
  let scannedFiles = 0

  function scanDir(dir) {
    const items = fs.readdirSync(dir)

    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        scanDir(fullPath)
        continue
      }

      if (!item.endsWith(".js")) continue

      scannedFiles++

      const content = fs.readFileSync(fullPath, "utf8")
      const lines = content.split("\n")

      lines.forEach((line, index) => {

        if (line.includes("handler.command") && line.includes(commandName)) {

          results.push({
            file: item,
            folder: dir,
            line: index + 1
          })

        }

      })

    }
  }

  scanDir(folder)

  return {
    scannedFiles,
    totalFound: results.length,
    results
  }
}