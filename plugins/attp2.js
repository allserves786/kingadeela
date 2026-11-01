const { cmd } = require('../command')
const axios = require('axios')

cmd({
    pattern: "attp2",
    alias: ["textsticker", "animsticker"],
    desc: "Create animated text sticker",
    category: "tools",
    react: "✨",
    filename: __filename
}, async (conn, mek, m, { from, reply, sender, q }) => {
    try {
        if (!q) return reply("❌ *Please provide text*\nExample: `.attp Hello`")

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } })

        const text = q.trim()
        const apiUrl = `https://api.agatz.xyz/api/attp?text=${encodeURIComponent(text)}`

        const { data } = await axios.get(apiUrl, { responseType: 'arraybuffer' })

        await conn.sendMessage(from, {
            sticker: Buffer.from(data),
        }, { quoted: mek })

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } })

    } catch (err) {
        console.error(err)
        reply("❌ *Failed to create ATTP sticker*")
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } })
    }
})
