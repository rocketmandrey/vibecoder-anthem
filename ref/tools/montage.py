import sys
from PIL import Image, ImageDraw
out=sys.argv[1]; fr=[int(x) for x in sys.argv[2:]]; W,H,cols=480,270,4
im=Image.new('RGB',(W*cols,H*((len(fr)+cols-1)//cols)))
for i,f in enumerate(fr):
    t=Image.open(f'ref/f/{f:04d}.jpg').resize((W,H)); ImageDraw.Draw(t).text((6,6),str(f),fill=(255,0,0)); im.paste(t,((i%cols)*W,(i//cols)*H))
im.save(out)
