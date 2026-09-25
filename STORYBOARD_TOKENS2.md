# ЖГИ ТОКЕНЫ v2 (acid / industrial cut): storyboard

Page `tokens2.html`, render `node render.mjs --song=tokens2 ...`, 239 s. Same lyrics as v1, but a different track (Suno v2): hardcore punk at ~188 BPM
(engine grid BPM 94.2 = half-time; phase drifts across Suno's hard edits, so **sync hits to the word times in `src/tokens2/lyrics.js`
and to audio onsets, not to bpOf()**), with **acid (TB-303 squelch) and industrial (metal hits, gated orchestral impacts) inserts** and
abrupt edit transitions. Karaoke: Russian only (one line).

This is a new video, not a re-cut of v1. v1 was "fire and soot, a corporate furnace". v2's world is **ЗАВОД ТОКЕНОВ (the token factory)**:
- **industrial**: hydraulic presses minting tokens, conveyor belts, gears, sparks, steam, hazard stripes, a factory siren; every industrial hit = a press slams.
- **acid**: the 303 inserts turn the frame into an acid rave: acid-green / hot-magenta checkerboards, a melting smiley made of a token, wobbling (filter-sweep) wavy distortion bands, strobes.
- **Matrix, a drop only ("капельку")**: token-glyph green code rain in a few moments only (the boot, the acid drop, the midnight reset), and CEO-Clawd once in black shades. Never the whole look.
- **edits**: chapter changes are hard **glitch cuts** (RGB split, slice offsets, 2–4 frames), no brush wipes.

## Palette (v2 layer `src/tokens2/acid.js` re-themes on top of the v1 kit)
Factory: gunmetal `#2B2F36`, steel `#59636E`, hazard yellow `#FFD21F`, rust `#B4502A`, sodium orange `#FF8A1F`.
Acid: acid green `#B6FF1A`, hot magenta `#FF2BD6`, UV violet `#6A2BFF`. Matrix: `#00FF6A` on `#020A04`. Paper cream for the zine cutouts.

## Kit
Reuse the v1 kit (`src/tokens/kit.js`: token, tokenRain, fire, smoke, serverRack, cooler, dataCenter, gpuCard, ticker, stockChart, ceoClawd,
agentBot, limitBar, counter, uiCard, slide, stamp, punkText, crowdMosh, ruFont, fmtNum, TK) plus the v2 layer `src/tokens2/acid.js`:
- theme: KP → factory/acid colours (karaoke bar hazard-yellow on gunmetal), `WIPE_COLS` irrelevant (no wipes).
- `press(x, y, w, h, t, hitT, o)`: a hydraulic press whose ram slams at hitT (a list of times), minting a token under it, sparks + steam.
- `conveyor(x, y, w, t, o)`: belt with rollers moving items (o.items: 'token' | 'agent' | 'gpu' | 'task'), o.speed.
- `gear(x, y, r, t, o)`, `hazard(x, y, w, h)`, `siren(x, y, t, o)` (rotating beacon), `steam(x, y, t, o)`.
- `acidField(t, o)`: full-frame acid rave background: checkerboard in perspective, wavy squelch bands, o.k intensity.
- `acidSmiley(x, y, r, t, o)`: the token as an acid smiley, o.melt 0..1.
- `squelch(t, t0, t1)`: returns a 0..1 wobble for a filter sweep between t0..t1 (for bending shapes/text).
- `matrixRain(t, o)`: green token-glyph code rain (katakana + ₮ + digits), o.k, o.area; use sparingly.
- `glitchCut(t, tCut, o)`: call at the end of a frame: RGB-split slices around a hard cut (±0.1 s).
- `shades(u)`: the black-sunglasses KHAT hook for ceoClawd (the one Matrix CEO moment).
- `zineCut(x, y, w, h, o)`: a torn xerox paper cutout panel (halftone dots, tape) to frame images punk-zine style.

