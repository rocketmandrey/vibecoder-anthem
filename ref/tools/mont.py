import sys
from PIL import Image, ImageDraw
out=sys.argv[1]; ns=[int(x) for x in sys.argv[2:]]; cols=3; w,h=640,360
rows=(len(ns)+cols-1)//cols; M=Image.new('RGB',(cols*w,rows*h))
for i,n in enumerate(ns):
    im=Image.open(f'ref/f/{n:04d}.jpg').resize((w,h)); ImageDraw.Draw(im).text((6,6),str(n),fill=(255,0,0)); M.paste(im,((i%cols)*w,(i//cols)*h))
M.save(out)
