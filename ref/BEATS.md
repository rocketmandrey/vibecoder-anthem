# Reference 2102436464323661880 — frame-level beat map (target: 1:1 reconstruction)

Source: `~/Downloads/devteamdrew-research-2026-10-07/x-profile-public-video-archive/2026-09-22_devteamdrew_2102436464323661880/assets/video-01.mp4`
1920x1080, 24 fps, 766 frames (31.92 s), silent.
- All frames: `ref/f/NNNN.jpg`, frame N (1-based) shows t = (N-1)/24. E.g. t=9.417 → 0227.jpg.
- 12 fps overview sheets: `ref/s12_K.jpg` (K=0..3 → 8 s each; row = 1 s, 12 tiles of 1/12 s).
- `ref/motion.json`: mean abs diff of frame i vs i-1 (480x270). 0.0 = held frame.

## Cadence (from motion.json)
- **On twos** (every 2nd frame is an exact hold): paper/Clawd 0.0–6.3 and 29.8–31.92; sunflower hold ~14.6–15.1; Earth-rise 24.8–27.2.
  On top of that the paper/linework re-draws every 4 frames (bigger diff each 4th frame = 6 fps texture boil).
- **On ones** (every frame new): all transitions, zooms and morphs (6.3–29.8 except the holds above).

## Hard cuts = 1–2 frame flash inserts
| t (frame) | inserted frames | then |
|---|---|---|
| 9.417, 9.458 (227–228) | neuron re-drawn as **dark-brown pencil drawing on cream paper**, grey radial speed lines, scribbly grey border | 9.5 storm |
| 10.167, 10.208 (245–246) | **pencil lightning** (brown) on paper with radial lines | 10.25 paper radial blank → paper folds into a white beam |
| 21.25, 21.292 (511–512) | **ink burst**: cream bg, thick black radial wedges, small black circle in centre | 21.333 purple rings |
| 28.75, 28.792 (691–692) | **pencil spiral** on cream: black/blue/green concentric spiral strokes, black eye-oval in centre, grey radial lines | 28.833 soup bubble again |

