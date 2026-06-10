import { test } from '@playwright/test';
import { ClaimChtSteps } from '../../../steps/new-cortex/claim/claim-cht.steps';
import { loginAs } from '../../../steps/new-cortex/shared/login-helper';

/**
 * CTXN-2311: [Bug] CHT INVOICE_NO must be vn or approval code
 *
 * ⚠️  แทนที่ REPLACE_ME:
 *   VISIT_MULTI_APPROVAL  = Visit ที่มี approval codes > 1 รายการ
 *   VISIT_SINGLE_APPROVAL = Visit ที่มี approval code เดียว
 *   VISIT_NO_APPROVAL     = Visit ที่ไม่มี approval code
 */
const TEST_DATA = {
  VISIT_MULTI_APPROVAL: 'REPLACE_ME',
  VISIT_SINGLE_APPROVAL: 'REPLACE_ME',
  VISIT_NO_APPROVAL: 'REPLACE_ME',
};

test.describe('CTXN-2311: CHT.INVOICE_NO Bug Fix', {
  tag: ['@claim', '@page-cht-export', '@req-CTXN-2311'],
}, () => {
  let steps: ClaimChtSteps;

  test.beforeEach(async ({ page }) => {
    await loginAs(page);
    steps = new ClaimChtSteps(page);
  });

  test('TC-2311-01: หลาย approval codes → CHT.INVOICE_NO = approval code', { tag: ['@regression'] }, async () => {
    await steps.whenOpenClaimPreview(TEST_DATA.VISIT_MULTI_APPROVAL);
    await steps.thenInvoiceNoEqualsApprovalCode();
  });

  test('TC-2311-02: approval code เดียว → CHT.INVOICE_NO = VN', { tag: ['@regression', '@smoke'] }, async () => {
    await steps.whenOpenClaimPreview(TEST_DATA.VISIT_SINGLE_APPROVAL);
    await steps.thenInvoiceNoEqualsVN();
  });

  test('TC-2311-03: Regression — ไม่มี approval code → CHT.INVOICE_NO = VN', { tag: ['@regression'] }, async () => {
    await steps.whenOpenClaimPreview(TEST_DATA.VISIT_NO_APPROVAL);
    await steps.thenInvoiceNoEqualsVN();
  });
});
