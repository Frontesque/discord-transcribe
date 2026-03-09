#!/bin/bash
sudo dnf install -y git @development-tools cmake gcc

npx whisper-node download

## Now automatically handled my node-whisper

# Download Base Model
# ./download-ggml-model.sh base.en

# Compile Whisper
#git clone https://github.com/ggerganov/whisper.cpp.git
#cd whisper.cpp
#make