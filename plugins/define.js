const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "define",
    alias: ["dict", "dictionary"],
    desc: "Get word meaning",
    category: "tools",
    react: "📖",
    filename: __filename
},
async (conn, mek, m, { from, reply, sender, q }) => {
    try {
        if (!q) return reply(`*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*\n*│*  ᴜsᴀɢᴇ: .define hello\n*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*`);

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        const { data } = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(q)}`, {
            timeout: 10000
        });

        const word = data[0];
        const meaning = word.meanings[0];
        const definition = meaning.definitions[0].definition;
        const example = meaning.definitions[0].example || "No example available";
        const partOfSpeech = meaning.partOfSpeech;

        const caption = `*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*
*│*  ᴅɪᴄᴛɪᴏɴᴀʀʏ
*│*  ━━━━━━━━━━━━━━━
*│*  ᴡᴏʀᴅ     : *${word.word}*
*│*  ᴛʏᴘᴇ     : ${partOfSpeech}
*│*  ᴍᴇᴀɴɪɴɢ  : ${definition}
*│*  ᴇxᴀᴍᴘʟᴇ  : ${example}
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
        reply(`*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*\n*│*  ᴡᴏʀᴅ ɴᴏᴛ ғᴏᴜɴᴅ\n*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*`);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});