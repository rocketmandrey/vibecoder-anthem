# Smooth morphing and motion for the Canvas 2D pipeline

Constraints: plain `<script>` tags (UMD or inline), every frame is a pure f(t), no SVG DOM, Canvas 2D output.
Versions checked against the npm registry, 2026-10-09.

## Recommended toolkit

Verdict: write the morph core inline (about 60 lines). Use no morph library in the render path.
Libraries are reference only, plus `polymorph` as an optional fallback.

### 1. Arc-length resample + best-rotation match + lerp (inline)

```js
// pts: [[x,y],...] closed ring. Returns n points spaced equally by arc length.
function resample(pts, n) {
  const L = [0]; // cumulative length, closed ring
  for (let i = 1; i <= pts.length; i++) {
    const a = pts[i - 1], b = pts[i % pts.length];
    L.push(L[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1]));
  }
  const total = L[pts.length], out = [];
  let j = 0;
  for (let k = 0; k < n; k++) {
    const s = (k / n) * total;
    while (L[j + 1] < s) j++;
    const a = pts[j], b = pts[(j + 1) % pts.length];
    const u = (s - L[j]) / (L[j + 1] - L[j] || 1);
    out.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]);
  }
  return out;
}

// Start-index rotation (and optional reversal) minimising summed squared distance.
// O(n^2); n = 128..256 is fine, and it runs once per morph, not per frame, if cached.
function matchRing(A, B, allowReverse = true) {
  const n = A.length;
  let best = { cost: Infinity, B: B };
  for (const Bc of allowReverse ? [B, B.slice().reverse()] : [B]) {
    for (let s = 0; s < n; s++) {
      let c = 0;
      for (let i = 0; i < n; i++) {
        const p = A[i], q = Bc[(i + s) % n];
        c += (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2;
      }
      if (c < best.cost) best = { cost: c, B: Bc.map((_, i) => Bc[(i + s) % n]) };
    }
  }
  return best.B;
}

// Pure morph: same t -> same shape.
function morph(A, B, t) {
  return A.map((p, i) => [p[0] + (B[i][0] - p[0]) * t, p[1] + (B[i][1] - p[1]) * t]);
}
// Usage: const A = resample(ringA,160), B = matchRing(A, resample(ringB,160));
// ctx.beginPath(); morph(A,B,e).forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p)); ctx.closePath();
```

Note: rotation-only matching fails when the shapes need a different orientation. Add a small
search over rotation angle (before resampling) if needed. Keep the match cached; `morph` is cheap.

### 2. Closed-form critically damped spring as f(t)

Use for camera and element lag. No state, no integration, random-access safe.

```js
// Critically damped spring from x0 (with velocity v0) to target, at time t >= 0.
// w = angular frequency (rad/s). Standard closed form: x(t) = target + (x0 + (v0 + w*x0)*t) * e^(-w t)
// with x0 = start - target.
function spring(t, start, target, w = 6, v0 = 0) {
  const x0 = start - target;
  return target + (x0 + (v0 + w * x0) * t) * Math.exp(-w * t);
}
// Evaluate as a function of t relative to the moment the target was set: spring(t - tKey, ...).
// Keep t0 values in a fixed table, so the result stays pure.
```

Single-variable only; for 2D, call it per axis. Overshoot-free by construction.

### 3. Smoothstep-chained camera keys (pure)

```js
const ss = (u) => { u = Math.min(1, Math.max(0, u)); return u * u * (3 - 2 * u); };
// keys: [{t:0, x:0, y:0, z:1}, {t:4, x:120, y:-40, z:1.4}, ...] sorted by t
function camera(t, keys) {
  let k = 0;
  while (k < keys.length - 2 && t >= keys[k + 1].t) k++;
  const a = keys[k], b = keys[k + 1];
  const u = ss((t - a.t) / (b.t - a.t));
  return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, z: a.z + (b.z - a.z) * u };
}
```

Smoothstep gives zero velocity at every key, which reads as a deliberate stop. For continuous motion
use quintic `u*u*u*(u*(6*u-15)+10)` (zero velocity and acceleration at ends).

### 4. Frame blending / motion blur (pure, sub-sampled)

Average N samples over a shutter window: `frame(t) = mean_k draw(t + k/fps * shutter/N)`.
Each sample is still a pure function of t, so workers can split the sub-samples.
Cost is N x. Use N = 4..8 only for fast cuts; for hand-drawn look, prefer smears (below).

## Libraries

