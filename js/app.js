/* Rodseo M — daily-life English. Plain JavaScript, no build step. */
(() => {
'use strict';
const CFG = window.RODSEO_CONFIG || {};
const BOOKS = window.BOOKS || [];
const TOPICS = window.TOPICS || ['Daily life'];
const TOTAL = CFG.TOTAL_DAYS || 120;
const PASS = CFG.PASS_SCORE || 7;
const DEV = CFG.DEVELOPER || 'Yosef Habtamu';
const KEY = 'rodseo_m_v1';

/* ───────── helpers ───────── */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const ymd = d => d.toLocaleDateString('en-CA');
const today = () => ymd(new Date());
const addDays = (d, n) => { const x = new Date(d + 'T12:00:00'); x.setDate(x.getDate() + n); return ymd(x); };
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const words = t => (t.trim().match(/[A-Za-z']+/g) || []);
const sentences = t => t.split(/[.!?]+(?:\s|$)/).filter(x => x.trim().split(/\s+/).length >= 3);
const ic = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3 11l9-8 9 8v10h-6v-6H9v6H3z"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 4h7a3 3 0 013 3v13a2 2 0 00-2-2H4zM20 4h-6M20 4v14h-6"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 20V10M12 20V4M19 20v-7"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l13 8-13 8z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>',
  stop: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 5h14v14H5z"/></svg>',
  spk: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11"/></svg>',
  bell: '<svg class="bell" viewBox="0 0 24 24" fill="#F7B500"><path d="M12 22a2.5 2.5 0 002.4-2h-4.8A2.5 2.5 0 0012 22zm7-6V11a7 7 0 00-5-6.7V3a2 2 0 10-4 0v1.3A7 7 0 005 11v5l-2 2v1h18v-1z"/></svg>',
  flame: c => `<svg class="flame ${c || ''}" viewBox="0 0 24 24"><path d="M12 2c1 4 6 6 6 12a6 6 0 01-12 0c0-3 2-4 3-6 1 2 2 2 2 2 0-3 0-5 1-8z" fill="#F7B500"/><path d="M12 12c1 2 3 3 3 5a3 3 0 01-6 0c0-2 2-3 3-5z" fill="#EC5560"/></svg>`
};
function toast(m, ms = 2600) { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), ms); }

/* ───────── state (saved only in this browser) ───────── */
const defaults = () => ({
  user: { name: '', accepted: false, reminder: '19:00' },
  settings: { apiKey: '', model: '', speed: 0.9, alarm: true, fs: 22 },
  progress: { day: 1, lastCompleted: null, streak: 0, best: 0, completed: [] },
  session: null, attempts: [], writings: [], words: [], books: {}, talk: [], fired: null
});
let S = load();
function load() { try { const r = JSON.parse(localStorage.getItem(KEY)); if (r) { const d = defaults(); for (const k in d) if (r[k] !== undefined) d[k] = (typeof d[k] === 'object' && !Array.isArray(d[k]) && d[k]) ? Object.assign(d[k], r[k]) : r[k]; return d; } } catch (e) {} return defaults(); }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast('Could not save. Browser storage may be full.'); } }
const doneToday = () => S.progress.lastCompleted === today();
const streakNow = () => { const l = S.progress.lastCompleted; return (l === today() || l === addDays(today(), -1)) ? S.progress.streak : 0; };
const levelFor = n => n <= 20 ? { name: 'Starter', t: 1, w: '250-320', d: 'very simple present-tense sentences, only the most common everyday words' }
  : n <= 60 ? { name: 'Easy', t: 1, w: '350-450', d: 'simple sentences, present and past tense, common everyday words' }
  : n <= 90 ? { name: 'Hard', t: 2, w: '450-600', d: 'longer sentences, past, future and conditional tenses, phrasal verbs, more advanced vocabulary' }
  : { name: 'Harder', t: 3, w: '550-700', d: 'natural, fluent English with idioms, linking words, opinions and detailed descriptions' };
const monthOf = n => Math.ceil(n / 30);

/* ───────── Gemini ───────── */
const apiKey = () => (S.settings.apiKey || CFG.GEMINI_API_KEY || '').trim();
async function gemini({ system, contents, json = false, temperature = 0.7 }) {
  const key = apiKey(); if (!key) throw new Error('NO_KEY');
  const model = S.settings.model || CFG.GEMINI_MODEL || 'gemini-2.5-flash';
  const body = { contents, generationConfig: { temperature } };
  if (system) body.systemInstruction = { parts: [{ text: system }] };
  if (json) body.generationConfig.responseMimeType = 'application/json';
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key }, body: JSON.stringify(body)
  });
  if (!r.ok) { let m = ''; try { m = (await r.json()).error.message; } catch (e) {} throw new Error(`Gemini error ${r.status}${m ? ': ' + m : ''}`); }
  const d = await r.json();
  const t = (d.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('');
  if (!t) throw new Error('Gemini sent an empty answer. Try again.');
  return t;
}
const parseJSON = t => JSON.parse(t.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim());

/* ───────── books ───────── */
const getBook = n => BOOKS[n - 1] || S.books[n] || null;
let genBusy = false, genErr = '';
const validBook = b => b && Array.isArray(b.story) && b.story.length >= 3 && Array.isArray(b.vocab) && b.vocab.length >= 4 && Array.isArray(b.questions) && b.questions.length >= 10 &&
  b.questions.every(q => q && q.q && Array.isArray(q.options) && q.options.length === 4 && Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4) &&
  b.vocab.every(v => v.word && v.meaning && v.example);
async function generateBook(n) {
  const L = levelFor(n), topic = TOPICS[(n - 1) % TOPICS.length];
  const prev = BOOKS.map(b => b.title).concat(Object.values(S.books).map(b => b.title)).slice(-30).join('; ');
  const prompt = `Write story number ${n} of ${TOTAL} for an English course for ADULTS over 30 who want to speak and write daily-life English.
Level: ${L.name} — ${L.d}. Story length: ${L.w} words, 5 to 8 paragraphs. Topic: ${topic}.
The story must be an interesting, realistic scene from daily life with named adult characters (not childish), with dialogue so the learner sees how people really speak. Do not repeat these earlier titles: ${prev || 'none'}.
Also write 8 useful vocabulary words that appear in the story. Explain each meaning in simple ENGLISH (no translation) and give one natural example sentence.
Also write exactly 10 multiple-choice questions about the story, in story order, each with 4 options and exactly one correct option. Questions must be answerable only from the story. Vary the position of the correct option.
Return ONLY JSON: {"title":string,"story":[paragraph strings],"vocab":[{"word":string,"meaning":string,"example":string}],"questions":[{"q":string,"options":[4 strings],"answer":0-3}]}`;
  for (let t = 0; t < 2; t++) {
    const txt = await gemini({ contents: [{ role: 'user', parts: [{ text: prompt }] }], json: true, temperature: 0.9 });
    try { const b = parseJSON(txt); if (validBook(b)) return { id: n, title: b.title, topic, level: L.name, story: b.story, vocab: b.vocab.slice(0, 8), questions: b.questions.slice(0, 10).map(q => ({ q: q.q, o: q.options, a: q.answer })) }; } catch (e) {}
  }
  throw new Error('The AI did not return a usable story. Please try again.');
}
async function ensureBook(n) {
  if (getBook(n) || genBusy || !apiKey()) return;
  genBusy = true; genErr = ''; render();
  try { S.books[n] = await generateBook(n); save(); } catch (e) { genErr = e.message; }
  genBusy = false; render();
}

