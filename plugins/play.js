// plugins/song.js – YouTube Audio Downloader
// Search: Prexzy API | Download: VajiraOfc API
const { cmd } = require('../command');
const config = require('../config');
const axios = require('axios');

const VAJIRA_KEY = 'VajiraOfc';
const AUDIO_QUALITY = 128;

function extractVideoId(url) {
    return url.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
    )?.[1] || null;
}

// ─── Search (Prexzy) ────────────────────────────────────
async function searchYouTube(query) {
    const { data } = await axios.get(
        `https://prexzyapis.com/search/youtube?q=${encodeURIComponent(query)}`,
        { timeout: 20000 }
    );
    if (!data?.status || !Array.isArray(data.data) || data.data.length === 0) {
        throw new Error("No results found");
    }
    return data.data[0];
}

async function fetchBufferWithRetry(url, { retries = 2, timeout = 90000 } = {}) {
    let lastErr;
    for (let attempt = 1; attempt <= retries + 1; attempt++) {
        try {
            const res = await axios.get(url, {
                responseType: 'arraybuffer',
                timeout,
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            const buffer = Buffer.from(res.data);
            if (buffer.length === 0) throw new Error('Empty response');
            return buffer;
        } catch (err) {
            lastErr = err;
            if (attempt <= retries) await new Promise(r => setTimeout(r, 1500 * attempt));
        }
    }
    throw new Error(`Failed to fetch stream after ${retries + 1} attempts: ${lastErr.message}`);
}

cmd({
    pattern: "song",
    alias: ["ytaudio", "play", "mp3", "music"],
    react: "🎵",
    desc: "Download YouTube audio (MP3)",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        const q = args.join(" ");
        if (!q) {
            return reply(
`❌ *Please provide a song name or YouTube link*
Example:
.song alan walker faded
.song https://youtu.be/xxx`);
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

        await reply("⏳ *ꜱᴇᴀʀᴄʜɪɴɢ, ᴘʟᴇᴀꜱᴇ ᴡᴀɪᴛ...*");

        const isYtUrl = /(youtube\.com|youtu\.be)/i.test(q);
        let videoUrl, searchInfo = null;

        if (isYtUrl) {
            const videoId = extractVideoId(q);
            if (!videoId) throw new Error("Invalid YouTube URL");
            videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        } else {
            searchInfo = await searchYouTube(q);
            videoUrl = searchInfo.link;
        }

        await reply("⬇️ *ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ, ᴘʟᴇᴀꜱᴇ ᴡᴀɪᴛ...*");

        // ─── Fetch MP3 link from VajiraOfc ──────────────────────
        const apiUrl = `https://vajiraofc-apis.vercel.app/api/ytmp3?apikey=${VAJIRA_KEY}&url=${encodeURIComponent(videoUrl)}&quality=${AUDIO_QUALITY}`;
        let data;
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                const res = await axios.get(apiUrl, { timeout: 40000 });
                data = res.data;
                if (data?.success && data?.data?.download?.url) break;
                throw new Error("API returned no download link");
            } catch (err) {
                if (attempt === 3) throw new Error(`Downloader API failed: ${err.message}`);
                await new Promise(r => setTimeout(r, 1500 * attempt));
            }
        }

        const media = data.data;
        const audioUrl = media.download.url;
        const title = media.title || searchInfo?.title || 'Unknown';
        const channel = searchInfo?.channel || 'Unknown';
        const duration = searchInfo?.duration || 'N/A';
        const bitrate = media.download.quality || `${AUDIO_QUALITY}kbps`;
        const videoId = media.id || extractVideoId(videoUrl);
        const thumbnail = searchInfo?.imageUrl || (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null);

        // ─── Fetch the audio bytes ─────────────────────────────
        const audioBuffer = await fetchBufferWithRetry(audioUrl);

        // ─── Build caption ─────────────────────────────────────
        const caption =
`*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*
*┇•* 🎵 *𝐆ʜᴏsᴛ - xᴅ sᴏɴɢ ᴅʟ*
*┇•* ℹ️ *ᴛɪᴛʟᴇ: ${title}*
*┇•* 📡 *ᴄʜᴀɴɴᴇʟ: ${channel}*
*┇•* ⌛ *ᴅᴜʀᴀᴛɪᴏɴ: ${duration}*
*┇•* 🎚️ *ǫᴜᴀʟɪᴛʏ: ${bitrate}*
*┇•* 📦 *sɪᴢᴇ: ${(audioBuffer.length / 1024 / 1024).toFixed(2)} ᴍʙ*
*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*

*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*
*┇•* *_ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴛᴇᴀᴍ ᴢᴇᴇ_*
*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈᛭*`;

        // Thumbnail fail ho to bhi audio jaye
        try {
            if (thumbnail) {
                await conn.sendMessage(from, {
                    image: { url: thumbnail },
                    caption: caption
                }, { quoted: mek });
            } else {
                await reply(caption);
            }
        } catch (e) {
            console.error("SONG thumbnail send failed:", e.message);
            try { await reply(caption); } catch (e2) {}
        }

        // ─── Send the audio ──────────────────────────────────
        await conn.sendMessage(from, {
            audio: audioBuffer,
            mimetype: "audio/mpeg",
            fileName: `${title}.mp3`,
            ptt: false
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

    } catch (err) {
        console.error("SONG ERROR:", err);
        reply(`❌ *An error occurred while downloading audio*\n\n_${err.message || "Something went wrong"}_`);
        await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
    }
});
