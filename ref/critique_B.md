# Critique B: t = 7.45–10.25 s (soup → purple neuron → gold neuron → pencil flash → storm → pencil flash)

Method: reference frames 183–246 vs our stills rendered at the same frame times (frame N = (N-1)/24 s). Measurements are at 1920x1080. Colours are sampled with PIL (median of a small box). Motion is mean abs diff at 480x270 over consecutive frames, ours vs `ref/motion.json`. Mean SSIM for B is 0.613 (worst 9.42 = 0.32, 10.17 = 0.39).

Ranked by visibility.

1. **Storm cloud has no ink outline (9.5–10.21, frames 229–246).**
   Ref: the cloud lobes have a dark ink outline (about 3–4 px, near #15132B) and a fill of about #6E69AB to #8E8BC0 (sampled at 229 (900,120) = #8B8ECF). Lobes are layered: two big centre lobes plus a left and right lobe, each with a bumpy edge.
   Ours: same lobe silhouette, but no outline and a flat lilac fill (#7670C0). Lum at column x=600, y=0–300 is about 90–100 in ours vs 14–85 in ref.
   Fix: stroke every cloud lobe path with #15132B, width 4 px at 1920, and add a second inner lobe shade (#8B8ECF) on the upper-left of each lobe. Keep the lobe bottom edge at y≈250–265.

2. **Lightning trunk and core are the wrong width and colour (frames 232–241).**
   Ref at y=500: bright span x=970–996 (26 px), centre 980; core #E7FAFB, mid-blue halo #526DA9.
   Ours at y=500: span x=962–1000 (38 px), centre 972; core #FFFEFC with a wide #B9C6FA glow.
   Fix: trunk width 26 px incl. halo. Core stroke about 3 px in #E7FAFB, halo stroke about 8 px in #526DA9 at 60% alpha. Shift the trunk centre to x=980 at y=500 and x=949 at y=800 (ours 943). Cut the wide glow to about half its current radius.

3. **Pencil lightning at 10.208 (frame 246) is a neuron, not a bolt; radial focus is misplaced.**
   Ref 246: ochre/brown wiggly strokes, the tree is cut off at the top edge, it spans x≈480–1410 at the top, and the trunk is a zig-zag bolt. Radial focus (paper lines converge) at about (960, 630).
   Ours 246: a complete compact brown neuron tree centred at x≈870, fully visible at the top (y≈0–260). Radial focus at about (870, 870).   Fix: for the second pencil frame, move the focus to (960, 630), crop the tree at y=0 (top branches run off the frame), add 3–4 zig-zag kinks per 100 px on the trunk, and recolour strokes from the current brown to ochre about #B07A3C.

4. **Soma colour at the 8.625 flash (frame 208) is wrong.**
   Ref 208: soma flashes to pale rose #F8B8C8 (dominant tones #F8B8C8 / #E8A8C8) with a glow.
   Ours 208: soma stays mauve-grey #8878A8 with only a faint yellow halo.
   Fix: from 8.625 to 8.67, lerp soma fill to #F8B8C8 and back to #5A3FC0 over 3 frames (208–210). Also enlarge the axon starburst (ref about 180 px wide at ~(984,723); ours about 105 px) and double the glow radius.

5. **Neuron growth ends in a freeze then a one-frame pop (frames 199–205, 8.25–8.46).**
   Ref mean abs diff: 8.25=16.5, 8.29=24.6, 8.33=37.1, 8.375=27.8, 8.417=17.0, 8.458=16.6, 8.5=19.9.
   Ours: 8.25=3.4, 8.29=10.8, 8.33=42.7 (pop), 8.375=9.5, 8.417=0.40, 8.458=0.43, 8.5=5.5.
   So ours is too slow before 8.3, pops at 8.33, then holds for 2–3 frames (8.417–8.458), where ref is still moving at 17 per frame.
   Fix: drive dendrite/soma growth with a continuous curve that peaks at 8.33 and never reaches zero velocity before 8.5 (e.g. growth p = smoothstep over 8.12–8.46 with a linear tail, not an ease-out that stops at 8.42). Ref needs ~16 mean diff at 8.21–8.25 and ~17 at 8.42–8.46.

6. **Soup freezes for 4 frames at the start of segment B (frames 183–186, 7.58–7.71).**
   Ours mean abs diff: 0.20 at 183, 184, 185, 186 (effectively frozen). Ref: 6.1, 5.9, 8.6, 6.1 (continuous orbit and blob drift).
   Fix: give the orbit ellipses and blob drift a nonzero angular speed at t=7.46 (target ≈ 6 mean-abs at 480x270 per frame, same as ref; tune the orbit speed until it matches). Remove any ease-in that sets velocity to zero at segment start.

7. **Lightning restrike frames are 1–3 frames late.**
   Ref flicker peaks (mean abs diff): 231 (9.583) = 26.4; 237 (9.833) = 33.5; 238 (9.875) = 24.7; 240 (9.958) = 11.8.
   Ours peaks: 232 (9.625) = 12.1; 233 (9.667) = 14.1; 238 (9.875) = 8.3; 239 (9.917) = 10.1; 241 (10.0) = 16.1 (ref 241 = 5.2).
   Fix: restrike keyframes should be at 231, 237, 238 and 240 (ours currently at 232–233, 239, 241). Remove the 241 peak. Each restrike should be one frame of a new bolt shape plus one frame of a dim hold.

8. **Neighbour neurons stay lavender where ref has already turned gold (9.0–9.21, frames 217–222).**
   Ref 217: the top-right neighbour and one lower neighbour are gold (#FDF71E nuclei, peach/gold arms). Ref 222: all neighbours are gold-peach with yellow nuclei.
   Ours 217: all neighbours still #6A5AD0-ish lavender-blue; by 222 they are only partly warm.
   Fix: colour-lerp neighbours from #6A5AD0 to #FDF71E between 8.92 and 9.21, starting with the top-right neighbour (about (1860, 210) at 9.0) so it is gold by 9.0.

9. **Gold main neuron is too orange (9.21–9.42, frames 222–226).**
   Ref body at 226: #F8F818 / #F8E818 (lemon-gold). Ref axon at 217 (9.0): #F8D838 / #F8C838.
   Ours body at 226: #F8C848 (ochre); ours axon at 217: pale brown #987848 where the glow is weak.
   Fix: body fill #F8F818 with nucleus #F8E040, dendrites #F8E040, axon #F8D838 (0.6 alpha halo #F8F818 at 40%). Brighten the impulse glow at 9.0 to match ref (ref glow looks visibly larger than ours at the same point on the axon, about (960, 1020) in 1920 scale; measure before setting the radius).

10. **Soup colour and hatch texture (7.45–8.2, frames 181–199).**
    Ref pink blob #AB3768 (sampled at 183 (560,700)); ours #C35988 (lighter, less saturated). Ref teal blob #4D85A5 (183 (900,250)); ours #606B95 (greyer). Ref blobs have diagonal hatching (~8 px spacing, #2B1B3B lines, ~35% alpha); ours are flat.
    Fix: pink fill #AB3768, teal fill #4D85A5, add 45° hatching lines spaced 8 px, 1.5 px wide, #2B1B3B at 35% alpha inside the blobs.

11. **Dendrite and axon linework is jagged instead of tapered (8.33–8.42 and 9.0–9.42).**
    Ref 201/203: smooth tapering strokes (about 10 px at base to 1–2 px at tips), with a faint highlight and short dark hatch on the trunk. Axon has dark bands at joints.
    Ours: polyline dendrites with sharp kinks and many short stubs (roughly 1.5× the twig count of ref), squared tips, and axon segments with bulges at each joint.
    Fix: draw dendrites as quadratic Béziers with width taper (base 8 px, tip 1 px), reduce twig count to about 60% of current, and turn off the bulge at axon joints (use a continuous stroke with a 1-px dark outline).

12. **Pencil neuron at 9.417 (frame 227): soma and ink weight are wrong.**
    Ref 227: soma is a dark cross-hatched disc (about 90 px diameter at 1920) with a dark outline. Dendrites are near-black #2A1F18 at about 4 px.
    Ours 227: soma is a pale grey disc with a thin outline and no hatch; dendrites are about 2 px.
    Fix: soma disc filled with 45° cross-hatch (#3A3A3A, 3 px spacing), 3-px outline. Dendrite and axon width 4 px, colour #2A1F18.

13. **Flash frames do not redraw (9.458 = frame 228, 10.208 = frame 246).**
    Ours: 228 is an exact duplicate of 227 (mean abs diff 0.00); 246 is an exact duplicate of 245 (0.00). Ref: 228 differs by 5.2 and 246 by 6.0 (pencil linework re-drawn per frame).
    Fix: on the second frame of each flash pair, jitter every control point of the drawing by about ±2 px (fixed seed) so the pencil redraw shows.

14. **Paper base tint is too yellow.**
    Ref paper #E4E4DC (227 at (200,200) and (1700,900)). Ours #DCD9CC / #D7D3C7. Ref 246 paper is #EAE9E2 vs ours #F1EFE3.
    Fix: paper base #E4E4DC (flash 1) and #EAE9E2 (flash 2); keep grey border hatch.

15. **Ground line and strike halo (9.5–10.1, storm frames 229–241).**
    Ref dark hill top at x=300 is y=701; ours 707. Ref strike halo is a blue glow about 300 px wide at ground level; ours is about 150 px and fainter.
    Fix: raise the hill silhouette by 6 px at 1920 scale. Make the ground strike halo about 2× radius with colour #5C6FD8 at 35% alpha.

Timing check (passes): flash 1 (9.417, 9.458) and flash 2 (10.167, 10.208) start on the correct frames (227 and 245). Ours mean abs diff at 227 = 180 vs ref 188; at 245 = 166 vs ref 176. The storm starts on frame 229 in both.
