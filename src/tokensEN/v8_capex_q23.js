// Q2 aisle ambush; Q3 broadcast earnings briefing. Native cast and real-audio phoneme spans.
(() => {
function reporterEdition(r, formal) {
  const INK = PAL.ink, CREAM = PAL.cream;
  const sh = (p, c, sw = 1.2) => paint(p, { wash: c, fill: mixCol(c, TK.soot, .30), fillOp: 55, bleed: .035, tex: .6, border: .5, ink: INK, sw });
  const box = (x, y, w, h, c, sw) => sh(rectPts(x, y, w, h, 1.2), c, sw);
  const oval = (x, y, a, b, c, sw) => sh(ellPts(x, y, a, b, 18, .6), c, sw);
  const line = (p, w = 1, c = INK) => inkLine(p, w, c, 'ink', 0);
  const hit = (at, life = .12) => r < at ? 0 : Math.exp(-(r - at) / life);
  const later = hit(202.26), how = hit(203.20), soon = hit(204.92), now = hit(205.90);
  const crashed = r >= 205.90, broken = r >= 204.92, age = Math.max(0, r - 205.90);
  const podiumEnd = false;
  const reveal = ease(seg(r, 204.28, 204.66));
  const rise = podiumEnd ? 355 * easeOut(seg(age, 0, 1.03)) : 0;
  // Source-audio word boundaries (assets/tokensEN/truth.json), in real song time.
  // The two foreground journalists alternate; the CEO speaks only the answers.
  const dialogue = [
    { s: 201.60, e: 202.18, who: 5, word: 'REVENUE?', sounds: ['flat', 'o', 'smile', 'O', 'o'] },
    { s: 202.26, e: 202.54, who: 'ceo', word: 'LATER!', sounds: ['O', 'smile', 'o', 'flat'] },
    { s: 202.60, e: 203.04, who: 8, word: 'PROFIT?', sounds: ['o', 'O', 'flat', 'o'] },
    { s: 203.20, e: 203.74, who: 'ceo', word: 'HOW?!', sounds: ['O', 'O', 'o'] },
    { s: 204.28, e: 204.84, who: 5, word: 'A-G-I?', sounds: ['O', 'smile', 'flat', 'O', 'smile'] },
    { s: 204.92, e: 205.18, who: 'ceo', word: 'SOON!', sounds: ['o', 'O', 'o', 'flat'] },
    { s: 205.24, e: 205.78, who: 8, word: 'CAPEX?', sounds: ['O', 'flat', 'smile', 'O', 'flat'] },
    { s: 205.90, e: 206.50, who: 'ceo', word: 'NOW!', sounds: ['flat', 'O', 'O', 'grin'] }
  ];
  if (!formal) dialogue.forEach(d => { if (d.who === 8) d.who = 5; });
  const spoken = who => dialogue.find(d => d.who === who && r >= d.s && r < d.e);
  const mouthOf = (d, idle) => d ? d.sounds[Math.min(d.sounds.length - 1, Math.floor(seg(r, d.s, d.e) * d.sounds.length))] : idle;
  const askPose = who => Math.max(0, ...dialogue.filter(d => d.who === who).map(d =>
    easeOut(seg(r, d.s - .12, d.s)) * (1 - ease(seg(r, d.e, d.e + .10)))));
  const beats = EN_BEATS.map(O2N).filter(t => t > 201.3 && t < 207.4);
  const rebound = (t, at, life = .30) => t < at || t > at + life ? 0 : Math.sin(seg(t, at, at + life) * Math.PI);
  const bounce = t => Math.max(0, ...beats.map(b => rebound(t, b, .28)));
  const pocketsAt = t => easeOut(seg(t, 203.06, 203.20)) * (1 - ease(seg(t, 203.85, 204.15)));
  // Native 2.2u arms: pose by angles, props attach at their original tips.
  function pose(t) {
    const wind = ease(seg(t, 202.04, 202.26)), follow = easeOut(seg(t, 202.26, 202.42));
    const settle = ease(seg(t, 202.42, 202.88)), pocket = pocketsAt(t);
    const press = ease(seg(t, 205.24, 205.57)), down = easeIn(seg(t, 205.72, 205.90));
    const cheer = easeOut(seg(t, 205.90, 206.08));
    const reaction = mood(t, [[201.60, 'narrow'], [203.20, 'scared'], [204.20, 'narrow'], [205.90, 'spark']]);
    let aL = lerp(.30, 1.22, wind), aR = -.28;
    if (t >= 202.26) aL = lerp(1.22 + .30 * follow, -.25, settle);
    aL = lerp(aL, -.57, pocket); aR = lerp(aR, -.57, pocket);
    if (t >= 205.24) aR = lerp(lerp(-.28, .70, press), -.91, down);
    if (t >= 205.90) { aL = lerp(-.25, .70, cheer) + .06 * Math.sin((t - 205.90) * 10) * cheer; aR = lerp(-.91, .90, cheer); }
    const sq = .025 * bounce(t) + .045 * rebound(t, 203.20, .28) + .06 * rebound(t, 205.90, .24);
    const rot = -.014 * Math.sin((t - 201.60) * 5) + (t < 202.88 ? .025 * wind - .045 * follow : 0);
    return { aL, aR, sq, rot, y: 949 - 4 * bounce(t), ...reaction };
  }
  const heroX = formal ? 900 : 1010, u = formal ? 35 : 35, body = pose(r), heroY = body.y - rise;
  function hand(t, side, lift = 0) {
    const o = pose(t), a = side < 0 ? o.aL : o.aR, q = o.sq + o.take;
    const sx = 1 + q * .6, sy = 1 - q, c = Math.cos(o.rot), sn = Math.sin(o.rot);
    const x = side * (4.9 + 2.2 * Math.cos(a)) * u, y = (-4.5 - 2.2 * Math.sin(a)) * u;
    return [heroX + c * x * sx - sn * y * sy, o.y - lift + sn * x * sx + c * y * sy];
  }
  const button = hand(205.90, 1), release = hand(202.26, -1), releaseAngle = pose(202.26).rot;

  function mic(x, y, a = 0, s = 1) {
    push(); translate(x, y); rotate(a); scale(s);
    sh(rrPts(-8, -36, 16, 54, 5), '#535B63'); oval(0, -46, 19, 22, '#A4ABB0', .8);
    for (let i = -2; i <= 2; i++) line([[-12, -46 + i * 6], [12, -46 + i * 6]], .45); pop();
  }
  function spark(x, y, k, rad = 60) {
    if (k > .025) paint(starPts(x, y, rad * k, .35, 8), { wash: CREAM, ink: null });
  }
  function rack(x, floor, w, h, tilt = 0, seed = 0) {
    push(); translate(x, floor); rotate(tilt);
    if (h < 80) box(-w / 2, -h, w, h, TK.steel);
    else serverRack(-w / 2, -h, w, h, N2O(r), { seed, units: Math.max(2, Math.round(h / 90)), heat: .10 * now, fire: 0 });
    box(-w / 2 + 5, 0, 20, 12, TK.soot); box(w / 2 - 25, 0, 20, 12, TK.soot); pop();
  }
  function camera() {
    sh(rrPts(-16, -13, 32, 24, 3, .6), TK.steelDk, .7);
    box(-10, -18, 14, 6, TK.steelLt, .5);
    oval(16, 0, 9, 10, TK.soot, .6); oval(18, 0, 5, 6, '#7A93D8', .5);
  }
  function reporter(x, y, s, journalist, seed) {
    const flee = crashed ? easeOut(seg(age, .06, 1.35)) : 0;
    const roaming = !formal && journalist ? 16 * Math.sin((r - 201.6) * 2.4) : 0;
    const question = spoken(seed), ask = journalist ? askPose(seed) : 0;
    const xx = x + roaming + (seed % 2 ? -1 : 1) * flee * 42;
    const aR = journalist ? lerp(-.65, .58, ask) : 1.1 + .06 * Math.sin(r * 5 + seed);
    const aL = journalist ? lerp(.15, .83, ask) : crashed ? .95 : .2;
    const dy = -.32 * bounce(r + seed * .017) - .28 * ask;
    const reaction = mood(r, [[201.60, 'narrow'], [205.90, 'scared']]);
    const lean = journalist ? (seed === 5 ? .025 : -.025) * ask : 0;
    push(); translate(xx, y); scale(s);
    agentBot(0, 0, 8, N2O(r), { seed, dance: 'idle', dx: 0, dy,
      noShadow: false, ...reaction, flip: journalist && seed === 8,
      eyes: question ? 'normal' : reaction.eyes,
      squint: question ? 0 : reaction.squint,
      sq: .03 * bounce(r + seed * .017) + .035 * ask,
      rot: lean + (crashed ? .06 * Math.sin(age * 11 + seed) : .012 * Math.sin(r * 5 + seed)),
      walk: crashed ? age * 3 : null,
      mouth: mouthOf(question, crashed ? 'o' : 'flat'), aL, aR,
      armR: uu => {
        push(); rotate(aR); if (journalist) mic(0, 0, -.55, .5); else camera(); pop();
      }
    }); pop();
    if (question) {
      // A single balloon points to the speaking reporter; the other reporter stays quiet.
      const by = y - (formal ? 242 : 320), bw = question.word === 'REVENUE?' ? 286 : 248, bh = 68;
      sh([[xx - 22, by + bh - 3], [xx + 17, by + bh - 3], [xx + 5, y - (formal ? 168 : 225)]], CREAM, 1.2);
      sh(rrPts(xx - bw / 2, by, bw, bh, 12, .8), CREAM, 1.4);
      letter(question.word, xx, by + bh / 2, 33, INK, { ink: false, font: ruFont(33) });
      // Two small hand-drawn accents make the raised microphone readable at phone size.
      const dir = seed === 5 ? 1 : -1;
      line([[xx + dir * 144, y - (formal ? 160 : 225)], [xx + dir * 163, y - (formal ? 174 : 239)]], 1.0, CREAM);
      line([[xx + dir * 154, y - (formal ? 141 : 206)], [xx + dir * 177, y - (formal ? 145 : 210)]], 1.0, CREAM);
    }
  }
  function robot() {
    push(); translate(1254,951); scale(.88); translate(-1254,-951);
    // Boots touch the stage; every detached part lands on that same plane.
    const dt = Math.max(0, r - 204.92), base = 951;
    const parts = [[0, -608, 173, 116], [0, -416, 168, 230],
      [-123, -416, 53, 182], [123, -416, 53, 182], [-49, -133, 55, 264], [49, -133, 55, 264]];
    for (let i = 0; i < parts.length; i++) {
      const [px, py, w, h] = parts[i]; let dx = 0, dy = 0, tilt = 0;
      if (broken) {
        const sign = i % 2 ? 1 : -1;
        if (i === 0) {
          const startY = base + py, floorY = base - h / 2;
          const contact = (75 + Math.sqrt(75 * 75 + 4 * 850 * (floorY - startY))) / 1700;
          dx = 30 * easeOut(seg(dt, 0, .15)) + 67 * dt;
          dy = dt < contact ? -75 * dt + 850 * dt * dt : floorY - startY - 43 * Math.abs(Math.sin((dt - contact) * 11)) * Math.exp(-(dt - contact) * 3);
          tilt = dt * 2.5;
        } else if (i === 2 || i === 3) {
          dx = sign * (30 * easeOut(seg(dt, 0, .14)) + 53 * dt);
          dy = Math.min(-py - h / 2, -75 * dt + 680 * dt * dt); tilt = sign * dt * 1.9;
        } else {
          dx = sign * 12 * easeOut(seg(dt, 0, .2));
          dy = Math.min(-py - h / 2, 700 * dt * dt); tilt = sign * Math.min(1.35, dt * (i === 1 ? 1.45 : .65));
        }
      }
      if (broken) dy = Math.min(dy, -py - (Math.abs(w * Math.sin(tilt)) + Math.abs(h * Math.cos(tilt))) / 2);
      push(); translate(1254 + px + dx, base + py + dy); rotate(tilt);
      sh(rrPts(-w / 2, -h / 2, w, h, 7, 1.3), i === 1 ? TK.steel : TK.steelLt, 1.6);
      for (const side of [-1, 1]) oval(side * (w / 2 - 12), -h / 2 + 17, 3.5, 3.5, TK.copper, .5);
      box(-w / 2 + 9, -h / 2 + 9, w - 18, 7, '#9097A0', .4);
      if (i === 3 && !broken) {
        box(-w / 2 + 5, -15, w - 10, h / 2 - 4, TK.steelDk, .5);
        for (let j = 0; j < 3; j++) line([[-16 + j * 13, -6], [-22 + j * 15, 50], [-10 + j * 9, 92]], .8, j % 2 ? TK.copper : TK.led);
      }
      if (i === 0) {
        for (const ex of [-38, 38]) box(ex - 9, -15, 18, broken ? 8 : 21, broken ? TK.ember : TK.led, .6);
        line([[-25, 27], [25, 27]], 1.0);
      }
      if (i === 1) {
        box(-62, -78, 124, 160, TK.steelDk, .8);
        box(-39, -52, 78, 54, TK.pcb, .6);
        for (let j = 0; j < 4; j++) line([[-40 + j * 23, 10], [-49 + j * 28, 43], [-28 + j * 17, 67]], 1.1, j % 2 ? TK.copper : TK.led);
        oval(0, -23, 17, 17, broken ? TK.yellow : TK.led, .6);
      }
      pop();
    }
    spark(1254, 405, soon, 73);
    pop();
  }
  const cam = formal
    ? kf(r, [[201.60,[955,885,1.35]],[203.20,[954,880,1.38]],[204.60,[1040,790,1.23]],
      [205.24,[1010,830,1.28]],[205.90,[960,890,1.32]],[207.26,[960,892,1.30]]])
    : kf(r, [[201.60,[915,892,1.30]],[202.26,[927,880,1.32]],[203.20,[944,870,1.32]],
      [204.60,[1030,810,1.12]],[205.24,[1000,850,1.20]],[205.90,[967,876,1.30]],[207.26,[961,880,1.30]]]);
  const shake = later * 3 + how * 3 + soon * 5 + now * 8;
  camBegin(cam[0] + Math.sin(r * 71) * shake, cam[1] + Math.cos(r * 89) * shake, cam[2]);
  paint(rectPts(-1800,-1800,5600,4800), { wash:formal ? '#314453' : '#413346',
    fill:formal ? '#5B7784' : '#594053',fillOp:75,bleed:.05,tex:.7,border:.4,ink:null });
  if (formal) {
    // Broadcast earnings desk: a teal graph wall, studio lights and a long formal dais.
    sh(rrPts(505,210,925,635,24,1.5),'#4A6571',1.2);
    box(529,234,878,575,'#355460',.7);
    for (let j=0;j<5;j++) line([[565,295+j*102],[1360,295+j*102]],.5,'#6B8B91');
    for (let j=0;j<7;j++) line([[565+j*125,270],[565+j*125,770]],.4,'#6B8B91');
    const g=seg(r,201.6,205.9), climb=easeOut(seg(r,205.9,206.65));
    line([[582,697],[752,696],[918,695],[1060,695],[1210,695-310*climb],[1360,695-416*climb]],3.5,climb ? TK.yellow : '#94B2BA');
    for (const xx of [580,1350]) { line([[xx,50],[xx,170]],1.6); box(xx-48,140,96,40,TK.steelDk); }
    letter('EARNINGS  /  LIVE',940,480,36,CREAM,{font:ruFont(36),ink:false});
    box(493,936,990,21,'#9C8876');
    box(-700,956,3400,1400,'#293B46');
    for (let j=0;j<6;j++) line([[530+j*170,985],[440+j*200,1380]],.6,'#48616B');
    if(reveal>0) { glowAt(1270,655,220,TK.yellowLt,25); robot(); }
  } else {
    // An aisle interview: the CEO is cornered on foot by a roaming field reporter.
    for(let j=0;j<8;j++) {
      const xx=435+j*137;
      box(xx,200,108,620,j%2 ? '#46364D':'#513B51',.6);
      line([[xx+18,280],[xx+22,780]],.5,'#674D64');
    }
    box(575,246,266,384,'#79614D',1.4); box(595,267,226,340,'#4D3E46',.7);
    oval(798,470,8,8,TK.yellow,.7);
    box(-700,952,3400,1400,'#4A3740');
    sh([[585,954],[760,954],[700,1390],[280,1390]],'#896B57',.7);
    for(const side of [-1,1]) for(let j=0;j<3;j++) {
      const xx=side<0 ? 415-j*120 : 1430+j*125, yy=1080+j*120;
      box(xx,yy-96,95,90,'#5A4653',.8); line([[xx+15,yy],[xx+8,yy+55]],.7);line([[xx+82,yy],[xx+95,yy+55]],.7);
    }
    if(reveal>0) { glowAt(1254,645,180,TK.yellowLt,24); robot(); }
    // Camera operator follows at the back of the aisle, below the speaking reporter.
    reporter(865,1320,2.3,false,2);
  }

  ceoClawd(heroX, heroY, u, { ...body, noClicker: true, noShadow: false,
    mouth: mouthOf(spoken('ceo'), crashed ? 'grin' : 'flat'),
    armL: uu => {
      if (r < 202.26) { push(); rotate(body.aL); mic(0, 0, 0, 1.08); pop(); }
    },
    draw: uu => {
      const pull = pocketsAt(r);
      if (pull > 0) for (const side of [-1, 1]) {
        const x = side * 4.4 * uu, y = -3.7 * uu;
        sh([[x, y], [x + side * 60 * pull, y - 10 * pull],
          [x + side * 90 * pull, y + 10 * pull], [x + side * 94 * pull, y + 70 * pull],
          [x + side * 55 * pull, y + 87 * pull], [x + side * 10 * pull, y + 65 * pull],
          [x, y + 35]], CREAM, 1.05);
        line([[x + side * 14, y + 14], [x + side * 72 * pull, y + 14 * pull]], .7, '#9A9B91');
        line([[x + side * 18, y + 35], [x + side * 29 * pull, y + 62 * pull],
          [x + side * 56 * pull, y + 73 * pull]], .55, '#B3AD99');
      }
    } });
  if (r >= 202.26 && r < 203.06) {
    const dt = r - 202.26;
    mic(release[0] - 590 * dt, release[1] - 390 * dt + 580 * dt * dt, releaseAngle - dt * 9, 1.08);
    if (dt < .12) for (let i = 0; i < 3; i++)
      line([[release[0] + 15 + i * 9, release[1] + i * 14], [release[0] + 38 + i * 9, release[1] + 8 + i * 14]], .9, CREAM);
  }
  if (!crashed || !podiumEnd) {
    if (formal) {
      box(589,889,697,70,'#557985',1.5);
      box(603,901,669,44,'#6D9299',.7);
      box(573,879,724,24,'#A0AAA3',1.4);
      for (let i=0;i<3;i++) {
        const x=797+i*74; line([[x+12,883],[x,854]],.9);mic(x,854,(i-1)*.15,.5);
      }
      letter('Q&A',690,925,25,CREAM,{font:ruFont(25),ink:false});
    }
    const lift = easeOut(seg(r, 205.24, 205.54)), by = lerp(902, button[1], lift);
    if (lift > .01) {
      box(button[0] - 34, by + 10, 68, 36, TK.steelDk);
      const pushDown = 6 * rebound(r, 205.90, .18);
      oval(button[0], by + pushDown, 25, 13 - pushDown * .45, TK.ember);
    }
    if (r >= 205.72 && r < 206.04) {
      const grip = hand(r, 1, rise), q = body.sq + body.take;
      push(); translate(...grip); rotate(body.rot - body.aR); scale(1 + q * .6, 1 - q);
      paint(rectPts(-18, -20, 18, 40, 1.2), { wash: PAL.clay, fill: '#3E5A8C', fillOp: 50, ink: INK, sw: 1.6 }); pop();
    }
  }
  if (crashed) {
    if (podiumEnd && rise > 2) {
      // The former podium becomes a lifting rack. Hero and roof share ONE support point.
      rack(887, 949, 386, rise, 0, 4);
      // Redraw the planted feet over the roof edge, without a duplicate face or body.
      for (const lx of [-4, -2, 1, 3]) box(heroX + lx * u * (1 + (body.sq + body.take) * .6), heroY - 8, u * (1 + (body.sq + body.take) * .6), 10, '#3E5A8C', .7);
    }
    spark(button[0] + 26, button[1] + 26, now, 42);
    for (let i = 0; i < (podiumEnd ? 7 : 0); i++) {
      const vx = (i - 3) * 75, vy = -140 - hash(i) * 160;
      const x = 904 + (i - 3) * 39 + vx * age, y = Math.min(951 - i % 2 * 17, 786 + vy * age + 520 * age * age);
      push(); translate(x, y); rotate((i - 3) * (.15 + age * 1.8));
      sh([[-33, -9], [34, -13], [47, 7], [-24, 19]], i % 2 ? '#A1896B' : '#665247', .8); pop();
    }
    // Button and its platform remain one object when they break away.
    if (podiumEnd) {
      const bx = button[0] + age * 95, by = button[1] - age * 190 + age * age * 380;
      box(bx - 35, by, 71, 18, '#273039'); oval(bx, by - 4, 26, 11, '#CF5744', .7);
    }
    if (r >= 206.20) {
      const travel = easeOut(seg(r,206.20,206.80));
      const xx = formal ? 1300 : lerp(1550,1290,travel);
      const yy=949;
      rack(xx,yy,formal ? 132:170,formal ? 455:425,formal ? -.03:0,3);
      if(!formal) { box(xx-120,yy+5,240,22,'#69727A');for(const wx of [-80,80])oval(xx+wx,yy+39,20,20,TK.soot); }
    }
    for (const at of [205.90, 206.40, 206.85]) {
      const dt = r - at; if (dt < 0 || dt > 1.35) continue;
      const ox = at === 205.90 ? 1100 : at === 206.40 ? 1348 : 567;
      for (let i = 0; i < 7; i++) {
        const vx = (hash(i + at) - .5) * 440, vy = -120 - hash(i + 8) * 250;
        const x = ox + vx * dt, y = 892 + vy * dt + 310 * dt * dt;
        line([[x, y], [x - vx * .022, y - (vy + 620 * dt) * .022]], .8, i % 2 ? '#F4B053' : CREAM);
      }
    }
  }
  // Speaker-specific balloons follow the native mouths and real word intervals.
  const reply=spoken('ceo');
  if(reply) {
    const bx=heroX, by=heroY-437, bw=reply.word==='LATER!' ? 214:182;
    sh([[bx-15,by+62],[bx+14,by+62],[bx,heroY-318]],CREAM,1.0);
    sh(rrPts(bx-bw/2,by,bw,65,12,.8),CREAM,1.2);
    letter(reply.word,bx,by+32,32,INK,{ink:false,font:ruFont(32)});
  }
  if(formal) { reporter(800,1215,2.5,true,5);reporter(1150,1215,2.5,true,8); }
  else reporter(810,1135,3.2,true,5);
  camEnd();
}
window.CAPEX_V = window.CAPEX_V || {};
CAPEX_V.q2 = r => reporterEdition(r,false);
CAPEX_V.q3 = r => reporterEdition(r,true);
})();
