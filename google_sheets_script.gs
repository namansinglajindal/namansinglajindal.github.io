/**
 * ============================================================
 *  LEXSCAN + CLAUSEFORGE — Google Sheets Integration
 *  Powered by Google Gemini API (FREE — 1,500 requests/day)
 * ============================================================
 *
 *  HOW TO SET UP (5 minutes, no coding needed):
 *  ─────────────────────────────────────────────
 *  1. Open Google Sheets → create a new blank spreadsheet.
 *  2. Rename it: "LexScan & ClauseForge"
 *  3. Go to Extensions → Apps Script
 *  4. Delete all default code in the editor.
 *  5. Paste THIS ENTIRE FILE into the editor.
 *  6. Replace 'YOUR_GEMINI_API_KEY_HERE' below with your free key.
 *     → Get free key at: https://aistudio.google.com/app/apikey
 *     → Sign in with Google → "Create API key" → Copy it.
 *  7. Click the 💾 Save icon (or Ctrl+S).
 *  8. Reload your Google Sheet.
 *  9. A new menu "⚖ LexScan AI" will appear. Click it!
 *  10. First run: Google will ask for permissions → click "Allow".
 *
 *  THAT'S IT. No coding, no server, completely free.
 * ============================================================
 */

// ─── PUT YOUR FREE GEMINI API KEY HERE ───────────────────────
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';
// ─────────────────────────────────────────────────────────────

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// ══════════════════════════════════════════════════════════════
//  MENU SETUP — runs automatically when Sheet opens
// ══════════════════════════════════════════════════════════════
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚖ LexScan AI')
    .addItem('📋 Setup Sheets (First Time)', 'setupSheets')
    .addSeparator()
    .addItem('🔍 Run Compliance Check (selected row)', 'runComplianceCheck')
    .addItem('📝 Generate Legal Clause (selected row)', 'generateClause')
    .addSeparator()
    .addItem('🔍 Bulk: Run All Compliance Checks', 'runAllCompliance')
    .addItem('📝 Bulk: Generate All Clauses', 'generateAllClauses')
    .addSeparator()
    .addItem('ℹ️ Help & Instructions', 'showHelp')
    .addToUi();
}

