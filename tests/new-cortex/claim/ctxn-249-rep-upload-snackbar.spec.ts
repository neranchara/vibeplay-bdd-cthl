import { test } from '@playwright/test';
import { ClaimRepUploadSteps } from '../../../steps/new-cortex/claim/claim-rep-upload.steps';
/**
 * CTXN-249: [Claim] ปรับ wording snackbar เมื่อ upload REP ที่ไม่มีรายการ C
 *
 * ⚠️  ต้องสร้างไฟล์ fixtures ไว้ใน fixtures/ folder:
 *   rep-no-match.xlsx   — REP ที่ไม่มี matching C claims
 *   rep-invalid.xlsx    — REP Excel format ผิด
 *   rep-unsupported.csv — ไฟล์ที่ไม่ใช่ Excel
 *   rep-valid.xlsx      — REP ที่ถูกต้อง
 *
 * Tests ใช้ page.route() mock API → ไม่ต้องใช้ไฟล์จริงจาก server
 */

test.describe('CTXN-249: REP Upload Snackbar Error Messages', {
  tag: ['@claim', '@page-rep-upload', '@req-CTXN-249'],
}, () => {
  let steps: ClaimRepUploadSteps;

  test.beforeEach(async ({ page }) => {
    steps = new ClaimRepUploadSteps(page);
    await steps.whenOpenRepUploadPage();
  });

  test('TC-249-01: ErrNoClaimsToUpdate → ไม่พบรายการเบิกใน REP ที่ตรงกับในระบบ', { tag: ['@regression'] }, async () => {
    await steps.whenUploadWithMockedError('rep-no-match.xlsx', 422, 'ErrNoClaimsToUpdate');
    await steps.thenSnackbarShowsNoClaimsMessage();
  });

  test('TC-249-02: ErrInvalidExcelFormat → REP excel format ไม่ถูกต้อง', { tag: ['@regression'] }, async () => {
    await steps.whenUploadWithMockedError('rep-invalid.xlsx', 400, 'ErrInvalidExcelFormat');
    await steps.thenSnackbarShowsInvalidFormatMessage();
  });

  test('TC-249-03: ErrUnsupportedFormat → REP excel format ไม่ถูกต้อง', { tag: ['@regression'] }, async () => {
    await steps.whenUploadWithMockedError('rep-unsupported.csv', 400, 'ErrUnsupportedFormat');
    await steps.thenSnackbarShowsInvalidFormatMessage();
  });

  test('TC-249-04: InternalServerError → ไม่สามารถนำเข้า REP ได้ กรุณาติดต่อ Administrator', { tag: ['@regression'] }, async () => {
    await steps.whenUploadWithMockedError('rep-valid.xlsx', 500, 'InternalServerError');
    await steps.thenSnackbarShowsContactAdminMessage();
  });

  test('TC-249-05: Upload สำเร็จ → success snackbar', { tag: ['@regression', '@smoke'] }, async () => {
    await steps.whenUploadWithMockedSuccess('rep-valid.xlsx');
    await steps.thenSnackbarShowsSuccess();
  });
});
