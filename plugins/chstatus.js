// plugins/chstatus.js — Channel pe post / status lagao (link ya jid se)
const { cmd } = require('../command');
const config = require('../config');

let downloadMediaMessage;
try {
    ({ downloadMediaMessage } = require('@whiskeysockets/baileys'));
} catch (e) {}

// Link ya jid se channel ka JID nikalta hai
async function resolveChannelJid(conn, input) {
    const raw = input.trim();

    // Seedha JID
    if (/^\d+@newsletter$/.test(raw)) return { jid: raw, name: null };

    // Channel link
    const code = raw.match(/whatsapp\.com\/channel\/([A-Za-z0-9_-]+)/i)?.[1];
    if (!code) throw new Error('Invalid channel link ya jid');

    const meta = await conn.newsletterMetadata('invite', code);
    if (!meta?.id) throw new Error('Channel nahi mila');
    return { jid: meta.id, name: meta.name || meta.thread_metadata?.name?.text || null };
}

// Quoted message se media download
async function getQuotedBuffer(conn, m) {
    const qm = m.quoted;
    if (!qm) return null;
    if (typeof qm.download === 'function') return await qm.download();
    if (downloadMediaMessage) {
        return await downloadMediaMessage(
            qm.fakeObj || { key: qm.key, message: qm.message },
            'buffer',
            {},
            { reuploadRequest: conn.updateMediaMessage }
        );
    }
    return null;
}

cmd({
    pattern: "chstatus",
    alias: ["chpost", "channelstatus", "chupdate"],
    desc: "Channel pe status/post lagao (link ya jid se)",
    category: "owner",
    react: "📢",
    filename: __filename
}, async (conn, mek, m, { from, args, reply, isOwner }) => {
    try {
        const prefix = config.PREFIX || '.';

        if (isOwner === false) {
            return reply("❌ *Ye command sirf owner ke liye hai*");
        }

        if (!args.length) {
            return reply(
`❌ *Please provide a channel link or jid*
Example:
${prefix}chstatus https://whatsapp.com/channel/xxxx Hello everyone
${prefix}chstatus 120363xxxxxxxxxx@newsletter Hello everyone

📌 *Photo / video / audio ke liye us par reply karke:*
${prefix}chstatus <link ya jid> caption`);
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        await reply("⏳ *ꜱᴇᴀʀᴄʜɪɴɢ ᴄʜᴀɴɴᴇʟ, ᴘʟᴇᴀꜱᴇ ᴡᴀɪᴛ...*");

        // ─── Channel resolve ────────────────────────────────────
        const { jid, name } = await resolveChannelJid(conn, args[0]);
        const text = args.slice(1).join(' ').trim();

        // ─── Content decide ─────────────────────────────────────
        const qm = m.quoted;
        const qType = String(qm?.mtype || qm?.type || '');
        const qMime = String(qm?.mimetype || qm?.msg?.mimetype || '');

        let kind = 'text';
        if (qm) {
            if (/image/i.test(qType) || qMime.startsWith('image/')) kind = 'image';
            else if (/video/i.test(qType) || qMime.startsWith('video/')) kind = 'video';
            else if (/audio/i.test(qType) || qMime.startsWith('audio/')) kind = 'audio';
        }

        await reply("⬆️ *ᴘᴏsᴛɪɴɢ ᴏɴ ᴄʜᴀɴɴᴇʟ, ᴘʟᴇᴀꜱᴇ ᴡᴀɪᴛ...*");

        let content;
        if (kind === 'text') {
            const body = text || qm?.text || qm?.body || '';
            if (!body) {
                return reply("❌ *Post ke liye text likho ya kisi photo/video/audio par reply karo*");
            }
            content = { text: body };
        } else {
            const buffer = await getQuotedBuffer(conn, m);
            if (!buffer) throw new Error('Media download nahi ho saka');

            if (kind === 'image') content = { image: buffer, caption: text };
            else if (kind === 'video') content = { video: buffer, caption: text, mimetype: 'video/mp4' };
            else content = { audio: buffer, mimetype: qMime || 'audio/mpeg', ptt: false };
        }

        await conn.sendMessage(jid, content);

        // ─── Confirmation ──────────────────────────────────────
        const typeLabel = { text: 'ᴛᴇxᴛ', image: 'ɪᴍᴀɢᴇ', video: 'ᴠɪᴅᴇᴏ', audio: 'ᴀᴜᴅɪᴏ' }[kind];
        await reply(
`*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*
*┇•* 📢 *𝐆ʜᴏsᴛ - xᴅ ᴄʜᴀɴɴᴇʟ ᴘᴏsᴛ*
*┇•* 📡 *ᴄʜᴀɴɴᴇʟ: ${name || 'N/A'}*
*┇•* 🆔 *ᴊɪᴅ: ${jid}*
*┇•* 📦 *ᴛʏᴘᴇ: ${typeLabel}*
*┇•* ✅ *ꜱᴛᴀᴛᴜꜱ: ᴘᴏsᴛᴇᴅ*
*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*

*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*
*┇•* *_ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴛᴇᴀᴍ ᴢᴇᴇ_*
*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*`);

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (err) {
        console.error('[CHSTATUS] ERROR:', err);
        reply(`❌ *An error occurred while posting on channel*\n\n_${err.message || err}_\n\n📌 _Bot us channel ka owner/admin hona chahiye_`);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } }).catch(() => {});
    }
});
