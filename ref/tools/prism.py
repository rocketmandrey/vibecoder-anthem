import numpy as np
from col import load
# front-face vertices from cream outline
for n in list(range(250,279,2)):
    im=load(n); m=(im[:,:,0]>225)&(im[:,:,1]>220)&(im[:,:,2]>195)
    m[:, :400]=False; m[:, 1300:]=False
    ys,xs=np.where(m)
    if len(ys)<50: print(n,'none');continue
    ay=ys.min(); ax=xs[ys<=ay+3].mean()
    by=ys.max(); sel=ys>by-18
    print(n,'apex(%d,%d) BL(%d,%d) BR(%d,%d)'%(ax,ay,xs[sel].min(),by,xs[sel].max(),by))
