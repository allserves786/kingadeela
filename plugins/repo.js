// plugins/repo.js — Ghost-MD
const { cmd } = require('../command');

cmd({
  pattern: 'repo',
  alias: ['repository', 'botlink'],
  react: '🌐',
  desc: 'Bot website / repo link',
  category: 'main',
  filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
  try {
    const link = 'https://ghostxd.site';

    const text =
`*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*
*┇•* 🌐 *𝐆ʜᴏsᴛ - xᴅ ʙᴏᴛ ʟɪɴᴋ*
*┇•* 💀 *ʙᴏᴛ: 𝐆ʜᴏsᴛ-𝐌ᴅ💀🚩*
*┇•* 👤 *ᴏᴡɴᴇʀ: ᴛᴇᴀᴍ ᴢᴇᴇ*
*┇•* 🔗 *ʟɪɴᴋ: ${link}*
*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*

*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*
*┇•* *_ᴛᴀᴘ ᴛʜᴇ ʟɪɴᴋ ᴛᴏ ᴏᴘᴇɴ_*
*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*`;

    await conn.sendMessage(
      from,
      {
        text,
        contextInfo: {
          mentionedJid: [sender],
          externalAdReply: {
            title: 'Ghost-MD Bot',
            body: 'Open official page',
            mediaType: 1,
            sourceUrl: link,
            renderLargerThumbnail: false
          }
        }
      },
      { quoted: mek }
    );
  } catch (e) {
    console.error('[REPO] ERROR:', e);
    reply(`❌ *An error occurred*\n\n_${e.message || e}_`);
  }
});
