// tokensEN/i18n.js: BURN THE TOKENS — every piece of Russian signage in the v1/v2/v3 chapters goes through ONE dictionary at text render.
// letter() / stamp() / punkText() are wrapped (limitBar, uiCard, slide, counter, sfx all end in letter()), so no chapter is edited.
// A translation keeps the Russian footprint: if the English is wider than the Russian × SLACK at the same size it is scaled down
// (plates, cards, buttons stay filled, nothing spills). Per-entry { fit: px } sets an explicit max width instead; '\n' stacks lines.
// Time-scoped entries (EN song time T) re-word one moment only, e.g. Wall Street's «ЖГИ!» is «IS THAT ALL YOU GOT?!».
// Anything Cyrillic that still reaches the screen is logged once into window.I18N_MISS (grep the render, see STORYBOARD_EN.md §4).
(() => {
  const DICT = {
    // --- kit / acid
    'AGI ▲ СКОРО': 'AGI ▲ SOON', 'ВАТТЫ ▲ +18%': 'WATTS ▲ +18%', 'НЕДЕЛЬНЫЙ ЛИМИТ': 'WEEKLY LIMIT', 'ТОКЕНЫ': 'TOKENS', 'АГЕНТЫ': 'AGENTS',
    'ЗАДАЧИ': 'TASKS', 'ЗАДАЧА': 'TASK',
    // --- a01 boot
    'ПРЕСС №1': 'PRESS #1', 'ЧИРК': 'SCRATCH', 'ФШШ!': 'FSSSH!', 'ПРЕСС 1': 'PRESS 1', 'ПРЕСС 2': 'PRESS 2', 'ПРЕСС 3': 'PRESS 3', 'ПРЕСС': 'PRESS',
    'ЖГИ ТОКЕНЫ': 'BURN THE TOKENS', 'ЗАВОД ТОКЕНОВ': 'TOKEN FACTORY',
    // --- a02 friday
    'ЧЕТВЕРГ': 'THURSDAY', 'ПЯТНИЦА': 'FRIDAY', 'СУББОТА': 'SATURDAY', 'ВОСКРЕСЕНЬЕ': 'SUNDAY', 'СЕНТЯБРЬ': 'SEPTEMBER', 'ДЕЛА:': 'TO DO:',
    'отчёт': 'report', 'созвон': 'call', 'почта': 'email', 'Использование': 'Usage', 'сброс: вс, 23:59': 'resets Sun 11:59 PM',
    'ПН': 'MON', 'ВТ': 'TUE', 'СР': 'WED', 'ЧТ': 'THU', 'ПТ': 'FRI', 'СБ': 'SAT', 'ВС': 'SUN', 'ПОЛПУТИ': 'HALFWAY',
    'лимит сгорает в 23:59': 'expires Sun 11:59 PM', 'ЛИМИТЫ ЖДУТ': 'TOKENS WAITING', 'НЕ НУЖЕН': 'NOT NEEDED', 'К ЛУНЕ': 'WHY NOT?',
    'МОЯ ИГРА': 'MY GAME', 'ТОКЕН-РАННЕР': 'TOKEN RUNNER', 'ВСТАВЬТЕ ТОКЕН': 'INSERT TOKEN', 'РЕКОРД: —': 'HIGH SCORE: —',
    'ИГРОКОВ': 'PLAYERS', '0 ИГРОКОВ': '0 PLAYERS', 'мой-сайт.рф': 'my-site.com', 'МОЙ САЙТ': 'MY SITE',
    'сделан за 4 000 000 токенов': 'made with 4,000,000 tokens', 'ПОСЕТИТЕЛЕЙ': 'VISITORS', '0 ПОСЕТИТЕЛЕЙ': '0 VISITORS',
    // --- a03 chorus 1
    'ПРЕСС РЫНКА': 'MARKET PRESS', 'БИРЖА': 'WALL STREET', 'ЖГИ!': 'BURN!', 'ШРЕДЕР ТОКЕНОВ': 'TOKEN SHREDDER', 'ПРОДУКЦИЯ': 'OUTPUT',
    'ЖГИ ТОКЕНЫ!': 'BURN THE TOKENS!', 'ПОЧТИ 0%': 'ALMOST 0%', 'СОЖЖЕНО ТОКЕНОВ': 'TOKENS BURNED', 'KPI ДОСТИГНУТ': 'KPI ACHIEVED',
    'ТРЕБУЕТСЯ': 'HIRING', 'АГЕНТ': 'AGENT', 'НАНЯТ!': 'HIRED!', 'СКЛАД ЖЕЛЕЗА': 'COMPUTE STOCKPILE', 'БОЛЬШЕ АГЕНТОВ!': 'MORE AGENTS!',
    'БОЛЬШЕ ЖЕЛЕЗА!': 'MORE COMPUTE!', 'СОЖЖЕНО ЗА НЕДЕЛЮ': 'BURNED THIS WEEK', 'ЗАЧЕМ?!': 'WHY?!', 'ЗАЧЕМ?': 'WHY?',
    'НЕВАЖНО.': "DON'T ASK.", 'неважно.': "don't ask.", 'ПОЛЕЗНО': 'GOOD FOR YOU',
    // --- a04 kpi
    'КАК СОКРАТИТЬ РАСХОДЫ НА AI': 'HOW TO CUT OUR AI SPEND', 'АГЕНТ #42': 'AGENT #42', '9 МЛРД': '$9B', 'МАРИНА': 'MARINA',
    '5,8 МЛРД': '$5.8B', 'ПЕТЯ': 'PETE', '3,8 МЛРД': '$3.8B', 'СТАЖЁР': 'INTERN', '2 МЛРД': '$2B', 'НОВЫЙ KPI': 'NEW KPI',
    'СКОЛЬКО ТЫ СПАЛИЛ ЗА НЕДЕЛЮ': 'TOKENS YOU BURNED THIS WEEK', '5. CLAWD: 12 токенов': '5. CLAWD: 12 tokens', 'ХРУМ': 'CRUNCH',
    'БОНУС = ВЫСОТА КРЕСЛА': 'BONUS = CHAIR HEIGHT', 'ЗА ЭКОНОМИЮ': 'FOR SAVING', 'ВЫГОВОР': 'REPRIMAND', '+3 ₮ СЭКОНОМЛЕНО': '+3 ₮ SAVED',
    'ПЛОХО ПОМОГ': "DIDN'T EVEN TRY", 'ЧЕМПИОН ПО ТОКЕНАМ': 'TOP BURNER', 'АМИНЬ': 'AMEN', 'ОРГСТРУКТУРА': 'ORG CHART',
    'отдел AI-трансформации': 'AI Transformation Dept.', 'AGENT #1 · нанят: пн 09:00': 'AGENT #1 · hired Mon 9:00 AM',
    'AGENT #2 · нанят: пн 09:01': 'AGENT #2 · hired Mon 9:01 AM', 'ШТАТ:': 'HEADCOUNT:', 'КАК СОКРАТИТЬ': 'HOW TO CUT', 'РАСХОДЫ НА AI': 'OUR AI SPEND',
    'доклад · 100 агентов · 3 400 стр.': 'report · 100 agents · 3,400 pages', 'БУМ!': 'THUD!', 'ПРОЧТЕНИЙ: 0': 'READS: 0',
    'ЦЕНА ДОКЛАДА «КАК СОКРАТИТЬ РАСХОДЫ»': 'COST OF “HOW TO CUT OUR AI SPEND”', 'СПИСАНО': 'WRITTEN OFF',
    'ПЕЧАТЬ': 'PRINT', 'ПЕРЕПЛЁТ': 'BIND', 'НАГРАДА': 'AWARD', 'ШРЕДЕР': 'SHRED', 'ПЕЧАТЬ!': 'PRINT!', 'ПЕРЕПЛЁТ!': 'BIND!', 'НАГРАДА!': 'AWARD!',
    'В ШРЕДЕР!': 'SHRED IT!',
    // --- a05 chorus 2
    'ЭТО': 'QC:', 'ПОЛЕЗНО!': 'GOOD FOR YOU!', '5,0 · 12 480 отзывов': '5.0 · 12,480 reviews', '#1 в рейтинге полезности': '#1 in Health & Fitness',
    'ОБРАЗЕЦ': 'SAMPLE', 'ЖГИ': 'BURN', 'ЛИМИТ': 'LIMIT', 'ПУБЛИЧНЫЙ СЧЁТЧИК · СОЖЖЕНО ТОКЕНОВ': 'PUBLIC COUNTER · TOKENS BURNED',
    'ЕЩЁ ОДИН МИЛЛИОН!': 'ONE MORE MILLION!', 'ОДИН…': 'ONE…', 'ЕЩЁ…': 'MORE…', 'ЖЕЛЕЗО': 'COMPUTE', 'НЕВАЖНО': "DON'T ASK", 'ЩЁЛК': 'CLICK', 'щёлк': 'click',
    // --- a06 sermon
    'ВЖЖЖ': 'VRRRM', 'г. СОСЕДНИЙ · ВОДОХРАНИЛИЩЕ': 'NEXT TOWN · RESERVOIR', 'БОЛЬШЕ МЕДИ.': 'MORE COPPER.', 'БОЛЬШЕ ВОДЫ.': 'MORE WATER.',
    'ВЫПИТО': 'DRUNK', 'А-АХ': 'AAAH', 'СЧЁТ': 'BILL', 'ИТОГО:': 'TOTAL:', '$300 МЛРД': '$500B', 'ЧТОБЫ ИНТЕЛЛЕКТ': 'SO INTELLIGENCE', 'СТАЛ ДЕШЕВЛЕ!': 'GETS CHEAPER!',
    // --- a07 acid
    'БОЛЬШЕ': 'MORE', 'ОТДЕЛ ЗАКУПОК GPU': 'GPU PROCUREMENT', 'ЕЩЁ GPU!': 'MORE GPUs!', 'КУПЛЕНО GPU:': 'GPUS BOUGHT:', 'КЛАЦ!': 'CLACK!',
    'В': 'V', 'Ж': 'Z', 'ПШШШ…': 'PSSSH…', 'БОЛЬШЕ GPU!': 'MORE G-P-Us!', 'БОЛЬШЕ ТОКЕНОВ!': 'MORE TOKENS!', 'БОЛЬШЕ ЗАДАЧ!': 'MORE TASKS!',
    'МАХОВИК ЭКОНОМИКИ': 'THE ECONOMY LOOP', 'ИНДЕКС ТОКЕНОВ': 'TOKEN INDEX', 'ЭКОНОМИКА': 'THE ECONOMY', 'РАБОТАЕТ!': 'IS WORKING!',
    // --- a08 rap
    'ВЕСНА': 'SPRING', 'AGI ГОТОВ!': 'AGI READY!', 'AGI — К ВЕСНЕ!': 'AGI BY SPRING!', 'обещано:': 'promised:', 'ОПЯТЬ': 'AGAIN',
    'AGI: ЗАГРУЗКА…': 'AGI: LOADING…', 'ОСТАЛОСЬ ЧУТЬ-ЧУТЬ': 'ALMOST HERE', '…подождите': '…please wait', 'AGI УЖЕ ПИШЕТ:': 'AGI ALREADY WRITES:',
    'КОД': 'CODE', 'ЗАМЕНА ПРОГРАММИСТОВ:': 'REPLACING DEVS:', 'ВОТ-ВОТ': 'ANY DAY NOW', 'ШЛЁП': 'SLAP', 'ПАРОВОЗИКИ': 'TOY TRAINS',
    'Царское Село · 1837': 'Tsarskoye Selo · 1837', '2–5 игроков · 8+': '2–5 players · 8+', 'Царское Село': 'Tsarskoye Selo', 'Москва': 'Moscow',
    'Казань': 'Kazan', 'Финский залив': 'Gulf of Finland', 'Волга': 'Volga', 'БИЛЕТ': 'TICKET', 'Ц. Село → Казань': 'Ts. Selo → Kazan', '22 очка': '22 pts',
    'ВЕСЬ МИРОВОЙ ПРОГРЕСС': 'THE WHOLE AI CRAZE', '→ ради этого': '→ for this', 'КАЗАНЬ': 'KAZAN', 'МОСТ —': 'BRIDGE —', 'в следующем': 'in the next',
    'релизе': 'release', 'ВЕНТИЛЯТОРЫ GPU': 'GPU FANS', 'ВЖУХ!': 'WHOOSH!', 'ой.': 'oops.', 'ту-ту…': 'choo-choo…',
    // --- a09 capex
    'ПРЕСС №1 · ПОЛНАЯ МОЩНОСТЬ': 'PRESS #1 · FULL POWER', 'ТОПКА': 'FIREBOX', 'СКОРОСТЬ СЖИГАНИЯ': 'BURN RATE', 'ДОХОДЫ': 'REVENUE',
    'ПРИБЫЛЬ': 'PROFIT', 'ПОТОМ': 'LATER', 'ШРЕДДЕР': 'SHREDDER', 'утилизация лишнего': 'surplus disposal', 'СКОРО…': 'SOON…', 'СЕЙЧАС!': 'NOW!',
    'БЕНЧМАРК': 'BENCHMARK', 'было': 'before', 'стало': 'after', '(ось от 87)': '(axis starts at 87)', 'ТОКЕНОВ СОЖЖЕНО ЗА НЕДЕЛЮ': 'TOKENS BURNED THIS WEEK',
    'АКЦИОНЕРЫ': 'SHAREHOLDERS', 'к бенчмарку': 'on the benchmark', 'ради этого': 'for this',
    // --- a10 sunday
    '0 визитов': '0 visits', 'ВС 23:58': 'SUN 11:58 PM', 'Лимит исчерпан · сброс в ПН 00:00': 'Limit reached · resets Mon 12:00 AM', '0 токенов': '0 tokens',
    '3 ИГРЫ': '3 GAMES', '7 САЙТОВ': '7 WEBSITES', '42 АГЕНТА': '42 AGENTS', 'ПН 00:00': 'MON 12:00 AM', 'ВС 23:59': 'SUN 11:59 PM',
    'Ваш недельный лимит восстановлен': 'Your weekly limit has been reset.', 'Приятной недели! · 1 000 000 токенов': 'Have a great week! · 1,000,000 tokens',
    'ВАШ НЕДЕЛЬНЫЙ ЛИМИТ ВОССТАНОВЛЕН': 'YOUR WEEKLY LIMIT HAS BEEN RESET',
    // --- b07 / b08 / b10
    'ТОКЕНОВ': 'TOKENS', 'АГЕНТОВ': 'AGENTS', 'ЗАДАЧ': 'TASKS', 'КОЛЕСО САНСАРЫ': 'THE ECONOMY LOOP', 'ТРЕКЕР': 'TRACKER', 'КАЛОРИЙ': 'CALORIES',
    'ТРЕКЕР КАЛОРИЙ': 'CALORIE TRACKER', 'из 2000 ккал': 'of 2,000 kcal', 'Завтрак': 'Breakfast', 'Обед': 'Lunch', 'Ужин': 'Dinner', 'пусто': 'empty',
    'подключаем 100 000 GPU': 'connecting 100,000 GPUs', 'ТЫК!': 'TAP!', 'АНАЛИЗ ФОТО': 'ANALYZING PHOTO', 'ФОТО': 'PHOTO', 'ВИДЕО': 'VIDEO',
    'ПОРТРЕТ': 'PORTRAIT', 'AI · трекер калорий': 'AI · calorie tracker', 'БУЛКА С МАЙОНЕЗОМ': 'MAYONNAISE 99.7%', '9999 ккал': '9,999 kcal',
    'ЭЙ!': 'HEY!', 'ЦОД': 'DATA CENTER', 'БУМ': 'THUD', 'НЕДЕЛЬНЫЙ ЛИМИТ · ПЛАНЕТА ЗЕМЛЯ': 'WEEKLY LIMIT · PLANET EARTH',
  };
  // strings the chapters glue together ('ещё ' + n, 'КРУГ ' + n, 'ДИССЕРТАЦИИ: ' + n, n + ' км/ч', …)
  const PREFIX = [['ещё ', '+1 MORE '], ['КРУГ ', 'LAP '], ['весна ', 'spring '], ['релиз ', 'release '], ['ДИССЕРТАЦИИ: ', 'THESES: ']];
  const SUFFIX = [[' км/ч', ' km/h'], [' ккал', ' kcal'], [' токенов', ' tokens']];
  // one moment re-worded: [ru, en, from, to (EN song time), { fit }]
  const AT = [
    ['ЖГИ!', 'IS THAT ALL\nYOU GOT?!', 43.5, 45.5, { fit: 1250 }],       // E06: Wall Street's shout (a03 talk)
  ];
  const FIT = { 'BURN THE TOKENS!': 1000, 'BURN THE TOKENS': 860 };                            // explicit max widths (world px) for the 4:5 window
  const SLACK = 1.25;
  const CYR = /[А-Яа-яЁё]/;
  window.I18N_MISS = new Set();

  function tr(s) {
    if (typeof s !== 'string' || !CYR.test(s)) return typeof s === 'string' ? commas(s) : s;
    const at = AT.find(a => a[0] === s && T >= a[2] && T < a[3]);
    if (at) return at[1];
    let en = DICT[s];
    if (en == null) { const p = PREFIX.find(([k]) => s.startsWith(k)); if (p) en = p[1] + s.slice(p[0].length); }
    if (en == null) { const q = SUFFIX.find(([k]) => s.endsWith(k)); if (q) en = s.slice(0, -q[0].length) + q[1]; }
    if (en == null || CYR.test(en)) { if (s.length > 1) I18N_MISS.add(s); return s; }
    return commas(en);
  }
  const commas = s => s.replace(/(\d) (?=\d{3}(?!\d))/g, '$1,');     // fmtNum's '1 000 000' → '1,000,000'
  const fitOf = s => { const a = AT.find(a => a[1] === s); return (a && a[4] && a[4].fit) || FIT[s]; };
  const DEF_FONT = size => `${size}px "Permanent Marker", "Comic Sans MS", cursive`;
  // the factor that keeps `en` inside the Russian footprint (or its explicit fit width)
  function shrink(ru, en, size, font) {
    if (ru === en) return 1;
    const f = font || DEF_FONT(size), wide = s => Math.max(...s.split('\n').map(l => textW(l, f)));
    const cap = fitOf(en) || wide(ru) * SLACK, w = wide(en);
    return w > cap ? cap / w : 1;
  }
  const scaleFont = (font, k) => font && font.replace(/(\d+(\.\d+)?)px/, (m, v) => (v * k) + 'px');

  // NO BIG TEXT (user rule for BURN THE TOKENS): outside the title windows, lettering ≥ BIG world px, every stamp, ransom caption and
  // counter is dropped (the jokes are pictures, the lyric is in the subtitle band); Cyrillic that survived translation is dropped everywhere.
  const TITLE_OK = [[0, 18.16], [241.6, 1e9]], BIG = 64;
  const titleOk = () => TITLE_OK.some(([a, b]) => T >= a && T < b);
  const quiet = (en, size) => CYR.test(en) || (!titleOk() && size >= BIG && !/^\d{1,2}$/.test(en.trim()));   // 1–2 digits: calendar dates stay
  const _counter = counter;
  counter = (...a) => { if (titleOk()) _counter(...a); };
  const _letter = letter;
  letter = (txt, x, y, size, color, o = {}) => {
    const en = tr(txt);
    if (typeof en === 'string' && quiet(en, size)) return;
    if (en === txt) return _letter(txt, x, y, size, color, o);
    const k = shrink(txt, en, size, o.font), lines = en.split('\n'), sz = size * k, lh = sz * 1.08;
    const oo = k < 1 ? { ...o, font: scaleFont(o.font, k) } : o;
    lines.forEach((l, i) => _letter(l, x, y + (i - (lines.length - 1) / 2) * lh, sz, color, oo));
  };
  const _stamp = stamp;
  stamp = (txt, x, y, size, t, t0, o = {}) => { const en = tr(txt); if (!titleOk()) return; _stamp(en, x, y, size * shrink(txt, en, size, ruFont(size)), t, t0, o); };
  const _punk = punkText;
  punkText = (txt, x, y, size, t, t0, o = {}) => {
    const en = tr(txt); if (!titleOk()) return; if (en === txt) return _punk(txt, x, y, size, t, t0, o);
    // punkText sets one letter per box (≈ glyph + 0.2 size, spaces 0.4 size): compare those widths, not the plain string
    const boxes = s => [...s].reduce((a, c) => a + (c === ' ' ? size * .4 : textW(c, ruFont(size)) + size * .2), 0);
    const cap = fitOf(en) || boxes(txt) * SLACK, k = Math.min(1, cap / boxes(en));
    _punk(en, x, y, size * k, t, t0, o);
  };
  window.EN_TR = tr;
})();
