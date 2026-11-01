const { cmd } = require('../command');

cmd({
    pattern: "calc",
    alias: ["calculate", "math"],
    desc: "Simple calculator",
    category: "tools",
    react: "🧮",
    filename: __filename
},
async (conn, mek, m, { from, reply, sender, q }) => {
    try {
        if (!q) return reply(`*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*\n*│*  ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴇxᴘʀᴇssɪᴏɴ\n*│*  ᴇxᴀᴍᴘʟᴇ: .calc 25+35*2\n*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*`);

        // Safety: only allow numbers and basic operators
        if (!/^[0-9+\-*/().%\s]+$/.test(q)) {
            return reply(`*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*\n*│*  ᴏɴʟʏ ɴᴜᴍʙᴇʀs ᴀɴᴅ + - * / ( ) % ᴀʟʟᴏᴡᴇᴅ\n*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*`);
        }

        const result = Function('"use strict"; return (' + q + ')')();

        const caption = `*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*
*│*  ᴄᴀʟᴄᴜʟᴀᴛᴏʀ
*│*  ━━━━━━━━━━━━━━━
*│*  ᴇxᴘʀᴇssɪᴏɴ : ${q}
*│*  ʀᴇsᴜʟᴛ     : *${result}*
*│*  
*│*  @${sender.split('@')[0]}
*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*
> _ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴛᴇᴀᴍ ᴢᴇᴇ_`;

        await conn.sendMessage(from, { text: caption, mentions: [sender] }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.log(e);
        reply(`*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*\n*│*  ɪɴᴠᴀʟɪᴅ ᴇxᴘʀᴇssɪᴏɴ\n*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*`);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});