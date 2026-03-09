const whisper = require('whisper-node');
const ffmpeg = require("./ffmpeg");
const fs = require("fs");

async function transcribe(filePath, username) {
    if (!fs.existsSync(filePath) || fs.statSync(filePath).size < 1000) {
        console.warn(`[${username}] Audio file is too small or missing. Skipping.`);
        return;
    }
    try {
        // whisper-node requires 16Hz Mono WAV
        // (You already have the FFmpeg command from the previous step)
        const transcript = await whisper.whisper(filePath, {
            modelName: "base.en",
            shellOptions: {
                silent: true //stfu
            }
        });

        const transcription = transcript.map(t => t.speech).join(' ');

        console.log(`[${username}]`, transcription);
    } catch (e) {
        console.log(`[${username}] Transcription error: (Error Suppressed)`);
    }
    fs.unlinkSync(filePath); // Clean up the WAV file after transcription
}


module.exports = async (userid, username, filename) => {
    const wavFile = await ffmpeg.pcm_to_wav(filename);
    fs.unlinkSync(filename); // Clean up the PCM file after conversion
    transcribe(wavFile, username);
}