#!/bin/bash
# colab_render.sh <render.mjs clip args>: `node render.mjs --clip=…` split over Colab GPU VMs (docs/COLAB.md).
#   scripts/colab_render.sh --song=tokensENr --clip=0:264.811 --out=out/reels/btt_full.mp4
#   env: VMS="L4 L4 A100 A100" (Colab allows 2 per type), JOBS=6 (Chromes per VM), MAXMIN=45 (hard cap, minutes),
#        CHROME_VERSION (default: the Mac's Chrome), CHROME_GL
# Each VM renders a contiguous frame range as JOBS `render.mjs --part` chunks (video only, same x264 params as the local
# render); chunks stream back over ssh while they render, concat -c copy, the song is muxed once here. The page is stateless per frame
# (seeded per frame), so chunks need no pre-roll. Every VM is ALWAYS stopped (per VM + trap + watchdog + final check).
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/.." && pwd); cd "$ROOT"
(( $# )) || { sed -n 2,3p "$0"; exit 2; }
read -ra VMT <<< "${VMS:-L4 L4 A100 A100}"; JOBS=${JOBS:-6} MAXMIN=${MAXMIN:-45}
CHROME_VERSION=${CHROME_VERSION:-$("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --version 2>/dev/null | grep -oE '[0-9.]{8,}' || echo 154.0.8037.92)}
CHROME_GL=${CHROME_GL:---no-sandbox --enable-gpu --use-gl=angle --use-angle=gl-egl}
TMP=$(mktemp -d) CS=/tmp/cbt-$$ t0=$(date +%s); mkdir -p "$CS"   # ssh ControlPath must stay short (<104 bytes)
NAMES=(); for i in "${!VMT[@]}"; do NAMES+=("bt-$$-$i"); done

cleanup() {
  local rc=$? s j; trap - EXIT INT TERM; set +e
  for j in $(jobs -p); do pkill -P "$j"; kill "$j"; done 2>/dev/null
  for s in "${NAMES[@]}"; do ssh -F "$TMP/ssh" -O exit "$s" 2>/dev/null; colab stop -s "$s" >/dev/null 2>&1 & done; wait
  for s in $(colab sessions 2>/dev/null | grep -oE "\[bt-$$-[0-9]+\]" | tr -d '[]'); do colab stop -s "$s" >/dev/null 2>&1; done   # a late `colab new`
  if colab sessions 2>/dev/null | grep -F "[bt-$$-"; then echo "!! Colab sessions STILL RUNNING: colab stop -s <name>" >&2; rc=1
  else echo "colab: all ${#NAMES[@]} sessions stopped"; fi
  rm -rf "$TMP" "$CS"; exit $rc
}
trap cleanup EXIT; trap 'exit 130' INT TERM
( sleep $((MAXMIN * 60)); echo "!! MAXMIN=$MAXMIN reached, aborting" >&2; kill -TERM $$ ) & WD=$!

cat > "$TMP/ssh" <<EOF
Host bt-*
  User root
  ProxyCommand colab ssh --proxy-mode -s %n
  StrictHostKeyChecking no
  UserKnownHostsFile /dev/null
  LogLevel error
  ServerAliveInterval 15
  ServerAliveCountMax 4
  ControlMaster auto
  ControlPath $CS/%n
  ControlPersist 900
EOF

# clip range, fps, audio, out: the same defaults render.mjs uses (SONGS read from render.mjs itself)
read A B FPS AUDIO FADE OUT < <(node -e '
  const a = Object.fromEntries(process.argv.slice(1).map(x => { const [k, v] = x.replace(/^--/, "").split("="); return [k, v ?? true]; }));
  const SONGS = Function("return " + require("fs").readFileSync("render.mjs", "utf8").match(/const SONGS = (\{[\s\S]*?\});\n/)[1])(), S = SONGS[a.song || "pdoom"];
  const [A, B] = a.clip ? String(a.clip).split(":").map(Number) : [0, S.dur];
  console.log(A, B, +(a.fps || 24), S.audio, a.fade ? 1 : 0, a.out || "out/clip.mp4");' -- "$@")
REST=(); for x in "$@"; do [[ $x == --out=* ]] || REST+=("$x"); done
N=$(node -p "Math.round(($B - $A) * $FPS)") V=${#VMT[@]}

cat > "$TMP/vm_setup.sh" <<'VM'
# on the VM: NVIDIA EGL vendor json (Colab ships libEGL_nvidia but no glvnd json -> SwiftShader), Chrome for Testing (same
# version as the Mac), its missing .so, npm ci; GPU check: WebGL not on NVIDIA = abort
set -euo pipefail; cd /content/bt; CV=$1
export PATH=/tools/node/bin:$PATH LD_LIBRARY_PATH=/usr/lib64-nvidia   # the ssh shell lacks the Colab kernel env
mkdir -p /usr/share/glvnd/egl_vendor.d out
echo '{"file_format_version":"1.0.0","ICD":{"library_path":"libEGL_nvidia.so.0"}}' > /usr/share/glvnd/egl_vendor.d/10_nvidia.json
L="libatk1.0-0t64 libatk-bridge2.0-0t64 libxcomposite1 libatspi2.0-0t64 libxdamage1 libxrandr2 libgbm1 libxkbcommon0 libasound2t64 libcups2t64"
T=$SECONDS; ( export DEBIAN_FRONTEND=noninteractive; apt-get -qq install -y --no-install-recommends $L >/dev/null 2>&1 || { apt-get -qq update >/dev/null 2>&1; apt-get -qq install -y --no-install-recommends $L >/dev/null 2>&1; }; echo -n "apt $((SECONDS - T))s " ) &
( cd /content && curl -sSfLo c.zip "https://storage.googleapis.com/chrome-for-testing-public/$CV/linux64/chrome-linux64.zip" && unzip -qo c.zip; echo -n "chrome $((SECONDS - T))s " ) &
( npm ci --no-audit --no-fund --loglevel=error >/dev/null 2>&1; echo -n "npm $((SECONDS - T))s " ) &
# ffmpeg 8.x like the Mac (8.0): the image's 4.x turns the full-range JPEG frames into tv-range yuv420p, the Mac keeps pc range (yuvj420p)
( cd /content && curl -sSfL https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-n8.1-latest-linux64-gpl-8.1.tar.xz | tar xJ && mv ffmpeg-n8.1-* ff8; echo -n "ffmpeg $((SECONDS - T))s " ) &
wait
cat > gpu_probe.mjs <<'JS'
import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: process.env.CHROME, headless: true, args: ['--ignore-gpu-blocklist', ...process.env.CHROME_GL.split(' ')] });
const p = await b.newPage(); console.log(await p.evaluate(() => { const gl = document.createElement('canvas').getContext('webgl2'), e = gl?.getExtension('WEBGL_debug_renderer_info');
  return e ? gl.getParameter(e.UNMASKED_RENDERER_WEBGL) : 'no webgl2'; })); await b.close();
JS
R=$(CHROME=/content/chrome-linux64/chrome CHROME_GL=$2 node gpu_probe.mjs); echo "probe $((SECONDS - T))s; $(hostname) $(nproc) cpu, $(/content/ff8/bin/ffmpeg -version | head -c 22), WebGL: $R"
[[ $R == *NVIDIA* ]] || { echo "GPU WebGL not on NVIDIA (SwiftShader?), abort"; exit 3; }
VM

cat > "$TMP/vm_render.sh" <<'VM'
# on the VM: frames [a, b) of the clip in J Chromes (chunk k = [a+k*n/J, a+(k+1)*n/J)) -> out/p<k>.ts (MPEG-TS: valid while it grows,
# so the Mac pulls it during the render via stream.sh; a plain scp afterwards ran at ~0.25 MB/s through the colab ssh proxy)
set -euo pipefail; cd /content/bt; a=$1 b=$2 J=$3; shift 3
export PATH=/content/ff8/bin:/tools/node/bin:$PATH LD_LIBRARY_PATH=/usr/lib64-nvidia CHROME=/content/chrome-linux64/chrome
t=$(date +%s) P=
for ((k = 0; k < J; k++)); do
  node render.mjs "$@" --part=$(( a + k * (b - a) / J )):$(( a + (k + 1) * (b - a) / J )) --out=out/p$k.ts < /dev/null > out/p$k.log 2>&1 & P="$P $!"; echo $! > out/p$k.pid
done
for p in $P; do wait $p || { echo "chunk failed:"; tail -5 out/p*.log; exit 1; }; done
grep -h '^\[page' out/p*.log | sort | uniq -c | sort -rn | head -5 | sed "s/^/$(hostname) /" || true
echo "$(hostname) frames $a-$b: render $(( $(date +%s) - t ))s, ms/frame per Chrome: $(for k in $(seq 0 $((J - 1))); do grep '^frame' out/p$k.log | tail -1 | awk '{printf "%s ", $3}'; done)"
VM

cat > "$TMP/stream.sh" <<'VM'
# stream.sh k: out/p<k>.ts to stdout from byte 0 while it is written, until its render.mjs exits
cd /content/bt; until [[ -s out/p$1.pid ]]; do sleep .5; done; P=$(cat out/p$1.pid)
until [[ -e out/p$1.ts ]]; do kill -0 "$P" 2>/dev/null || exit 1; sleep .5; done
exec tail -c +1 -s .5 -f --pid="$P" out/p$1.ts
VM

# bundle (~1 MB): renderer + package files + pages + src/. No audio (muxed here), no node_modules (npm ci on the VM).
export COPYFILE_DISABLE=1
tar czf "$TMP/b.tgz" --no-xattrs render.mjs package.json package-lock.json *.html src -C "$TMP" vm_setup.sh vm_render.sh stream.sh
echo "bundle $(du -h "$TMP/b.tgz" | cut -f1); $N frames on $V VMs x $JOBS Chromes"

vm() {  # vm <i> <type>: frames [i*N/V, (i+1)*N/V) -> $TMP/p<i>_<k>.ts, k < JOBS
  local i=$1 s=${NAMES[$1]} g=${2%-hm} a=$(( $1 * N / V )) b=$(( ($1 + 1) * N / V )) S="ssh -F $TMP/ssh" k
  for k in 1 2 3 4; do   # Colab answers 503 / TooManyAssignments when that GPU pool is momentarily full
    colab new -s "$s" --gpu "$g" $([[ $2 == *-hm ]] && echo --high-mem) > "$TMP/new$i" 2>&1 && break
    (( k < 4 )) || { echo "$s: no $2: $(grep -m1 -oE 'Service Unavailable|TooManyAssignments|Allocation refused[^.]*|[A-Za-z]+Error.*' "$TMP/new$i")" >&2; return 1; }; sleep $((k * 5))
  done; local T="$s ($2): new $(( $(date +%s) - t0 ))s"
  $S "$s" "mkdir -p /content/bt && cd /content/bt && tar xz && bash vm_setup.sh $CHROME_VERSION '$CHROME_GL'" < "$TMP/b.tgz"
  T="$T, ready $(( $(date +%s) - t0 ))s"
  $S "$s" "cd /content/bt && CHROME_GL='$CHROME_GL' bash vm_render.sh $a $b $JOBS $(printf '%q ' "${REST[@]}")" & R=$!
  for ((k = 0; k < JOBS; k++)); do $S "$s" "bash /content/bt/stream.sh $k" > "$TMP/p${i}_$k.ts" & done
  wait $R; T="$T, rendered $(( $(date +%s) - t0 ))s"; wait
  $S -O exit "$s" 2>/dev/null || true; colab stop -s "$s" >/dev/null 2>&1; echo "$T, streamed+stopped $(( $(date +%s) - t0 ))s"
}
P=; for i in "${!VMT[@]}"; do vm "$i" "${VMT[$i]}" & P="$P $!"; done
for p in $P; do wait "$p" || { echo "a VM failed" >&2; exit 1; }; done

# local: parts in order (-c copy, explicit durations so .ts start offsets can't drift the joins) + the song, as render.mjs muxes it
for i in "${!VMT[@]}"; do a=$(( i * N / V )) b=$(( (i + 1) * N / V )); for ((k = 0; k < JOBS; k++)); do
  echo "file p${i}_$k.ts"; echo "duration $(node -p "($(( a + (k + 1) * (b - a) / JOBS )) - $(( a + k * (b - a) / JOBS ))) / $FPS")"; done; done > "$TMP/list"
L=$(node -p "$B - $A"); AF=(); (( FADE )) && AF=(-af "afade=t=in:d=0.06:curve=tri,afade=t=out:st=$(node -p "($L - .35).toFixed(3)"):d=0.35")
mkdir -p "$(dirname "$OUT")"
ffmpeg -nostdin -v error -y -f concat -safe 0 -i "$TMP/list" -ss "$A" -t "$L" -i "$AUDIO" -map 0:v -map 1:a ${AF[@]+"${AF[@]}"} \
  -c:v copy -c:a aac -b:a 192k -movflags +faststart "$OUT"   # no -shortest: with -c:v copy it drops frames
echo "wrote $OUT  $(ffprobe -v error -count_packets -select_streams v -show_entries stream=nb_read_packets -of csv=p=0 "$OUT")/$N frames, $(( $(date +%s) - t0 ))s end-to-end, VMs: ${VMT[*]}"
