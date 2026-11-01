const { cmd } = require('../command');
const crypto = require('crypto');

cmd({
    pattern: "uuid",
    alias: ["guid"],
    desc: "Generate random UUID",
    category: "tools",
    react: "🆔",
    filename: __filename
},
async (conn, mek, m, { from, reply, sender }) => {
    try {
        const uuid = crypto.randomUUID();

        const caption = `*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*
*│*  ᴜᴜɪᴅ ɢᴇɴᴇʀᴀᴛᴏʀ
*│*  ━━━━━━━━━━━━━━━
*│*  ᴜᴜɪᴅ : *${uuid}*
*│*  
*│*  @${sender.split('@')[0]}
*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*
> _ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴛᴇᴀᴍ ᴢᴇᴇ_`;

        await conn.sendMessage(from, {
            text: caption,
            mentions: [sender],
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363404811118873@newsletter",
                    newsletterName: "🌟 𝐆𝐇𝐎𝐒𝐓 𝐌𝐃",
                    serverMessageId: 999
                }
            }
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.log(e);
        reply(`*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*\n*│*  ᴇʀʀᴏʀ\n*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*`);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});