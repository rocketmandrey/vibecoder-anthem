#!/bin/bash
# cmpst.sh out_dir t1 t2 ... : side-by-side ours|ref for the given times (stills in out_dir/tX_YY.png) -> out_dir/cmp.jpg
D=$1; shift; args=(); fl=""; i=0
for t in "$@"; do n=$(python3 -c "print(round($t*24)+1)"); f=$(printf "%s/t%s.png" $D $(python3 -c "print('%.2f'%$t)" | tr . _)); args+=(-i $f -i $(printf "ref/f/%04d.jpg" $n)); fl+="[$((2*i))]scale=640:-1[a$i];[$((2*i+1))]scale=640:-1[b$i];[a$i][b$i]hstack[r$i];"; i=$((i+1)); done
ins=""; for j in $(seq 0 $((i-1))); do ins+="[r$j]"; done
ffmpeg -v error -y "${args[@]}" -filter_complex "${fl}${ins}vstack=inputs=$i" $D/cmp.jpg