// ══════════════════════════════════════════════════════════════
//  SETUP: Create the two sheets with correct headers & sample data
// ══════════════════════════════════════════════════════════════
function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // ── Sheet 1: Compliance Checker ──────────────────────────────
  let cs = ss.getSheetByName('🔍 Compliance Checker');
  if (!cs) cs = ss.insertSheet('🔍 Compliance Checker');
  cs.clearContents();
  cs.clearFormats();

  const compHeaders = [
    'Jurisdiction', 'Compare With (optional)', 'Legal Domain',
    'Your Specific Query', 'Surface Hidden Laws?', 'AI Compliance Analysis', 'Last Updated'
  ];
  cs.getRange(1, 1, 1, compHeaders.length).setValues([compHeaders]);

  // Style header row
  const compHeaderRange = cs.getRange(1, 1, 1, compHeaders.length);
  compHeaderRange.setBackground('#1c1917').setFontColor('#f7f2ea')
    .setFontWeight('bold').setFontFamily('Courier New').setFontSize(10);

  // Column widths
  cs.setColumnWidth(1, 160); cs.setColumnWidth(2, 160); cs.setColumnWidth(3, 200);
  cs.setColumnWidth(4, 280); cs.setColumnWidth(5, 140);
  cs.setColumnWidth(6, 500); cs.setColumnWidth(7, 150);

  // Sample data rows
  const compSamples = [
    ['Maharashtra', '', 'Environmental Law (Pollution Control, Waste Management, EIA)',
     'Hazardous waste storage requirements for a small chemical plant', 'YES', '', ''],
    ['All India (Central Government)', 'European Union (GDPR / EU law)',
     'Data Protection & Cybersecurity (DPDP Act, IT Act, GDPR equivalents)',
     'Data localisation and cross-border transfer for a SaaS startup', 'NO', '', ''],
    ['Karnataka', '', 'Labour & Employment Law (Wages, Leave, POSH, ESI, PF)',
     'Shop and establishment registration and compliance for a tech startup with 50 employees', 'YES', '', ''],
  ];
  cs.getRange(2, 1, compSamples.length, compHeaders.length).setValues(compSamples);

  // Alternate row shading
  cs.getRange(2, 1, 20, compHeaders.length).setBackground('#f7f2ea');
  cs.getRange(3, 1, 1, compHeaders.length).setBackground('#f0ebe0');
  cs.getRange(5, 1, 1, compHeaders.length).setBackground('#f0ebe0');

  // Freeze header
  cs.setFrozenRows(1);

  // ── Sheet 2: Clause Generator ────────────────────────────────
  let cl = ss.getSheetByName('📝 Clause Generator');
  if (!cl) cl = ss.insertSheet('📝 Clause Generator');
  cl.clearContents();
  cl.clearFormats();

  const clauseHeaders = [
    'Clause Type', 'Parties & Context', 'Governing Law', 'Formality Level',
    'Output Depth', 'Generated Clause', 'Last Updated'
  ];
  cl.getRange(1, 1, 1, clauseHeaders.length).setValues([clauseHeaders]);
  const clauseHeaderRange = cl.getRange(1, 1, 1, clauseHeaders.length);
  clauseHeaderRange.setBackground('#7f1d1d').setFontColor('#fef2f2')
    .setFontWeight('bold').setFontFamily('Courier New').setFontSize(10);

  cl.setColumnWidth(1, 200); cl.setColumnWidth(2, 300); cl.setColumnWidth(3, 180);
  cl.setColumnWidth(4, 180); cl.setColumnWidth(5, 180);
  cl.setColumnWidth(6, 500); cl.setColumnWidth(7, 150);

  const clauseSamples = [
    ['CIRP Resolution Plan Key Terms (IBC 2016, Section 30)',
     'Resolution Applicant: Tata Steel Ltd · Corporate Debtor: ABC Steels Pvt Ltd (MSME) · Total claims: ₹450 Cr · Resolution amount: ₹120 Cr',
     'Laws of India (Courts of Mumbai, India)', 'High Court / NCLT formal', 'Full — Clause + Citations + Explanation + Pitfalls', '', ''],
    ['Contra Proferentem Interpretation Clause (Indian Contract Act 1872)',
     'SaaS vendor (Party A) and Enterprise client (Party B). Vendor-drafted agreement.',
     'Laws of Karnataka (Courts of Bengaluru, India)', 'Commercial contract', 'Full — Clause + Citations + Explanation + Pitfalls', '', ''],
    ['DPDP Act 2023 Data Processing Consent Clause',
     'Health-tech app collecting sensitive personal data (health records) from Indian users. Data processor: AWS India.',
     'Laws of India (Courts of Delhi, India)', 'Startup / plain English', 'Annotated — Clause with inline explanations', '', ''],
  ];
  cl.getRange(2, 1, clauseSamples.length, clauseHeaders.length).setValues(clauseSamples);
  cl.setFrozenRows(1);

  // ── Instructions sheet ───────────────────────────────────────
  let ins = ss.getSheetByName('ℹ️ Instructions');
  if (!ins) ins = ss.insertSheet('ℹ️ Instructions');
  ins.clearContents();
  ins.getRange('A1').setValue('LexScan AI & ClauseForge — Google Sheets Edition');
  ins.getRange('A1').setFontSize(16).setFontWeight('bold').setFontFamily('Courier New');
  ins.getRange('A3').setValue('HOW TO USE:');
  const steps = [
    'Step 1: Go to the 🔍 Compliance Checker sheet OR the 📝 Clause Generator sheet.',
    'Step 2: Fill in a new row with your query details (look at the sample rows for guidance).',
    'Step 3: Click on any cell in that row.',
    'Step 4: From the menu above, click ⚖ LexScan AI → Run Compliance Check OR Generate Legal Clause.',
    'Step 5: Wait 10–20 seconds. The AI result appears in Column F.',
    '',
    'BULK PROCESSING:',
    'Fill multiple rows, then use "Bulk: Run All" to process all empty rows at once.',
    '',
    'IMPORTANT NOTES:',
    '• Gemini API is free for 1,500 requests/day. Each row = 1 request.',
    '• Do not share your spreadsheet publicly with your API key visible.',
    '• Go to File → Share → change to "Anyone with link can VIEW" to share safely.',
    '• Results are NOT legal advice. Always review with a qualified advocate.',
    '• If you get an error, check that your API key is correctly entered in the script.',
    '',
    'VALID VALUES for Compliance Checker:',
    '• Jurisdiction: Maharashtra, Delhi (NCT), Karnataka, Gujarat, Tamil Nadu, All India (Central Government), European Union (GDPR / EU law), Singapore, etc.',
    '• Surface Hidden Laws?: YES or NO',
    '',
    'VALID VALUES for Clause Generator:',
    '• Formality Level: High Court / NCLT formal | Commercial contract | Startup / plain English',
    '• Output Depth: Full — Clause + Citations + Explanation + Pitfalls | Clause Only | Annotated',
  ];
  ins.getRange(3, 1, 1, 1).setValue('HOW TO USE:').setFontWeight('bold');
  ins.getRange(4, 1, steps.length, 1).setValues(steps.map(s => [s]));
  ins.setColumnWidth(1, 700);
  ins.setFrozenRows(1);

  ss.setActiveSheet(cs);
  SpreadsheetApp.getUi().alert(
    '✅ Setup Complete!\n\n' +
    'Sheets created:\n• 🔍 Compliance Checker\n• 📝 Clause Generator\n• ℹ️ Instructions\n\n' +
    'Sample rows added. Select a row, then use the ⚖ LexScan AI menu to generate results.\n\n' +
    'Make sure your Gemini API key is pasted at the top of the script (Extensions → Apps Script).'
  );
}