| Lib | Version / license / size | Works in our constraints? | Verdict |
|---|---|---|---|
| flubber | 0.4.2, MIT, 88 KB unpacked; UMD `https://unpkg.com/flubber@0.4.2/build/flubber.min.js` (~53 KB) | Yes: ring or path input, returns `interpolator(t)`, pure. Outputs path string -> `new Path2D(d)` | Reference only. Good "best guess" for arbitrary shapes, but its matching is opaque; we want control over ink and hatching |
| polymorph-js | 1.0.2, MIT, 66 KB unpacked; UMD `https://unpkg.com/polymorph-js@1.0.2/dist/polymorph.min.js` (~7 KB) | Yes: pure, path-string output, handles holes | Use only as fallback for quick path-to-path morphs; ~7 KB, MIT, minimal API |
| d3-interpolate-path | 2.3.0, BSD-3-Clause, zero deps; npm main `build/d3-interpolate-path.js` (UMD path verified via npm `main` field; the `.min.js` URL 404s) | Yes, pure (string in, string out), good with Path2D | Skip: extends point counts, not the best correspondence for hand-drawn wobble. Borrow the De Casteljau idea only if beziers are needed |
| KUTE.js | 2.2.6, MIT, 626 KB unpacked; `https://unpkg.com/kute.js@2.2.6/dist/kute.min.js` (~50 KB) | Partly: `cubicMorph` exists, but it is a stateful tween engine (rAF) | Skip. Its morph is point-count matching through svg-path-commander; not pure |
| GSAP MorphSVG | gsap 3.15.0, "Standard" no-charge license per npm (gsap.com/standard-license); `https://unpkg.com/gsap@3.15.0/dist/MorphSVGPlugin.min.js` (~21 KB) | Only via timeline seek, which is stateful and needs DOM SVG paths | Skip in render. Matching ideas to borrow: `shapeIndex` (start-point rotation, negative = reversed), `map` modes (size / position / complexity), convert to cubics and add anchors so counts match |
| svg-path-properties | 2.1.0, ISC, 65 KB unpacked | Yes, but needs path length queries; we resample ourselves | Skip: our 30-line `resample` covers it |
| mo-js | 0.288.2, MIT | DOM-oriented, stateful | Skip |

### GSAP MorphSVG: how it matches, and open alternatives

- Converts every path to cubic beziers, then inserts anchor points so both shapes have equal counts.
- Chooses a start point by `shapeIndex` (`auto` runs a search, a number is fixed); `map` pairs subpaths by size, position, or count.
- The open-source equivalent is items 1 above (resample by arc length + rotation search). It covers
  the same job for closed rings. The `polymorph` and `flubber` libraries do the same in different forms.

### SDF morphing (Inigo Quilez, smooth min)

- Source: https://iquilezles.org/articles/smin/ (the polynomial smin formula below is the standard
  form from that article; the page was not retrievable during this research, so verify the exact form there).
- Polynomial smooth min: `h = clamp(0.5 + 0.5*(b-a)/k, 0, 1); return mix(b, a, h) - k*h*(1-h);`
- Morph by blending two shape SDFs: `d(t) = mix(dA, dB, t)` or `smin(dA, dB, k(t))`. `k` in distance units.
- Verdict: skip the GLSL/WebGL route. Our pipeline is Canvas 2D with hand-drawn ink; a raster
  SDF pass adds a second renderer, a readback cost per frame, and loses hatching. Borrow the
  smin formula only if we later need a blobby union at low resolution (e.g. spark -> cell merge),
  and then rasterise to ImageData and trace the outline with marching squares.

### Particle-identity morphs (verdict: use for "seeds -> birds -> stars")

Assign each particle a fixed id at t=0 and a target at each keyframe, from a seeded PRNG
(`hash(id)`). Position = `lerp(p_k(id), p_{k+1}(id), ease(t))`. Pure, because the ids and
targets depend only on the seed. Sorted-by-angle assignment gives fewer crossings than random.

## Smoothness practice

- Animation on twos: hold each drawing for 2 frames (12 drawings/s at 24 fps). Use ones only for fast action or when a moving background strobes. Source: AnimSchool blog (https://blog.animschool.edu/?p=608), Blender Artists thread (https://blenderartists.org/t/animation-on-twos/686600).
- Smears: an in-between frame that stretches or duplicates the shape, drawn only for fast moves. For a rocket trail, use one stretched frame between extremes; add a second for ease. Source: Prolific smear guide (https://prolificstudio.co/blog/smear-frames/), Clip Studio (https://tips.clip-studio.com/en-us/articles/6170). For our code: draw the morph with a stretched copy (scale along the velocity vector) at alpha 0.3-0.5, as a pure function of t.
- Easing: use smoothstep for holds and quintic for continuous motion. Avoid linear morphs; they read as mechanical.

## Gaps

- No Context7 or Notion lookup was needed: this is research, not code against an external API.
- The exact IQ smin page was unreachable (HTTP 404 via WebFetch); the formula is from the standard article and should be checked.
- MorphSVG license: npm states "Standard" no-charge. Verify on gsap.com before any reuse.
