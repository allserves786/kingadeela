const { cmd } = require('../command');

cmd({
    pattern: "base64",
    alias: ["b64"],
    desc: "Encode or Decode Base64",
    category: "tools",
    react: "🔐",
    filename: __filename
},
async (conn, mek, m, { from, reply, sender, q }) => {
    try {
        if (!q) return reply(`*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*\n*│*  ᴜsᴀɢᴇ:\n*│*  .base64 encode Hello\n*│*  .base64 decode SGVsbG8=\n*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*`);

        const args = q.trim().split(" ");
        const action = args[0].toLowerCase();
        const text = args.slice(1).join(" ");

        if (!text || (action !== "encode" && action !== "decode")) {
            return reply(`*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*\n*│*  ᴜsᴇ: .base64 encode/decode your text\n*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*`);
        }

        let result;
        if (action === "encode") {
            result = Buffer.from(text).toString('base64');
        } else {
            result = Buffer.from(text, 'base64').toString('utf-8');
        }

        const caption = `*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*
*│*  ʙᴀsᴇ64 ${action.toUpperCase()}
*│*  ━━━━━━━━━━━━━━━
*│*  ɪɴᴘᴜᴛ  : ${text.length > 50 ? text.slice(0, 50) + "..." : text}
*│*  ʀᴇsᴜʟᴛ : *${result}*
*│*  
*│*  @${sender.split('@')[0]}
*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*
> _ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴛᴇᴀᴍ ᴢᴇᴇ_`;

        await conn.sendMessage(from, { text: caption, mentions: [sender] }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.log(e);
        reply(`*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*\n*│*  ɪɴᴠᴀʟɪᴅ ʙᴀsᴇ64 ᴏʀ ᴇʀʀᴏʀ\n*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*`);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});