// ══════════════════════════════════════════════════════════════
//  COMPLIANCE CHECK — single row
// ══════════════════════════════════════════════════════════════
function runComplianceCheck() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const row   = sheet.getActiveRange().getRow();

  if (row === 1) { SpreadsheetApp.getUi().alert('Please click on a data row (row 2 or below), not the header.'); return; }
  if (!validateKey()) return;

  const data = sheet.getRange(row, 1, 1, 5).getValues()[0];
  const [j1, j2, domain, query, hidden] = data;

  if (!j1 || !domain) {
    SpreadsheetApp.getUi().alert('Please fill in at least Jurisdiction (Column A) and Legal Domain (Column C).'); return;
  }

  const prompt = buildCompliancePrompt(j1, j2, domain, query, hidden === 'YES');
  const result = callGemini(prompt);

  sheet.getRange(row, 6).setValue(result).setWrap(true);
  sheet.getRange(row, 7).setValue(new Date().toLocaleString());
  sheet.setRowHeight(row, Math.min(400, Math.max(120, result.length / 2)));

  SpreadsheetApp.getUi().alert('✅ Analysis complete! Check Column F in row ' + row + '.');
}

// ══════════════════════════════════════════════════════════════
//  CLAUSE GENERATOR — single row
// ══════════════════════════════════════════════════════════════
function generateClause() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const row   = sheet.getActiveRange().getRow();

  if (row === 1) { SpreadsheetApp.getUi().alert('Please click on a data row (row 2 or below).'); return; }
  if (!validateKey()) return;

  const data = sheet.getRange(row, 1, 1, 5).getValues()[0];
  const [clauseType, context, govLaw, tone, depth] = data;

  if (!clauseType) { SpreadsheetApp.getUi().alert('Please fill in Clause Type (Column A).'); return; }

  const prompt = buildClausePrompt(clauseType, context, govLaw, tone, depth);
  const result = callGemini(prompt);

  sheet.getRange(row, 6).setValue(result).setWrap(true);
  sheet.getRange(row, 7).setValue(new Date().toLocaleString());
  sheet.setRowHeight(row, Math.min(500, Math.max(150, result.length / 2)));

  SpreadsheetApp.getUi().alert('✅ Clause generated! Check Column F in row ' + row + '.');
}

