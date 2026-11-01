const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "github",
    alias: ["gh", "git"],
    desc: "Get GitHub user info",
    category: "tools",
    react: "🐙",
    filename: __filename
},
async (conn, mek, m, { from, reply, sender, q }) => {
    try {
        if (!q) return reply(`*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*\n*│*  ᴜsᴀɢᴇ: .github username\n*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*`);

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        const { data } = await axios.get(`https://api.github.com/users/${q}`, { timeout: 10000 });

        const caption = `*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*
*│*  ɢɪᴛʜᴜʙ ᴜsᴇʀ
*│*  ━━━━━━━━━━━━━━━
*│*  ɴᴀᴍᴇ      : ${data.name || "N/A"}
*│*  ᴜsᴇʀɴᴀᴍᴇ  : ${data.login}
*│*  ʙɪᴏ       : ${data.bio || "No bio"}
*│*  ʀᴇᴘᴏs     : ${data.public_repos}
*│*  ғᴏʟʟᴏᴡᴇʀs : ${data.followers}
*│*  ғᴏʟʟᴏᴡɪɴɢ : ${data.following}
*│*  ʟᴏᴄᴀᴛɪᴏɴ  : ${data.location || "N/A"}
*│*  
*│*  @${sender.split('@')[0]}
*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*
> _ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴛᴇᴀᴍ ᴢᴇᴇ_`;

        await conn.sendMessage(from, {
            image: { url: data.avatar_url },
            caption: caption,
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
        reply(`*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*\n*│*  ᴜsᴇʀ ɴᴏᴛ ғᴏᴜɴᴅ\n*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*`);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});