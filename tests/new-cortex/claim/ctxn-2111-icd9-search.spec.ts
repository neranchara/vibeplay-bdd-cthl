import { test } from '@playwright/test';
import { ClaimIcd9Steps } from '../../../steps/new-cortex/claim/claim-icd9.steps';
/**
 * CTXN-2111: [Claim][OPD Coding] Improve ICD9-CM search — prefix matching
 *
 * ⚠️  แทนที่ REPLACE_ME:
 *   OPD_VISIT_ID = OPD Visit ที่มีสิทธิ์เข้า OPD Coding section
 */
const TEST_DATA = {
  OPD_VISIT_ID: 'REPLACE_ME',
};

test.describe('CTXN-2111: ICD9-CM Prefix Search', {
  tag: ['@claim', '@page-icd9-search', '@req-CTXN-2111'],
}, () => {
  let steps: ClaimIcd9Steps;

  test.beforeEach(async ({ page }) => {
    steps = new ClaimIcd9Steps(page);
    await steps.whenOpenOPDCodingAndAddProcedure(TEST_DATA.OPD_VISIT_ID);
  });

  test('TC-2111-01: prefix "99" → ผลลัพธ์ทุกรายการขึ้นต้นด้วย "99"', { tag: ['@regression', '@smoke'] }, async () => {
    await steps.whenSearchByPrefix('99');
    await steps.thenAllResultsStartWithPrefix('99');
  });

  test('TC-2111-02: code match มีอยู่ → ไม่ mix กับ keyword results', { tag: ['@regression'] }, async () => {
    await steps.whenSearchByPrefix('45');
    await steps.thenResultsAreCodeMatchesOnly('45');
  });

  test('TC-2111-03: keyword "fracture" → keyword search results', { tag: ['@regression'] }, async () => {
    await steps.whenSearchByPrefix('fracture');
    await steps.thenResultsContainKeyword('fracture');
  });

  test('TC-2111-04: exact code "99.04" → แสดงในผลลัพธ์', { tag: ['@regression'] }, async () => {
    await steps.whenSearchByPrefix('99.04');
    await steps.thenExactCodeIsInResults('99.04');
  });
});