/* ───────── speech (listening) ───────── */
let queueId = 0;
function stopSpeech() { queueId++; try { speechSynthesis.cancel(); } catch (e) {} document.querySelectorAll('.paper p.now').forEach(p => p.classList.remove('now')); listening = false; const b = $('[data-a=listen]'); if (b) { b.classList.remove('on'); b.innerHTML = ic.play + '<span>Listen</span>'; } }
function speakChunks(chunks, rate, onEach) {
  if (!('speechSynthesis' in window)) { toast('Your browser cannot read aloud.'); return; }
  stopSpeech(); const id = queueId; let i = 0;
  const voices = speechSynthesis.getVoices();
  const voice = voices.find(v => /^en[-_](US|GB)/i.test(v.lang)) || voices.find(v => /^en/i.test(v.lang));
  const next = () => {
    if (id !== queueId || i >= chunks.length) { if (id === queueId) stopSpeech(); return; }
    const u = new SpeechSynthesisUtterance(chunks[i]); u.lang = 'en-US'; u.rate = rate; if (voice) u.voice = voice;
    const k = i++; u.onstart = () => onEach && onEach(k); u.onend = next; u.onerror = next;
    speechSynthesis.speak(u);
  };
  next();
}
const say = (t, rate) => speakChunks([t], rate || S.settings.speed);

