# qC.py A B : render ours for [A,B), print per frame: t, ssim(480x270 gray-ish via skimage if present else NCC), ref motion, our motion
import numpy as np,json,sys,subprocess,os,glob
from PIL import Image
import math;A=math.ceil(float(sys.argv[1])*24-1e-6)/24;B=float(sys.argv[2]);os.makedirs('out/qa_C',exist_ok=True)
subprocess.run(f'node render.mjs --song=wonder --clip={A}:{B} --out=out/qa_C/q.mp4',shell=True,capture_output=True)
subprocess.run('ffmpeg -v error -y -i out/qa_C/q.mp4 -vf "fps=24,scale=480:270" -f rawvideo -pix_fmt rgb24 out/qa_C/q.raw',shell=True)
a=np.fromfile('out/qa_C/q.raw',np.uint8).reshape(-1,270,480,3).astype(float)
m=json.load(open('ref/motion.json')); n0=round(A*24)
def box(x,k=7):
    c=np.cumsum(np.cumsum(np.pad(x,((1,0),(1,0))),0),1); return (c[k:,k:]-c[:-k,k:]-c[k:,:-k]+c[:-k,:-k])/(k*k)
def ssim(a,b):
    a=a.mean(2);b=b.mean(2);ma,mb=box(a),box(b);va=box(a*a)-ma*ma;vb=box(b*b)-mb*mb;cv=box(a*b)-ma*mb
    return (((2*ma*mb+6.5)*(2*cv+58.5))/((ma*ma+mb*mb+6.5)*(va+vb+58.5))).mean()
for i in range(len(a)):
    idx=n0+i; r=np.asarray(Image.open('ref/f/%04d.jpg'%(idx+1)).convert('RGB').resize((480,270)),dtype=float)
    s=ssim(a[i],r)
    print('%.3f f%d ssim %.2f ref %5.1f ours %5.1f'%(idx/24,idx+1,s,m[idx],np.abs(a[i]-a[i-1]).mean() if i else float('nan')))
