const { cmd } = require('../command');

cmd({
    pattern: "binary",
    alias: ["bin"],
    desc: "Text to Binary / Binary to Text",
    category: "tools",
    react: "💻",
    filename: __filename
},
async (conn, mek, m, { from, reply, sender, q }) => {
    try {
        if (!q) return reply(`*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*\n*│*  ᴜsᴀɢᴇ:\n*│*  .binary encode Hello\n*│*  .binary decode 01001000...\n*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*`);

        const args = q.trim().split(" ");
        const action = args[0].toLowerCase();
        const text = args.slice(1).join(" ");

        if (!text || (action !== "encode" && action !== "decode")) {
            return reply(`*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*\n*│*  ᴜsᴇ: .binary encode/decode your text\n*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*`);
        }

        let result;
        if (action === "encode") {
            result = text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
        } else {
            result = text.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
        }

        const caption = `*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*
*│*  ʙɪɴᴀʀʏ ${action.toUpperCase()}
*│*  ━━━━━━━━━━━━━━━
*│*  ɪɴᴘᴜᴛ  : ${text.length > 40 ? text.slice(0, 40) + "..." : text}
*│*  ʀᴇsᴜʟᴛ : *${result}*
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
        reply(`*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*\n*│*  ɪɴᴠᴀʟɪᴅ ɪɴᴘᴜᴛ\n*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*`);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});