// plugins/channelvote.js
// ǫᴀᴅᴇᴇʀ xᴅ WhatsApp Channel Vote (𝐆ʜᴏsᴛ-𝐌ᴅ Version)

const { cmd } = require('../command');
const config = require('../config');
const axios = require('axios');

// Safely import proxy agents so the command doesn't crash if they are not installed
let HttpsProxyAgent, SocksProxyAgent;
try {
    HttpsProxyAgent = require('https-proxy-agent').HttpsProxyAgent;
    SocksProxyAgent = require('socks-proxy-agent').SocksProxyAgent;
} catch (e) {
    console.warn('[channelvote] Proxy packages not installed. Run: npm i https-proxy-agent socks-proxy-agent');
}

// ⚡ Creator name in Small Caps
const CREATOR = 'ǫᴀᴅᴇᴇʀ xᴅ';
const CHANNEL_URL = 'https://whatsapp.com/channel/0029VbAkAEhCRs1g8MmyEJ2K';
const BASE_URL = 'https://pollchbyjiyyad-21.vercel.app';

let proxyPool = [];
let proxyIndex = 0;
let lastProxyFetch = 0;

// ── Helper: Stylish Box for WhatsApp ──
function box(lines) {
    return `‎*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*\n` +
        lines.map(l => `‎*┇•* ${l}`).join('\n') +
        `\n‎*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*`;
}

async function fetchProxies() {
    if (!HttpsProxyAgent || !SocksProxyAgent) return []; // Skip if deps missing

    const now = Date.now();
    if (proxyPool.length > 0 && (now - lastProxyFetch) < 300000) {
        return proxyPool;
    }
    const pool = [];
    try {
        const res = await axios.get('https://api.ikyyxd.my.id/v2l/proxy-free/ikyy-xsample', { timeout: 8000 });
        if (Array.isArray(res.data)) {
            res.data.forEach((p) => {
                if (typeof p === 'string' && p.includes(':')) {
                    const parts = p.trim().split(':');
                    if (parts.length >= 4) {
                        pool.push({ type: 'http', url: `http://${parts[2]}:${parts[3]}@${parts[0]}:${parts[1]}` });
                    }
                }
            });
        }
    } catch (_) {}

    if (pool.length < 5) {
        try {
            const res = await axios.get('https://api.proxyscrape.com/v4/free-proxy-list/get?request=display_proxies&proxy_format=protocolipport&format=text&protocol=socks5&timeout=5000', { timeout: 8000 });
            if (typeof res.data === 'string') {
                res.data.split('\n').forEach((line) => {
                    const clean = line.trim();
                    if (clean.startsWith('socks5://')) {
                        pool.push({ type: 'socks5', url: clean });
                    }
                });
            }
        } catch (_) {}
    }

    if (pool.length > 0) {
        proxyPool = pool;
        lastProxyFetch = now;
    }
    return proxyPool;
}

function getNextProxyAgent() {
    if (!proxyPool.length) return null;
    const item = proxyPool[proxyIndex % proxyPool.length];
    proxyIndex++;
    if (item.type === 'socks5') return new SocksProxyAgent(item.url);
    return new HttpsProxyAgent(item.url);
}

function formatResult(startTime, data) {
    return { Creator: CREATOR, Channel: CHANNEL_URL, time: `${Date.now() - startTime}ms`, status: true, ...data };
}

function formatError(startTime, err) {
    let msg = (err && err.message) ? err.message : String(err);
    if (err && err.response && err.response.data) {
        const d = err.response.data;
        if (typeof d === 'string') msg = d;
        else if (d.error) msg = d.error;
        else if (d.message) msg = d.message;
    }
    return { Creator: CREATOR, Channel: CHANNEL_URL, time: `${Date.now() - startTime}ms`, status: false, error: msg };
}

async function apiRequest(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    const method = (options.method || 'GET').toUpperCase();
    const data = options.data || undefined;
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Origin': BASE_URL,
        'Referer': `${BASE_URL}/`,
        ...(options.headers || {})
    };

    let attempt = 0;
    const maxAttempts = options.forceProxy ? 4 : 3;
    let lastError = null;

    while (attempt < maxAttempts) {
        attempt++;
        let agent = null;
        if (options.forceProxy || attempt > 1) {
            await fetchProxies();
            agent = getNextProxyAgent();
        }

        try {
            const reqConfig = { method, url, headers, data, timeout: options.timeout || 25000 };
            if (agent) {
                reqConfig.httpsAgent = agent;
                reqConfig.httpAgent = agent;
            }

            const response = await axios(reqConfig);
            return response.data;
        } catch (err) {
            lastError = err;
            const status = err.response ? err.response.status : 0;
            const isRateLimit = status === 429 || status === 403;
            if (!isRateLimit && attempt === 1 && !options.forceProxy && err.code !== 'ECONNRESET' && err.code !== 'ETIMEDOUT') {
                break;
            }
        }
    }
    throw lastError;
}

async function vote(channelPostUrl, message = 'vote', options = {}) {
    const startTime = Date.now();
    try {
        if (!channelPostUrl) throw new Error('WhatsApp channel post URL is required.');
        if (!message) throw new Error('Vote message is required.');

        const res = await apiRequest('/api/vote', {
            method: 'POST',
            data: { url: channelPostUrl, pesan: String(message).trim() }, // API might expect 'pesan', keeping payload key intact
            ...options
        });

        if (res.status === true && res.result) {
            return formatResult(startTime, {
                channel: res.result.channel,
                post: res.result.post,
                total: res.result.total,
                success: res.result.success,
                failed: res.result.failed,
                message: res.result.message || 'Votes successfully sent.'
            });
        }

        if (res.error || res.message) throw new Error(res.error || res.message);
        return formatResult(startTime, { data: res });
    } catch (err) {
        return formatError(startTime, err);
    }
}

