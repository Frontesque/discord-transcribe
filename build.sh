#!/bin/bash
rm -rf bin
rm -rf node_modules
zip -r -o "tjsb.zip" * -x "./package-lock.json" -x "./build.sh" -x "./.git/*" -x "./*.zip" -x "./transcript.txt"