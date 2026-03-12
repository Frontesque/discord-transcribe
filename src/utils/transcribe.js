const whisper = require('./whisper');
const ffmpeg = require("./ffmpeg");
const fs = require("fs");

module.exports = async (userid, username, filePath) => {
    const wavFile = await ffmpeg.pcm_to_wav(filePath);
    fs.unlinkSync(filePath); // Clean up the PCM file after conversion
    
    if (!fs.existsSync(wavFile) || fs.statSync(wavFile).size < 1000) {
        console.log(`[SCRIPTY:WHISPER] ${username}'s audio file is too short. Skipping.`);
        fs.unlinkSync(wavFile);
        return;
    }
    
    const transcription = await whisper.transcribe(wavFile);

    if (transcription !== "") {
        console.log(`[SCRIPTY:OUTPUT]  [${username}] ${transcription}`);
        const now = new Date();
        const hhmmss = now.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        fs.appendFileSync('transcript.txt', `(${hhmmss}) [${username}] ${transcription}\n`);
    }

    fs.unlinkSync(wavFile); // Clean up the WAV file after transcription

}