# skeleton of the pencil neuron (ref frame 227) -> polylines JSON (neuron-space = ref pixels of frame 227)
import numpy as np, json, sys
from PIL import ImageFilter
from PIL import Image
im=np.asarray(Image.open('ref/f/0227.jpg').convert('L')).astype(int)
m=im<136
from PIL import Image as I
mi=I.fromarray((m*255).astype('uint8')).filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(5)); m=np.asarray(mi)>0
m[:, :150]=False; m[:, 1800:]=False; m[975:,:]=m[975:,:]  # keep bottom bolt
m[:2,:]=False
m[:100,:740]=False; m[:100,1230:]=False
m[:, :450]=False; m[:, 1480:]=False
m[840:,:900]=False; m[840:,1070:]=False
# remove soma interior hatch region later; keep all
def zs(img):
    img=img.copy()
    while True:
        ch=False
        for step in (0,1):
            P=np.pad(img,1)
            p2=P[:-2,1:-1];p3=P[:-2,2:];p4=P[1:-1,2:];p5=P[2:,2:];p6=P[2:,1:-1];p7=P[2:,:-2];p8=P[1:-1,:-2];p9=P[:-2,:-2]
            nb=[p2,p3,p4,p5,p6,p7,p8,p9]
            B=sum(x.astype(int) for x in nb)
            seq=nb+[p2]
            A=sum(((~seq[i])&seq[i+1]).astype(int) for i in range(8))
            if step==0: c=(p2&p4&p6)==0; d=(p4&p6&p8)==0
            else: c=(p2&p4&p8)==0; d=(p2&p6&p8)==0
            rm=img&(B>=2)&(B<=6)&(A==1)&c&d
            if rm.any(): img=img&~rm; ch=True
        if not ch: return img
# drop small blobs: label via simple flood using numpy? use iterative approach with PIL
sk=zs(m)
np.save('out/qa_B/sk.npy',sk)
print(sk.sum())
