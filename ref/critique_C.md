# Segment C critique (t = 10.25–13.667)

Method: side-by-side crops at 10.29, 10.42, 11.0, 11.75, 11.96, 12.3, 12.75, 12.9, 13.0, 13.2, 13.5 (ref/f/NNNN vs out/qa_Cc/st). Per-frame motion: 85 of our frames rendered (10.208–13.708) at 480x270, mean abs diff vs previous frame, compared with ref/motion.json (ref frame N = motion[N-1]). Full-res coordinates are 1920x1080; "960-scale" means half of that.

Motion summary (ref / ours, mean abs diff per frame):
- 10.25–10.42 match well (10.33: 73 / 73; 10.38: 44 / 44).
- 10.58–10.92 ours too still: ref ~5–7, ours ~3–4.
- 10.96–11.29 cadence wrong (see item 6).
- 11.42–11.63 match within ~15% (ours slightly low at 11.46: 15 vs 19).
- 12.00 single-frame stall, 12.04–12.42 ours low: see item 5.
- 12.79–12.83 ours dead (18 / 18 vs ref 20 / 23), then 12.92 spike; see item 3.
- 13.04 spike (28 vs 22), then 13.08–13.42 ours ~11 vs ref ~20; see item 1.
- 13.46–13.58 ours 4–9 vs ref 10–12; see item 2.
- 13.625–13.708 D-cut peak one frame late; see item 4.

## Ranked list

1. **Jerk at 13.04 and slow end-on turn, 13.00–13.42.** Ref per-frame motion is a smooth ramp 26→29→22→20→19→18→15 (13.00→13.37). Ours: 25.8 (13.00), 28.4 (13.04), 12.4 (13.08), 13.1, 13.4, 11.3, 8.1 (13.25), 11.0, 11.8, 10.8 (13.38). This is the overshoot-then-drop the builder saw. Also the coil centre is off: ours ~(980,530) full-res vs ref ~(940,540) at 13.0 (SSIM 0.46 at 12.96–13.00 is the worst of the segment). Fix: drop/merge the camera key that lands on 13.04 and re-fit with a monotone curve; sample at 1/24 s; target per-frame diff 29 (13.00), 25 (13.04), 22 (13.08), 20 (13.13), 19 (13.21), 18 (13.29), 18 (13.33), 15 (13.38) — i.e. roughly 1.6–1.9x our current speed in 13.08–13.33. Recentre the coil on (940,540) full-res.