/* ───────── reminder, alarm, calendar ───────── */
let actx = null, alarmInt = null, shoutInt = null;
function beep() {
  try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume();
    [0, .22].forEach(d => { const o = actx.createOscillator(), g = actx.createGain(); o.type = 'square'; o.frequency.value = d ? 988 : 784; o.connect(g); g.connect(actx.destination);
      const t = actx.currentTime + d; g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.25, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + .2); o.start(t); o.stop(t + .22); }); } catch (e) {}
}
function startAlarm() {
  stopAlarm(); beep(); alarmInt = setInterval(beep, 1400);
  const shout = () => { try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(`${S.user.name ? S.user.name + ', ' : ''}it is time to learn English! Come on, let's study!`); u.lang = 'en-US'; u.rate = 1; u.pitch = 1.15; u.volume = 1; speechSynthesis.speak(u); } catch (e) {} };
  shout(); shoutInt = setInterval(shout, 9000);
}
function stopAlarm() { clearInterval(alarmInt); clearInterval(shoutInt); alarmInt = shoutInt = null; try { speechSynthesis.cancel(); } catch (e) {} }
function showAlarm() {
  startAlarm();
  $('#overlay').innerHTML = `<div class="modal center" role="alertdialog" aria-label="Lesson reminder">${ic.bell}<h2>Time for your English lesson${S.user.name ? ', ' + esc(S.user.name) : ''}!</h2><p class="muted">Day ${S.progress.day} is waiting for you.</p>
  <div class="row" style="justify-content:center"><button class="btn btn-gold" data-a="alarmStart">Start now</button><button class="btn btn-ghost" data-a="alarmSnooze">Snooze 5 min</button><button class="btn btn-ghost" data-a="alarmStop">Stop</button></div></div>`;
}
function notify(body) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const o = { body, icon: 'assets/icon-192.png', badge: 'assets/icon-192.png', tag: 'rodseo', requireInteraction: true };
  navigator.serviceWorker?.ready.then(r => r.showNotification('Rodseo M', o)).catch(() => { try { new Notification('Rodseo M', o); } catch (e) {} });
}
function fireReminder() { S.fired = today(); save(); notify('Time for your English lesson!'); showAlarm(); }
let snoozeAt = 0;
function tickReminder() {
  if (!S.user.accepted || !S.settings.alarm || doneToday() || $('#overlay').innerHTML) return;
  const now = new Date(), hm = now.toTimeString().slice(0, 5);
  if (snoozeAt && Date.now() >= snoozeAt) { snoozeAt = 0; fireReminder(); return; }
  if (hm === S.user.reminder && S.fired !== today()) fireReminder();
}
async function askNotify() {
  if (!('Notification' in window)) { toast('This browser does not support notifications.'); return false; }
  if (Notification.permission === 'granted') return true;
  const p = await Notification.requestPermission(); return p === 'granted';
}
function downloadICS() {
  const [h, m] = S.user.reminder.split(':').map(Number), s = new Date(); s.setHours(h, m, 0, 0); const e = new Date(s.getTime() + 15 * 6e4);
  const f = d => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}00`;
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Rodseo M//EN', 'BEGIN:VEVENT', 'UID:rodseo-m-daily@rodseo-m', `DTSTAMP:${f(new Date())}`, `DTSTART:${f(s)}`, `DTEND:${f(e)}`, `RRULE:FREQ=DAILY;COUNT=${TOTAL}`,
    'SUMMARY:Rodseo M - English lesson', 'DESCRIPTION:Time to learn English! Open Rodseo M.', 'BEGIN:VALARM', 'TRIGGER:PT0M', 'ACTION:DISPLAY', 'DESCRIPTION:Rodseo M - English lesson', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })); a.download = 'rodseo-m-reminder.ics'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

/* ───────── confetti ───────── */
function confetti() {
  const c = $('#confetti'), x = c.getContext('2d'); c.width = innerWidth; c.height = innerHeight;
  const cols = ['#F7B500', '#22B085', '#EC5560', '#EEF3F9', '#6EA8FF'];
  const ps = Array.from({ length: 150 }, () => ({ x: Math.random() * c.width, y: -20 - Math.random() * c.height * .5, w: 6 + Math.random() * 8, h: 10 + Math.random() * 10, vx: -2 + Math.random() * 4, vy: 3 + Math.random() * 5, r: Math.random() * 6, vr: -.2 + Math.random() * .4, c: cols[Math.random() * cols.length | 0] }));
  const t0 = performance.now();
  (function f(t) { x.clearRect(0, 0, c.width, c.height); ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.r += p.vr; x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; x.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); x.restore(); });
    if (t - t0 < 3200) requestAnimationFrame(f); else x.clearRect(0, 0, c.width, c.height); })(t0);
}

/* ───────── router / shell ───────── */
let route = 'home', wDraft = '', busy = false, listening = false;
const tod = () => { const h = new Date().getHours(); return h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening'; };
const go = r => { stopSpeech(); route = r; render(); window.scrollTo(0, 0); };
function render(quiet) {
  const v = $('#view');
  renderTop(); renderNav();
  const views = { home: viewHome, lesson: viewLesson, progress: viewProgress, talk: viewTalk, settings: viewSettings };
  v.innerHTML = S.user.accepted ? (views[route] || viewHome)() : viewWelcome();
  v.classList.remove('enter'); if (!quiet) { void v.offsetWidth; v.classList.add('enter'); }
  const lg = $('.log'); if (lg) lg.scrollTop = lg.scrollHeight;
  meter();
}
function renderTop() {
  $('#top').innerHTML = `<div class="brand"><img src="assets/logo-white.png" alt="">Rodseo M</div>` +
    (S.user.accepted ? `<div class="chip gold" title="Your streak">${ic.flame(streakNow() ? '' : 'off')}<b>${streakNow()}</b> day${streakNow() === 1 ? '' : 's'}</div>` : '');
}
function renderNav() {
  const n = $('#nav'); if (!S.user.accepted) { n.innerHTML = ''; n.style.display = 'none'; return; } n.style.display = 'flex';
  const items = [['home', 'Home', ic.home], ['lesson', 'Lesson', ic.book], ['progress', 'Progress', ic.chart], ['talk', 'Coach', ic.chat], ['settings', 'Settings', ic.gear]];
  n.innerHTML = items.map(([k, l, i]) => `<button data-a="go" data-r="${k}" ${route === k ? 'aria-current="page"' : ''}>${i}<span>${l}</span></button>`).join('');
}
function modal(html) { $('#overlay').innerHTML = `<div class="modal" role="dialog">${html}</div>`; }
function closeModal() { $('#overlay').innerHTML = ''; }

/* ───────── welcome ───────── */
function viewWelcome() {
  return `<div class="welcome"><img src="assets/logo-white.png" alt="Rodseo M logo"><h1>Welcome to Rodseo M</h1>
  <p class="muted" style="margin:10px 0 20px">One story every day. Real English for real life. Made for adults who are 30 and older.</p>
  <div class="card"><label for="wn">Your first name</label><input type="text" id="wn" autocomplete="given-name" maxlength="30">
  <label for="wr">Daily lesson reminder</label><input type="time" id="wr" value="19:00">
  <label class="check"><input type="checkbox" id="wa"><span>I am 30 years old or older.</span></label>
  <label class="check"><input type="checkbox" id="wt"><span>I accept the <a href="#" data-a="terms">Terms of Service</a>.</span></label>
  <button class="btn btn-gold wide pulse" data-a="start">Start learning</button></div></div>`;
}

/* ───────── home ───────── */
function viewHome() {
  const p = S.progress, done = p.completed.length, pct = Math.min(1, done / TOTAL), C = 402;
  const book = getBook(p.day), L = levelFor(Math.min(p.day, TOTAL));
  const hm = new Date().toTimeString().slice(0, 5);
  const waiting = !doneToday() && p.day <= TOTAL && hm >= S.user.reminder;
  const needKey = !apiKey() && p.day > BOOKS.length && p.day <= TOTAL;
  const att = S.attempts.filter(a => a.kind === 'story'), avg = att.length ? Math.round(att.reduce((s, a) => s + a.score / a.total, 0) / att.length * 100) + '%' : '–';
  const week = Array.from({ length: 7 }, (_, i) => { const d = addDays(today(), i - 6), dt = new Date(d + 'T12:00:00'); return { d, l: dt.toLocaleDateString('en', { weekday: 'short' }).slice(0, 2), on: p.completed.some(c => c.date === d) }; });
  const cta = p.day > TOTAL ? '' : doneToday() ? `<button class="btn btn-ink" data-a="go" data-r="lesson">Day ${p.day - 1} complete — see you tomorrow</button>` : `<button class="btn btn-ink pulse" data-a="go" data-r="lesson">${S.session && S.session.day === p.day && S.session.step !== 'review' ? 'Continue lesson' : 'Start today\'s lesson'}</button>`;
  return `<h1 style="margin:6px 0 16px">Good ${tod()}${S.user.name ? ', ' + esc(S.user.name) : ''}.</h1>
  ${waiting ? `<div class="banner"><span>Your English lesson is still waiting for you today.</span><button class="btn btn-gold btn-sm" data-a="go" data-r="lesson">Go to lesson</button></div>` : ''}
  ${needKey ? `<div class="banner"><span>Story ${p.day} is written by Gemini. Add your key to unlock the next books.</span><button class="btn btn-gold btn-sm" data-a="go" data-r="settings">Add key</button></div>` : ''}
  <div class="card gold hero"><div class="stack"><div class="row"><span class="chip" style="background:rgba(36,26,0,.14)">Month ${monthOf(Math.min(p.day, TOTAL))} · ${L.name}</span></div>
    <h1>${p.day > TOTAL ? 'Course complete' : 'Day ' + p.day}</h1>
    <p class="muted">${p.day > TOTAL ? 'You finished all ' + TOTAL + ' stories. Well done.' : book ? esc(book.title) + ' — ' + esc(book.topic) : 'Topic: ' + esc(TOPICS[(p.day - 1) % TOPICS.length])}</p>${cta}</div>
    <div class="ring" style="--c:${C};--o:${C * (1 - pct)}"><svg viewBox="0 0 150 150"><circle class="tr" cx="75" cy="75" r="64"/><circle class="pg" cx="75" cy="75" r="64"/></svg><div class="in"><b>${done}</b><span>of ${TOTAL} days</span></div></div></div>
  <div class="grid2"><div class="card"><div class="row between"><h2>Your streak</h2>${ic.flame(streakNow() ? '' : 'off')}</div>
    <div class="stat" style="margin-top:8px"><b>${streakNow()}</b><span>${streakNow() ? 'days in a row' : 'Finish today\'s lesson to start a streak'}</span></div>
    <div class="week">${week.map(w => `<div class="${w.on ? 'on' : ''} ${w.d === today() ? 'today' : ''}"><i>${w.on ? '✓' : ''}</i>${w.l}</div>`).join('')}</div></div>
  <div class="card"><h2>Your numbers</h2><div class="stats4" style="grid-template-columns:1fr 1fr;margin-top:12px"><div class="stat"><b>${p.best}</b><span>best streak</span></div><div class="stat"><b>${avg}</b><span>average score</span></div><div class="stat"><b>${S.words.length}</b><span>words learned</span></div><div class="stat"><b>${att.length}</b><span>quizzes taken</span></div></div></div></div>`;
}

/* ───────── lesson ───────── */
const STEPS = [['review', 'Word check'], ['read', 'Story'], ['quiz', 'Questions'], ['words', 'New words'], ['write', 'Writing'], ['chat', 'Talk']];
function ensureSession() {
  const p = S.progress;
  if (S.session && S.session.day === p.day) return S.session;
  S.session = { day: p.day, step: S.words.length ? 'review' : 'read', hadReview: S.words.length > 0, review: null, quiz: null, tries: 0, wr: { phase: 'sentence', fb: null, word: null }, chat: [] };
  save(); return S.session;
}
function stepper(s) {
  const list = STEPS.filter(x => x[0] !== 'review' || s.hadReview), i = list.findIndex(x => x[0] === s.step);
  return `<div class="steplabel">Step ${i + 1} of ${list.length} · ${list[i][1]}</div><div class="stepper">${list.map((x, k) => `<i class="${k < i ? 'done' : k === i ? 'now' : ''}"></i>`).join('')}</div>`;
}
function viewLesson() {
  const p = S.progress;
  if (p.day > TOTAL) return `<div class="card center"><h1>Course complete</h1><p class="muted" style="margin:10px 0">You finished every story. Check your progress to see how far you came.</p><button class="btn btn-gold" data-a="go" data-r="progress">See my progress</button></div>`;
  if (doneToday()) return viewDone();
  if (!apiKey() && !getBook(p.day)) return `<div class="card"><h2>Story ${p.day} needs your Gemini key</h2><p class="muted" style="margin:10px 0 16px">The first ${BOOKS.length} stories come with the app. From story ${BOOKS.length + 1}, Gemini writes each new story for your level. Add the key once and everything unlocks.</p><button class="btn btn-gold" data-a="go" data-r="settings">Add Gemini key</button></div>`;
  const book = getBook(p.day);
  if (!book) {
    if (genErr) return `<div class="card"><h2>Could not write today's story</h2><p class="muted" style="margin:10px 0 16px">${esc(genErr)}</p><button class="btn btn-gold" data-a="retryBook">Try again</button></div>`;
    if (!genBusy) setTimeout(() => ensureBook(p.day), 0);
    return `<div class="loader"><div class="spin"></div><h2>Writing today's story…</h2><p class="muted">Level: ${levelFor(p.day).name}. This takes about 20 seconds.</p></div>`;
  }
  const s = ensureSession();
  if (s.step === 'review' && !s.review) { s.review = buildReview(); if (!s.review) s.step = 'read'; save(); }
  return ({ review: viewReview, read: viewRead, quiz: viewQuiz, words: viewWords, write: viewWrite, chat: viewCheckin }[s.step])(s, book);
}

