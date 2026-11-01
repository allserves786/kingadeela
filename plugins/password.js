const { cmd } = require('../command');

cmd({
    pattern: "password",
    alias: ["pass", "genpass"],
    desc: "Generate strong password",
    category: "tools",
    react: "🔐",
    filename: __filename
},
async (conn, mek, m, { from, reply, sender, q }) => {
    try {
        let length = 12;
        if (q && !isNaN(q)) length = parseInt(q);
        if (length < 6) length = 6;
        if (length > 32) length = 32;

        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        let password = "";
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        const caption = `*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*
*│*  ᴘᴀssᴡᴏʀᴅ ɢᴇɴᴇʀᴀᴛᴏʀ
*│*  ━━━━━━━━━━━━━━━
*│*  ʟᴇɴɢᴛʜ   : ${length}
*│*  ᴘᴀssᴡᴏʀᴅ : *${password}*
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
        reply(`*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*\n*│*  ᴇʀʀᴏʀ ɢᴇɴᴇʀᴀᴛɪɴɢ ᴘᴀssᴡᴏʀᴅ\n*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*`);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});