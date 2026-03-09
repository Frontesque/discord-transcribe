#!/bin/bash
sudo dnf install -y git @development-tools cmake gcc

mkdir -p bin
cd bin

# Compile Whisper
git clone https://github.com/ggerganov/whisper.cpp.git
cd whisper.cpp
make

# Download Base Model
./models/download-ggml-model.sh base.en
