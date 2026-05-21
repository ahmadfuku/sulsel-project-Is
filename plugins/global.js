import path from 'path'
import fetch from 'node-fetch'

let handler = m => m
handler.all = async function (m, { __dirname }) {
    global.pathResolve = (p) => path.resolve(__dirname, p)

    if (global.thumb) {
        const res = await fetch(global.thumb)
        global.thumbnail = Buffer.from(await res.arrayBuffer())
    }
}

export default handler