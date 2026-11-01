const { cmd } = require('../command');
const axios = require('axios');

const API = 'https://adeel-api-f6e4b06d1510.herokuapp.com/api/chreact';
const LINK_RE = /https?:\/\/(?:www\.)?whatsapp\.com\/channel\/[A-Za-z0-9_-]+\/\d+/i;

cmd({
  pattern: 'chreact',
  alias: ['channelreact', 'creact', 'rp'],
  desc: 'React on channel post',
  category: 'owner',
  react: '📢',
  filename: __filename
}, async (conn, mek, m, { q, reply, react, isOwner, isCreator }) => {
  if (!isOwner && !isCreator) {
    return reply('*❌ Only the owner can use this command!*');
  }

  const text = String(q || '').trim();
  const quoted = m.quoted && (m.quoted.body || m.quoted.text || '');
  const link = (text.match(LINK_RE) || String(quoted).match(LINK_RE) || [])[0];

  if (!link) {
    return reply(
      'Usage:\n' +
      '.chreact <channel post link>\n\n' +
      'Example:\n' +
      '.chreact https://whatsapp.com/channel/XXXX/123'
    );
  }

  try {
    try { await react('⏳'); } catch (_) {}

    const { data } = await axios.get(API, {
      params: { url: link },
      timeout: 20000,
      validateStatus: () => true
    });

    if (!data?.status) {
      try { await react('❌'); } catch (_) {}
      return reply('❌ ' + (data?.message || 'Failed to send reactions'));
    }

    try { await react('✅'); } catch (_) {}
    return reply(
      '✅ Reactions sent successful\n\n' +
      '> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ǫᴀᴅᴇᴇʀ xᴅ ⚡*'
    );
  } catch (e) {
    console.error('[CHREACT]', e.message);
    try { await react('❌'); } catch (_) {}
    return reply('❌ Error. Try again.');
  }
});
