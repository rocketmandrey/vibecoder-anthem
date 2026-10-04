// Stage pitch alternatives. Choreography follows real source-audio seconds.
(() => {
  window.CAPEX_V = window.CAPEX_V || {};
  const C = { ink: PAL.ink, cream: PAL.cream, gold: '#E4AC5A', pale: '#E7DBC3', red: '#C65B4D', blue: '#708AAB', wall: '#3D303C', wood: '#94735B' };
  const sh = (p, c, sw = 1.1) => paint(p, { wash: c, fill: mixCol(c, C.ink, .25), fillOp: 46, bleed: .035, tex: .55, border: .35, ink: C.ink, sw });
  const box = (x,y,w,h,c,sw) => sh(rectPts(x,y,w,h,1),c,sw);
  const oval = (x,y,w,h,c,sw) => sh(ellPts(x,y,w,h,20,.5),c,sw);
  const line = (p,w=1,c=C.ink) => inkLine(p,w,c,'ink',0);
  const txt = (s,x,y,z,c=C.ink) => letter(s,x,y,z,c,{font:ruFont(z),ink:false});
  const D = [
    [201.60,202.18,0,'REVENUE?',['flat','o','smile','O','o']],
    [202.26,202.54,2,'LATER!',['O','smile','o','flat']],
    [202.60,203.04,1,'PROFIT?',['o','O','flat','o']],
    [203.20,203.74,2,'HOW?!',['O','O','o']],
    [204.28,204.84,0,'A-G-I?',['O','smile','flat','O','smile']],
    [204.92,205.18,2,'SOON!',['o','O','o','flat']],
    [205.24,205.78,1,'CAPEX?',['O','flat','smile','O','flat']],
    [205.90,206.50,2,'NOW!',['flat','O','O','grin']]
  ];
  const speech = (r,id) => D.find(d=>d[2]===id && r>=d[0] && r<d[1]);
  const mouth = (r,id,idle='flat') => { const d=speech(r,id); return d ? d[4][Math.min(d[4].length-1,Math.floor(seg(r,d[0],d[1])*d[4].length))] : idle; };
  const ask = (r,id) => Math.max(0,...D.filter(d=>d[2]===id).map(d=>easeOut(seg(r,d[0]-.12,d[0]))*(1-ease(seg(r,d[1],d[1]+.10)))));
  const hit = (r,a,life=.18) => r<a ? 0 : Math.exp(-(r-a)/life);
  const kick = (r,a,len=.24) => r<a || r>a+len ? 0 : Math.sin(seg(r,a,a+len)*Math.PI);
  const bob = r => Math.max(0,...EN_BEATS.map(O2N).filter(t=>t>201.3&&t<207.4).map(t=>kick(r,t,.28)));
  function mic(x,y,a=0,s=1) {
    push();translate(x,y);rotate(a);scale(s);
    sh(rrPts(-7,-25,14,49,5), '#5A565E');oval(0,-35,16,20,'#A8ACA6',.8);
    for(let i=-2;i<=2;i++) line([[-11,-35+i*6],[11,-35+i*6]],.4);pop();
  }
  function stage(r,kind) {
    paint(rectPts(-1800,-1800,5500,4200),{wash:kind===1?'#524146':'#352B35',fill:'#7B5F58',fillOp:32,tex:.65,ink:null});
    for(let i=0;i<10;i++) {
      const x=300+i*140;
      sh([[x,-600],[x+142,-600],[x+125+2*Math.sin(r*2+i),940],[x-8,940]],i%2?'#46363F':'#3D303A',.5);
      line([[x+29,-20],[x+24,925]],.45,'#70535A');
    }
    for(const x of [600,1320]) paint([[x-40,-300],[x+40,-300],[x+250,936],[x-250,936]],{fill:'#E6B970',fillOp:21,tex:.35,bleed:.03,ink:null});
    box(-500,940,3100,850,kind===1?'#63504A':'#493D40');
    box(375,928,1170,22,C.wood,1.5);
    for(let i=0;i<9;i++) line([[420+i*130,960],[345+i*154,1390]],.5,'#B0916D');
  }
  function audience(r,id,x,y,kind=1) {
    const d=speech(r,id), k=ask(r,id);
    box(x-79,y-90,158,125,kind===1?'#655251':'#5D464E',1.1);
    push();translate(x,y-4*bob(r+id*.03));scale(2.45);
    agentBot(0,0,8,N2O(r),{seed:id+20,dance:'idle',dx:0,dy:-.2*k,rot:(id?-.012:.012)*k,flip:id===1,
      sq:.018*bob(r)+.03*k,noShadow:true,eyes:d?'normal':r>=205.9?'scared':'look',lookX:id?-.6:.6,
      mouth:mouth(r,id),aL:-.5,aR:lerp(-.35,1.25,k),col:kind===1?C.blue:'#AA8491',dk:kind===1?'#536A87':'#755F74',lt:'#C5B9B2',
      armR:uu=>{push();rotate(lerp(-.35,1.25,k));mic(0,0,-.65,.43);pop();}});pop();
    if(d) {
      const bx=id?x-60:x+60,by=y-280,w=d[3]==='REVENUE?'?302:258;
      sh([[bx-15,by+66],[bx+18,by+66],[x,y-154]],C.cream);
      sh(rrPts(bx-w/2,by,w,68,14,1),C.cream,1.4);txt(d[3],bx,by+35,34);
    }
  }
  function pose(r) {
    const pocket=easeOut(seg(r,203.05,203.20))*(1-ease(seg(r,203.85,204.12))), wind=ease(seg(r,202.05,202.26));
    const follow=easeOut(seg(r,202.26,202.42)),settle=ease(seg(r,202.42,202.9));
    let aL=r<202.26?lerp(.25,1.22,wind):lerp(1.22+.24*follow,-.22,settle),aR=.55;
    aL=lerp(aL,-.53,pocket);aR=lerp(aR,-.53,pocket);
    if(r>=204.28)aR=lerp(aR,1.06,easeOut(seg(r,204.28,204.5)));
    if(r>=205.24)aR=lerp(aR,-.52,ease(seg(r,205.65,205.9)));
    if(r>=205.9){const g=easeOut(seg(r,205.9,206.1));aL=lerp(-.22,.88,g);aR=lerp(-.52,1.18,g);}
    return {aL,aR,pocket,sq:.025*bob(r)+.055*kick(r,203.2)+.07*kick(r,205.9),rot:-.012*Math.sin(r*5)-.028*hit(r,202.26),...mood(r,[[201.6,'narrow'],[203.2,'scared'],[204.2,'narrow'],[205.9,'spark']])};
  }
  function presenter(r,x,y,u,walking=false) {
    const o=pose(r);ceoClawd(x,y-4*bob(r),u,{...o,walk:walking?r*3.2:null,noClicker:true,noShadow:false,mouth:mouth(r,2,r>=205.9?'grin':'flat'),
      armL:()=>{if(r<202.26){push();rotate(o.aL);mic(0,0,0,1);pop();}},
      draw:uu=>{if(o.pocket>.01)for(const s of [-1,1]) {
        const px=s*4.4*uu,py=-3.7*uu,k=o.pocket;
        sh([[px,py],[px+s*56*k,py-5],[px+s*86*k,py+14],[px+s*86*k,py+64],[px+s*45*k,py+75],[px+s*7*k,py+44]],C.cream,.9);
        line([[px+s*15,py+14],[px+s*59*k,py+22],[px+s*55*k,py+55]],.6,'#B5AA96');
      }}});
    if(r>=202.26&&r<203.1) {
      const a=r-202.26,po=pose(202.26),hx=x-(4.9+2.2*Math.cos(po.aL))*u,hy=y-(4.5+2.2*Math.sin(po.aL))*u;
      mic(hx-510*a,hy-330*a+570*a*a,-a*8,1);
    }
  }
  function bot(r,x,y,u) {
    const broken=r>=204.92,dt=Math.max(0,r-204.92);
    for(const [px,py,w,h,ix] of [[0,-6.9,4.5,2.7,0],[0,-3.9,4,3.2,1],[-2.8,-4,1.2,3,2],[2.8,-4,1.2,3,3],[-1.1,-.8,1.1,2.2,4],[1.1,-.8,1.1,2.2,5]]) {
      const sign=ix%2?1:-1,ang=broken?sign*Math.min(1.2,dt*2):0;
      const half=(Math.abs(w*u*Math.sin(ang))+Math.abs(h*u*Math.cos(ang)))/2;
      const yy=broken?Math.min(-half,py*u-70*dt+600*dt*dt):py*u;
      push();translate(x+px*u+(broken?sign*25*dt:0),y+yy);rotate(ang);
      sh(rrPts(-w*u/2,-h*u/2,w*u,h*u,6,.7),ix===1?'#819494':'#B0B9B1');
      if(ix===0){for(const s of [-1,1])box(s*21-6,-10,12,broken?6:14,broken?C.red:'#D6AA5D',.6);line([[-13,18],[13,18]],.8);}
      if(ix===1){box(-24,-25,48,50,'#5F7679');oval(0,0,11,11,broken?C.red:C.gold,.5);}pop();
    }
    if(hit(r,204.92)>.1)for(let i=0;i<6;i++){const a=i*TAU/6;line([[x+Math.cos(a)*55,y-115+Math.sin(a)*50],[x+Math.cos(a)*80,y-115+Math.sin(a)*75]],1.5*hit(r,204.92),C.gold);}
  }
  function rack(r,x,y,w,h,seed) {serverRack(x-w/2,y-h,w,h,N2O(r),{seed,units:4,heat:0,fire:0});}
  CAPEX_V.p1 = function(r) {
    const z=kf(r,[[201.6,1.06],[203.2,1.10],[204.28,1.06],[205.9,1.04],[207.26,1.04]]);
    camBegin(960,615,z);stage(r,1);
    box(535,15,850,447,'#997E6B',1.6);box(551,29,818,416,C.pale,.9);
    txt('DEMO DAY',960,-8,32,C.gold);
    const phase=r<202.60?0:r<204.28?1:r<205.24?2:3;
    const titles=['REVENUE','PROFIT','AGI','CAPEX'];txt(titles[phase],960,88,41);
    line([[584,120],[1335,120]],.8,'#AC967E');
    if(phase===0) {
      const off=r>=202.26?easeOut(seg(r,202.26,202.55)):0;
      line([[663,333],[1208,333]],1.1);line([[663,333],[663,165]],1.1);
      for(let i=0;i<4;i++){const h=37+i*30;box(724+i*114,333-h,56,h,'#87A294');}
      if(off<.95){line([[715+off*290,309],[825+off*290,268],[941+off*290,230],[1089+off*290,164]],3,C.red);sh([[1089+off*290,164],[1055+off*290,171],[1080+off*290,197]],C.red,.8);}
      if(r>=202.26)txt('LATER!',1010,377,42,C.red);
    } else if(phase===1) {
      const open=easeOut(seg(r,203.20,203.37));
      oval(958,250,100,100,C.gold,1.6);oval(958,250,79,79,C.pale,.8);
      txt(open>.3?'?':'0',958,250,99,open>.3?C.red:C.ink);
      txt(r>=203.20?'HOW?!':'MARGIN',960,379,42,r>=203.20?C.red:C.ink);
    } else if(phase===2) {
      const broken=r>=204.92;
      box(775,165,370,136,'#C4CFBF',1.3);txt(broken?'OFFLINE':'DEMO READY',960,233,37,broken?C.red:'#597663');
      txt(broken?'SOON!':'PROTOTYPE',960,371,42,broken?C.red:C.ink);
    } else {
      const k=easeOut(seg(r,205.90,206.18));
      for(let i=0;i<5;i++)box(678+i*116,350-(55+120*k)*(i+1)/5,60,(55+120*k)*(i+1)/5,i<3?'#829D93':C.red);
      line([[655,350],[1250,350]],1.3);txt(r>=205.90?'BUY NOW!':'COMPUTE',960,394,42,r>=205.90?C.red:C.ink);
    }
    if(r>=204.28&&r<205.90)bot(r,1265,918,19);
    oval(960,915,290,52,'#B09568',.5);
    if(r>=205.9){const k=easeOut(seg(r,205.9,206.4));rack(r,608,922,141,360*k+25,6);rack(r,1317,922,141,428*k+25,7);}
    presenter(r,943,917,36);
    audience(r,0,584,1206);audience(r,1,1335,1206);
    camEnd();
  };
  CAPEX_V.p2 = function(r) {
    const z=kf(r,[[201.6,1.10],[203.2,1.12],[204.28,1.08],[205.90,1.03],[207.26,1.03]]);
    camBegin(960,607,z);stage(r,2);
    txt('THE NEXT BIG THING',960,-5,32,C.gold);
    // A painted roadmap, separate from the presenter and physically part of the set.
    sh(rrPts(530,56,840,486,25,1), '#E0CDB1',1.3);
    const phase=r<202.60?0:r<204.28?1:r<205.24?2:3;
    const ys=[144,247,350,453],names=['REVENUE','PROFIT','AGI','CAPEX'],ans=['LATER','HOW?','SOON','NOW!'],ats=[202.26,203.20,204.92,205.90];
    line([[669,145],[670,453]],3,'#AD8970');
    for(let i=0;i<4;i++) {
      const yes=r>=ats[i],focus=i===phase;
      oval(670,ys[i],focus?29:19,focus?29:19,yes?C.red:focus?C.gold:'#B4A58F',1.1);
      if(yes)txt(i===3?'!':i===1?'?':'✓',670,ys[i],26,C.cream);
      txt(names[i],focus?895:882,ys[i],focus?38:31,focus?C.ink:'#8A7769');
      if(yes)txt(ans[i],1220,ys[i],i===3?39:32,C.red);
      else if(focus)line([[1130,ys[i]],[1265,ys[i]]],1.3,'#B08D70');
    }
    // Continuous foot placement: walk during gaps, then stop to deliver each answer.
    const x=kf(r,[[201.6,881],[202.55,881],[203.05,962],[203.8,962],[204.20,847],[205.15,847],[205.58,957],[207.26,957]]);
    const moving=(r>202.55&&r<203.05)||(r>203.8&&r<204.20)||(r>205.15&&r<205.58);
    oval(960,902,285,70,'#AC4F48',1.3);oval(960,902,248,51,'#BD5B50',.6);
    if(r>=204.28&&r<205.90)bot(r,1233,917,20);
    if(r>=205.90){const k=easeOut(seg(r,205.90,206.48));rack(r,1270,916,162,330*k+25,22);rack(r,629,916,133,310*k+25,23);}
    presenter(r,x,905-(moving?Math.abs(Math.sin(r*18))*9:0),37,moving);
    if(moving)for(let i=0;i<2;i++)line([[x-65+i*52,929],[x-85+i*52,930]],.9,C.gold);
    audience(r,0,566,1205,2);audience(r,1,1340,1205,2);
    camEnd();
  };
})();