// ══════════════════════════════════════════════════════════════
//  BULK OPERATIONS
// ══════════════════════════════════════════════════════════════
function runAllCompliance() {
  if (!validateKey()) return;
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('🔍 Compliance Checker');
  if (!sheet) { SpreadsheetApp.getUi().alert('Please run Setup first from the menu.'); return; }

  const lastRow = sheet.getLastRow();
  let processed = 0;

  for (let row = 2; row <= lastRow; row++) {
    const vals = sheet.getRange(row, 1, 1, 6).getValues()[0];
    if (!vals[0] || !vals[2]) continue; // skip if no jurisdiction or domain
    if (vals[5]) continue;              // skip if already has result

    const prompt = buildCompliancePrompt(vals[0], vals[1], vals[2], vals[3], vals[4] === 'YES');
    const result = callGemini(prompt);
    sheet.getRange(row, 6).setValue(result).setWrap(true);
    sheet.getRange(row, 7).setValue(new Date().toLocaleString());
    processed++;
    Utilities.sleep(1000); // 1 second between calls to respect rate limits
  }

  SpreadsheetApp.getUi().alert(`✅ Bulk complete. ${processed} rows processed.`);
}

function generateAllClauses() {
  if (!validateKey()) return;
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('📝 Clause Generator');
  if (!sheet) { SpreadsheetApp.getUi().alert('Please run Setup first.'); return; }

  const lastRow = sheet.getLastRow();
  let processed = 0;

  for (let row = 2; row <= lastRow; row++) {
    const vals = sheet.getRange(row, 1, 1, 6).getValues()[0];
    if (!vals[0]) continue;
    if (vals[5]) continue;

    const prompt = buildClausePrompt(vals[0], vals[1], vals[2], vals[3], vals[4]);
    const result = callGemini(prompt);
    sheet.getRange(row, 6).setValue(result).setWrap(true);
    sheet.getRange(row, 7).setValue(new Date().toLocaleString());
    processed++;
    Utilities.sleep(1000);
  }

  SpreadsheetApp.getUi().alert(`✅ Bulk complete. ${processed} clauses generated.`);
}

// ══════════════════════════════════════════════════════════════
//  PROMPT BUILDERS
// ══════════════════════════════════════════════════════════════
function buildCompliancePrompt(j1, j2, domain, query, hidden) {
  const compNote = j2 ? `Do a SIDE-BY-SIDE COMPARISON between ${j1} and ${j2}. Organise by jurisdiction.` : '';
  const hiddenNote = hidden ? 'Also surface non-obvious "hidden" obligations — state circulars, local by-laws, tribunal orders. Label these [HIDDEN OBLIGATION].' : '';

  return `You are a senior regulatory compliance expert in Indian law and international regulation.

Jurisdiction: ${j1}${j2 ? ' vs ' + j2 : ''}
Domain: ${domain}
Query: ${query || '(General compliance overview)'}
${compNote}
${hiddenNote}

Structure your response with these exact headers:

TOP COMPLIANCE OBLIGATIONS
(List 4–6 key obligations with specific Act names and section numbers)

LEGAL CITATIONS
(For each obligation: full Act name, section/rule number, issuing authority)

RISK LEVEL
(HIGH / MEDIUM / LOW with 2-sentence justification)

PRACTICAL COMPLIANCE STEPS
(3–4 numbered actionable steps)

WATCH OUT FOR
(2–3 traps or recent amendments often missed)

CAVEATS
(Areas of legal uncertainty — write "Verify: [topic]" for uncertain points)

Rules: Only cite laws you are confident exist. Never fabricate section numbers or case names. If uncertain, write "Verify independently: [topic]".`;
}

