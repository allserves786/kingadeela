const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "joke",
    alias: ["jokes"],
    desc: "Get a random joke",
    category: "tools",
    react: "😂",
    filename: __filename
},
async (conn, mek, m, { from, reply, sender }) => {
    try {
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        const { data } = await axios.get('https://official-joke-api.appspot.com/random_joke', {
            timeout: 8000
        });

        const caption = `*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*
*│*  ʀᴀɴᴅᴏᴍ ᴊᴏᴋᴇ
*│*  ━━━━━━━━━━━━━━━
*│*  ${data.setup}
*│*  
*│*  *${data.punchline}*
*│*  
*│*  @${sender.split('@')[0]}
*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*
> _ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴛᴇᴀᴍ ᴢᴇᴇ_`;

        await conn.sendMessage(from, { text: caption, mentions: [sender] }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.log(e);
        reply(`*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*\n*│*  ᴊᴏᴋᴇ ɴᴏᴛ ғᴏᴜɴᴅ\n*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*`);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});