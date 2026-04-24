#!/bin/bash
# sudo dnf install -y @development-tools git cmake gcc gcc-c++ nodejs opus-devel

MODEL_TO_DOWNLOAD=${SCRIPTY_MODEL}

case "$MODEL_TO_DOWNLOAD" in tiny|tiny.en|tiny-q5_1|tiny.en-q5_1|tiny-q8_0|base|base.en|base-q5_1|base.en-q5_1|base-q8_0|small|small.en|small.en-tdrz|small-q5_1|small.en-q5_1|small-q8_0|medium|medium.en|medium-q5_0|medium.en-q5_0|medium-q8_0|large-v1|large-v2|large-v2-q5_0|large-v2-q8_0|large-v3|large-v3-q5_0|large-v3-turbo|large-v3-turbo-q5_0|large-v3-turbo-q8_0)
        echo "Valid model selected: $MODEL_TO_DOWNLOAD"
        ;;
    *)
        echo "Invalid or no model specified. Please set the "SCRIPTY_MODEL" environment variable. Exiting..."
        exit
        ;;
esac

mkdir -p bin
cd bin

# Compile Whisper
if [ ! -d "whisper.cpp" ]; then
    git clone https://github.com/ggerganov/whisper.cpp.git
fi
cd whisper.cpp
make -j $(nproc)

# Download Base Model
./models/download-ggml-model.sh "$MODEL_TO_DOWNLOAD"
