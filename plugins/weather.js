const { cmd } = require('../command')
const axios = require('axios')

cmd({
    pattern: "wthr",
    alias: ["weather", "mosam", "climate"],
    desc: "Get detailed weather information",
    category: "tools",
    react: "🌤️",
    filename: __filename
}, async (conn, mek, m, { from, reply, sender, q }) => {
    try {
        if (!q) return reply("❌ *Please provide a city name*\nExample: `.wthr Lahore`")

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } })

        const city = q.trim()
        const { data } = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`)

        const current = data.current_condition[0]
        const location = data.nearest_area[0]

        const caption = `*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*
*┇•* 🌤️ *𝐖ᴇᴀᴛʜᴇʀ ɪɴғᴏ*
*┇•* 📍 *${location.areaName[0].value}, ${location.region[0].value}*
*┇•* 🌍 *${location.country[0].value}*
*┇•* 🌡️ *ᴛᴇᴍᴘ: ${current.temp_C}°C*
*┇•* 🥵 *ғᴇᴇʟꜱ: ${current.FeelsLikeC}°C*
*┇•* ☁️ *${current.weatherDesc[0].value}*
*┇•* 💧 *ʜᴜᴍɪᴅɪᴛʏ: ${current.humidity}%*
*┇•* 💨 *ᴡɪɴᴅ: ${current.windspeedKmph} ᴋᴍ/ʜ*
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
        reply("❌ *City not found*")
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } })
    }
})
