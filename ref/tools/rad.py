import sys,numpy as np
from PIL import Image
def seq(im,cx,cy,ang):
    a=np.radians(ang); out=[]; last=None
    for rr in range(10,900,2):
        x=int(cx+rr*np.cos(a)); y=int(cy+rr*np.sin(a))
        if not(0<=x<1920 and 0<=y<1080): break
        p=im[y,x]
        k='R' if p[0]>170 and p[1]<110 and p[2]<110 else ('P' if p[2]>150 and p[0]>100 and p[1]<110 else '.')
        if k!='.' and k!=last: out.append((rr,k))
        if k!='.': last=k
        elif last and rr%2==0 and np.abs(p-np.array([10,11,32])).sum()<40: last=None
    return out
for path in sys.argv[1:]:
    im=np.asarray(Image.open(path).convert('RGB')).astype(int); cx,cy=960,540
    print(path)
    for ang in (0,90,180,270): print(' ',ang,seq(im,cx,cy,ang))
