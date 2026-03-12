const { joinVoiceChannel, VoiceConnectionStatus, EndBehaviorType } = require('@discordjs/voice');
const prism = require('prism-media');
const fs = require('fs');
const path = require('path');
const transcribe = require("../utils/transcribe");

// Keep track of active recordings outside the event listener
const activeRecordings = new Set();

module.exports = (client) => {
    client.on('messageCreate', async (message) => {
        // Command: !join
        if (message.content === '!join') {
            const channel = message.member?.voice.channel;
    
            if (!channel) {
                return message.reply('You need to be in a voice channel first!');
            }
    
            // 2. Join the channel
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
                selfDeaf: false, // Critical: Bot must not be deafened to receive audio
            });
    
            connection.on(VoiceConnectionStatus.Ready, () => {
                console.log('[SCRIPTY:DISCORD] Connected to the voice channel!');
                message.reply('I am now listening...');
            });
    
            // 3. Listen for speaking events
            connection.playOpusPacket(Buffer.from([0xF8, 0xFF, 0xFE]));
            connection.receiver.speaking.on('start', (userId) => {

                
                if (activeRecordings.has(userId)) return; // 1. CHECK IF WE ARE ALREADY RECORDING THIS USER
                activeRecordings.add(userId); // 2. MARK AS RECORDING

                const member = message.guild.members.cache.get(userId);
                const username = member ? member.user.username : "Unknown User";
                console.log(`[SCRIPTY:DISCORD] \x1b[90mRecording: ${username} (${userId})\x1b[0m`);
    
                // Subscribe to the specific user's audio stream
                const opusStream = connection.receiver.subscribe(userId, {
                    end: {
                        behavior: EndBehaviorType.AfterSilence,
                        duration: 500, // End stream after 0.5 second of silence
                    },
                });
    
                // 4. Convert Opus to PCM and save to file
                const pcmStream = opusStream.pipe(new prism.opus.Decoder({ 
                    rate: 48000, 
                    channels: 2, 
                    frameSize: 960 
                }));
    
                const filename = path.join(`recording-${userId}-${Date.now()}.pcm`);
                const writeStream = fs.createWriteStream(filename);
    
                pcmStream.pipe(writeStream);
    
                opusStream.on('end', () => {
                    console.log(`[SCRIPTY:DISCORD] \x1b[90mStopped recording: ${username} (${userId})\x1b[0m`);
                    activeRecordings.delete(userId);
                    writeStream.end();
                    transcribe(userId, username, filename);
                });
            });
        }
    });
}