function buildClausePrompt(clauseType, context, govLaw, tone, depth) {
  const depthMap = {
    'Full — Clause + Citations + Explanation + Pitfalls':
      'Provide: THE CLAUSE / LEGAL CITATIONS / PLAIN LANGUAGE EXPLANATION / DRAFTING NOTES / COMMON PITFALLS',
    'Clause Only — Ready to paste into contract':
      'Provide ONLY the clause text. No explanations. Ready to paste.',
    'Annotated — Clause with inline explanations':
      'Provide the clause with [Explanation: ...] annotations after key phrases. Then add DRAFTING NOTES.'
  };

  const instruction = depthMap[depth] || depthMap['Full — Clause + Citations + Explanation + Pitfalls'];

  return `You are a senior Indian advocate specialising in corporate, commercial, and insolvency law.

Clause Type: ${clauseType}
Context: ${context || '(Draft a general-purpose version)'}
Governing Law: ${govLaw || 'Laws of India'}
Style: ${tone || 'Commercial contract'}

${instruction}

Rules:
1. Clause text must be in proper legal language.
2. Cite accurate Act names, years, and section numbers.
3. For IBC/CIRP: cite IBC 2016, IBBI Regulations 2016, NCLT Rules 2016.
4. For data clauses: cite DPDP Act 2023, IT Act 2000.
5. Flag uncertain points as [Verify: topic] — never fabricate citations.
6. Under COMMON PITFALLS, include at least one non-obvious issue experts miss.

Begin directly with the first section.`;
}

// ══════════════════════════════════════════════════════════════
//  GEMINI API CALL
// ══════════════════════════════════════════════════════════════
function callGemini(prompt) {
  try {
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.18, maxOutputTokens: 2500 }
    };

    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(GEMINI_URL, options);
    const code = response.getResponseCode();
    const body = JSON.parse(response.getContentText());

    if (code !== 200) {
      return `ERROR (${code}): ${body.error?.message || 'Unknown error. Check your API key.'}`;
    }

    return body.candidates?.[0]?.content?.parts?.[0]?.text
      || 'ERROR: Empty response from Gemini. Please try again.';

  } catch (e) {
    return 'ERROR: ' + e.message + '\n\nCheck that your Gemini API key is correctly pasted at the top of the script.';
  }
}

// ══════════════════════════════════════════════════════════════
//  VALIDATION
// ══════════════════════════════════════════════════════════════
function validateKey() {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    SpreadsheetApp.getUi().alert(
      '⚠ API Key Missing!\n\n' +
      '1. Go to Extensions → Apps Script\n' +
      '2. Find the line: const GEMINI_API_KEY = \'YOUR_GEMINI_API_KEY_HERE\';\n' +
      '3. Replace the placeholder with your actual key from aistudio.google.com\n' +
      '4. Save the script (Ctrl+S)\n' +
      '5. Come back and try again.'
    );
    return false;
  }
  return true;
}

// ══════════════════════════════════════════════════════════════
//  HELP
// ══════════════════════════════════════════════════════════════
function showHelp() {
  SpreadsheetApp.getUi().alert(
    'LexScan AI & ClauseForge — Help\n\n' +
    'PROJECTS:\n' +
    '• 🔍 Compliance Checker: Enter jurisdiction, domain, and your question → get a structured analysis with citations, risk level, and practical steps.\n' +
    '• 📝 Clause Generator: Enter clause type and context → get a drafted legal clause with citations and explanations.\n\n' +
    'API KEY:\n' +
    'Get a free Gemini API key at aistudio.google.com (no credit card needed, 1,500 free requests/day).\n\n' +
    'SHARING:\n' +
    'Share this Sheet as "Anyone with link can VIEW" for your application portfolio. Results are saved permanently in the sheet.\n\n' +
    'DISCLAIMER:\n' +
    'Output is AI-generated and NOT legal advice. Always review with a qualified advocate before use.'
  );
}
