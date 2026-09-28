// tokens3/vfocus.js: 9:16 reframing for «Жги токены» v3 (src/vertical.js). [real time, centre x, window width (1080 square … 1920 whole frame)].
// Written as shots: [start, x, w] holds until the next start and cuts there (hard, 0.01 s); [t, x, w, 1] glides (smoothstep) in from the key before it.
const VSHOTS = [
  [0, 1270, 1300],                                      // the dark: the match scrape, coin + Clawd
  [2.895, 1170, 1500],                                   // the flame on the token, Clawd right
  [5.504, 1000, 1200],                                   // ПРЕСС №1 slam → «ЖГИ ТОКЕНЫ» over the burning token
  [7.384, 960, 1080],                                    // the vigil row
  [12.025, 960, 1080], [12.711, 960, 1500, 1],             // the ride: ЗАВОД ТОКЕНОВ sign passes
  [17.45, 960, 1920], [18.666, 940, 1600, 1],              // 17.4 SLAM: the big sign spans the frame
  [25.249, 1150, 1540],                                  // Friday room: Clawd + to-dos + calendar
  [27.658, 1040, 1700],                                  // the laptop: limit bar 50%, «ПОЛПУТИ»
  [30.36, 1100, 1600],                                   // the park window, calendar flips
  [32.95, 960, 1080],                                   // the Sunday page burns
  [35.614, 960, 1300],                                    // site + bot waved off, the tractor beam
  [39.157, 960, 1500],                                   // rocket to the moon
  [40.344, 960, 1700],                                   // arcade «0 ИГРОКОВ»
  [43.011, 900, 1500],                                   // «МОЙ САЙТ» «0 ПОСЕТИТЕЛЕЙ» → the hot rack
  [45.696, 960, 1080],                                   // the burning hall
  [48.1, 1000, 1450],                                  // БИРЖА chart, eyes, «ЖГИ!»
  [50.507, 960, 1300],                                   // chorus: the shredder, «ЖГИ ТОКЕНЫ»
  [52.871, 1020, 1800],                                  // the limit bar burns down
  [55.574, 960, 1300],                                    // shredder again
  [57.962, 960, 1080],                                   // odometer 1 000 000
  [60.312, 960, 1920],                                   // «БОЛЬШЕ АГЕНТОВ», the hiring grid
  [65.09, 960, 1920],                                   // CEO slide: «ЗАЧЕМ?» / «НЕВАЖНО» / «ПОЛЕЗНО»
  [71.765, 1000, 1200],                                  // the stamp afterimage
  [72.074, 980, 1800],                                  // new KPI board
  [75.248, 940, 1500],                                   // the chairs
  [77.797, 1000, 1540],                                   // the extinguisher reprimand
  [79.85, 960, 1540],                                   // the golden idol
  [82.536, 960, 1920],                                   // org chart
  [84.748, 960, 1700],                                   // the report gathers dust
  [89.865, 1000, 1600],                                  // its price 40 000 000
  [92.709, 900, 1500], [93.765, 760, 1500, 1], [94.765, 760, 1500], [95.413, 960, 1500, 1], [96.119, 1170, 1500, 1],   // print → bind → award → shred, following the hits
  [97.46, 900, 1400],                                   // night chimneys, smoke letters
  [99.736, 900, 1200],                                   // the limit gauge on chimney 3
  [102.508, 960, 1400],                                  // chimneys
  [104.946, 960, 1300],                                   // public counter
  [107.254, 920, 1400],                                  // agents march out, «БОЛЬШЕ АГЕНТОВ / ЖЕЛЕЗА»
  [112.06, 920, 1400],                                  // GPU drone, «НЕВАЖНО» stamps
  [115.516, 930, 1750],                                  // «ЭТО ПОЛЕЗНО!» billboard
  [118.075, 1080, 1200],                                  // the gauge hits 0%
  [118.701, 960, 1080],                                  // blackout, one spotlight
  [121.878, 960, 1500],                                   // the cathedral
  [126.02, 960, 1920],                                  // «больше меди / больше воды»
  [128.737, 930, 1080],                                  // «Зачем?»
  [129.996, 960, 1920],                                  // the madman, the price tag, the bill
  [132.478, 960, 1920], [135.44, 1000, 1700, 1], [136.395, 760, 1200, 1],   // push-in, shades on
  [136.539, 960, 1500],                                  // «БОЛЬШЕ GPU!»
  [139.83, 700, 1150], [142.3, 1320, 1150, 1],          // GPU rush: pan with the crowd-surfing CEO (left → right)
  [142.35, 960, 1500],                                  // the PCIe slot, «ВЖЖЖЖ»
  [144.83, 700, 1150], [147.839, 1240, 1150, 1],         // GPU rush 2, same pan (the «ЕЩЁ GPU!» slams at 960 stay in frame)
  [147.872, 960, 1500],                                  // the factory plugs in
  [148.915, 960, 1080],                                  // samsara wheel: VERT camera (a07 CAMKV) whips to each pod centred, square window
  [158.022, 960, 1250],                                  //   the pull-back whip to the whole wheel
  [160.098, 900, 1400],                                   // «ЭКОНОМИКА РАБОТАЕТ!»
  [162.601, 960, 1700],                                  // AGI spring calendar / loading 99.999% (a08 VERT pulls the cast in)
  [167.82, 960, 1300],                                  // the robot arm
  [170.28, 960, 1920],                                  // programmers «ВОТ-ВОТ»
  [172.667, 960, 1300],                                 // hug the phone
  [175.552, 960, 1080],                                  // calorie tracker
  [177.894, 960, 1500],                                  // 100 000 GPU
  [180.637, 980, 1080],                                   // the bun, the mayo
  [186.94, 900, 1400],                                   // final chorus: the presses
  [189.219, 1000, 1700],                                 // the firebox, ×2
  [191.353, 920, 1500],                                  // the shredder «ПОТОМ»
  [194.332, 880, 1080],                                   // AGI billboard
  [196.246, 880, 1080], [196.981, 1150, 1300, 1],           // whip to CAPEX neon
  [197.34, 980, 1400],                                  // benchmark +1%
  [198.947, 960, 1920],                                  // 300 000 000 000
  [199.406, 960, 1600],                                  // puppets
  [202.456, 1000, 1080],                                  // the big hand / TV off
  [203.565, 1100, 1500],                                 // ВС 23:58
  [211.828, 1040, 1200],                                  // 0 токенов
  [213.252, 1100, 1600],                                 // 3 games / 7 sites
  [216.18, 920, 1080],                                  // 42 agents
  [218.643, 1100, 1500],                                  // the desk, the clock
  [222.583, 1100, 1500], [223.309, 960, 1080, 1],           // to the window
  [226.412, 1000, 1300],                                 // «лимит восстановлен»
  [228.53, 960, 1500],                                   // close-up, eyes shut through the roll + «Сука»; the snap on the 231.375 slam keeps this window
  [232.03, 1000, 1080],                                  // blast
  [233.36, 960, 1080],                                   // laptop corridor
  [234.02, 920, 1500],                                   // mosh with the agents
  [235.356, 800, 1400],                                  // stage-dive
  [236.197, 960, 1080],                                  // «прыжок веры» / БУМ
  [237.999, 1060, 1560],                                 // planet limit → token, 0%
  [239.35, 860, 1200],                                  // smash «0%», fists up
  [240.018, 860, 1200], [240.201, 1000, 1600, 1],          // «ЖГИ!» flashes in on the right
  [240.641, 960, 1540],                                   // credit card
];
const VF = window.VFOCUS = [];
VSHOTS.forEach(([t, x, w, glide], i) => {
  const P = VF[VF.length - 1];
  if (i && !glide && t - P[0] > .02) VF.push([t - .01, P[1], P[2]]);
  VF.push([t, x, w]);
});
window.VTITLE_OFF = t => t >= 240.9;                                        // the end card has its own title