/* review: vocabulary from earlier days, before today's exercise */
function buildReview() {
  if (!S.words.length) return null;
  const pool = [...new Set([...S.words.map(w => w.word), ...BOOKS.flatMap(b => b.vocab.map(v => v.word))])];
  const pick = shuffle(S.words).slice(0, Math.min(5, S.words.length));
  const qs = pick.map((w, k) => {
    const re = new RegExp('\\b' + escRe(w.word) + '\\b', 'i'), blank = k % 2 === 1 && re.test(w.example);
    const o = shuffle([w.word, ...shuffle(pool.filter(x => x.toLowerCase() !== w.word.toLowerCase())).slice(0, 3)]);
    return { q: blank ? 'Fill the gap: “' + w.example.replace(re, '_____') + '”' : 'Which word means: “' + w.meaning + '”?', o, a: o.indexOf(w.word), word: w.word };
  });
  return { qs, i: 0, ans: [], right: 0, phase: 'q' };
}
function viewReview(s) {
  const r = s.review;
  if (r.phase === 'sum') return `${stepper(s)}<div class="card center"><h2>Word check finished</h2><div class="score"><div class="big">${r.right}/${r.qs.length}</div><p class="muted">${r.right === r.qs.length ? 'You remember everything. Excellent!' : 'Some words need more practice. They will come back again.'}</p></div><button class="btn btn-gold wide" data-a="reviewDone">Continue to today's story</button></div>`;
  const q = r.qs[r.i], a = r.ans[r.i], answered = a != null;
  return `${stepper(s)}<div class="qtop"><span>Word ${r.i + 1} of ${r.qs.length}</span><div class="bar"><i style="width:${r.i / r.qs.length * 100}%"></i></div></div>
  <div class="card qcard"><p class="muted" style="margin-bottom:8px">Before the story, let's check the words you learned.</p><h2>${esc(q.q)}</h2><div class="opts">${q.o.map((o, i) => `<button class="opt ${answered ? 'lock' : ''} ${answered && i === q.a ? 'right' : ''} ${answered && i === a && a !== q.a ? 'wrong' : ''}" data-a="rpick" data-i="${i}"><b>${'ABCD'[i]}</b><span>${esc(o)}</span></button>`).join('')}</div>
  ${answered ? `<div class="feedback ${a === q.a ? 'ok' : 'no'}">${a === q.a ? 'Correct!' : 'The answer is “' + esc(q.o[q.a]) + '”.'}</div><button class="btn btn-gold wide" data-a="rnext">${r.i === r.qs.length - 1 ? 'See result' : 'Next'}</button>` : ''}</div>`;
}

/* read + listen */
function viewRead(s, book) {
  const sp = S.settings.speed, sl = sp <= .8 ? 'Slow' : sp >= 1.05 ? 'Fast' : 'Normal';
  return `${stepper(s)}<div class="row"><span class="chip gold">Day ${s.day} · Month ${monthOf(s.day)} · ${book.level}</span><span class="chip">${esc(book.topic)}</span></div>
  <h1 style="margin:12px 0 14px">${esc(book.title)}</h1>
  <div class="tools"><button class="tool" data-a="listen">${ic.play}<span>Listen</span></button><button class="tool" data-a="speed">${ic.spk}<span>${sl}</span></button><button class="tool" data-a="fs" data-d="-2" aria-label="Smaller text">A−</button><button class="tool" data-a="fs" data-d="2" aria-label="Bigger text">A+</button></div>
  <article class="paper" style="--fs:${S.settings.fs}px">${book.story.map((p, i) => `<p id="sp${i}">${esc(p)}</p>`).join('')}</article>
  <p class="muted center" style="margin-bottom:14px">Read it, then listen to it. After you continue, the story is hidden and the questions begin.</p>
  <button class="btn btn-gold wide" data-a="finishRead">I finished reading</button>`;
}

/* quiz */
const prep = qs => shuffle(qs).map(x => { const c = x.o[x.a], o = shuffle(x.o); return { q: x.q, o, a: o.indexOf(c) }; });
function newQuiz(s, book) { s.tries = (s.tries || 0) + 1; s.quiz = { qs: prep(book.questions), i: 0, ans: [], phase: 'q', res: null }; save(); }
const QUOTES = ['Without failing, there is no success. Try again — be strong.', 'Every mistake is a step forward. Be strong and try again.', 'Falling is not the end. Standing up again is the lesson.', 'Strong learners are made on hard days. Try again!', 'You did not fail. You found what to practise. Try again, and be strong.'];
function viewQuiz(s, book) {
  if (!s.quiz) newQuiz(s, book);
  const q = s.quiz;
  if (q.phase === 'res') {
    const r = q.res;
    if (r.passed) return `<div class="card center"><h1>You passed!</h1><div class="score"><div class="big" style="color:var(--green)">${r.score}/10</div><p class="muted">You needed ${PASS}. ${r.score === 10 ? 'Perfect score!' : 'Great work.'}</p></div></div>
      ${r.wrong.length ? `<div class="card"><h3>Look at what you missed</h3><ul class="review">${r.wrong.map(w => `<li>${esc(w.q)}<small>Correct answer: ${esc(w.right)}</small></li>`).join('')}</ul></div>` : ''}
      <button class="btn btn-gold wide" data-a="toWords">Learn today's new words</button>`;
    return `<div class="card center"><div class="score"><div class="big" style="color:var(--red)">${r.score}/10</div><p class="muted">You need ${PASS} to pass.</p></div><p class="quote">${esc(QUOTES[(s.tries - 1) % QUOTES.length])}</p><p class="muted">The story is hidden now. Use what you remember — you can do this.</p></div><button class="btn btn-gold wide" data-a="retryQuiz">Try again</button>`;
  }
  const cur = q.qs[q.i], sel = q.ans[q.i];
  return `${stepper(s)}<div class="qtop"><span>Question ${q.i + 1} of ${q.qs.length}</span><div class="bar"><i style="width:${q.i / q.qs.length * 100}%"></i></div></div>
  <div class="card qcard"><h2>${esc(cur.q)}</h2><div class="opts">${cur.o.map((o, i) => `<button class="opt ${sel === i ? 'sel' : ''}" data-a="pick" data-i="${i}"><b>${'ABCD'[i]}</b><span>${esc(o)}</span></button>`).join('')}</div></div>
  <button class="btn btn-gold wide" id="qnext" data-a="qnext" ${sel == null ? 'disabled' : ''}>${q.i === q.qs.length - 1 ? 'Finish' : 'Next'}</button>`;
}

