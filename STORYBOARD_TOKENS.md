# ЖГИ ТОКЕНЫ: storyboard

Hardcore-punk corporate satire. Page `tokens.html`, render `node render.mjs --song=tokens ...`, 204 s.
Same engine as P(doom) / IT GIRL: p5.brush watercolour, frames are pure functions of t, chapters via `chapter(name, start, end, shots)`.
Tempo ~99.6 BPM (beat 0.602 s, first beat 0.579 s). From 94.5 s the band goes double-time hardcore: animate on half-beats (`bpOf(t) * 2`).

## Concept
A weekend, a weekly token limit that expires at midnight on Sunday, and the whole AI economy as one burning machine.
The hero is **Clawd, the user**: it has unspent limits and wants to go to the park. The villain/preacher is **CEO-Clawd**:
black turtleneck, headset mic, clicker, a stage and a slide deck. Everything burns: tokens are glowing gold coin-chips
thrown into a furnace, coolers howl, data-center racks glow orange, the stock ticker only goes up.
The tone is deadpan and punk: dry corporate UI cards set against smashed guitars, fire and mosh pits. Nothing absurd for its own sake; every image is a line of the lyric made literal.

## Palette (kit re-themes KP so karaoke and wipes match)
Soot black `#1A1718`, furnace orange `#FF6A1A`, flame yellow `#FFC53D`, ember red `#D8262A`, rack steel `#3A4450`,
LED green `#48E08A`, stock green `#2FBF71`, corporate blue `#2E5BFF`, paper cream (the engine's PAL.cream).

## Shared kit: `src/tokens/kit.js` (the kit agent builds this first)
- theme: `Object.assign(KP, {...})` fire palette; `WIPE_COLS` → soot/fire pairs; clear `HAT_SWAP`; wipe centre = burning token instead of ruby star (set `window.WIPE_ICON = (x, y, r, {glow, rot}) => ...`).
- `TK` palette object.
- `token(x, y, r, o)`: a gold coin-chip with a "T" / spark glyph, o.burn 0..1 (flames lick, it blackens), o.rot, o.glow.
- `tokenRain(t, o)`: coins falling / flying into a target (o.to [x, y], o.n, o.seed).
- `fire(x, y, w, h, t, o)`: boiling watercolour flames (o.cols, o.seed, o.k intensity).
- `smoke(x, y, t, o)`: rising soot puffs.
- `serverRack(x, y, w, h, t, o)`: rack with blinking LEDs, o.heat 0..1 (glows orange, fire on top at 1).
- `cooler(x, y, r, t, o)`: fan with spinning blades plus howl lines (o.speed, o.howl).
- `dataCenter(t, o)`: full-frame hall of racks in perspective, cable trays, o.heat, o.fire.
- `gpuCard(x, y, s, t, o)`: green-PCB GPU with fans, o.glow.
- `ticker(t, o)`: full-width stock ticker strip (o.y, o.items like ['NVDA ▲', 'TOKN ▲']), always green and going up.
- `stockChart(x, y, w, h, t, o)`: candlestick chart that only climbs, o.k progress, o.moon (breaks out of the frame top).
- `ceoClawd(x, y, u, o)`: Clawd in a black turtleneck (no hat), headset mic, clicker in hand. Takes clawd() options.
- `agentBot(x, y, s, t, o)`: small generic agent (a little Clawd with a lanyard badge "AGENT #n"), o.n, o.hire (hand holding a smaller agent).
- `limitBar(x, y, w, v, o)`: horizontal "НЕДЕЛЬНЫЙ ЛИМИТ" progress bar with a % label, v 0..1 (o.label, o.col).
- `counter(x, y, size, value, o)`: an odometer-style number (for millions/billions); formats with spaces "40 000 000".
- `uiCard(x, y, w, h, o)`: a flat chat-UI / notification card (o.title, o.body, o.icon), used for the midnight notification.
- `slide(x, y, w, h, o)`: keynote slide frame (o.title, o.graph 'up'|'loop', o.bullets).
- `stamp(txt, x, y, size, t, t0, o)`: rubber-stamp slam text (Russian, RU_FONT) with a beat punch and ink spatter.
- `punkText(txt, x, y, size, t, t0, o)`: ransom-note / xerox punk lettering, letters jitter on the half-beat.
- `crowdMosh(t, o)`: bottom band of moshing little Clawds and agents with raised fists, o.y, o.k energy.

Russian text on screen: always `letter(txt, x, y, size, col, { font: size + 'px ' + RU_FONT })` or the kit's stamp/punkText (Permanent Marker has no Cyrillic).
Karaoke occupies y > 950. Keep essential art out of the bottom 130 px.

## Chapters (one agent each, files in `src/tokens/ch/`)

| file | name | time | what we see |
|---|---|---|---|
| t01_friday | friday | 0 – 32.35 | **0–12.6 intro**: black screen, a match strikes on the downbeat, lights a single token; big title stamp «ЖГИ ТОКЕНЫ» slams on the beat, choir-anthem feel, embers drifting up. **12.6 verse 1**: Friday evening, Clawd at a laptop, calendar page «ПЯТНИЦА» flips; «лимиты целы» → the limitBar at 50%, «полпути». 17.5 «Парк зовёт»: a window shows a sunny park with a bench and a kite; the calendar flips to «ВОСКРЕСЕНЬЕ» and the calendar sheet catches fire at «всё сгорит». 22.5 «Сайт не нужен, бот не нужен»: Clawd waves off floating icons (website, bot), but the limitBar glows and pulls it back; «вперёд, к луне!»: the bar becomes a rocket. 27.3 «Сделай игру, чтоб никто не играл»: an empty arcade cabinet with cobwebs, «0 игроков»; 29.6 a website with «0 посетителей», a tumbleweed rolls across the browser window. |
| t02_chorus | chorus1 | 32.35 – 58.8 | **Pre-chorus 32.35**: the dataCenter; coolers howl (howl lines), racks heat to orange, «дата-центр горит» flames on the top of the racks. 34.7 «Биржа смотрит и говорит»: a giant stock-exchange board with eyes (the ticker), its mouth opens. **Chorus 39.4**: the furnace: Clawd shovels tokens into a roaring furnace on every beat, punkText «ЖГИ ТОКЕНЫ!» on each shout (39.5, 40.7, 44.3, 45.6); 41.7 «пока лимит не обнулён» the limitBar drains; 46.6 «ещё один миллион!» a counter spins to 1 000 000; 49.5 «больше агентов!» agents pour out of a door, «больше железа!» GPU cards stack up; 51.75 «зачем — неважно! это полезно!» a CEO-style thumbs-up stamp «ПОЛЕЗНО». 55–58.8 «оооо» choir: wide shot, everything burning, the camera pulls back. |
| t03_kpi | verse2 | 58.8 – 80.35 | Open-plan office. 58.9 a whiteboard: «KPI: СКОЛЬКО ТЫ СПАЛИЛ ЗА НЕДЕЛЮ» with a leaderboard bar chart. 64 «мало потратил» a sad Clawd with a tiny bar gets a red «ПЛОХО ПОМОГ» stamp. 66.3 «чемпион по токенам — наш новый бог»: the champion Clawd lifted on a pedestal, halo made of tokens, the office kneels. 69 «агент нанял агента, тот нанял ещё сто»: an org chart that explodes into a fractal of agentBots (1 → 1 → 100). 71.9 «сделали доклад»: a thick report lands with a thud: «КАК СОКРАТИТЬ РАСХОДЫ НА AI»; dust, nobody opens it, it gets a cobweb. 76.3 «ушло сорок миллионов — ну и пускай!» a counter clicks to 40 000 000, money burns, an agent shrugs. |
| t04_sermon | bridge | 80.35 – 94.5 | Keynote stage, dark with one spotlight, a huge slide behind. CEO-Clawd preaches calmly (clicker in hand). 80.5 «больше электричества»: slide = power lines and a lightning bolt; 83.3 «больше меди» a copper coil, «больше воды» a water drop / cooling towers. 85.8 «Зачем?» a hard cut to silence: the question mark hangs. 86.65 a lone madman shouts from the dark audience: a tiny Clawd standing on a chair, a speech bubble «ЧТОБЫ ИНТЕЛЛЕКТ СТАЛ ДЕШЕВЛЕ» (lone crazy shout). 89.85 CEO smiles: «а когда он станет дешевле…» a slow push-in on the CEO's face. 92.3 «БОЛЬШЕ GPU!»: the slide explodes into GPUs, flash, the stage catches fire. |
| t05_drop | drop | 94.5 – 124.7 | **Tempo switch, hardcore.** The flywheel: a giant circular machine with four stations (GPU → ТОКЕНЫ → АГЕНТЫ → ЗАДАЧИ → back to ТОКЕНЫ), each station lights and punches on its line: 97.3/100.9/103.35 «Больше GPU!», 104.6 токенов, 107 агентов/задач, 109.4 задач, 111.8 токенов. The wheel spins faster each lap, sparks fly off. 114 «ЭКОНОМИКА РАБОТАЕТ!» a gigantic stamp, the stockChart rockets off the top of the frame. **116.4–124.7 instrumental mosh**: crowdMosh of Clawds and agents with CEO-Clawd crowd-surfing, strobing on half-beats, tokens flying like confetti, GPUs as crowd-surf boards. |
| t06_train | verse3 | 124.7 – 146.3 | 124.7 «ЭЙДЖИАЙ к весне обещают опять»: a calendar where «ВЕСНА» keeps getting crossed out and pushed ahead (2025 → 2026 → 2027). 127 «осталось чуть-чуть подождать» a loading bar stuck at 99%. 129.95 «пишет диссертации и код»: a robot arm writes a scroll plus code; 132.2 «заменит программистов вот-вот»: a row of programmer desks with «ВОТ-ВОТ» stickers. 134.4 «а мне от неё нужно только одно»: cut to Clawd hugging a board-game box. 136.8 «Ticket to Ride про царское село»: a painted board-game map (Царское Село, Москва, Казань) with coloured route pieces. 139.2 «сто тысяч GPU»: behind the map, an endless dataCenter powering it, cables into the board. 141.6 «паровозик до Казани ехал через лес»: the payoff shot, a tiny toy steam train chugging through a watercolour pine forest toward a «КАЗАНЬ» sign, smoke puffs on the beat, cables trailing behind it to the burning data center. |
| t07_capex | finale | 146.3 – 162.6 | Final chorus, a key change up, everything bigger. Clawd and CEO-Clawd on a stage made of GPUs above the furnace; 146.4 «Жги токены!» punkText; 148.6 the limitBar drains at double speed; 151.2 «доходы — потом! прибыль — потом!» signs «ДОХОДЫ» and «ПРИБЫЛЬ» get kicked off stage into the distance; 153.6 «ЭЙДЖИАЙ — скоро! CAPEX — сейчас!» a giant «CAPEX» neon lights up while «AGI» shows «СКОРО…» on a loading spinner; 156.2 «плюс процент к бенчмарку» a benchmark bar goes 87.1 → 88.1%; 158.3 «плюс триста миллиардов!» a counter slams to 300 000 000 000, a gold explosion, all the tokens rain down. |
| t08_sunday | outro | 162.6 – 205 | Quiet. Night room, desk lamp, Clawd alone in front of the laptop. 163.4 a digital clock «ВС 23:58». 170.35 «ноль токенов»: the limitBar at 0%, grey. 171.35 «три игры, семь сайтов, сорок два агента» — little icons pop in and line up: 3 game cartridges, 7 browser windows, 42 tiny agents (a grid that fills). 175.2 «ни один не нужен» — they all fade grey. 177.6 «тишина» — only the lamp, a moth. 179.3 «я счастлив» — Clawd leans back, eyes closed, a tiny smile, the window shows the moon. 180.8 «полночь» — the clock flips to 00:00. 183.4 the uiCard notification slides in: «Ваш недельный лимит восстановлен» and the limitBar snaps to 100% green. 188.1 «…Сука.» Clawd's deadpan face in extreme close-up (eyes half-shut). **188.5–200 explosion**: the band crashes back in; the room blows apart into the furnace, the data center reignites, the limitBar burns from 100 downward, a punk collage of all the chapters' motifs. 200.4 second «Сука» shouted: a final stamp «ЖГИ ТОКЕНЫ» and the credit «created by Claude Opus 5.5» on soot black, embers fading to 204. |

Wipes (fire/soot brush strokes) at 58.8, 94.5, 124.7, 162.6.
