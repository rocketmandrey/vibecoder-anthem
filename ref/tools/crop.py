# crop.py out.jpg x0 y0 x1 y1 N [N..]: ref (top) / ours (bottom) full-res crop per frame
import sys,subprocess
from PIL import Image
out=sys.argv[1];x0,y0,x1,y1=map(int,sys.argv[2:6]);ns=[int(x) for x in sys.argv[6:]]
subprocess.run(['node','render.mjs','--song=wonder','--stills='+','.join(f'{(n-1)/24+1e-4:.5f}' for n in ns),'--out=out/qa_C/o'],capture_output=True)
w,h=x1-x0,y1-y0;M=Image.new('RGB',(w*len(ns),h*2))
for i,n in enumerate(ns):
    r=Image.open(f'ref/f/{n:04d}.jpg').convert('RGB').resize((1920,1080)).crop((x0,y0,x1,y1));o=Image.open('out/qa_C/o/t%s.png'%('%.2f'%((n-1)/24+1e-4)).replace('.','_')).convert('RGB').crop((x0,y0,x1,y1))
    M.paste(r,(i*w,0));M.paste(o,(i*w,h))
M.save(out)
