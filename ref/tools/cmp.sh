#!/bin/bash
# cmp.sh A B NAME: render ours for [A,B) and compare with the reference frame by frame.
#   out/qa/NAME.mp4        triptych  reference | ours | 50% overlay  (1920x360, 24 fps) — the clip that goes to TG
#   out/qa/NAME_strip.jpg  12 fps strips: each pair of rows = 1 s (top: reference, bottom: ours), 160 px tiles
#   out/qa/NAME_ssim.txt   per-frame SSIM ours vs reference (t ssim), worst frames listed last
# Run from the repo root. Local render (~0.2 s/frame).
set -e
A=$(python3 -c "import math;print(math.ceil($1*24-1e-6)/24)"); B=$2; N=$3;   # A snapped to the 24 fps grid
 R=~/Downloads/devteamdrew-research-2026-10-07/x-profile-public-video-archive/2026-09-22_devteamdrew_2102436464323661880/assets/video-01.mp4
D=out/qa; mkdir -p $D; DUR=$(python3 -c "print($B-$A)")
node render.mjs --song=wonder --clip=$A:$B --out=$D/$N.ours.mp4 >/dev/null 2>&1
ffmpeg -v error -y -ss $A -t $DUR -i $R -i $D/$N.ours.mp4 -filter_complex \
 "[0:v]fps=24,scale=640:360,setpts=PTS-STARTPTS,split=2[r1][r2];[1:v]fps=24,scale=640:360,setpts=PTS-STARTPTS,split=2[o1][o2];[r2][o2]blend=all_mode=average[m];[r1][o1][m]hstack=3,drawtext=text='ref | ours | overlay 50 pct   t=%{pts\:flt\:$A}':x=8:y=8:fontsize=18:fontcolor=white:box=1:boxcolor=black@0.5" \
 -c:v libx264 -crf 20 -pix_fmt yuv420p -an $D/$N.mp4
ffmpeg -v error -y -ss $A -t $DUR -i $R -i $D/$N.ours.mp4 -filter_complex \
 "[0:v]fps=24,scale=480:270,setpts=PTS-STARTPTS[r];[1:v]fps=24,scale=480:270,setpts=PTS-STARTPTS[o];[o][r]ssim=stats_file=$D/$N.ssim.raw" -f null - 
python3 - "$D/$N.ssim.raw" "$A" > $D/${N}_ssim.txt <<'PY'
import sys,re
rows=[(float(sys.argv[2])+(int(re.search(r'n:(\d+)',l).group(1))-1)/24, float(re.search(r'All:([\d.]+)',l).group(1))) for l in open(sys.argv[1])]
print(f"mean SSIM {sum(s for _,s in rows)/len(rows):.3f}  (1 = identical; >0.8 close)")
for t,s in rows: print(f"{t:6.3f} {s:.3f}")
print("worst:", ' '.join(f"{t:.2f}:{s:.2f}" for t,s in sorted(rows,key=lambda r:r[1])[:8]))
PY
rm -f $D/$N.ssim.raw
for k in $(seq 0 $(python3 -c "import math;print(math.ceil($DUR)-1)")); do
  T0=$(python3 -c "print($A+$k)"); L=$(python3 -c "print(min(1,$B-$A-$k))")
  ffmpeg -v error -y -ss $T0 -t $L -i $R -vf "fps=12,scale=160:90,tile=12x1" -frames:v 1 $D/_r$k.png
  ffmpeg -v error -y -ss $k -t $L -i $D/$N.ours.mp4 -vf "fps=12,scale=160:90,tile=12x1" -frames:v 1 $D/_o$k.png
done
ffmpeg -v error -y $(for k in $(ls $D/_r*.png | sort -V | sed 's/.*_r\([0-9]*\).png/\1/'); do echo "-i $D/_r$k.png -i $D/_o$k.png"; done) -filter_complex "vstack=inputs=$(ls $D/_r*.png $D/_o*.png | wc -l | tr -d ' ')" $D/${N}_strip.jpg
rm -f $D/_r*.png $D/_o*.png $D/$N.ours.mp4
head -1 $D/${N}_ssim.txt; tail -1 $D/${N}_ssim.txt
