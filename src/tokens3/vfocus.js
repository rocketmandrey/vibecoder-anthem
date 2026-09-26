// tokens3/vfocus.js: 9:16 reframing for «Жги токены» v3 (src/vertical.js). [real time, centre x, window width (1080 square … 1920 whole frame)].
// Written as shots: [start, x, w] holds until the next start and cuts there (hard, 0.01 s); [t, x, w, 1] glides (smoothstep) in from the key before it.
const VSHOTS = [
  [0, 1270, 1300],                                      // the dark: the match scrape, coin + Clawd
  [2.92, 1170, 1500],                                   // the flame on the token, Clawd right
  [5.54, 1000, 1200],                                   // ПРЕСС №1 slam → «ЖГИ ТОКЕНЫ» over the burning token
  [7.54, 960, 1080],                                    // the vigil row
  [11.9, 960, 1080], [12.6, 960, 1500, 1],             // the ride: ЗАВОД ТОКЕНОВ sign passes
  [17.35, 960, 1920], [18.6, 940, 1600, 1],              // 17.4 SLAM: the big sign spans the frame
  [24.88, 1150, 1540],                                  // Friday room: Clawd + to-dos + calendar
  [27.78, 1040, 1700],                                  // the laptop: limit bar 50%, «ПОЛПУТИ»
  [30.0, 1100, 1600],                                   // the park window, calendar flips
  [32.91, 960, 1080],                                   // the Sunday page burns
  [35.5, 960, 1300],                                    // site + bot waved off, the tractor beam
  [38.91, 960, 1500],                                   // rocket to the moon
  [40.37, 960, 1700],                                   // arcade «0 ИГРОКОВ»
  [42.79, 900, 1500],                                   // «МОЙ САЙТ» «0 ПОСЕТИТЕЛЕЙ» → the hot rack
  [45.49, 960, 1080],                                   // the burning hall
  [48.06, 1000, 1450],                                  // БИРЖА chart, eyes, «ЖГИ!»
  [50.21, 960, 1300],                                   // chorus: the shredder, «ЖГИ ТОКЕНЫ»
  [52.83, 1020, 1800],                                  // the limit bar burns down
  [55.6, 960, 1300],                                    // shredder again
  [57.98, 960, 1080],                                   // odometer 1 000 000
  [60.26, 960, 1920],                                   // «БОЛЬШЕ АГЕНТОВ», the hiring grid
  [65.23, 960, 1920],                                   // CEO slide: «ЗАЧЕМ?» / «НЕВАЖНО» / «ПОЛЕЗНО»
  [71.35, 1000, 1200],                                  // the stamp afterimage
  [72.14, 980, 1800],                                  // new KPI board
  [74.79, 940, 1500],                                   // the chairs
  [77.21, 1000, 1540],                                   // the extinguisher reprimand
  [79.58, 960, 1540],                                   // the golden idol
  [82.04, 960, 1920],                                   // org chart
  [84.70, 960, 1700],                                   // the report gathers dust
  [89.57, 1000, 1600],                                  // its price 40 000 000
  [92.74, 900, 1500], [93.8, 760, 1500, 1], [94.8, 760, 1500], [95.4, 960, 1500, 1], [95.9, 1170, 1500, 1],   // print → bind → award → shred, following the hits
  [96.86, 900, 1400],                                   // night chimneys, smoke letters
  [99.70, 900, 1200],                                   // the limit gauge on chimney 3
  [101.87, 960, 1400],                                  // chimneys
  [105.0, 960, 1300],                                   // public counter
  [107.29, 920, 1400],                                  // agents march out, «БОЛЬШЕ АГЕНТОВ / ЖЕЛЕЗА»
  [112.17, 920, 1400],                                  // GPU drone, «НЕВАЖНО» stamps
  [115.45, 930, 1750],                                  // «ЭТО ПОЛЕЗНО!» billboard
  [118.42, 1250, 1080],                                  // the gauge hits 0%
  [119.16, 960, 1080],                                  // blackout, one spotlight
  [121.5, 960, 1080],                                   // the cathedral
  [125.37, 960, 1920],                                  // «больше меди / больше воды»
  [128.25, 930, 1080],                                  // «Зачем?»
  [129.87, 960, 1920],                                  // the madman, the price tag, the bill
  [132.46, 960, 1920], [135.5, 1000, 1700, 1], [136.4, 760, 1200, 1],   // push-in, shades on
  [136.54, 960, 1500],                                  // «БОЛЬШЕ GPU!»
  [139.83, 700, 1150], [142.3, 1320, 1150, 1],          // GPU rush: pan with the crowd-surfing CEO (left → right)
  [142.35, 960, 1500],                                  // the PCIe slot, «ВЖЖЖЖ»
  [144.83, 700, 1150], [147.95, 1240, 1150, 1],         // GPU rush 2, same pan (the «ЕЩЁ GPU!» slams at 960 stay in frame)
  [148.0, 960, 1500],                                  // the factory plugs in
  [149.27, 960, 1080],                                  // samsara wheel: VERT camera (a07 CAMKV) whips to each pod centred, square window
  [158.37, 960, 1250],                                  //   the pull-back whip to the whole wheel
  [160.3, 900, 1400],                                   // «ЭКОНОМИКА РАБОТАЕТ!»
  [162.59, 960, 1700],                                  // AGI spring calendar / loading 99.999% (a08 VERT pulls the cast in)
  [167.79, 960, 1300],                                  // the robot arm
  [170.34, 960, 1920],                                  // programmers «ВОТ-ВОТ»
  [172.66, 960, 1300],                                 // hug the phone
  [175.54, 960, 1080],                                  // calorie tracker
  [177.46, 960, 1500],                                  // 100 000 GPU
  [180.5, 980, 1080],                                   // the bun, the mayo
  [186.74, 900, 1400],                                  // final chorus: the presses
  [189.22, 1000, 1700],                                 // the firebox, ×2
  [191.2, 920, 1500],                                  // the shredder «ПОТОМ»
  [194.32, 880, 1080],                                   // AGI billboard
  [196.2, 880, 1080], [196.8, 1150, 1300, 1],           // whip to CAPEX neon
  [197.29, 980, 1400],                                  // benchmark +1%
  [198.96, 960, 1920],                                  // 300 000 000 000
  [199.46, 960, 1600],                                  // puppets
  [202.21, 1000, 1080],                                  // the big hand / TV off
  [203.58, 1100, 1500],                                 // ВС 23:58
  [211.0, 1040, 1200],                                  // 0 токенов
  [213.66, 1100, 1600],                                 // 3 games / 7 sites
  [216.17, 920, 1080],                                  // 42 agents
  [218.5, 1100, 1500],                                  // the desk, the clock
  [222.6, 1100, 1500], [223.2, 960, 1080, 1],           // to the window
  [226.42, 1000, 1300],                                 // «лимит восстановлен»
  [227.64, 960, 1500],                                   // close-up, «Сука»
  [230.87, 1000, 1080],                                 // blast
  [233.42, 960, 1080],                                  // laptop corridor
  [234.08, 920, 1500],                                  // mosh with the agents
  [235.37, 800, 1400],                                  // stage-dive
  [236.21, 960, 1080],                                  // «прыжок веры» / БУМ
  [238.02, 1020, 1440],                                 // planet limit → token, 0%
  [239.38, 860, 1200],                                  // smash «0%», fists up
  [240.05, 860, 1200], [240.3, 1000, 1600, 1],          // «ЖГИ!» flashes in on the right
  [240.9, 960, 1540],                                   // credit card
];
const VF = window.VFOCUS = [];
VSHOTS.forEach(([t, x, w, glide], i) => {
  const P = VF[VF.length - 1];
  if (i && !glide && t - P[0] > .02) VF.push([t - .01, P[1], P[2]]);
  VF.push([t, x, w]);
});
window.VTITLE_OFF = t => t >= 240.9;                                        // the end card has its own title
