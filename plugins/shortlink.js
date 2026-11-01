const { cmd } = require('../command')
const axios = require('axios')

cmd({
    pattern: "short",
    alias: ["shorturl", "tinyurl", "shorten"],
    desc: "Shorten any long URL",
    category: "tools",
    react: "🔗",
    filename: __filename
}, async (conn, mek, m, { from, reply, sender, q }) => {
    try {
        if (!q) return reply("❌ *Please provide a URL*\nExample: `.short https://google.com`")

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } })

        const url = q.trim()
        const { data } = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`)

        const caption = `*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*
*┇•* 🔗 *𝐔ʀʟ Sʜᴏʀᴛᴇɴᴇʀ*
*┇•* 📎 *ᴏʀɪɢɪɴᴀʟ: ${url}*
*┇•* ✨ *ꜱʜᴏʀᴛ: ${data}*
*┇•* 👤 *ᴜꜱᴇʀ: @${sender.split('@')[0]}*
*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*

> _ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴛᴇᴀᴍ ᴢᴇᴇ_`

        await conn.sendMessage(from, {
            text: caption,
            mentions: [sender]
        }, { quoted: mek })

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } })

    } catch (err) {
        console.error(err)
        reply("❌ *Failed to shorten URL*")
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } })
    }
})
