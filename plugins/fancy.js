const { cmd } = require('../command')
const axios = require('axios')

cmd({
    pattern: "fancy",
    alias: ["font", "styletext", "fancytext"],
    desc: "Convert text into multiple fancy styles",
    category: "tools",
    react: "✨",
    filename: __filename
}, async (conn, mek, m, { from, reply, sender, q }) => {
    try {
        if (!q) return reply("❌ *Please provide text*\nExample: `.fancy Ghost MD`")

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } })

        const text = q.trim()
        const { data } = await axios.get(`https://api.agatz.xyz/api/fancytext?text=${encodeURIComponent(text)}`)

        if (!data || !data.result) return reply("❌ *Failed to generate fancy text*")

        let styles = data.result.map((item, i) => `*${i + 1}.* ${item.result}`).join("\n")

        const caption = `*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*
*┇•* ✨ *𝐅ᴀɴᴄʏ Tᴇxᴛ*
*┇•* 📝 *ɪɴᴘᴜᴛ: ${text}*
*┇•* 👤 *ᴜꜱᴇʀ: @${sender.split('@')[0]}*
*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*

${styles}

> _ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴛᴇᴀᴍ ᴢᴇᴇ_`

        await conn.sendMessage(from, {
            text: caption,
            mentions: [sender]
        }, { quoted: mek })

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } })

    } catch (err) {
        console.error(err)
        reply("❌ *Error generating fancy text*")
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } })
    }
})
