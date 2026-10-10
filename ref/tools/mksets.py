# mksets.py n0 n1 : per-frame soup region sets for ref files n0..n1 -> out/qa_B/set_N.js (soup units relative to the star)
import sys, subprocess, math
from concurrent.futures import ThreadPoolExecutor
def mono(keys):
    xs=[k[0] for k in keys]; ys=[k[1] for k in keys]; n=len(keys); d=[(ys[i+1]-ys[i])/(xs[i+1]-xs[i]) for i in range(n-1)]; m=[0]*n
    m[0]=d[0]; m[n-1]=d[n-2]
    for i in range(1,n-1): m[i]=0 if d[i-1]*d[i]<=0 else (d[i-1]+d[i])/2
    for i in range(n-1):
        if not d[i]: m[i]=m[i+1]=0; continue
        a=m[i]/d[i]; b=m[i+1]/d[i]; s=a*a+b*b
        if s>9: k=3/math.sqrt(s); m[i]=k*a*d[i]; m[i+1]=k*b*d[i]
    def f(t):
        if t<=xs[0]: return ys[0]
        if t>=xs[-1]: return ys[-1]
        i=0
        while t>xs[i+1]: i+=1
        h=xs[i+1]-xs[i]; u=(t-xs[i])/h; u2=u*u; u3=u2*u
        return (2*u3-3*u2+1)*ys[i]+(u3-2*u2+u)*h*m[i]+(-2*u3+3*u2)*ys[i+1]+(u3-u2)*h*m[i+1]
    return f
SU1=mono([[6.9,.04],[7.0,.045],[7.042,.055],[7.125,.1],[7.167,.13],[7.208,.17],[7.25,.22],[7.292,.30],[7.333,.385],[7.375,.569],[7.417,.744],[7.458,.884],[7.5,.963],[7.542,.996],[7.583,1],[7.667,1.023],[7.75,1.034],[7.875,1.041],[8.0,1.051],[8.125,1.086],[8.167,1.152],[8.208,1.207],[8.25,1.266],[8.292,1.286],[8.333,1.328],[8.5,1.55]])
def S3(a,b,t):
    k=min(1,max(0,(t-a)/(b-a))); return k*k*(3-2*k)
def job(n):
    t=(n-1)/24; u=SU1(t); k=S3(7.583,8.125,t); sx=962+(951-962)*k; sy=543+(539-543)*k
    subprocess.run(['python3','ref/tools/blobs.py',str(n),'30'],check=True,stdout=subprocess.DEVNULL)
    r=subprocess.run(['python3','ref/tools/blobs2.py',str(sx),str(sy),str(u),str(n)],check=True,capture_output=True,text=True)
    open('out/qa_B/set_%d.js'%n,'w').write(r.stdout.strip()); return n,r.stderr.strip()
with ThreadPoolExecutor(4) as ex:
    for n,e in ex.map(job,range(int(sys.argv[1]),int(sys.argv[2])+1)): print(n,e)
