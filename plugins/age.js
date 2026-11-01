const { cmd } = require('../command');

cmd({
    pattern: "age",
    alias: ["agecalc"],
    desc: "Calculate age from birth date",
    category: "tools",
    react: "🎂",
    filename: __filename
},
async (conn, mek, m, { from, reply, sender, q }) => {
    try {
        if (!q) return reply(`*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*\n*│*  ᴜsᴀɢᴇ: .age 15/08/2005\n*│*  ғᴏʀᴍᴀᴛ: DD/MM/YYYY\n*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*`);

        const parts = q.split("/");
        if (parts.length !== 3) return reply(`*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*\n*│*  ᴄᴏʀʀᴇᴄᴛ ғᴏʀᴍᴀᴛ: DD/MM/YYYY\n*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*`);

        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const year = parseInt(parts[2]);

        const birthDate = new Date(year, month, day);
        const today = new Date();

        if (isNaN(birthDate.getTime())) {
            return reply(`*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*\n*│*  ɪɴᴠᴀʟɪᴅ ᴅᴀᴛᴇ\n*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*`);
        }

        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        const caption = `*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*
*│*  ᴀɢᴇ ᴄᴀʟᴄᴜʟᴀᴛᴏʀ
*│*  ━━━━━━━━━━━━━━━
*│*  ʙɪʀᴛʜ ᴅᴀᴛᴇ : ${q}
*│*  ʏᴏᴜʀ ᴀɢᴇ   : *${age} ʏᴇᴀʀs*
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
        reply(`*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*\n*│*  ᴇʀʀᴏʀ ᴄᴀʟᴄᴜʟᴀᴛɪɴɢ ᴀɢᴇ\n*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*`);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});