2. **Dotted Fibonacci spiral (13.42–13.62) is ~0.65x the reference size and too still.** Ref: outer dot ring reaches x≈270 full-res on the left (radius ≈670 px from centre ≈(940,540); top and bottom run off-frame), with a sparse trailing tail of 3–4 dots at lower right (960-scale ~(830,410),(700,530)). Ours: outer ring radius ≈445 px (leftmost x≈496). Dots: ref ellipses ~24x18 px full-res with darker red/violet shading (#e84838 / #a858e8 / shade #882838, #683898); ours ~16x12 px, flatter. Motion: ref 10.5–11.5 per frame, ours 4.5–8.6 at 13.46–13.58. Fix: scale the phyllotaxis radius by ~1.5 (outer radius ≈670 px, keep the centre hole ~ 1/12 of that), grow dots to ~24x18 px ellipses with a 2-tone shade, add the trailing tail dots, and retime its appearance so per-frame motion is 10–15 during 13.42–13.62.

3. **End-on coil timing at 12.75–12.92: dead frames and a spike.** Motion: ref 18.2 (12.75), 20.1, 22.8, 24.4, 26.4, 28.6 (12.96); ours 18.8, 18.1, 18.2 (12.79–12.83, stall), 24.4, 28.0 (12.92), 26.5. Position: at 12.75 ref coil vanishing point is at 960-scale x≈300 (full-res ~600); ours is at x≈190 (~380 full-res), i.e. ours is ~110 px ahead of ref at 12.75 and then stalls. Fix: move the 12.75 key so the vanishing point is at full-res x≈600 at 12.75, and make the ramp monotone 20→23→25→27→28 over 12.79–12.96 (remove the 12.83 plateau).

4. **Segment C→D cut is one frame late.** Ref motion peaks at 13.667 (69, the peach disc starts), ours peaks at 13.708 (82); at 13.667 ours is 41. Ref 13.625 = 24.7, ours = 28.9. Fix: start the D disc/bloom and the C end key one frame (1/24 s) earlier, or shift the C→D hand-off so ours peaks at 13.667.

5. **Helix entry: single-frame stall at 12.00 and under-speed 12.04–12.42.** Motion: ref 11.958 → 12.47, 12.000 → 7.75, 12.042 → 5.6, 12.083 → 5.8, 12.125 → 6.6, 12.167 → 8.2, 12.25 → 8.3, 12.33 → 10.0. Ours 12.18 → 12.0 → 2.07 (stall) → 3.9 → 4.1 → 6.4 → 5.0 → 6.6 → 7.1 → 8.6. Fix: the unravel→helix scroll needs continuous velocity across 12.00 (the value at 12.0 should be ~8, not 2); raise helix scroll/camera speed by ~15% over 12.04–12.42.

6. **On-twos cadence missing at 10.96–11.29.** Ref is on twos there: frames 266, 268, 270 are exact repeats of 265, 267, 269 (motion 0.02, 0.03, 0.07), odd frames move 5–7. Ours moves ~2.0 every frame (smooth but wrong cadence, visible as a judder difference when played against ref). Fix: for t in [10.96, 11.29] quantise the time for prism/beam/fan to pairs (floor to even frame) so every second frame is a hold; check against motion table in the frames 264–272.

7. **Under-speed 10.58–10.92.** Ref per-frame 5.5–6.9 (prism/beam slow drift), ours 2.3–4.2. Ours is ~40% too static here. Fix: raise the beam/prism drift in 10.58–10.92 by ~1.6x (or start the fan's brightening earlier), keeping the on-ones feel (ref has no holds in this window).

8. **Dotted orbit ring, tick marks and dashed rays around the prism are missing (10.46–11.6).** Ref (11.0): dotted circle centred on prism at 960-scale ≈(362,295), radius ≈190 (full-res centre ≈(724,590), r≈380), about 60 tick marks at 12 positions on its inside, plus two dashed rays going up-left and right from the prism. Ours: none. Fix: add a dashed circle, stroke #c9ccd6 at ~45% alpha, 1.5 px, dash 6 / gap 10 px, radius 380 full-res around prism centroid (724,590); 12 short radial ticks (6 px) on the inside; two dashed rays from the apex at ~±30° to the horizontal.

9. **Prism rendering.** Ref fill is darker and hatched: sampled #515669 (upper area), #4f5669 and #2f3648 (lower area) with diagonal pencil hatch; a faint back-face outline offset ~(+30,-30) full-res. Ours is a flat #3b4865 everywhere, no hatch, no hand-drawn wobble. Fix: fill #3a4156 with a gradient to #2f3648 at the base; hatch 1 px lines at 45° every 6 px in #5b6379 clipped to the prism; outline cream #f2efe6 2.5 px with ~1 px jitter; back edge #3d4456 at 1.5 px. Keep geometry (apex matches at (744,356), base y≈700, x 490–940 full-res).

10. **Beam entry is ~25 px too low and too thin at 11.0.** Full-res column measurements at 11.0 (frame 265): ref beam occupies y 472–498 at x=20 and y 484–510 at x=200 (~26 px thick); ours y 504–525 (x=20) and 507–527 (x=200) (~21 px, centred ~30 px lower). At 10.42 ours is 63 px thick vs ref 74 px. Fix: raise the beam's centreline at the left edge by ~28 px (to y≈485 at x=0) and widen to ~28–30 px, keeping the prism entry point (it should hit the prism at ~y 530 full-res, which ours already does).

11. **Paper sheet at 10.29–10.33 lacks texture and the pencil wedge.** Ref frame 248: paper #e7e7df with mottled grain and a hairy grey edge (hatch ticks along the top and bottom edges), sparse grey radial lines (#8a8a80, ~1 px), and a dark pencil wedge (near-black, 3–4 px) from full-res ≈(810,360) to (1020,660) with a short curl at (940,660). Ours: #ece9de flat (sample: 236,233,222), uniform 1-px radial lines, no edge hatch, no wedge. SSIM is 0.76 at 10.25 and 0.79 at 10.29. Fix: paper #e7e7df with a low-amplitude noise (±4) and 1-px hatch border ticks; add the dark pencil wedge (two strokes, #1c1c1c, 3–4 px) that retracts at 10.33; reduce ray count by ~30% and alpha to match ref lines.

12. **Helix backbones read flatter than ref (12.0–12.75; SSIM 0.72).** Ref strands are ~1.2x thicker with a dark under-stroke (sampled #882838 shade under the red #e84848, #683898 under the violet #a858e8) and diagonal pencil hatching along the strand; ours is a flat two-tone (red #e83838, violet #9858e8) with no under-stroke. Fix: stroke width +20%, add a 2–3 px under-stroke offset in #882838 (red) / #683898 (violet), and a 45° hatch clipped to the strand. Keep the period (≈215 px at 960-scale spacing matches ref already).

13. **End-on circular spiral (13.0–13.2): rung sticks too short.** Ref sticks are ~100–120 px long at 960-scale (≈200–240 full-res) and reach past the ring they belong to; ours are ~45–70 px (960-scale) and clipped inside. Ring thickness is about right. Fix: rung length ≈ 0.85 × the local ring radius, sticks should cross the next ring out; keep the same colour cycle (yellow, orange, blue, green). Recheck the coil centre (see item 1).

14. **Background glitch hairlines missing (11.5–11.9).** Ref frame 283 (11.75) has ~30 horizontal dark-blue-grey hairlines (#1a1a34, 1–2 px high, 40–300 px long, scattered across the top half and the lower band edge) over the indigo bg; ours is clean. Motion at 11.67–11.79 is near-zero in both so the lines are probably static per-hold frames. Fix: add a seeded set of ~30 such hairlines to the band segment between 11.46 and 11.96 (verify on frames 277–288 first; not checked beyond 11.75).

15. **Colour sampling, minor.** Band colours at 11.75 (sampled full-res at x=1200): ref red #ee3f3c, orange #f68827, yellow #f7d438, green #45c66a, blue #2d9de5, indigo #5761da, violet #a654e6; ours #f14040, #f68a30, #f6d43d, #47c36b, #309de5, #4e54d2, #a550e1. Indigo is the outlier (ours is ~9–13 units darker). Fix: indigo band #5761da; red #ee3f3c; orange #f68827. Also the fan is 7 bands in both ref and ours (BEATS.md says 6; update that note).

## Notes
- Overall SSIM worst spots: 12.96–13.00 (0.46), 13.67 (0.52), 12.88 (0.57). All three are in the coil/turn and D-cut items above.
- No change to the ref overall timing of the 10.25–10.42 paper→beam hand-off; motion matches there.
