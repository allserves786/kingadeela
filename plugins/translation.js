const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tr",
    alias: ["translate", "trt"],
    desc: "Translate text to any language",
    category: "tools",
    react: "🌐",
    filename: __filename
},
async (conn, mek, m, { from, reply, sender, q }) => {
    try {
        if (!q) return reply(`*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*\n*│*  ᴜsᴀɢᴇ: .tr hi Hello how are you\n*│*  ғɪʀsᴛ ʟᴀɴɢᴜᴀɢᴇ ᴄᴏᴅᴇ ᴛʜᴇɴ ᴛᴇxᴛ\n*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*`);

        const args = q.trim().split(" ");
        if (args.length < 2) return reply(`*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*\n*│*  ᴇxᴀᴍᴘʟᴇ: .tr hi Hello brother\n*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*`);

        const lang = args[0].toLowerCase();
        const text = args.slice(1).join(" ");

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        const { data } = await axios.get(`https://api.mymemory.translated.net/get?q=\( {encodeURIComponent(text)}&langpair=auto| \){lang}`, {
            timeout: 10000
        });

        const translated = data?.responseData?.translatedText || "Translation failed";

        const caption = `*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*
*│*  ᴛʀᴀɴsʟᴀᴛᴏʀ
*│*  ━━━━━━━━━━━━━━━
*│*  ᴛᴏ     : ${lang.toUpperCase()}
*│*  ᴏʀɪɢɪɴᴀʟ : ${text}
*│*  ʀᴇsᴜʟᴛ  : *${translated}*
*│*  
*│*  @${sender.split('@')[0]}
*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*
> _ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴛᴇᴀᴍ ᴢᴇᴇ_`;

        await conn.sendMessage(from, { text: caption, mentions: [sender] }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.log(e);
        reply(`*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*\n*│*  ᴛʀᴀɴsʟᴀᴛɪᴏɴ ғᴀɪʟᴇᴅ\n*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*`);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});