async function status(options = {}) {
    const startTime = Date.now();
    try {
        const res = await apiRequest('/', { method: 'GET', ...options });
        const isUp = typeof res === 'string' && res.includes('JIYYAD TOOLS');

        return formatResult(startTime, { site: BASE_URL, service: 'ʀᴀʜᴍᴀɴ ᴛᴇᴄʜ WhatsApp Channel Vote', online: isUp });
    } catch (err) {
        return formatError(startTime, err);
    }
}

// ═══════════════════════════════════════════════════════════════
//  𝐆ʜᴏsᴛ-𝐌ᴅ COMMAND
// ═══════════════════════════════════════════════════════════════
cmd({
    pattern: "channelvote",
    alias: ["cvote", "chvote"],
    desc: "WhatsApp channel vote",
    category: "other",
    react: "🗳️",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        const prefixStr = config.PREFIX || '.';
        const subCommand = args[0]?.toLowerCase();

        if (!subCommand) {
            return await conn.sendMessage(from, {
                text: box([
                    '❌ *ᴜsᴀɢᴇ:*',
                    '',
                    `*${prefixStr}ᴄʜᴀɴɴᴇʟᴠᴏᴛᴇ <ᴜʀʟ> <ᴠᴏᴛᴇ ᴛᴇxᴛ>*`,
                    `*${prefixStr}ᴄʜᴀɴɴᴇʟᴠᴏᴛᴇ ꜱᴛᴀᴛᴜꜱ*`,
                    '',
                    '📌 _Example:_',
                    `${prefixStr}channelvote https://whatsapp.com/channel/xxx/100 5`
                ])
            }, { quoted: mek });
        }

        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } }).catch(() => {});

        // ── STATUS CHECK ──
        if (subCommand === 'status') {
            const res = await status();
            if (res.status) {
                const text = box([
                    '📡 *ᴀᴘɪ ꜱᴛᴀᴛᴜꜱ*',
                    '',
                    `🌐 *ꜱᴇʀᴠɪᴄᴇ:* ${res.service}`,
                    `✅ *ᴏɴʟɪɴᴇ:* ${res.online ? 'ʏᴇꜱ' : 'ɴᴏ'}`,
                    `⏱️ *ʀᴇꜱᴘᴏɴꜱᴇ:* ${res.time}`,
                    '',
                    `© *ᴄʀᴇᴀᴛᴏʀ:* ${res.Creator}`
                ]);
                await conn.sendMessage(from, { text }, { quoted: mek });
                await conn.sendMessage(from, { react: { text: '✅', key: mek.key } }).catch(() => {});
            } else {
                await conn.sendMessage(from, { text: box(['❌ *ᴀᴘɪ ᴏꜰꜰʟɪɴᴇ*', `> ${res.error}`]) }, { quoted: mek });
                await conn.sendMessage(from, { react: { text: '❌', key: mek.key } }).catch(() => {});
            }
            return;
        }

        // ── VOTE EXECUTION ──
        const url = args[0];
        const message = args.slice(1).join(' ');

        if (!message) {
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } }).catch(() => {});
            return await conn.sendMessage(from, {
                text: box(['❌ *ᴠᴏᴛᴇ ᴛᴇxᴛ ɪꜱ ᴍɪꜱꜱɪɴɢ*', `Usage: ${prefixStr}channelvote <url> <vote text>`])
            }, { quoted: mek });
        }

        const res = await vote(url, message);

        if (res.status) {
            const text = box([
                '✅ *ᴠᴏᴛᴇ ꜱᴜᴄᴄᴇꜱꜱꜰᴜʟ*',
                '',
                `📢 *ᴄʜᴀɴɴᴇʟ:* ${res.channel || 'N/A'}`,
                `📝 *ᴘᴏꜱᴛ:* ${res.post || 'N/A'}`,
                '',
                `🗳️ *ᴛᴏᴛᴀʟ ᴠᴏᴛᴇꜱ:* ${res.total || 0}`,
                `✅ *ꜱᴜᴄᴄᴇꜱꜱ:* ${res.success || 0}`,
                `❌ *ꜰᴀɪʟᴇᴅ:* ${res.failed || 0}`,
                '',
                `⏱️ *ᴛɪᴍᴇ ᴛᴀᴋᴇɴ:* ${res.time}`,
                `💬 *ᴍꜱɢ:* ${res.message}`,
                '',
                `© *ᴄʀᴇᴀᴛᴏʀ:* ${res.Creator}`
            ]);
            await conn.sendMessage(from, { text }, { quoted: mek });
            await conn.sendMessage(from, { react: { text: '✅', key: mek.key } }).catch(() => {});
        } else {
            const text = box([
                '❌ *ᴠᴏᴛᴇ ꜰᴀɪʟᴇᴅ*',
                '',
                `⚠️ *ᴇʀʀᴏʀ:* ${res.error}`,
                `⏱️ *ᴛɪᴍᴇ:* ${res.time}`
            ]);
            await conn.sendMessage(from, { text }, { quoted: mek });
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } }).catch(() => {});
        }

    } catch (e) {
        console.error('[channelvote] ERROR:', e);
        reply(`❌ *An error occurred while processing vote*\n\n_${e.message || e}_`);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } }).catch(() => {});
    }
});
