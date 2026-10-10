# regstat.py x0 y0 x1 y1 file... : mean RGB of region in ours (out/qa_B/st/tX_YY.png, time=(file-1)/24) vs ref/f/NNNN.jpg
import sys
from PIL import Image
import numpy as np
x0,y0,x1,y1=map(int,sys.argv[1:5])
for n in map(int,sys.argv[5:]):
    t=(n-1)/24; f='out/qa_B/st/t%s.png'%('%.2f'%t).replace('.','_')
    try: a=np.asarray(Image.open(f).convert('RGB').crop((x0,y0,x1,y1))).reshape(-1,3).mean(0)
    except Exception as e: a=np.zeros(3)
    b=np.asarray(Image.open('ref/f/%04d.jpg'%n).convert('RGB').resize((1920,1080)).crop((x0,y0,x1,y1))).reshape(-1,3).mean(0)
    print(n,'ours',a.round(0),'ref',b.round(0))
