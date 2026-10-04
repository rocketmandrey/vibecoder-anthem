// Calm Q&A refinements 1A / 1B / 1C. Same native hero/camera, robot physically behind CEO from start.
window.CAPEX_V=window.CAPEX_V||{};
(() => {
function calmRefinement(r, edition) {
  const INK = PAL.ink, CREAM = PAL.cream;
  const sh = (p, c, sw = 1.2) => paint(p, { wash: c, fill: mixCol(c, TK.soot, .30), fillOp: 55, bleed: .035, tex: .6, border: .5, ink: INK, sw });
  const box = (x, y, w, h, c, sw) => sh(rectPts(x, y, w, h, 1.2), c, sw);
  const oval = (x, y, a, b, c, sw) => sh(ellPts(x, y, a, b, 18, .6), c, sw);
  const line = (p, w = 1, c = INK) => inkLine(p, w, c, 'ink', 0);
  const hit = (at, life = .12) => r < at ? 0 : Math.exp(-(r - at) / life);
  const later = hit(202.26), how = hit(203.20), soon = hit(204.92), now = hit(205.90);
  const crashed = r >= 205.90, broken = r >= 204.92, age = Math.max(0, r - 205.90);
  const podiumEnd = false;
  const reveal = ease(seg(r, 204.28, 204.78));
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
    const pocket = pocketsAt(t), dismiss = rebound(t,202.26,.28);
    const press = ease(seg(t, 205.24, 205.57)), down = easeIn(seg(t, 205.72, 205.90));
    const cheer = easeOut(seg(t, 205.90, 206.08));
    const reaction = mood(t, [[201.60, 'narrow'], [203.20, 'scared'], [204.20, 'narrow'], [205.90, 'spark']]);
    // LATER: a short dismissive "eh, later" wave made only by the native 2.2u arm.
    // The CEO has an empty hand throughout; the lectern and reporters retain their mics.
    let aL = kf(t,[[201.60,.10],[202.12,.10],[202.26,1.08],
      [202.34,.18],[202.43,1.22],[202.54,.25],[202.86,-.25]]), aR = -.28;
    aL = lerp(aL, -.57, pocket); aR = lerp(aR, -.57, pocket);
    if (t >= 205.24) aR = lerp(lerp(-.28, .70, press), -.91, down);
    if (t >= 205.90) { aL = lerp(-.25, .70, cheer) + .06 * Math.sin((t - 205.90) * 10) * cheer; aR = lerp(-.91, .90, cheer); }
    const sq = .025 * bounce(t) + .045 * rebound(t, 203.20, .28) + .06 * rebound(t, 205.90, .24);
    const rot = -.014 * Math.sin((t - 201.60) * 5) - .022*dismiss;
    return { aL, aR, sq, rot, y: 949 - 4 * bounce(t), ...reaction };
  }
  const heroX = 887, u = 40, body = pose(r), heroY = body.y - rise;
  function hand(t, side, lift = 0) {
    const o = pose(t), a = side < 0 ? o.aL : o.aR, q = o.sq + o.take;
    const sx = 1 + q * .6, sy = 1 - q, c = Math.cos(o.rot), sn = Math.sin(o.rot);
    const x = side * (4.9 + 2.2 * Math.cos(a)) * u, y = (-4.5 - 2.2 * Math.sin(a)) * u;
    return [heroX + c * x * sx - sn * y * sy, o.y - lift + sn * x * sx + c * y * sy];
  }
  const button = hand(205.90, 1);

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
    const question = spoken(seed), ask = journalist ? askPose(seed) : 0;
    const xx = x + (seed % 2 ? -1 : 1) * flee * 42;
    const aR = journalist ? lerp(-.65, .58, ask) : 1.1 + .06 * Math.sin(r * 5 + seed);
    const aL = journalist ? edition === 1 ? lerp(-.35,.05,ask)
      : edition === 2 ? lerp(.15,1.12,Math.max(ask,.8*reveal*(1-ease(seg(r,204.84,205.25)))))
      : lerp(.15,.83,ask) : crashed ? .95 : .2;
    const dy = -.32 * bounce(r + seed * .017) - .28 * ask;
    const reaction = mood(r, [[201.60, 'narrow'], [205.90, 'scared']]);
    const lean = journalist ? (seed === 5 ? .025 : -.025) * ask : 0;
    push(); translate(xx, y); scale(s);
    agentBot(0, 0, 8, N2O(r), { seed, dance: 'idle', dx: 0, dy,
      noShadow: false, ...reaction, flip: journalist && seed === 8,
      eyes: question ? 'normal' : r >= 204.40 && r < 205.35 ? 'look' : reaction.eyes,
      lookY: -1, lookX: seed === 5 ? .5 : -.5,
      squint: question ? 0 : reaction.squint,
      sq: .03 * bounce(r + seed * .017) + .035 * ask,
      rot: lean + (crashed ? .06 * Math.sin(age * 11 + seed) : .012 * Math.sin(r * 5 + seed)),
      walk: crashed ? age * 3 : null,
      mouth: mouthOf(question, 'flat'), aL, aR,
      armL: uu => {
        if(edition===1 && journalist) {
          push();rotate(-aL);sh(rrPts(-10,-18,22,32,3,.3),'#35545C',.6);box(-7,-14,16,20,'#A5BAB0',.3);line([[-4,-8],[4,-8]],.5,CREAM);pop();
        }
      },
      armR: uu => {
        push(); rotate(aR); if (journalist) mic(0, 0, -.55, .5); else camera(); pop();
      }
    }); pop();
    if (question) {
      // A single balloon points to the speaking reporter; the other reporter stays quiet.
      const by = y - 242, bw = question.word === 'REVENUE?' ? 286 : 248, bh = 68;
      sh([[xx - 22, by + bh - 3], [xx + 17, by + bh - 3], [xx + 5, y - 168]], CREAM, 1.2);
      sh(rrPts(xx - bw / 2, by, bw, bh, 12, .8), CREAM, 1.4);
      letter(question.word, xx, by + bh / 2, 33, INK, { ink: false, font: ruFont(33) });
      // Two small hand-drawn accents make the raised microphone readable at phone size.
      const dir = seed === 5 ? 1 : -1;
      line([[xx + dir * 144, y - 160], [xx + dir * 163, y - 174]], 1.0, CREAM);
      line([[xx + dir * 154, y - 141], [xx + dir * 177, y - 145]], 1.0, CREAM);
    }
  }
  function robot() {
    // Full-size geometry is remapped to a 546px robot centred immediately behind the CEO.
    push();translate(heroX,939);scale(.82);translate(-1254,-951);
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
          dx = (edition === 2 ? -1 : 1) * (325 * easeOut(seg(dt,0,.43)) + 18 * Math.min(dt,.65));
          dy = dt < contact ? -75 * dt + 850 * dt * dt : floorY - startY - 43 * Math.abs(Math.sin((dt - contact) * 11)) * Math.exp(-(dt - contact) * 3);
          tilt = dt * 2.5;
        } else if (i === 2 || i === 3) {
          dx = sign * (100 * easeOut(seg(dt, 0, .17)) + 160 * Math.min(dt,.5));
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
  // All three editions share framing, ground, hero rig and camera movement.
  const cam = kf(r,[[201.60,[915,821,1.38]],[203.20,[915,820,1.39]],
    [204.28,[915,821,1.38]],[205.90,[915,821,1.38]],[207.26,[915,821,1.38]]]);
  const shake = later*2+how*2+soon*3+now*5;
  camBegin(cam[0]+Math.sin(r*71)*shake,cam[1]+Math.cos(r*89)*shake,cam[2]);
  const room = ['#E3DFD0','#594553','#A5B3A0'][edition];
  const cloth = ['#6D8E83','#D2CCBC','#695063'][edition];
  const dark = ['#7D9489','#40323F','#82947E'][edition];
  paint(rectPts(-1800,-1800,5600,4800),{wash:room,fill:mixCol(room,TK.soot,.14),fillOp:45,bleed:.05,tex:.7,border:.4,ink:null});
  // A quiet contemporary studio wall, with soft panel texture instead of timber ornament.
  for(let j=0;j<7;j++)line([[430+j*145,-400],[430+j*145,940]],.35,mixCol(room,TK.soot,.12));
  box(-700,948,3400,1400,mixCol(room,TK.soot,.26),.5);
  line([[430,948],[1500,948]],1,mixCol(room,TK.soot,.35));
  for(let j=0;j<6;j++)line([[490+j*155,970],[450+j*172,1320]],.4,mixCol(room,TK.soot,.32));
  // This booth is always present and centred on heroX. Draw the robot on EVERY frame,
  // then cover it with opaque cloth until the AGI reveal physically opens it.
  const bx=heroX-224, by=383, bw=448, bh=558;
  sh(rrPts(bx-12,by-12,bw+24,bh+20,14,1),dark,1.1);
  box(bx,by,bw,bh,'#303C3C',.65);
  robot();
  if(edition===0) {
    // A: two soft sage curtains gather into narrow folds at the booth's sides.
    for(const side of [-1,1]) {
      const w=lerp(bw/2,35,reveal), xx=side<0?bx:bx+bw-w;
      sh([[xx,by],[xx+w,by],[xx+w+2*Math.sin(r*3),by+bh],[xx-1,by+bh]],cloth,1.0);
      for(let j=1;j<5;j++)line([[xx+w*j/5,by+7],[xx+w*j/5+2*Math.sin(r*3+j),by+bh-5]],.6,mixCol(cloth,TK.soot,.19));
    }
    line([[bx-9,by-6],[bx+bw+9,by-6]],2,mixCol(dark,TK.soot,.25));
  } else if(edition===1) {
    // B: a single cream roller cloth lifts into its top housing, exposing the fixed robot.
    const roller=easeOut(seg(r,204.28,204.60));
    const h=lerp(bh,6,roller), yy=by+h;
    sh([[bx,by],[bx+bw,by],[bx+bw,yy],[bx,yy]],cloth,1.0);
    for(let j=0;j<5;j++)line([[bx+18+j*94,by+4],[bx+20+j*94,yy-4]],.45,mixCol(cloth,TK.soot,.13));
    box(bx-7,by-17,bw+14,23,'#8E9B91',.8);
    box(bx,yy-9,bw,10,'#AEB7AC',.6);
    line([[bx+bw+12,by+5],[bx+bw+12,630-215*roller]],.8,CREAM);
    oval(bx+bw+12,636-215*roller,6,8,CREAM,.5);
  } else {
    // C: six plum folds concertina into a single narrow stack on the right.
    const start=lerp(bx,bx+bw-50,reveal), slot=lerp(bw/6,8,reveal);
    for(let j=0;j<6;j++) {
      const xx=start+j*slot, col=j%2?mixCol(cloth,CREAM,.06):cloth;
      sh([[xx,by],[xx+slot+1,by],[xx+slot-1,by+bh],[xx+2,by+bh]],col,.75);
      line([[xx+slot*.24,by+7],[xx+slot*.3,by+bh-5]],.6,mixCol(cloth,TK.soot,.22));
    }
    line([[bx-8,by-7],[bx+bw+8,by-7]],1.5,dark);
  }
  // The calm briefing uses two foreground journalists, with clear separate silhouettes.
  ceoClawd(heroX, heroY, u, { ...body, noClicker: true, noShadow: false,
    mouth: mouthOf(spoken('ceo'), crashed ? 'grin' : 'flat'),
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
  if (!crashed || !podiumEnd) {
    // A slim matte lectern: native pockets and wrists stay visible above its clean top.
    const deskCol=['#758D80','#A4A99A','#D3D7C6'][edition];
    box(730,897,342,43,deskCol,1.2);
    box(716,879,377,19,mixCol(deskCol,CREAM,.32),1.2);
    box(755,913,292,6,mixCol(deskCol,TK.soot,.1),.4);
    for(let j=0;j<2;j++) {
      const x=798+j*105;line([[x+12,881],[x,854]],.8);mic(x,854,(j-.5)*.15,.46);
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
    for (const [at, x, tilt, seed] of [[206.40, 1198, -.045, 3], [206.85, 598, .04, 5]]) {
      if (r < at - .27) continue;
      const p = easeIn(seg(r, at - .27, at)), dt = Math.max(0, r - at);
      const bounce = r >= at ? 17 * Math.abs(Math.sin(dt * 21)) * Math.exp(-dt * 5) : 0;
      rack(x, lerp(-480, 948, p) - bounce, 130, 495, tilt + .008 * Math.sin(dt * 13), seed);
      spark(x, 943, hit(at), 68);
    }
    for (const at of [205.90, 206.40, 206.85]) {
      const dt = r - at; if (dt < 0 || dt > 1.35) continue;
      const ox = at === 205.90 ? 1100 : at === 206.40 ? 1198 : 598;
      for (let i = 0; i < 7; i++) {
        const vx = (hash(i + at) - .5) * 440, vy = -120 - hash(i + 8) * 250;
        const x = ox + vx * dt, y = 892 + vy * dt + 310 * dt * dt;
        line([[x, y], [x - vx * .022, y - (vy + 620 * dt) * .022]], .8, i % 2 ? '#F4B053' : CREAM);
      }
    }
  }
  // Foreground press witnesses look up; distinct footprints leave the CEO's face clear.
  reporter(760, 1200, 2.50, true, 5); reporter(1080, 1200, 2.50, true, 8);
  camEnd();
}
CAPEX_V.q1a=r=>calmRefinement(r,0);
CAPEX_V.q1b=r=>calmRefinement(r,1);
CAPEX_V.q1c=r=>calmRefinement(r,2);
})();
