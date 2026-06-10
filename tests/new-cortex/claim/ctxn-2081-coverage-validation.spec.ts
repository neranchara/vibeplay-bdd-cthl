import { test } from '@playwright/test';
import { ClaimCoverageSteps } from '../../../steps/new-cortex/claim/claim-coverage.steps';
import {
  getAuthToken,
  setupCtxn2081,
  Ctxn2081Context,
} from '../../../helpers/api/claim-api-setup';
/**
 * CTXN-2081: [Registration][Manage Coverage] Improve Coverage Handling OPD/IPD
 *
 * Pattern: API Setup (beforeAll) → UI Assert (each test)
 *   - beforeAll: login ด้วย user1, ยิง API สร้างคนไข้ + assign coverage, save HN ลงไฟล์
 *   - beforeEach: login UI เพื่อเปิด session
 *   - test body: assert พฤติกรรม UI เท่านั้น
 *
 * ⚠️  ถ้า PLAN_IDS ใน claim-api-setup.ts ไม่ถูกต้อง ให้แก้ก่อน run
 */

let ctx: Ctxn2081Context;

// Visit ID สำหรับ NHSO OPD TC-2081-04 — ต้อง run ครั้งแรกแล้วได้ visitId มาใส่
// หรือสร้าง visit ผ่าน API เพิ่มเติมได้ในอนาคต
const NHSO_OPD_VISIT_ID = 'REPLACE_ME';

test.describe('CTXN-2081: Coverage Validation & Admission History', {
  tag: ['@claim', '@page-coverage-validation', '@req-CTXN-2081'],
}, () => {
  let steps: ClaimCoverageSteps;

  // ── API Setup: รันครั้งเดียวต่อ describe block ───────────────────────────
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    try {
      const token = await getAuthToken(page);
      ctx = await setupCtxn2081(page, token);
      console.log('[CTXN-2081] Setup complete:');
      console.log(`  patientZeroBudget : HN=${ctx.patientZeroBudget.hn} | name="${ctx.patientZeroBudget.name}"`);
      console.log(`  patientWithBudget : HN=${ctx.patientWithBudget.hn} | name="${ctx.patientWithBudget.name}"`);
      console.log(`  patientZeroIPD    : HN=${ctx.patientZeroIPD.hn}    | name="${ctx.patientZeroIPD.name}"`);
      console.log(`  patientNhsoIPD    : HN=${ctx.patientNhsoIPD.hn}    | name="${ctx.patientNhsoIPD.name}"`);
    } finally {
      await page.close();
    }
  });

  test.beforeEach(async ({ page }) => {
    steps = new ClaimCoverageSteps(page);
  });

  // ── Tests: assert ผ่าน UI ────────────────────────────────────────────────

  test('TC-2081-01: createVisit — budget หมด → validation error', { tag: ['@regression', '@smoke'] }, async () => {
    await steps.whenCreateVisitWithPatient(ctx.patientZeroBudget.name);
    await steps.thenBudgetValidationErrorShown();
  });

  test('TC-2081-02: createVisit — budget เหลือ → สร้าง Visit ได้ปกติ', { tag: ['@regression', '@smoke'] }, async () => {
    await steps.whenCreateVisitWithPatient(ctx.patientWithBudget.name);
    await steps.thenVisitCreatedSuccessfully();
  });

  test('TC-2081-04: NHSO OPD — มีปุ่มขอ auth code', { tag: ['@regression'] }, async () => {
    test.skip(NHSO_OPD_VISIT_ID === 'REPLACE_ME', 'ต้องใส่ NHSO_OPD_VISIT_ID ก่อน');
    await steps.whenOpenVisit(NHSO_OPD_VISIT_ID);
    await steps.thenRequestAuthCodeButtonVisible();
  });

  test('TC-2081-05: Admission — budget_ipd หมด → validation error', { tag: ['@regression'] }, async () => {
    await steps.whenAdmitPatient(ctx.patientZeroIPD.name);
    await steps.thenIPDBudgetValidationErrorShown();
  });

  test('TC-2081-06: NHSO IPD — ไม่มีปุ่ม request auth, ใส่ free text ได้', { tag: ['@regression'] }, async () => {
    await steps.whenOpenNewAdmissionForPatient(ctx.patientNhsoIPD.name);
    await steps.thenNoRequestAuthCodeButton();
    await steps.thenAuthCodeFreeTextInputExists();
    await steps.whenFillAuthCode('AUTH-TEST-001');
    await steps.thenAuthCodeInputHasValue('AUTH-TEST-001');
  });

  test('TC-2081-07: Admission History — Auth Code, Endpoint Code, Approval Codes แยก column', { tag: ['@regression'] }, async () => {
    await steps.whenOpenAdmissionHistory();
    await steps.thenAdmissionHistoryColumnsVisible();
    await steps.thenApprovalCodesJoinedByComma();
  });
});
