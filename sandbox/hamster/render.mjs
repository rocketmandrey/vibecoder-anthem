// node sandbox/hamster/render.mjs [1,2,3,4,5]   → out/reels/hamster_v<n>.mp4 (4 s, 720², 24 fps) + hamster_variants.mp4/.png grid
import puppeteer from 'puppeteer-core';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const vs = (process.argv[2] || '1,2,3,4,5').split(','), FPS = 24, N = 96, OUT = 'out/reels';
const run = (a, input) => new Promise((ok, bad) => { const p = spawn('ffmpeg', a, { stdio: [input ? 'pipe' : 'ignore', 'inherit', 'inherit'] }); p.on('close', c => c ? bad(new Error('ffmpeg ' + c)) : ok()); if (input) input(p.stdin); });
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--allow-file-access-from-files'] });
await Promise.all(vs.map(async v => {
  const page = await browser.newPage(); await page.setViewport({ width: 720, height: 720 });
  page.on('pageerror', e => console.log('page error', v, e.message));
  await page.goto(pathToFileURL(resolve('sandbox/hamster/index.html')).href + `?render&v=${v}`); await page.waitForFunction('window.ready === true');
  await run(['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${OUT}/hamster_v${v}.mp4`], async stdin => {
    for (let i = 0; i < N; i++) { const u = await page.evaluate(t => window.renderAt(t), i / FPS); stdin.write(Buffer.from(u.slice(u.indexOf(',') + 1), 'base64')); }
    stdin.end();
  });
  console.log('v' + v);
}));
await browser.close();
if (vs.length === 5) {
  const ins = vs.flatMap(v => ['-i', `${OUT}/hamster_v${v}.mp4`]), sc = vs.map((_, i) => `[${i}:v]scale=480:480[s${i}]`).join(';');
  const grid = `${sc};[s0][s1][s2][s3][s4]xstack=inputs=5:layout=0_0|480_0|960_0|240_480|720_480:fill=0x1C1F24`;
  await run(['-y', '-loglevel', 'error', ...ins, '-filter_complex', grid, '-c:v', 'libx264', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${OUT}/hamster_variants.mp4`]);
  await run(['-y', '-loglevel', 'error', '-ss', '3.2', '-i', `${OUT}/hamster_variants.mp4`, '-frames:v', '1', `${OUT}/hamster_variants.png`]);
  console.log('grid done');
}
