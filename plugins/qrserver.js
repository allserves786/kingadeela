const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "qr",
    alias: ["qrcode"],
    desc: "Generate QR Code",
    category: "tools",
    react: "📱",
    filename: __filename
},
async (conn, mek, m, { from, reply, sender, q }) => {
    try {
        if (!q) return reply(`*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*\n*│*  ᴜsᴀɢᴇ: .qr Your text or link\n*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*`);

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(q)}`;

        const caption = `*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*
*│*  Qʀ ᴄᴏᴅᴇ ɢᴇɴᴇʀᴀᴛᴇᴅ
*│*  ━━━━━━━━━━━━━━━
*│*  ᴛᴇxᴛ : ${q.length > 40 ? q.slice(0, 40) + "..." : q}
*│*  
*│*  @${sender.split('@')[0]}
*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*
> _ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴛᴇᴀᴍ ᴢᴇᴇ_`;

        await conn.sendMessage(from, {
            image: { url: qrUrl },
            caption: caption,
            mentions: [sender]
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.log(e);
        reply(`*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*\n*│*  ғᴀɪʟᴇᴅ ᴛᴏ ɢᴇɴᴇʀᴀᴛᴇ Qʀ\n*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*`);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});