// ─────────────────────────────────────────────────────────────
//  Rodseo M — settings
//
//  GEMINI API KEY
//  Best way: leave this empty and paste the key inside the app
//  (Settings → Gemini API key). It is then saved only in that
//  person's browser.
//
//  If you paste a key here and push to a PUBLIC GitHub repo,
//  anyone can read it and use your quota. Only do that for a
//  private repo or a key restricted to your website address.
// ─────────────────────────────────────────────────────────────
window.RODSEO_CONFIG = {
  GEMINI_API_KEY: "",              // ← put your key here (optional, see warning above)
  GEMINI_MODEL: "gemini-2.5-flash",// change if Google renames the model
  PASS_SCORE: 7,                   // correct answers needed out of 10
  TOTAL_DAYS: 120,                 // 4 months, one book per day
  DEVELOPER: "Yosef Habtamu"
};
