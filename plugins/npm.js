const { cmd } = require('../command')
const axios = require('axios')

cmd({
    pattern: "npm",
    alias: ["npmsearch", "package"],
    desc: "Search NPM packages",
    category: "tools",
    react: "📦",
    filename: __filename
}, async (conn, mek, m, { from, reply, sender, q }) => {
    try {
        if (!q) return reply("❌ *Please provide package name*\nExample: `.npm axios`")

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } })

        const { data } = await axios.get(`https://registry.npmjs.org/${encodeURIComponent(q.trim())}`)

        const latest = data["dist-tags"].latest
        const info = data.versions[latest]

        const caption = `*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*
*┇•* 📦 *𝐍ᴘᴍ Pᴀᴄᴋᴀɢᴇ*
*┇•* 📛 *ɴᴀᴍᴇ: ${data.name}*
*┇•* 📌 *ᴠᴇʀꜱɪᴏɴ: ${latest}*
*┇•* 📝 *ᴅᴇꜱᴄ: ${info.description || "No description"}*
*┇•* 👤 *ᴀᴜᴛʜᴏʀ: ${info.author?.name || "Unknown"}*
*┇•* 📅 *ʟɪᴄᴇɴꜱᴇ: ${info.license || "N/A"}*
*┇•* 🔗 *ɴᴘᴍ: https://www.npmjs.com/package/${data.name}*
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
        reply("❌ *Package not found*")
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } })
    }
})
