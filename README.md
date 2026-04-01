# LexScan AI + ClauseForge
### Cross-Jurisdictional Compliance Intelligence & Legal Clause Architect
*Built by Naman Singla · BSc LLB (Hons) Cybersecurity · NLIU*

---

## What's Included

| File | What it is | How to use |
|------|-----------|------------|
| `lexscan_compliance_checker.html` | Cross-jurisdictional compliance analysis tool | Open in any browser OR deploy to GitHub Pages |
| `clauseforge_clause_generator.html` | Legal clause generator for niche Indian law clauses | Open in any browser OR deploy to GitHub Pages |
| `google_sheets_script.gs` | Google Apps Script — same tools inside Google Sheets | Paste into Google Apps Script editor |

---

## Option A — Standalone (Open Directly in Browser)

**No installation. No server. Just a file.**

1. Download `lexscan_compliance_checker.html` and/or `clauseforge_clause_generator.html`
2. Double-click the file → it opens in your browser
3. Get a free Gemini API key (see below)
4. Paste the key into the app → start using it

That's it. Works 100% offline after loading fonts (first time needs internet for Google Fonts).

---

## Option B — Deploy to GitHub Pages (Free, Public URL)

Get a public shareable link like `https://yourusername.github.io/lexscan/`

### Step-by-step for anyone to deploy these tools (15 minutes, free):

