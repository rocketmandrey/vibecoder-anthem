"""Beats / hits / vocal onsets of the new master (new-master time).
usage: python scripts/master_grid.py <master audio> <vocals stem wav> [out.json]   (needs beat_this, librosa)
beats: beat_this final0 (the quarter grid audio.js uses); b188/b94/kick: the legacy librosa trackers behind beats188/94/_kick.npy;
hits: onset peaks, strength = x global median (hits.txt format); vox: onset peaks of the demucs vocal stem (for snapping line starts)."""
import json, sys
import numpy as np, librosa
from beat_this.inference import File2Beats

mix, voc = sys.argv[1], sys.argv[2]; out = sys.argv[3] if len(sys.argv) > 3 else "assets/tokens3/master_grid.json"
SR, HOP = 22050, 256
r3 = lambda a: [round(float(x), 3) for x in a]
beats, downs = File2Beats(checkpoint_path="final0", device="cpu", dbn=False)(mix)
y = librosa.load(mix, sr=SR)[0]
_, b188 = librosa.beat.beat_track(y=y, sr=SR, start_bpm=188, units="time")
b94 = b188[::2]
yk = librosa.effects.hpss(y)[1]; S = np.abs(librosa.stft(yk, hop_length=HOP)); fq = librosa.fft_frequencies(sr=SR)
kenv = librosa.onset.onset_strength(S=librosa.amplitude_to_db(S[fq < 150]), sr=SR, hop_length=HOP)
_, kick = librosa.beat.beat_track(onset_envelope=kenv, sr=SR, hop_length=HOP, start_bpm=94, units="time")

def peaks(sig, thr, wait=.1):
    env = librosa.onset.onset_strength(y=sig, sr=SR, hop_length=HOP); med = np.median(env)
    pk = librosa.util.peak_pick(env, pre_max=3, post_max=3, pre_avg=10, post_avg=10, delta=med, wait=int(wait * SR / HOP))
    pk = [p for p in pk if env[p] / med >= thr]
    return [[round(float(librosa.frames_to_time(p, sr=SR, hop_length=HOP)), 3), round(float(env[p] / med), 1)] for p in pk]

hits = peaks(y, 4.6)
vox = peaks(librosa.load(voc, sr=SR)[0], 2.0, .06)
json.dump({"audio": mix.split("/")[-1], "beats": r3(beats), "downbeats": r3(downs), "b188": r3(b188), "b94": r3(b94), "kick": r3(kick),
           "hits": hits, "vox": vox}, open(out, "w"), indent=0)
print(out, len(beats), "beats", len(hits), "hits", len(vox), "vox onsets")