/* new words */
function addWords(book, day) { book.vocab.forEach(v => { if (!S.words.some(w => w.word.toLowerCase() === v.word.toLowerCase())) S.words.push({ word: v.word, meaning: v.meaning, example: v.example, day, right: 0, wrong: 0 }); }); save(); }
function viewWords(s, book) {
  addWords(book, s.day);
  return `${stepper(s)}<h1 style="margin-bottom:6px">Words for today</h1><p class="muted" style="margin-bottom:16px">Tap the speaker to hear each word and its example. These words come back in your next word check.</p>
  <div class="words">${book.vocab.map(v => `<div class="word"><h3>${esc(v.word)}<button class="tool" data-a="sayw" data-w="${esc(v.word)}" data-e="${esc(v.example)}" aria-label="Listen to ${esc(v.word)}">${ic.spk}</button></h3><div>${esc(v.meaning)}</div><em>“${esc(v.example)}”</em></div>`).join('')}</div>
  <button class="btn btn-gold wide" style="margin-top:18px" data-a="toWrite">Now write</button>`;
}

/* writing, analysed by Gemini */
function localCheck(kind, text, ctx) {
  const m = [], w = words(text).length;
  if (kind === 'sentence') { if (w < 4) m.push('Write a full sentence with at least 4 words.'); if (!/^[A-Z"]/.test(text.trim())) m.push('Start the sentence with a capital letter.'); if (!/[.!?"]$/.test(text.trim())) m.push('End the sentence with a full stop.'); if (!new RegExp('\\b' + escRe(ctx.word), 'i').test(text)) m.push('Use the word “' + ctx.word + '”.'); }
  else { if (w < 25) m.push('Write at least 25 words.'); if (sentences(text).length < 3) m.push('Write at least 3 full sentences.'); }
  return { valid: !m.length, score: null, corrected: '', mistakes: m.map(x => ({ wrong: '', fix: '', why: x })), praise: m.length ? '' : 'Your text has the right shape.', tip: 'This was only a basic check. Add your Gemini key in Settings and the AI teacher will check your grammar properly.', local: true };
}
async function analyze(kind, text, ctx) {
  if (!apiKey()) return localCheck(kind, text, ctx);
  const sys = `You are a warm but honest English teacher for adult learners (age 30+), level ${levelFor(S.progress.day).name}. Judge the learner's ${kind}. ${kind === 'sentence' ? `It must be one real, meaningful sentence that uses the word "${ctx.word}".` : `It must be a real paragraph of at least 3 connected sentences that retells today's story "${ctx.title}" in the learner's own words.`} If the text is only a few random words, a list, copied, or does not make sense, set valid to false and give a score under 4. Be truthful: never give a high score to wrong English. Use very simple words in your feedback.
Return ONLY JSON: {"valid":boolean,"score":integer 0-10,"corrected":string (the whole corrected text),"mistakes":[{"wrong":string,"fix":string,"why":string}],"praise":string (one honest sentence about what was good),"tip":string (one short tip)}`;
  const r = parseJSON(await gemini({ system: sys, contents: [{ role: 'user', parts: [{ text }] }], json: true, temperature: 0.2 }));
  r.score = Math.max(0, Math.min(10, Math.round(+r.score || 0))); r.mistakes = Array.isArray(r.mistakes) ? r.mistakes : []; r.valid = !!r.valid; return r;
}
const wrPassed = fb => fb && fb.valid && (fb.score == null || fb.score >= 5);
function viewWrite(s, book) {
  const w = s.wr; if (!w.word) { w.word = book.vocab[s.day % book.vocab.length].word; save(); }
  const sen = w.phase === 'sentence', fb = w.fb;
  return `${stepper(s)}<h1 style="margin-bottom:6px">${sen ? 'Write one sentence' : 'Write a paragraph'}</h1>
  <p class="muted" style="margin-bottom:14px">${sen ? `Use the word <b style="color:var(--gold)">${esc(w.word)}</b> in one complete sentence about your own life.` : `Tell today's story, “${esc(book.title)}”, in your own words. Write 3 to 5 full sentences. Do not copy the story.`}</p>
  <textarea id="wtext" placeholder="${sen ? 'Write your sentence here…' : 'Write your paragraph here…'}" ${wrPassed(fb) ? 'readonly' : ''} style="${sen ? 'min-height:110px' : ''}">${esc(wDraft)}</textarea>
  <div class="meter" id="wmeter"></div>
  ${fb ? `<div class="card" style="margin-top:14px"><div class="row between"><h3>${wrPassed(fb) ? 'Good work' : 'Not yet — try again'}</h3>${fb.score != null ? `<span class="chip gold">Score ${fb.score}/10</span>` : ''}</div>
    ${fb.praise ? `<p style="margin-top:8px">${esc(fb.praise)}</p>` : ''}
    ${fb.corrected ? `<div class="fix"><span class="muted">Corrected version</span><br><ins>${esc(fb.corrected)}</ins></div>` : ''}
    ${fb.mistakes.map(m => `<div class="fix">${m.wrong ? `<del>${esc(m.wrong)}</del> → <ins>${esc(m.fix)}</ins><br>` : ''}<span class="muted">${esc(m.why)}</span></div>`).join('')}
    ${fb.tip ? `<p class="muted" style="margin-top:12px">Tip: ${esc(fb.tip)}</p>` : ''}</div>` : ''}
  <div style="margin-top:16px">${wrPassed(fb) ? `<button class="btn btn-gold wide" data-a="wnext">${sen ? 'Next: write a paragraph' : 'Next: talk about your day'}</button>` : `<button class="btn btn-gold wide" data-a="wcheck" ${busy ? 'disabled' : ''}>${busy ? 'Checking…' : 'Check my writing'}</button>`}</div>`;
}

/* daily check-in chat */
const bub = m => `<div class="bub ${m.r}">${esc(m.t)}</div>`;
function viewCheckin(s) {
  if (!s.chat.length) { s.chat.push({ r: 'b', t: `Good ${tod()}${S.user.name ? ', ' + S.user.name : ''}! How was your day today? Tell me in English — it is only you and me.` }); save(); }
  const n = s.chat.filter(m => m.r === 'u').length;
  return `${stepper(s)}<h1 style="margin-bottom:12px">How was your day?</h1><div class="card"><div class="log" id="log">${s.chat.map(bub).join('')}</div>
  <div class="send"><input type="text" id="cin" placeholder="Write in English…" autocomplete="off" maxlength="500"><button class="btn btn-gold" data-a="send" data-k="checkin">Send</button></div></div>
  ${n >= 2 ? `<button class="btn btn-gold wide pulse" data-a="complete">Finish today's lesson</button>` : `<p class="muted center">Send at least 2 messages to finish the lesson.</p>`}`;
}
const CANNED = ['That sounds interesting! What did you eat today?', 'Nice. Who did you talk to today?', 'Good. What will you do tomorrow?', 'Thank you for telling me. What was the best part of your day?'];
async function sendChat(kind) {
  const inp = $('#cin'), text = inp.value.trim(); if (!text || busy) return; inp.value = '';
  const s = ensureSession(), arr = kind === 'talk' ? S.talk : s.chat;
  arr.push({ r: 'u', t: text }); save(); const log = $('#log'); log.insertAdjacentHTML('beforeend', bub({ r: 'u', t: text }) + '<div class="bub b typing" id="typ"><span></span><span></span><span></span></div>'); log.scrollTop = log.scrollHeight;
  busy = true; let reply;
  try {
    if (!apiKey()) { reply = kind === 'talk' ? 'I need a Gemini key to answer. Add it in Settings, and I will be ready to talk.' : CANNED[arr.filter(m => m.r === 'u').length % CANNED.length] + ' (Add a Gemini key in Settings to get real answers and corrections.)'; }
    else {
      const hist = arr.slice(-14), first = hist.findIndex(m => m.r === 'u');
      reply = await gemini({ system: kind === 'talk' ? talkPrompt() : checkinPrompt(), contents: hist.slice(first).map(m => ({ role: m.r === 'u' ? 'user' : 'model', parts: [{ text: m.t }] })), temperature: 0.7 });
    }
  } catch (e) { reply = e.message === 'NO_KEY' ? 'Add your Gemini key in Settings first.' : 'Sorry, I could not answer: ' + e.message; }
  busy = false; arr.push({ r: 'b', t: reply.trim() }); if (kind === 'talk' && S.talk.length > 60) S.talk = S.talk.slice(-60); save();
  if (route === (kind === 'talk' ? 'talk' : 'lesson')) render(true);
}
function ctxLine() { const att = S.attempts.filter(a => a.kind === 'story'); return `Learner: ${S.user.name || 'a student'}, adult (30+). Current day: ${S.progress.day} of ${TOTAL}. Level: ${levelFor(S.progress.day).name}. Streak: ${streakNow()} days. Quizzes taken: ${att.length}.`; }
const checkinPrompt = () => `You are Rodseo, a kind English coach inside the Rodseo M app. You are doing the daily check-in: ask about the learner's day, react warmly, and ask ONE short follow-up question. Use simple English and short sentences. If the learner's message has a grammar mistake, first write one short line starting with "Better:" with the corrected sentence, then continue. Keep the reply under 60 words. ${ctxLine()}`;
const talkPrompt = () => `You are Rodseo, the friendly English coach inside the Rodseo M app. Rodseo M is a free web app created by the developer ${DEV}. It teaches daily-life English to adults over 30: one story per day for ${TOTAL} days (4 months), easy at first and harder after month 2. The learner reads and listens to the story, then it is hidden and she answers 10 questions and needs ${PASS}/10 to pass. Each day also has a vocabulary check of earlier words, new words with English meanings, a writing task checked by AI, and a daily chat about her day. The app has a streak counter, daily reminders, a progress page with honest statistics, and a Terms of Service in Settings. All progress is saved only in the learner's own browser. If asked about the app or its developer, answer from these facts only; if you do not know something, say so honestly. Help with English: explain words, correct sentences, practise speaking. Use simple, clear English with short sentences. Be kind, but honest. Keep replies under 90 words unless asked for more. ${ctxLine()}`;
function viewTalk() {
  if (!S.talk.length) S.talk.push({ r: 'b', t: `Hello${S.user.name ? ' ' + S.user.name : ''}! I am Rodseo, your English coach. Ask me about a word, a sentence, or this app. I was made for you by ${DEV}.` });
  return `<h1 style="margin-bottom:6px">Your English coach</h1><p class="muted" style="margin-bottom:14px">Ask about words, grammar, or how the app works.</p>
  ${apiKey() ? '' : `<div class="banner"><span>The coach needs a Gemini key to answer.</span><button class="btn btn-gold btn-sm" data-a="go" data-r="settings">Add key</button></div>`}
  <div class="card"><div class="log" id="log" style="max-height:56vh">${S.talk.map(bub).join('')}</div><div class="send"><input type="text" id="cin" placeholder="Ask the coach…" autocomplete="off" maxlength="500"><button class="btn btn-gold" data-a="send" data-k="talk">Send</button></div></div>`;
}

/* finish the day */
function completeDay() {
  const p = S.progress, t = today();
  p.streak = p.lastCompleted === addDays(t, -1) ? p.streak + 1 : 1; p.best = Math.max(p.best, p.streak);
  p.lastCompleted = t; p.completed.push({ date: t, day: p.day }); p.day += 1; S.session = null; save();
  confetti(); render();
}
function viewDone() {
  const last = S.progress.completed[S.progress.completed.length - 1], book = last && getBook(last.day);
  return `<div class="card gold center"><div style="display:grid;place-items:center">${ic.flame().replace('class="flame ', 'style="width:64px;height:64px" class="flame ')}</div><h1>Day ${last ? last.day : ''} complete!</h1><p class="muted" style="margin:8px 0">${streakNow()} day${streakNow() === 1 ? '' : 's'} in a row. Your next story opens tomorrow.</p></div>
  ${book ? `<div class="card"><h3 style="margin-bottom:10px">Today's words</h3>${book.vocab.map(v => `<p><b>${esc(v.word)}</b> — <span class="muted">${esc(v.meaning)}</span></p>`).join('')}</div>` : ''}
  <div class="row"><button class="btn btn-gold" data-a="go" data-r="progress">See my progress</button><button class="btn btn-ghost" data-a="go" data-r="home">Home</button></div>`;
}

/* ───────── progress (real numbers only) ───────── */
function viewProgress() {
  const p = S.progress, st = S.attempts.filter(a => a.kind === 'story'), rv = S.attempts.filter(a => a.kind === 'review');
  const pct = (a, b) => b ? Math.round(a / b * 100) + '%' : '–';
  const avg = pct(st.reduce((s, a) => s + a.score, 0), st.reduce((s, a) => s + a.total, 0));
  const dayIds = [...new Set(st.map(a => a.day))], firstTry = pct(dayIds.filter(d => st.find(a => a.day === d).passed).length, dayIds.length);
  const rvAcc = pct(rv.reduce((s, a) => s + a.score, 0), rv.reduce((s, a) => s + a.total, 0));
  const doneSet = new Set(p.completed.map(c => c.day)), last = st.slice(-12);
  const weak = S.words.filter(w => w.wrong > 0).sort((a, b) => (b.wrong - b.right) - (a.wrong - a.right)).slice(0, 6);
  return `<h1 style="margin-bottom:6px">Your progress</h1><p class="muted" style="margin-bottom:16px">Every number here comes from what you really did on this device. Nothing is made up.</p>
  <div class="card"><div class="stats4"><div class="stat"><b>${p.completed.length}</b><span>days finished</span></div><div class="stat"><b>${streakNow()}</b><span>current streak (best ${p.best})</span></div><div class="stat"><b>${avg}</b><span>average quiz score</span></div><div class="stat"><b>${firstTry}</b><span>passed on first try</span></div></div></div>
  <div class="card"><h2>Your ${TOTAL} days</h2><div class="days" style="margin-top:14px">${Array.from({ length: TOTAL }, (_, i) => { const n = i + 1, t = levelFor(n).t; return `<i class="${doneSet.has(n) ? 'done' : n === p.day ? 'cur' : ''} ${t > 1 ? 't' + t : ''}" title="Day ${n}">${n}</i>`; }).join('')}</div>
  <div class="legend"><span>Green: finished</span><span>Gold: today</span><span>Gold line: hard stories (day 61+)</span><span>Red line: harder (day 91+)</span></div></div>
  <div class="card"><h2>Last quiz scores</h2>${last.length ? `<div class="cols">${last.map(a => `<div title="Day ${a.day}: ${a.score}/${a.total}"><i class="${a.passed ? 'ok' : ''}" style="height:${Math.max(4, a.score / a.total * 100)}%"></i>${a.score}</div>`).join('')}</div><p class="muted" style="margin-top:10px">Green means passed (${PASS}/10 or more). Word-check accuracy: ${rvAcc}.</p>` : '<p class="muted" style="margin-top:8px">No quiz yet. Finish your first story to see scores here.</p>'}</div>
  <div class="card"><h2>Words to practise</h2>${weak.length ? weak.map(w => `<p style="margin-top:8px"><b>${esc(w.word)}</b> — <span class="muted">${esc(w.meaning)} (missed ${w.wrong}×)</span></p>`).join('') : `<p class="muted" style="margin-top:8px">${S.words.length ? 'No missed words so far.' : 'Words you learn will appear here.'}</p>`}</div>
  <div class="card"><h2>Your writing</h2><ul class="hist">${S.writings.length ? S.writings.slice(-5).reverse().map(w => `<li><div class="row between"><span class="muted">Day ${w.day} · ${w.type}</span>${w.score != null ? `<span class="chip gold">${w.score}/10</span>` : '<span class="chip">basic check</span>'}</div><p style="margin-top:6px">${esc(w.text)}</p></li>`).join('') : '<li class="muted">Your sentences and paragraphs will be saved here.</li>'}</ul></div>`;
}

/* ───────── settings ───────── */
function viewSettings() {
  const perm = 'Notification' in window ? Notification.permission : 'unsupported';
  return `<h1 style="margin-bottom:16px">Settings</h1>
  <div class="card"><h2>Gemini API key</h2><p class="muted" style="margin:6px 0 4px">Powers the coach, new stories (day ${BOOKS.length + 1} onward) and the writing checker. It is saved only in this browser.</p>
    <label for="sk">Your key</label><div class="secret"><input type="password" id="sk" data-s="apiKey" value="${esc(S.settings.apiKey)}" placeholder="Paste your key here" autocomplete="off"><button class="btn btn-ghost btn-sm" data-a="showKey">Show</button></div>
    <label for="sm">Model name</label><input type="text" id="sm" data-s="model" value="${esc(S.settings.model)}" placeholder="${esc(CFG.GEMINI_MODEL || 'gemini-2.5-flash')}">
    <div class="row" style="margin-top:14px"><button class="btn btn-gold btn-sm" data-a="testKey">Test key</button><span class="muted">${apiKey() ? 'A key is set.' : 'No key yet.'}</span></div></div>
  <div class="card"><h2>Reminder</h2><label for="sr">Lesson time</label><input type="time" id="sr" data-s="reminder" value="${esc(S.user.reminder)}">
    <label class="check"><input type="checkbox" data-s="alarm" ${S.settings.alarm ? 'checked' : ''}><span>Ring the alarm and say “time to learn English” while the app is open</span></label>
    <div class="row"><button class="btn btn-ghost btn-sm" data-a="askNotify">Allow notifications (${esc(perm)})</button><button class="btn btn-ghost btn-sm" data-a="testAlarm">Test alarm</button><button class="btn btn-ghost btn-sm" data-a="ics">Add daily alarm to my phone calendar</button></div>
    <p class="muted" style="margin-top:12px">A web page cannot wake your phone by itself. The in-app alarm works while Rodseo M is open or installed. For a reminder that always rings, add the daily alarm to your calendar app.</p></div>
  <div class="card"><h2>You</h2><label for="sn">Your name</label><input type="text" id="sn" data-s="name" value="${esc(S.user.name)}" maxlength="30">
    <label for="ss">Reading speed</label><select id="ss" data-s="speed">${[['0.75', 'Slow'], ['0.9', 'Normal'], ['1.1', 'Fast']].map(([v, l]) => `<option value="${v}" ${Math.abs(S.settings.speed - v) < .06 ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
  <div class="card"><h2>Your data</h2><p class="muted" style="margin:6px 0 12px">Everything is saved in this browser only. Clearing browser data deletes it.</p><div class="row"><button class="btn btn-ghost btn-sm" data-a="export">Download my data</button><button class="btn btn-red btn-sm" data-a="reset">Delete everything</button></div></div>
  <div class="card"><h2>About</h2><p class="muted" style="margin:6px 0 12px">Rodseo M — daily-life English for adults. Created by ${esc(DEV)}.</p><button class="btn btn-ghost btn-sm" data-a="terms">Terms of Service</button></div>`;
}
const TERMS = [
  ['Who we are', `Rodseo M is a free English-learning web app created by ${DEV}.`],
  ['Who it is for', 'Rodseo M is made for adults who are 30 years old or older. By using it, you confirm that you are 30 or older.'],
  ['Your data', 'Your name, progress, answers, writing and chats are saved only in this browser on this device. The developer does not receive them. If you clear your browser data or change device, they are gone. You can download or delete them in Settings.'],
  ['AI features', 'When you add a Gemini API key, the text you write in chats and exercises, and requests for new stories, are sent to Google\'s Gemini service to create answers. Do not type passwords, ID numbers, bank details or other private information. Your key is stored in your browser.'],
  ['Accuracy', 'AI can make mistakes. Rodseo M is a learning aid, not an official exam or a certified teaching service. Scores show your practice results only.'],
  ['Reminders', 'Reminders depend on your browser and device permissions. The in-app alarm only works while the app is open. For a dependable reminder, add the daily alarm to your calendar app.'],
  ['Fair use', 'Please use the app only for learning. It is provided as it is, without any promise that it is always available or free of errors.'],
  ['Changes', 'These terms may change when the app is updated. Questions? Contact the developer through the Rodseo M project page on GitHub.']
];
function showTerms() { modal(`<h2>Terms of Service</h2>${TERMS.map(([h, t]) => `<p><b>${h}.</b> ${esc(t)}</p>`).join('')}<div class="row"><button class="btn btn-gold" data-a="close">I understand</button></div>`); }
function onSetting(el) {
  const k = el.dataset.s, v = el.type === 'checkbox' ? el.checked : el.value.trim();
  if (k === 'apiKey') { S.settings.apiKey = v; genErr = ''; toast(v ? 'Key saved in this browser.' : 'Key removed.'); }
  else if (k === 'model') S.settings.model = v;
  else if (k === 'reminder') { S.user.reminder = v || '19:00'; S.fired = null; toast('Reminder time saved.'); }
  else if (k === 'alarm') S.settings.alarm = v;
  else if (k === 'name') S.user.name = v;
  else if (k === 'speed') S.settings.speed = +v;
  save();
}
function meter() {
  const t = $('#wtext'), m = $('#wmeter'); if (!t || !m) return;
  const s = ensureSession(), sen = s.wr.phase === 'sentence', w = words(t.value).length, min = sen ? 4 : 25;
  m.textContent = `${w} word${w === 1 ? '' : 's'} · at least ${min} needed`; m.style.color = w >= min ? 'var(--green)' : '';
}

/* ───────── actions ───────── */
const A = {
  go: el => go(el.dataset.r),
  terms: showTerms, close: closeModal,
  start() {
    const n = $('#wn').value.trim();
    if (!n) return toast('Please write your name.');
    if (!$('#wa').checked) return toast('Rodseo M is made for people aged 30 and older.');
    if (!$('#wt').checked) return toast('Please accept the Terms of Service.');
    S.user = { name: n, accepted: true, reminder: $('#wr').value || '19:00' }; save(); route = 'home'; render();
    askNotify().then(ok => toast(ok ? 'Reminders are on.' : 'You can turn on reminders in Settings.'));
  },
  retryBook() { genErr = ''; render(); },
  /* review */
  rpick(el) { const r = S.session.review; if (r.ans[r.i] != null) return; const i = +el.dataset.i, q = r.qs[r.i], w = S.words.find(x => x.word === q.word); r.ans[r.i] = i; if (i === q.a) { r.right++; if (w) w.right++; } else if (w) w.wrong++; save(); render(true); },
  rnext() { const r = S.session.review; if (r.i < r.qs.length - 1) { r.i++; } else { r.phase = 'sum'; S.attempts.push({ date: today(), day: S.session.day, kind: 'review', score: r.right, total: r.qs.length }); } save(); render(); },
  reviewDone() { const s = S.session; s.step = 'read'; s.review = null; save(); render(); window.scrollTo(0, 0); },
  /* reading */
  listen(el) {
    if (listening) { stopSpeech(); return; }
    const book = getBook(S.progress.day); listening = true; el.classList.add('on'); el.innerHTML = ic.stop + '<span>Stop</span>';
    speakChunks(book.story, S.settings.speed, i => document.querySelectorAll('.paper p').forEach((p, k) => p.classList.toggle('now', k === i)));
  },
  speed() { const L = [.75, .9, 1.1], i = L.findIndex(x => Math.abs(x - S.settings.speed) < .06); S.settings.speed = L[(i + 1) % 3]; save(); stopSpeech(); render(true); },
  fs(el) { S.settings.fs = Math.max(18, Math.min(32, S.settings.fs + +el.dataset.d)); const p = $('.paper'); if (p) p.style.setProperty('--fs', S.settings.fs + 'px'); save(); },
  finishRead() { stopSpeech(); modal(`<h2>Ready for the questions?</h2><p>After you continue, the story is hidden and you cannot read it again today. You need ${PASS} correct answers out of 10.</p><div class="row"><button class="btn btn-gold" data-a="startQuiz">Yes, start</button><button class="btn btn-ghost" data-a="close">Read again</button></div>`); },
  startQuiz() { closeModal(); const s = S.session; s.step = 'quiz'; newQuiz(s, getBook(s.day)); render(); window.scrollTo(0, 0); },
  /* quiz */
  pick(el) { const q = S.session.quiz; q.ans[q.i] = +el.dataset.i; save(); document.querySelectorAll('.opt').forEach(o => o.classList.toggle('sel', o === el)); $('#qnext').disabled = false; },
  qnext() {
    const s = S.session, q = s.quiz;
    if (q.i < q.qs.length - 1) { q.i++; save(); render(); return; }
    const wrong = q.qs.map((x, i) => ({ x, i })).filter(o => q.ans[o.i] !== o.x.a).map(o => ({ q: o.x.q, right: o.x.o[o.x.a] }));
    const score = q.qs.length - wrong.length, passed = score >= PASS;
    S.attempts.push({ date: today(), day: s.day, kind: 'story', score, total: q.qs.length, passed });
    q.phase = 'res'; q.res = { score, passed, wrong }; save(); if (passed) confetti(); render(); window.scrollTo(0, 0);
  },
  retryQuiz() { const s = S.session; newQuiz(s, getBook(s.day)); render(); window.scrollTo(0, 0); },
  toWords() { const s = S.session; s.step = 'words'; s.quiz = null; save(); render(); window.scrollTo(0, 0); },
  sayw(el) { say(el.dataset.w + '. ' + el.dataset.e, .85); },
  toWrite() { const s = S.session; s.step = 'write'; wDraft = ''; save(); render(); window.scrollTo(0, 0); },
  /* writing */
  async wcheck() {
    const s = S.session, w = s.wr, text = $('#wtext').value.trim(), sen = w.phase === 'sentence', book = getBook(s.day); wDraft = text;
    if (words(text).length < (sen ? 4 : 25)) return toast(sen ? 'Write a full sentence — at least 4 words.' : 'Write a paragraph — at least 25 words.');
    busy = true; render(true);
    try {
      const fb = await analyze(sen ? 'sentence' : 'paragraph', text, { word: w.word, title: book.title }); w.fb = fb;
      if (wrPassed(fb)) S.writings.push({ date: today(), day: s.day, type: sen ? 'sentence' : 'paragraph', text, score: fb.score, local: !!fb.local });
      save();
    } catch (e) { toast('Could not check your writing: ' + e.message, 5000); }
    busy = false; render(true); meter();
  },
  wnext() { const s = S.session, w = s.wr; if (w.phase === 'sentence') { w.phase = 'paragraph'; w.fb = null; } else s.step = 'chat'; wDraft = ''; save(); render(); window.scrollTo(0, 0); },
  send: el => sendChat(el.dataset.k),
  complete: completeDay,
  /* alarm */
  alarmStart() { stopAlarm(); closeModal(); go('lesson'); },
  alarmStop() { stopAlarm(); closeModal(); },
  alarmSnooze() { stopAlarm(); closeModal(); snoozeAt = Date.now() + 5 * 6e4; toast('I will remind you again in 5 minutes.'); },
  testAlarm() { showAlarm(); },
  async askNotify() { const ok = await askNotify(); toast(ok ? 'Notifications are on.' : 'Notifications are blocked. Allow them in your browser settings.'); render(true); },
  ics() { downloadICS(); toast('Open the file to add the daily alarm to your calendar.'); },
  /* settings */
  showKey(el) { const i = $('#sk'); i.type = i.type === 'password' ? 'text' : 'password'; el.textContent = i.type === 'password' ? 'Show' : 'Hide'; },
  async testKey(el) {
    S.settings.apiKey = $('#sk').value.trim(); S.settings.model = $('#sm').value.trim(); save(); el.disabled = true; el.textContent = 'Testing…';
    try { await gemini({ contents: [{ role: 'user', parts: [{ text: 'Reply with the single word OK.' }] }], temperature: 0 }); toast('The key works. 🎉'); }
    catch (e) { toast(e.message === 'NO_KEY' ? 'Paste your key first.' : e.message, 6000); }
    el.disabled = false; el.textContent = 'Test key';
  },
  export() { const a = document.createElement('a'); const safe = JSON.parse(JSON.stringify(S)); safe.settings.apiKey = ''; a.href = URL.createObjectURL(new Blob([JSON.stringify(safe, null, 2)], { type: 'application/json' })); a.download = 'rodseo-m-my-data.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); },
  reset() { modal(`<h2>Delete everything?</h2><p>Your streak, scores, words, writing and settings will be erased from this browser. This cannot be undone.</p><div class="row"><button class="btn btn-red" data-a="resetYes">Yes, delete</button><button class="btn btn-ghost" data-a="close">Cancel</button></div>`); },
  resetYes() { localStorage.removeItem(KEY); S = defaults(); closeModal(); route = 'home'; render(); toast('Everything was deleted.'); }
};

/* ───────── start ───────── */
document.addEventListener('click', e => { const el = e.target.closest('[data-a]'); if (!el || !A[el.dataset.a]) return; e.preventDefault(); A[el.dataset.a](el); });
document.addEventListener('change', e => { const el = e.target.closest('[data-s]'); if (el) onSetting(el); });
document.addEventListener('input', e => { if (e.target.id === 'wtext') { wDraft = e.target.value; meter(); } });
document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'cin') { e.preventDefault(); const b = $('[data-a=send]'); if (b) b.click(); } if (e.key === 'Escape' && $('#overlay').innerHTML && !alarmInt) closeModal(); });

function init() {
  render(); meter();
  setTimeout(() => $('#splash').classList.add('out'), S.user.accepted ? 1500 : 2000);
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
  setInterval(tickReminder, 15000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) tickReminder(); });
  if (S.user.accepted && !doneToday() && S.progress.day <= TOTAL) setTimeout(() => { toast('Your English lesson is waiting for you today.', 4000); notify('Your English lesson is waiting for you today.'); }, 2600);
}
init();
})();