## Sections (from audio: whisper + spectral analysis; acid = strong centroid sweeps)
| time | section | notes |
|---|---|---|
| 0–20.1 | intro | no vocals. Industrial/choir build (quiet ~0.05 rms, rising at 12 s). |
| 20.1–39.8 | verse 1 | acid squelch under it (centroid sweeps 20–38). |
| 39.8–45.05 | pre-chorus | dip + a harsh hit at ~42 (bright noise burst). |
| 45.05–66.4 | chorus 1 | doubled shouts "Больше агентов! Больше агентов!". |
| 66.4–67.1 | edit | |
| 67.1–88.2 | verse 2 | |
| 88.2–91.8 | industrial break | |
| 91.8–113.6 | chorus 2 | |
| 113.6–116.3 | break | |
| 116.3–132.55 | CEO bridge + **angelic choir** | very quiet at 118–126 (rms 0.02): the sermon with a choir answering. |
| 132.55–145.55 | **acid drop** "БОЛЬШЕ GPU!" ×3 (132.55, 137.7, 143.9) | acid beat and Matrix sounds |
| 145.55–157.35 | acid drop: the loop lines + «ЭКОНОМИКА РАБОТАЕТ!» 155.0 | |
| 157.35–179.4 | verse 3, **rap** | fast recitative |
| 180.85–196.0 | final chorus, a step up | |
| 196–197.9 | acid sweep | huge centroid swings (192–206). |
| 197.9–226.6 | spoken outro | 218–222 almost silent. |
| 227.3, 228.8 | «Эй!» «Эй!» gang shouts | |
| 229–237 | band blast | loudest part of the song. |
| 237.2 | final «…Сука.» | end 239. |

