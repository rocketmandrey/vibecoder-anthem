#!/bin/bash
# dcmp.sh t... : ours | ref side by side (scratch tool for segment D) -> out/qa_D/dc.jpg
cd "$(dirname "$0")/../.."
node render.mjs --song=wonder --stills=$(IFS=,; echo "$*") --out=out/qa_D/st >/dev/null 2>&1
args=(); fl=""; i=0
for t in "$@"; do n=$(python3 -c "print(round($t*24)+1)"); f=$(python3 -c "print('out/qa_D/st/t%s.png'%('%.2f'%$t).replace('.','_'))")
 args+=(-i $f -i ref/f/$(printf %04d $n).jpg); fl+="[$((2*i))]scale=640:360[o$i];[$((2*i+1))]scale=640:360[r$i];[o$i][r$i]hstack[p$i];"; i=$((i+1)); done
ins=$(for k in $(seq 0 $((i-1))); do printf "[p$k]"; done)
ffmpeg -v error -y "${args[@]}" -filter_complex "${fl}${ins}vstack=inputs=$i" out/qa_D/dc.jpg
