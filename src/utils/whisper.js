const { spawn } = require('child_process');

async function transcribe(source) {
    return new Promise(async (resolve, reject) => {
        const cmd = spawn('./bin/whisper.cpp/build/bin/whisper-cli', [
            '-m',
            './bin/whisper.cpp/models/ggml-base.en.bin',
            '-f',
            source
        ]);

        let output = "";
        let errorOutput = "";

        // Capture standard output (the transcript)
        cmd.stdout.on('data', (data) => {
            output += data.toString();
        });

        // Capture standard error (logs, progress, and actual errors)
        cmd.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        cmd.on('close', (code) => {
            if (code === 0) {
                // Whisper often outputs extra newlines/spaces, so trim it
                let transcription = "";
                try {
                    transcription = output.split("]   ")[1].trim();
                } catch (e) {}
                resolve(transcription);
            } else {
                console.error("Whisper Error Output:", errorOutput);
                reject(new Error(`Whisper process exited with code ${code}`));
            }
        });

        cmd.on('error', (err) => {
            reject(err);
        });

    })
}

module.exports = {
    transcribe
}