## Chapters (one agent each, `src/tokens2/ch/`)
| file | name | time | what we see |
|---|---|---|---|
| a01_boot | boot | 0–20.1 | **The start**: black. A single green Matrix line types «wake up, Clawd…», then «ваш лимит сгорит через 2 дня». A hard cut into the dark **ЗАВОД ТОКЕНОВ**: sodium lamps flicker on one by one, a siren starts rotating, presses begin slamming on the industrial hits, minting tokens that ride a conveyor into the dark. The camera tracks one token along the belt (12 s rise) and it falls off the end into Clawd's hand at home (20.1). The title «ЖГИ ТОКЕНЫ» is stamped by a press at the build's peak. |
| a02_friday | friday | 20.1–39.8 | Friday in Clawd's flat, but everything is a punk-zine collage (zineCut panels) that wobbles with the acid squelch. Limit bar 50% «полпути»; the park window; the Sunday calendar stamped «СГОРИТ» by a tiny press; site/bot icons waved off; the bar becomes a rocket «к луне»; the empty arcade «0 игроков»; the website «0 посетителей». |
| a03_chorus1 | chorus1 | 39.8–67.1 | 39.8 pre-chorus: the factory's server floor; coolers howl; the harsh hit at ~42 = a siren and steam blast. 42.9 the stock exchange as a giant factory control panel with eyes. 45.05 chorus: an assembly line of Clawds feeding tokens into a **token shredder** on every «Жги!»; the doubled shouts are staged as call-and-response (two groups). The counter hits 1 000 000; agents come off a conveyor, GPUs off another; «Зачем — неважно!» twice, then «Это полезно!» on a green quality-control stamp «ОТК: ПОЛЕЗНО». |
| a04_kpi | verse2 | 67.1–91.8 | The factory office above the floor: KPI board «СКОЛЬКО ТЫ СПАЛИЛ ЗА НЕДЕЛЮ» with a production-plan feel ("План: 100% сожжено"), «ПЛОХО ПОМОГ», the token champion as the "worker of the month" on an honour board («Доска почёта»), agents hiring agents as a self-replicating conveyor line, the unread report «КАК СОКРАТИТЬ РАСХОДЫ НА AI» fed into a shredder, 40 000 000. **88.2–91.8 industrial break**: the whole factory stamps in unison, 4 presses on 4 hits, sparks. |
| a05_chorus2 | chorus2 | 91.8–116.3 | Chorus 2 must not repeat chorus 1: an outdoor night shot: the factory's chimneys burning tokens, a city grid pulsing; smoke from the chimneys forms the lyric words; «Ещё один миллион!» on a huge public counter on the factory wall; agents march in columns; GPUs arrive on freight trains. «Это полезно!» on a Soviet-style mosaic banner. **113.6–116.3 break**: all the lights cut to black except one spotlight → the bridge. |
| a06_sermon | bridge | 116.3–132.55 | A cathedral of servers: CEO-Clawd preaches from a pulpit made of a GPU, with stained-glass windows showing a pylon, a copper coil and a water drop, and an **angelic choir** of agents with halos (tokens) answering «Больше меди. Больше воды.» and «Зачем?» (light beams from above). 125.15 the lone madman shouts «ЧТОБЫ ИНТЕЛЛЕКТ СТАЛ ДЕШЕВЛЕ». 127.15 a slow push-in, and CEO-Clawd **puts on black shades** (the Matrix moment), and at «нам понадобится…» the stained glass turns into green code. |
| a07_acid | acid | 132.55–157.35 | **ACID DROP**: «БОЛЬШЕ GPU!» ×3 (132.55, 137.7, 143.9): each hit the frame flips into acidField + acidSmiley tokens, green matrixRain made of GPU glyphs, squelch-bent lettering. 145.55 the loop lines: an acid flywheel GPU → ТОКЕНЫ → АГЕНТЫ → ЗАДАЧИ as four spinning acid smileys; each line lights its pair. 155.0 «ЭКОНОМИКА РАБОТАЕТ!» a press stamps it through a stock chart that melts upward. |
| a08_rap | rap | 157.35–180.85 | **Rap verse**: a hip-hop setup: CEO-Clawd and Clawd trade lines at two mics in front of a wall of speakers made of server racks; each line is a zineCut panel slammed in on the flow: AGI calendar «ВЕСНА» crossed out year by year, loading 99.999%, a robot arm writing dissertations and code, «ВОТ-ВОТ» stickers on programmer desks. 167.25 «а мне нужно только одно» → the board-game box; 169.7 a painted homage map Царское Село→Москва→Казань; 172.1 100 000 GPUs of the factory powering it; 174.85 the payoff: a toy steam train through a watercolour pine forest to «КАЗАНЬ» (this is the calm beautiful moment), smoke puffs on the beat, cables trailing back to the factory. |
| a09_capex | capex | 180.85–197.9 | Final chorus a step up: the factory at full blast, Clawd and CEO-Clawd on top of the biggest press; limit bar drains at double speed; «ДОХОДЫ»/«ПРИБЫЛЬ» thrown into the shredder; «CAPEX» as a giant neon on the chimney while «AGI» shows «СКОРО…»; the benchmark +1% on a truncated axis; the counter slams to 300 000 000 000. **196–197.9 acid sweep**: the whole factory melts into acid colours and folds into a single token that shrinks to a dot → the outro. |
| a10_sunday | sunday | 197.9–239 | Quiet spoken outro in Clawd's dark room (clock «ВС 23:58», limit bar 0% grey, 3 games / 7 sites / 42 agents that go grey, «тишина», «я счастлив», moon). 218.45 «полночь» → 00:00. 220.7 the notification «Ваш недельный лимит восстановлен» → **a Matrix moment**: green token-code rain pours down the screen and the bar refills to 100%. 224.2 «…Сука.» deadpan close-up. **The finish**: 227.3/228.8 «Эй! Эй!» two press slams; 229–237 the band blasts: the room's walls fall away and it was inside the factory all along: the camera pulls back through the factory, presses minting again, the conveyor carrying Clawd himself; limit bar burning down. 237.2 the last «…Сука.»: a hard cut to the opening shot's black with the green line «wake up, Clawd…» — the loop starts again (next week), then the credit «created by Claude Opus 5.5». |

## ⚠️ Astra review → FINAL DECISIONS (these override the chapter table above where they conflict)
Core idea sharpened: **the factory manufactures pointless work**. Every shot = the machine producing something useless at enormous cost. Don't redo v1's picture-by-picture; stage each line as an *action inside the machine*.

**Matrix = two drops only**: (1) the acid drop 132.55–145.5 (the track literally has "Matrix sounds" there): short green token-glyph rain bursts on the three «БОЛЬШЕ GPU!» hits + CEO puts on black shades at 132.55; (2) 220.7 the reset notification glitches into green code for ~1.5 s. **No** «wake up, Clawd», no katakana (use ₮, 0/1, digits), no stained-glass code, no Matrix in the ending.

