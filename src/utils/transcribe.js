const whisper = require('./whisper');
const ffmpeg = require("./ffmpeg");
const fs = require("fs");


module.exports = async (userid, username, filePath) => {
    const wavFile = await ffmpeg.pcm_to_wav(filePath);
    fs.unlinkSync(filePath); // Clean up the PCM file after conversion
    
    if (!fs.existsSync(wavFile) || fs.statSync(wavFile).size < 1000) {
        console.log(`[${username}] Audio file is too small or missing. Skipping.`);
        fs.unlinkSync(wavFile);
        return;
    }
    
    const transcription = await whisper.transcribe(wavFile);

    if (transcription !== "") {
        console.log(`[${username}] ${transcription}`);
    }

    fs.unlinkSync(wavFile); // Clean up the WAV file after transcription

}