**Step 1: Create a GitHub account**
- Go to [github.com](https://github.com) → Sign Up (free)

**Step 2: Create a new repository**
- Click the `+` button (top right) → "New repository"
- Name: `lexscan-ai` (or any name)
- Set to **Public**
- Check "Add a README file"
- Click "Create repository"

**Step 3: Upload your HTML files**
- In your new repository, click "Add file" → "Upload files"
- Upload: `lexscan_compliance_checker.html` and `clauseforge_clause_generator.html`
- Also rename `lexscan_compliance_checker.html` to `index.html` if you want it as the homepage
- Click "Commit changes"

**Step 4: Enable GitHub Pages**
- Go to your repository → Settings tab
- Left sidebar: click "Pages"
- Under "Source": select "Deploy from a branch"
- Branch: `main` · Folder: `/ (root)`
- Click "Save"

**Step 5: Get your URL**
- Wait 2–3 minutes
- Your site is live at: `https://YOUR_USERNAME.github.io/lexscan-ai/`
- Share this link in your application as your portfolio link!

**Step 6: Create an index page linking both tools**

Create a file called `index.html` with this content:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>AI Legal Tools Portfolio</title>
  <style>
    body { font-family: sans-serif; max-width: 700px; margin: 80px auto; padding: 20px; background: #f7f2ea; }
    h1 { font-size: 28px; color: #1c1917; }
    p { color: #44403c; margin: 12px 0 28px; }
    .card { background: white; border: 1px solid #d9cdb8; border-radius: 6px; padding: 24px; margin: 16px 0; }
    .card h2 { margin: 0 0 8px; font-size: 18px; }
    .btn { display: inline-block; margin-top: 14px; padding: 10px 20px; background: #9b1c1c; color: white; text-decoration: none; border-radius: 4px; font-size: 14px; }
    .btn2 { background: #1c1917; }
  </style>
</head>
<body>
  <h1>AI Legal Tools Portfolio</h1>
  <p>Two AI-powered legal tools built for Indian law compliance and contract drafting. Powered by Google Gemini API (free).</p>
  <div class="card">
    <h2>🔍 LexScan AI — Compliance Intelligence Engine</h2>
    <p>Cross-jurisdictional compliance analysis across Indian states and international jurisdictions. Surfaces hidden obligations, generates risk ratings, and cites actual laws.</p>
    <a class="btn" href="lexscan_compliance_checker.html">Open LexScan →</a>
  </div>
  <div class="card">
    <h2>📝 ClauseForge — Legal Clause Architect</h2>
    <p>Generates niche legal clauses (CIRP resolution plans, contra proferentem, DPDP consent, force majeure) with Indian law citations and plain-language annotations.</p>
    <a class="btn btn2" href="clauseforge_clause_generator.html">Open ClauseForge →</a>
  </div>
</body>
</html>
```

---

## Option C — Google Sheets (No Browser, No Deployment)

Best for: offline use, bulk processing multiple queries, sharing as a "view-only" Google Sheet link.

### Setup (5 minutes):

1. Go to [sheets.google.com](https://sheets.google.com) → Create a new blank spreadsheet
2. Go to **Extensions → Apps Script**
3. Delete all default code in the editor
4. Open `google_sheets_script.gs` from this repo → Copy **all** the content
5. Paste it into the Apps Script editor
6. Find this line at the top:
   ```
   const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';
   ```
7. Replace with your actual Gemini API key
8. Click 💾 **Save** (Ctrl+S)
9. Go back to your spreadsheet → **Refresh the page**
10. A new menu **"⚖ LexScan AI"** appears → Click it → **Setup Sheets**
11. Grant permissions when asked → Click Allow

Two sheets are automatically created with headers and sample data.  
**To use:** Fill a row → click the row → use the menu to run analysis.

### Sharing your Sheet:
- File → Share → "Anyone with the link" → Set to **Viewer**
- Copy the link → paste in your application

---

## Getting Your Free Gemini API Key

1. Go to: **[aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)**
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (starts with `AIza...`)
5. Paste it into the app or script

**Cost:** Free. 1,500 requests per day. No credit card needed.

> **Optional paid upgrade:** If you want more requests or GPT-4o quality,  
> OpenAI API starts at $5 minimum top-up. To use OpenAI instead of Gemini,  
> change the API URL in the code to `https://api.openai.com/v1/chat/completions`  
> and update the payload format accordingly.

---

## What These Tools Do 

### LexScan AI — Compliance Intelligence Engine
- **Problem solved:** Startups and law firms waste weeks researching state-specific compliance requirements. Environmental clearances, labour law variations, DPDP obligations — these are scattered across notifications, circulars, and local by-laws that even lawyers miss.
- **Innovation:** Cross-jurisdictional comparison mode (e.g., "compare Maharashtra vs Singapore for data protection") — not available in any free tool.
- **Hidden Law feature:** Specifically surfaces non-obvious obligations from circulars and tribunal orders, which is where most compliance failures occur.
- **Tech used:** Google Gemini 1.5 Flash API, pure HTML/JS, zero backend — deployable in minutes.

### ClauseForge — Legal Clause Architect
- **Problem solved:** Niche legal clauses (CIRP resolution plans, contra proferentem, DPDP consent) require deep domain knowledge that generic AI tools lack. Lawyers either draft them poorly or spend hours researching.
- **Innovation:** Domain-specific prompting with citation enforcement — the AI is instructed to only cite laws it is confident exist and to flag uncertain areas explicitly.
- **Clause types included:** CIRP/IBC, Contra Proferentem, DPDP 2023 consent, Force Majeure, Arbitration (SIAC/ICA), ESOP Vesting, Non-Compete (Indian law), IP Assignment, Data Localisation.
- **Tech used:** Google Gemini 1.5 Flash API, pure HTML/JS.

---



Use these three links:
1. **GitHub Pages URL** — live portfolio of both tools
2. **Google Sheets link** — the compliance checker in Sheets with sample outputs already filled in (shared as view-only)
3. **GitHub repository** — shows all source files

---

## Disclaimer

These tools are for demonstration and educational purposes.  
Output is AI-generated and does **not** constitute legal advice.  
Always review generated content with a qualified advocate before relying on it.

---

*LexScan AI & ClauseForge · Built with Google Gemini API (Free Tier) · India-focused legal tech* Note: This whole tool and output has been developed using AI Tools.