## Beats (t in s)
**Segment A — Clawd on paper (0 – 7.45), owner s1_clawd.js**
- 0.0–0.55 empty cool cream paper (#ECE9E0-ish, mottled), thin grey ground line at ~0.73 H across the frame.
- 0.58–3.0 Clawd walks in from the LEFT, small (body ≈ 1/7 W). Body tilts/bobs per step, legs alternate. Stops ≈ 0.45 W.
- 3.0–4.4 stands, blinks (~4.17).
- 4.4–5.3 happy: eyes ^ ^, one arm raised waving.
- 5.4–6.3 neutral, thinking.
- 6.3–6.9 thin pencil concentric circles bloom around him + radial pencil lines; camera pushes in (accelerating).
- 6.9–7.25 body fills frame (orange with hatching), push into the LEFT eye: the eye is a dark rounded rect with a white highlight, inside it the cosmic "soup".
- 7.25–7.45 eye window fills frame → soup. (7.42: a 1-frame orange sliver.)
**Segment B — mind (7.45 – 10.25), owner s2_mind.js**
- 7.45–8.2 soup bubble: translucent coloured blobs (pink, teal, violet, yellow), tilted orbit ellipses (cyan, gold, magenta), tiny planets, sparkle star in centre, on dark indigo.
- 8.2–8.33 central spark → purple disc (soma); bubble falls away; 8.33 purple neuron with dendrite tree on indigo.
- 8.4–8.5 soma flashes yellow; 8.5–9.0 yellow impulse glow travels down the axon.
- 9.0–9.4 small neighbour neurons appear around; main neuron turns golden.
- 9.417–9.458 FLASH pencil neuron (see cuts). 9.5–10.12 storm: violet night sky, big cloud outline across the top, lightning = the neuron shape (dendrites → cloud branches, axon → bolt), rain, dark hill line at bottom. Lightning flickers (~9.75, 10.0).
- 10.167–10.208 FLASH pencil lightning.
**Segment C — light (10.25 – 13.667), owner s3_light.js**
- 10.25 cream paper with radial lines, no drawing; 10.29–10.45 the paper sheet folds/collapses into a white wedge → the white beam entering from the left on black.
- 10.45–11.5 prism (outlined triangle, glassy) at ~0.45 W; white beam from left, rainbow fan (6 flat bands) to lower right.
- 11.5–11.75 camera dives into the fan; 11.67 flat horizontal rainbow band across the full width.
- 11.83–12.0 the band wiggles and unravels into a double helix.
- 12.0–12.75 horizontal DNA double helix (red/violet backbones, multicolour rungs), scrolling.
- 12.75–13.0 helix turns end-on (perspective coil into depth) → 13.0–13.4 circular spiral seen end-on with rungs.
- 13.42–13.62 dotted Fibonacci (phyllotaxis) spiral of red/violet dots.
**Segment D — bloom (13.667 – 21.25), owner s4_bloom.js**
- 13.667–13.9 peach disc expands from centre over dark, carrying scattered seeds → full peach/sunset gradient; seeds converge.
- 13.9–14.25 seeds pack into a dark seed head; 14.25–14.6 yellow petals unfold; 14.6–15.6 sunflower holds (on twos, gentle sway).
- 15.6–16.0 seeds lift off as birds; flower drops out of frame.
- 16.0–17.0 murmuration across a peach→mauve sunset sky, shaping a long lens.
- 17.0–17.6 flock compacts into an ellipse, sky darkens to indigo; 17.6 flock → galaxy (glowing ellipse, warm core).
- 17.6–18.8 galaxy holds, slow rotation, dust.
- 18.83 core goes black; 18.9 ring; 19.0 accretion disk + lensed arc (orange/pink/cream), black shadow.
- 19.0–21.0 black hole rotates / tilts, disk shimmering.
- 21.0 4-point glint in centre; 21.08–21.2 hole shrinks with glow.
**Segment E — flight (21.25 – 28.75), owner s5_flight.js**
- 21.25–21.292 FLASH ink burst. 21.333 purple bg, small concentric rings (pink/white/gold) with glow.
- 21.42–21.9 rings expand past the camera (cream/gold/pink/violet bands), leaving a dark disc with star streaks.
- 22.0–22.45 warp: radial star streaks on dark.
- 22.5–23.4 a glowing spark rises from the bottom centre leaving a vertical golden beam; 23.5–23.9 spark again at the top.
- 23.75–24.25 rocket appears on top of the beam (the beam is its exhaust), rises.
- 24.25–24.9 rocket tilts right, trail becomes a golden arc; arc grows.
- 25.0–25.3 arc flattens into a thin horizon curve; 25.33 grey cratered Moon horizon, Earth peeking.
- 25.4–27.2 Earth-rise (on twos), Earth: blue ocean, green/yellow continents, white cloud swirls, dark outline.
- 27.2–27.6 push into Earth; 27.7 green island on blue ocean; 27.85 island = Mandelbrot shape.
- 28.0–28.3 zoom into rainbow-banded Mandelbrot on blue; 28.33 glowing dot at centre grows into the soup bubble; 28.5–28.7 bubble soup fills.
**Segment A again — return (28.75 – 31.92), owner s1_clawd.js**
- 28.75–28.792 FLASH pencil spiral. 28.833 soup; 28.9 orange body with eye-window (1-2 frames); 29.0–29.25 pull out of the eye: big Clawd body, eye with soup.
- 29.25–29.6 Clawd shrinks back to normal with radial pencil lines; 29.6–30.0 small Clawd neutral.
- 30.0–30.4 eyes ^ ^; 30.4–31.92 both arms up, happy, wiggle (on twos).

## Shared hooks
- `K.soup(c, t, cx, cy, R, a)` — the soup bubble (owner B); used by A (inside the eye 6.9–7.45, 28.83–29.3) and E (28.33–28.75).
