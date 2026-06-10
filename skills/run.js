#!/usr/bin/env node

/**
 * Playwright Test Runner
 * Usage: node skills/run.js <site> [module] [filter] [--headed] [--ui] [--debug]
 *
 * Examples:
 *   node skills/run.js new-cortex login
 *   node skills/run.js new-cortex claim
 *   node skills/run.js new-cortex claim ctxn-2081 --headed
 *   node skills/run.js new-cortex claim --ui
 *   HEADED=true node skills/run.js new-cortex claim
 */

const { execSync } = require('child_process');
const path = require('path');

// ── Parse flags ──────────────────────────────────────────────────────────────
const rawArgs    = process.argv.slice(2);
const headedFlag = rawArgs.includes('--headed') || process.env.HEADED === 'true';
const uiFlag     = rawArgs.includes('--ui');
const debugFlag  = rawArgs.includes('--debug');
const tagArg     = rawArgs.find(a => a.startsWith('--tag='));
const tagFilter  = tagArg?.substring('--tag='.length) ?? process.env.TAG;
const positional = rawArgs.filter(a => !a.startsWith('--'));

const site   = positional[0];   // new-cortex | tmh | sbh | nuh
const moduleName = positional[1];   // login | claim | reception | medical-record | ...
const filter = positional[2];   // optional file prefix: ctxn-2081 | ctxn-2083 | ...

// ── Module → path mapping ────────────────────────────────────────────────────
const MODULE_MAP = {
  'new-cortex': {
    'login':                 'tests/new-cortex/login/',
    'reception':             'tests/new-cortex/reception/',
    'check-apps':            'tests/new-cortex/reception/check_apps.spec.ts',
    'advance-visits':        'tests/new-cortex/reception/advance-visits.spec.ts',
    'seed-patients':         'tests/new-cortex/reception/seed_patients.spec.ts',
    'medical-record':        'tests/new-cortex/medical-record/medical-record.spec.ts',
    'medical-record-search': 'tests/new-cortex/medical-record/medical-record-search.spec.ts',
    'registration':          'tests/new-cortex/registration/',
    'reg-create':            'tests/new-cortex/registration/reg-create-patient.spec.ts',
    'reg-search':            'tests/new-cortex/registration/reg-search-patient.spec.ts',
    'claim':                 'tests/new-cortex/claim/',
    'setup':                 'tests/new-cortex/setup/',
  },
  'tmh': { 'login': 'tests/tmh/login/' },
  'sbh': { 'login': 'tests/sbh/login/' },
  'nuh': { 'login': 'tests/nuh/login/' },
};

// ── Resolve test path ────────────────────────────────────────────────────────
function resolveTestPath() {
  if (!site) return 'tests/';

  const siteMap = MODULE_MAP[site];
  if (!siteMap) {
    console.error(`Unknown site: "${site}". Available: ${Object.keys(MODULE_MAP).join(', ')}`);
    process.exit(1);
  }

  if (!moduleName) return `tests/${site}/`;

  const modulePath = siteMap[moduleName];
  if (!modulePath) {
    console.error(`Unknown module: "${moduleName}" for site "${site}". Available: ${Object.keys(siteMap).join(', ')}`);
    process.exit(1);
  }

  // filter = ค้นหาไฟล์ spec ที่ขึ้นต้นด้วย filter ใน folder
  if (filter && modulePath.endsWith('/')) {
    return `${modulePath}${filter}`;
  }

  return modulePath;
}

// ── Build command ────────────────────────────────────────────────────────────
const testPath = resolveTestPath();
let cmd = `npx playwright test "${testPath}"`;

if (headedFlag) cmd += ' --headed';
if (uiFlag)     cmd += ' --ui';
if (debugFlag)  cmd += ' --debug';
if (tagFilter)  cmd += ` --grep "${tagFilter}"`;

// ── Run ──────────────────────────────────────────────────────────────────────
console.log('─'.repeat(60));
console.log(`  Site   : ${site   || '(all)'}`);
console.log(`  Module : ${moduleName || '(all)'}`);
if (filter) console.log(`  Filter : ${filter}`);
console.log(`  Mode   : ${uiFlag ? 'ui' : debugFlag ? 'debug' : headedFlag ? 'headed' : 'headless'}`);
if (tagFilter) console.log(`  Tag    : ${tagFilter}`);
console.log('─'.repeat(60));
console.log(`\n  $ ${cmd}\n`);

try {
  execSync(cmd, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
} catch {
  process.exit(1);
}
