#!/usr/bin/env bash
# Turns the two source videos into the scroll-scrub frame sequences used by the hero.
# Needs ffmpeg. Usage: bash tools/extract-frames.sh [build.mp4] [entry.mp4]
# Edit the crop/delogo lines below if your AI tool puts its watermark somewhere else.
set -e
cd "$(dirname "$0")/.."
BUILD=${1:-source/build.mp4}; ENTRY=${2:-source/entry.mp4}
rm -rf public/frames/build public/frames/entry; mkdir -p public/frames/build public/frames/entry
# BUILD clip: crop the bottom 10% (watermark), scale to 1280 wide, keep every 2nd frame
ffmpeg -v error -y -i "$BUILD" -vf "crop=iw:ih*0.9:0:0,scale=1280:-2,select='not(mod(n\,2))'" -fps_mode vfr -q:v 4 public/frames/build/b%04d.jpg
# ENTRY clip: remove the top-right watermark, keep every 3rd frame
ffmpeg -v error -y -i "$ENTRY" -vf "delogo=x=790:y=1:w=232:h=64,select='not(mod(n\,3))'" -fps_mode vfr -q:v 4 public/frames/entry/e%04d.jpg
NB=$(ls public/frames/build | wc -l); NE=$(ls public/frames/entry | wc -l)
W=$(ffprobe -v error -select_streams v -show_entries stream=width -of csv=p=0 public/frames/build/b0001.jpg)
H=$(ffprobe -v error -select_streams v -show_entries stream=height -of csv=p=0 public/frames/build/b0001.jpg)
printf '{"build":{"count":%s,"pattern":"frames/build/b%%04d.jpg","width":%s,"height":%s},"entry":{"count":%s,"pattern":"frames/entry/e%%04d.jpg","width":1024,"height":576}}\n' $NB $W $H $NE > public/frames/manifest.json
echo "build=$NB entry=$NE"; cat public/frames/manifest.json
