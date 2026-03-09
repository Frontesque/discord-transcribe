const { spawn } = require('child_process');

async function pcm_to_wav(source) {
    return new Promise(async (resolve, reject) => {
        let output = source.replace(".pcm", ".wav");
        
        // console.log(`[FFMPEG] Converting: "${source}  ->  ${output}"`);
        const cmd = spawn('ffmpeg', [
            // --- Input Settings (Telling FFmpeg what the .pcm file IS) ---
            "-f", "s16le",    // Raw PCM format
            "-ar", "48000",   // Correct 48kHz Discord rate
            "-ac", "2",       // Correct channel flag (stereo)
            "-i", source,     // The input file
        
            // --- Output Settings (What Whisper needs) ---
            "-ar", "16000",   // Downsample to 16kHz for Whisper
            "-ac", "1",       // Convert to Mono for Whisper
            "-y",             // Overwrite if exists
            output            // The .wav path
        ]);
        cmd.on('close', (code) => {
            // console.log(`[FFMPEG] Converted: "${source}  ->  ${output}"`);
            return resolve(output);
        });


    })
}

module.exports = {
    pcm_to_wav
}