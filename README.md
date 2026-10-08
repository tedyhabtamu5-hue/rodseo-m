# Rodseo M

Daily-life English for adults 30+. One story every day for 120 days (4 months).
Plain HTML/CSS/JavaScript — no build step. Created by Yosef Habtamu.

## Put it on GitHub Pages
1. Extract this zip and copy **everything** into your `rodseo-m` repository (replace the old files).
2. `git add . && git commit -m "New Rodseo M" && git push`
3. On GitHub: **Settings → Pages → Deploy from branch → main / (root)**.
4. Open `https://tedyhabtamu5-hue.github.io/rodseo-m/`

## Gemini API key
Get a key at https://aistudio.google.com/apikey, then either:
- **Recommended:** open the app → **Settings → Gemini API key** → paste → *Test key*. It stays in that browser only.
- or paste it in `config.js` (`GEMINI_API_KEY`). **Warning:** in a public repo anyone can read it.

The key powers: the English coach, daily "How was your day?" chat, writing checks, and every story from day 4 onward.
Days 1–3 are bundled and work without a key. If Google renames the model, change `GEMINI_MODEL` in `config.js`.

## How a day works
Word check (earlier words) → read + listen to the story → "I finished reading" (story is hidden) → 10 questions, 7 needed →
new words with English meanings → write a sentence and a paragraph (AI checks) → chat about your day → streak +1.
Stories get harder after day 60 (Hard) and day 90 (Harder).

## Reminders — what a web page can and cannot do
The alarm rings and speaks while the app is open or installed (browser menu → *Install app*). A web page cannot wake a closed phone.
For an alarm that always rings, use **Settings → Add daily alarm to my phone calendar** (downloads a .ics file).

## Files
`index.html` · `css/style.css` · `js/app.js` (all logic) · `js/books.js` (bundled stories) · `config.js` · `sw.js` · `manifest.webmanifest` · `assets/`
