# holds.py A B : renders ours for [A,B), compares per-frame hold(0)/move with ref/motion.json; prints mismatched frames
import sys,subprocess,json,os,numpy as np
from PIL import Image
A,B=float(sys.argv[1]),float(sys.argv[2]); d='out/hold_tmp'; os.makedirs(d,exist_ok=True)
subprocess.run(['node','render.mjs','--song=wonder',f'--clip={A}:{B}',f'--out={d}/o.mp4'],capture_output=True)
subprocess.run(f'rm -f {d}/f*.png; ffmpeg -v error -y -i {d}/o.mp4 -vf scale=480:270 {d}/f%04d.png',shell=True)
M=json.load(open('ref/motion.json')); k0=round(A*24); n=len(os.listdir(d))-1
fr=[np.asarray(Image.open(f'{d}/f{i+1:04d}.png').convert('L')).astype(float) for i in range(n)]
bad=[]; 
for i in range(1,n):
    k=k0+i; ours=np.abs(fr[i]-fr[i-1]).mean(); ref=M[k] if k<len(M) else 0
    if (ours<0.3)!=(ref<0.3): bad.append((k,round(ours,2),ref))
print('frames',n-1,'mismatch',len(bad)); print(bad[:60])
subprocess.run(f'rm -rf {d}',shell=True)
