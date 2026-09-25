# IT GIRL: storyboard (magical-girl anime homage)

Second video on the same engine. Song: `assets/itgirl/itgirl.m4a`, 160 s, **120 BPM, first beat 0.233 s** → beat n = `0.233 + n·0.5`, bar = 2 s, bars start at 0.233, 2.233, 4.233… `bpOf / pulse / beatN / move()` already use this tempo on the itgirl page.

Page: `itgirl.html`. Render checks: `node render.mjs --song=itgirl --sheet=10,11,12 --cols=3 --w=640 --out=out/check/iXX.jpg`.

## Chant timing (sung letters, from word timestamps)
The spelled chant is fast: ~0.37–0.45 s per letter, one spelling ≈ 2–2.5 s. Measured letter onsets:
- intro: I 0.00 · T 0.48 · G 0.88 · I 1.32 · R 1.60 · L 2.02 | T 2.50 G 2.90 I 3.32 R 3.58 L 3.98 | I 4.42 T 4.96 G 5.42 I 5.80 R 6.04 L 6.12 | I 6.54 T 6.96 G 7.40 I 7.80 R 8.06 L 8.24
- chorus 1: I 34.18 · T 34.48 · G 34.82 · I 35.30 · R 35.56 · L 36.02 | next spellings start 36.54 and 40.46 (same spacing)
- chorus 2: I 84.24 · T 84.50 · G 84.86 · I 85.28 · R 85.56 · L ~86.0 | next ~88.2
- finale: I 125.88 · T 126.48 · G 126.86 · I 127.30 · R 127.56 · L 128.02, then repeating every ~2 s until ~141
- outro: I 151.80 · T 152.44 · G 152.86 · I 153.32 · R 153.60 · L 154.02, repeating to 160
Use `spell('ITGIRL', x, y, size, t, t0, { step: .4 })` with t0 at the I, or place letters yourself from this list.
Other hits: "hit 'em" 43.42 / 93.60 · "Hit it" 43.98 / 93.96 · "drop" (bridge) 125.50 · "One, two, three" 123.84 / 124.50 / 124.96.

## The idea

A 90s magical-girl anime opening, played as a bratty it-girl anthem. **Clawd is the magical girl**: odango buns with long streaming pigtails, crescent tiara, blue pleated sailor skirt, big red bow, white gloves, moon wand (`sailorClawd`). The song is her strutting past her haters. The haters are **gossiping lips** (`lips`), always flapping, and a few jealous rival Clawds. Her crew: **the black cat** with a crescent on its forehead (`blackCat`), the mascot who sighs at her antics, and the **masked gentleman** (`tuxResearcher`: the Researcher in a top hat, domino mask and cape) who keeps throwing roses at the wrong moment. Backup dancers are small Clawds in odango hair (`sailorClawd` at small u, give them other skirt/bow colours: pink, mint, lilac, gold).

Anime grammar to use everywhere: speed-line backgrounds, sparkle bursts, sakura/star petals, dramatic zoom-ins on eyes, freeze-frame poses with a radial burst behind, transformation ribbons, split screens, a big moon.

