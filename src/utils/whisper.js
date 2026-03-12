const { spawn } = require('child_process');

const model = `ggml-${process.env.SCRIPTY_MODEL}.bin`;

async function transcribe(source) {
    return new Promise(async (resolve, reject) => {
        const cmd = spawn('./bin/whisper.cpp/build/bin/whisper-cli', [
            '-m',
            './bin/whisper.cpp/models/'+model,
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
                let transcription = [];
                try {
                    let chunks = output.trim().split("\n");
                    for (const i in chunks) {
                        transcription.push(chunks[i].split("]   ")[1]?.trim());
                    }
                } catch (e) {
                    console.log("[SCRIPTY:WHISPER] Failed to parse Whisper output. Returning raw output.");
                    transcription.push(output.trim());
                }
                resolve(transcription.join(" "));
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