Per chapter:
- **a01_boot 0–20.1 (the start)**: Clawd is dressed for a walk (cap, scarf) at the front door of his flat. He pulls the door handle — it's a **press lever**: somewhere a press slams (industrial hit), a token is minted, the door stays shut. He pulls again and again on the hits, each pull reveals more machinery behind the walls (wallpaper tears away to gears/conveyors). 12–20.1: the camera follows the minted token through the monstrous factory (presses, furnaces, conveyors, a thousand GPUs) and it comes back out... onto Clawd's laptop as the chat reply «Чем могу помочь?». Title «ЖГИ ТОКЕНЫ» stamped by a press at the peak.
- **a02_friday 20.1–39.8**: Clawd tries to go out; every action orders another useless product. Limit bar **100%** at «лимиты целы» (half-way = a week calendar at ПТ, «полпути»). 27.8 the calendar **burns the weekend like a consumable** (СБ/ВС tear-off sheets fed into a furnace). 35.1 an agent plays the useless game so the report shows «1 пользователь». 37.75 the unread site.
- **a03_chorus1 39.8–67.1**: ~42 the harsh hit **squashes the server room flat into a stock chart**; 42.9 the chart grows a mouth and «говорит». 39.8 must show a clear fire in the data center (lyric: «горит»). Chorus: the token shredder assembly line; 55.25 **agents step off the conveyor already carrying job postings** (they immediately hire). «ОТК: ПОЛЕЗНО».
- **a04_kpi 67.1–91.8**: bonuses are physical: **the more you burned, the higher your chair** rises; the thrifty employee is swallowed by his desk. 72.65 **a fire extinguisher gets a reprimand for saving**. 74.6 the champion is a literal new god (idol + worship), not "worker of the month". 79.85 the report is sealed with a sticker «ПРОЧТЕНИЕ НЕ ВХОДИТ». 88.2–91.8 industrial break: **four hits = four stages of the report: print → bind → award → shred**.
- **a05_chorus2 91.8–116.3**: as planned (outdoor night factory, chimneys, freight trains of GPUs), must differ from chorus 1.
- **a06_sermon 116.3–132.55**: server cathedral + angelic agent choir as planned. 120.8 **the CEO sips water; the neighbouring town's reservoir dries up**. 125.15 **the intelligence price tag shrinks while the bill unrolls to the floor**. No Matrix stained glass. At 132.55 the CEO puts on the black shades (the drop starts).
- **a07_acid 132.55–157.35**: escalation on each «БОЛЬШЕ GPU!»: 132.55 a GPU grows out of the CEO's head; 137.7 the CEO turns into a PCIe slot; 143.9 the whole factory is plugged into him. In the gaps (135.2–137.7, 140.2–143.9) the watercolour runs and Clawd tries to hold his own outline together. Short Matrix rain bursts on the three hits only. 145.55 loop lines: tasks multiply like wet prints; the loop must go **задачи → токены** (as sung). 155.0 the system eats its own output «ЭКОНОМИКА РАБОТАЕТ!».
- **a08_rap 157.35–180.85**: no literal rap mics. **The CEO's keynote gets hijacked by Clawd's toy railway**: slides for each line (AGI calendar, 99.999%, dissertations/code arm), 164.6 **a programmer is replaced by a sign «Скоро заменим»**, and the toy train keeps running across the slides; 174.85 **a hundred thousand fans blow on the toy steam train** through the watercolour forest to «КАЗАНЬ» — keep it the one calm beautiful shot.
- **a09_capex 180.85–197.9**: a change of meaning, not just bigger: **the whole giant factory at full blast produces one single tiny checkmark ✓**. Limit bar double-speed drain, ДОХОДЫ/ПРИБЫЛЬ into the shredder, CAPEX neon vs AGI «СКОРО…», 193.3 **the chart rises because a press pushes the axis down**, counter 300 000 000 000. 196–197.9 the acid stain dries into a grey circle «0 токенов» → the outro.
- **a10_sunday 197.9–239 (the finish)**: the quiet outro as planned; 220.7 the one short Matrix glitch inside the notification, bar refills. 224.2 «…Сука.» deadpan. 227.3 / 228.8 «Эй! Эй!» (verify onsets from audio) two press slams. 229–237 **the conveyor delivers Clawd a new week, packaged as a gift box** (ribbon, tag «НЕДЕЛЯ 40 · 1 000 000 токенов»); he opens it: it's the whole factory unfolding out of the box, presses and fire everywhere, limit bar burning down. 237.2 the last «…Сука.» on Clawd's face; he **closes the laptop — on the lid a button «Продолжить» lights up**. Black. Credit «created by Claude Opus 5.5» on its own card to 239.
