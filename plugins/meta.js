import fs from "fs"

let handler = async (m, { fukusima }) => {

  await fukusima.sendMessage(m.chat, { react: { text: "🕕", key: m.key } })

  await fukusima.sendTable(
    m.chat,
    "Java vs JavaScript",
    ["Feature", "Java", "JavaScript"],
    [
      ["Type", "Compiled", "Interpreted"],
      ["Typing", "Static", "Dynamic"],
      ["Main Use Cases", "Enterprise apps, Android", "Web dev, Full-stack"]
    ],
    m,
    {
      headerText: "Alright, let me create a comparison table between Java and JavaScript.\n\nEven though their names are super similar, they're actually quite different. Here's a quick comparison table:",
      footer: "Hope this helps!"
    }
  )

}

handler.help = ["meta"]
handler.tags = ["main"]
handler.command = ["meta"]
handler.owner = true

export default handler