**Rule for every shot:** something happens. **Text-light:** the only big lettering is the spelled **I-T-G-I-R-L** chants (use `spell()`, one letter per beat or half beat, it's the hook) and a handful of SFX (SNAP!, DROP!, POP!, ✦). No labels. The karaoke already shows the words.

## Palette arc
Night indigo + moon gold (intro) → hot pink / sky blue sparkle (chorus 1) → pastel dream sky, bubblegum (verse 2) → neon concert stage, pink + lilac lasers (chorus 2) → storm grey-violet with lightning, rain (bridge) → full rainbow galaxy + gold (finale).

## Transitions
Brush wipes at 59.45 and 109.4 (automatic, pink/gold with a star). Everywhere else motivated: whip pans with speed lines, iris-in on a sparkle, a hair flip that wipes the frame, a heart that fills the screen, a camera-flash white-out, a lightning flash.

---

## i01 · Intro + Verse 1 (0 – 25.4) · night city, big moon

| Time | Lyric | Shot |
|---|---|---|
| 0.0–4.2 | I-T-G-I-R-L | Night city, huge moon. Camera tilts down from the moon. The letters **I T G I R L** pop up one per beat across the moon in glitter colours (`spell`). A silhouette with two buns and streaming pigtails stands on a rooftop against the moon. |
| 4.2–8.4 | I-T-G-I-R-L | Second spelling. Push in: the silhouette turns, gloves flash, **transformation**: ribbons spiral around her (`ribbonSwirl`), sparkles, and on 8.23 (bar) she lands the pose, fully lit: sailorClawd, wink, peace sign (arm raised). Radial burst behind. |
| 8.5–11.85 | Hate it or love it, the radar is locked | A green radar screen sweeps; blips are hearts; the sweep line hits a big blinking heart that is her. Cut to a targeting reticle locking on her face; she blows a kiss at the lens. |
| 11.9–13.85 | Every move… ticker tape blocked | Stock-ticker LED band scrolls across the frame packed with her little face icons and hearts; every step she struts (walk, `move('walk')`), a new icon pushes the band. Paper ticker tape rains like confetti. |
| 13.9–15.85 | Too fly for the chat, too cool for the beef | She flies up past floating chat bubbles (blank, just "…"), and a cartoon steak (the beef) with an angry face shakes its fist below; she sails over it on her crescent. |
| 15.9–17.8 | Got 'em biting their nails down to the teeth | Row of 3–4 hater lips/rival Clawds with scared eyes chewing their gloves, teeth chattering on the beat. |
| 17.85–19.65 | Call me buggin', call me bougie… elite | She sips tea from a fine teacup with pinky up, on a velvet throne; a little bug (ladybug) buzzes around, she flicks it away. |
| 19.7–21.65 | I'm just serving up heavy… tasting defeat | Tennis serve! She serves a giant glittery heart like a tennis ball with the wand; it smashes into a rival who gets a face full of it. |
| 21.7–23.2 | Talk that talk, yeah you run that jaw | Close-up swarm of flapping lips (`lips`, talk 1) filling the frame, crowding. |
| 23.25–25.35 | While I'm out here breaking every single rule | She karate-chops a giant stone rule tablet / thick law book, it cracks in two on the beat, rules flutter away like paper birds. Out: the pieces fly at the camera. |

## i02 · Pre-chorus 1 + Chorus 1 (25.4 – 59.45) · hot pink + sky blue

| Time | Lyric | Shot |
|---|---|---|
| 25.4–27.4 | Got that swagger, got that juice | Strut in slow-mo with speed lines, sipping a juice box with a bendy straw; sunglasses slide down. |
| 27.45–29.8 | Loose lips, baby, what's the use? | Lips fly around her like mosquitoes; the black cat swats one with a paw; they zip away. |
| 29.9–31.3 | You can plot, you can scheme, throw a little shade | Shadowy rivals around a table with a map and her photo, drawing arrows; a literal black shadow shape is thrown at her. |
| 31.35–33.3 | I'm the blueprint, honey, in the shade you made | The thrown shadow lands behind her… and it's a blue blueprint of her (white lines on blue, her silhouette with measurements). She poses in front. |
| 33.35–34.2 | Pump it up— | Wand pumps like a fist 2×, zoom punches in on the beat. |
| 34.2–38.25 | I-T-G-I-R-L | **Chorus.** Concert-style stage with hot-pink and sky-blue rays (use your own backdrop, or `stageBack(t, { backdrop })`). Giant letters spelled one per half-beat behind her. |
| 38.3–42.35 | I-T-G-I-R-L (it girl) | Second spelling; backup dancers (small sailor Clawds in 4 colours) pop in on each beat. |
| 42.4–43.95 | Yeah, yeah, yeah, I'm that girl… hit 'em! | Freeze-frame hero pose with radial burst; on "hit 'em" the whole frame shakes. |
| 43.98–45.55 | Hit it, drop it, shake it, pop it | Four hits, four micro-cuts (every beat): hit (fist pump + impact star), drop (squat), shake (shimmy), pop (heart pops). |
| 45.6–47.95 | Can't stop, won't stop, never gonna drop it! | Group spins, a disco moon ball descends. |
| 48.0–49.85 | Hit it, drop it, shake it, pop it | Same four hits, different angle (overhead / Dutch tilt). |
| 49.9–51.9 | Bounce to the bass, hit it right back | A giant subwoofer thumps; everyone bounces on it; the rings of bass push the camera. |
| 51.95–53.75 | Look at it, want it, get it, snap! | Shopping-window gag: she looks at a sparkly crown in a window, wants it, grabs it; on **SNAP** a camera flash freeze with polaroid frame. |
| 53.8–55.9 | Bounce to the bass, hit it right back | Whole troupe line dance bounce. |
| 55.95–57.2 | IT GIRL! | Final pose, sparkle burst. |
| 57.2–59.45 | (break) | The cat, alone on stage, shrugs and sighs; the masked gentleman throws a rose that lands on the cat's head. |

## i03 · Verse 2 + Pre-chorus 2 (59.45 – 84.25) · pastel dream sky, bubblegum

| Time | Lyric | Shot |
|---|---|---|
| 59.45–61.3 | All that drama? As if! Please stop. | Theatre masks (comedy/tragedy) cry and wail at her; she holds up a glove "stop" and they freeze mid-sob. |
| 61.35–63.3 | Got my hair flipped high, chilling at the top | Hair flip: the pigtails whip across the frame (a wipe), revealing her lounging on top of a skyscraper/pink cloud tower, sunglasses on. |
| 63.35–65.2 | You're bugging out hard 'cause I don't check the pulse | A hospital heart monitor beeping in a hater's room; hater's eyes pop out (bugging); she's asleep on a cloud ignoring it. |
| 65.25–67.35 | Living rent-free in your feeds and your thoughts | Inside a hater's head/phone: she has furnished it like her apartment (tiny sofa, fairy lights) and waves from inside a thought bubble. |
| 67.4–69.3 | Mad 'cause I'm paid, mad 'cause I'm fly | Money-heart confetti raining; she flies across on the crescent moon; angry lips steam. |
| 69.35–71.35 | Catch me rolling on by with a cool little eye | Rollerblades, side-scrolling parallax past pastel shops; she lowers her shades and winks at the camera. |
| 71.4–73.4 | Whatever, whatever, you do what you can | Big "W" hand sign / shrug; rivals struggle to lift a dumbbell. |
| 73.45–75.5 | Still eating out of the palm of my hand | Giant glove hand, tiny lips/haters eating sprinkles from her palm like birds. |
| 75.55–83.3 | (pre-chorus 2, same words as pre 1) | Escalated pre-chorus remix: the blueprint gag replayed with the cat as the blueprint, the lips now wearing sunglasses copying her, the plotters' map catches fire (sparkly). |
| 83.35–84.25 | Pump it up— | The cat pumps the wand this time. |

## i04 · Chorus 2 (84.25 – 109.4) · neon concert, lasers

| Time | Lyric | Shot |
|---|---|---|
| 84.25–91.9 | I-T-G-I-R-L ×2 | Big arena, crowd of lightsticks (hearts), pink/lilac lasers sweeping. Letters spelled on a giant LED wall. Transformation reprise: bigger, with a full rainbow ribbon. |
| 91.95–93.9 | …I'm that girl, hit 'em! | Magical attack wind-up: she spins the wand… |
| 93.98–107.2 | (hook lines) | …and fires **heart beams** (`heartBeam`) at the hater lips on every "hit it"; hit lips turn into sparkles/pink butterflies. "Can't stop won't stop" = a beam sweep. "Bounce to the bass" = the arena floor bounces. "Look at it, want it, get it, snap" = she snaps a selfie with the defeated haters. Final "IT GIRL" = full-frame freeze with speed-line burst. |
| 107.2–109.4 | (break) | Rose from the masked gentleman sails across; she catches it in her teeth. |

## i05 · Bridge (109.4 – 125.88) · storm violet, rain, thunder

| Time | Lyric | Shot |
|---|---|---|
| 109.4–111.3 | Talk behind my back? That's cute. | She walks away; behind her back lips whisper; she glances back over her shoulder with a smirk (eyes 'narrow'). |
| 111.35–113.3 | Keep the rumor mill spinning in a tailored suit | A literal windmill made of gossip magazines turning; a hater lips in a tiny tailored suit and tie cranks it. |
| 113.35–115.4 | You want the aesthetic? You want the lane? | A rival tries on a cheap copy of her buns (lopsided) at a mirror; the lane: two racing lanes, hers glittering. |
| 115.45–117.9 | …can't duplicate the rain. Or the thunder. | She raises the wand; storm clouds gather; rain falls only around her like a spotlight; on "thunder" a lightning bolt strikes, flash. A rival photocopier jams trying to copy her. |
| 117.95–122.0 | Yeah, keep talking under your breath. | Dark, rain; the lips are tiny and whispering at the bottom of the frame; she stands in a single spotlight, eyes closed, calm. |
| 122.0–123.8 | (silence) | Near silence: the raindrops freeze mid-air; hold. |
| 123.8–125.88 | One, two, three—drop! | Countdown: the frozen raindrops turn into 1… 2… 3 (big numbers, one per beat), on **DROP** she slams the wand down: shockwave, full flash into the finale. |

## i06 · Final chorus + outro (125.88 – 160) · rainbow galaxy + gold

| Time | Lyric | Shot |
|---|---|---|
| 125.88–141.25 | I-T-G-I-R-L ×4 | The biggest transformation: she grows to planet size in space, galaxy spiral hair, moon tiara. Each spelling a different setup: (1) letters as constellations, (2) backup dancers on planets, (3) the whole cast (cat, gentleman, reformed lips) dancing, (4) "yuh yuh yuh" freeze poses. |
| 141.3–149.6 | Bounce to the bass… snap… IT GIRL! | Back to the stage, all characters bouncing; snap = group photo polaroid; final IT GIRL = hero pose. |
| 149.6–151.8 | (break) | Petals and sparkles fall; the cat winks at the camera. |
| 151.8–160 | I-T-G-I-R-L… IT GIRL | Outro: the night city and moon again (bookend with the intro). She stands on the rooftop, pigtails in the wind, the letters glow over the moon one last time, and on the final beat she winks; iris-in on the wink sparkle → fade to night. Small line at the very end: "created by Claude Opus 5.5". |
