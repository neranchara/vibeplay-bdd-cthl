import { test } from '@playwright/test';
import { RegCreatePatientSteps } from '../../../steps/new-cortex/registration/reg-create-patient.steps';
import { buildPatient } from '../../../helpers/utils/patient-factory';
import { toFormData } from '../../../pages/new-cortex/registration/registration.page';
import { getAuthToken } from '../../../helpers/api/claim-api-setup';
import { createPatientViaAPI } from '../../../helpers/api/patient.api';

/**
 * Registration: Create Patient
 * TC-REG-MR001  ตรวจสอบ UI elements ในหน้าสร้างผู้ป่วย
 * TC-REG-MR002  กรอก required fields ไม่ครบ → validation error
 * TC-REG-MR003  กรอก required fields ครบ → สร้างสำเร็จ
 * TC-REG-MR004  กรอก ID card ซ้ำ → แสดง warning
 */

let existingIdCard = '';

test.describe('Registration: Create Patient', {
  tag: ['@registration', '@page-create-patient'],
}, () => {
  let steps: RegCreatePatientSteps;

  // สร้างคนไข้ล่วงหน้าสำหรับ MR-004 (duplicate ID card test)
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    try {
      const token   = await getAuthToken(page);
      const created = await createPatientViaAPI(page, token, buildPatient());
      existingIdCard = created.idCardNo;
    } finally {
      await page.close();
    }
  });

  test.beforeEach(async ({ page }) => {
    steps = new RegCreatePatientSteps(page);
    await steps.givenOnMedicalRecordPage();
  });

  // ── MR-001: UI elements ─────────────────────────────────────────────────────
  test('TC-REG-MR001: หน้าสร้างผู้ป่วย — UI elements ครบถ้วน', {
    tag: ['@regression', '@req-MR-001'],
  }, async () => {
    await steps.whenOpenCreateForm();
    await steps.thenCreateFormElementsVisible();
  });

  // ── MR-002: Validation — required fields ไม่ครบ ─────────────────────────────
  test('TC-REG-MR002: กรอก required fields ไม่ครบ → validation error', {
    tag: ['@regression', '@req-MR-002'],
  }, async () => {
    await steps.whenOpenCreateForm();
    await steps.whenFillFormPartial({ firstName: buildPatient().firstName });
    await steps.whenClickSave();
    await steps.thenValidationErrorsShown();
    await steps.thenFormStillOpen();
  });

  // ── MR-003: Happy path ───────────────────────────────────────────────────────
  test('TC-REG-MR003: กรอก required fields ครบ → สร้างผู้ป่วยสำเร็จ', {
    tag: ['@regression', '@smoke', '@req-MR-003'],
  }, async () => {
    const patient = buildPatient();
    await steps.whenOpenCreateForm();
    await steps.whenFillFormComplete(toFormData(patient));
    await steps.whenClickSave();
    await steps.thenPatientCreatedSuccessfully();
  });

  // ── MR-004: Duplicate ID card ────────────────────────────────────────────────
  test('TC-REG-MR004: กรอก ID card ซ้ำ → แสดง warning, ไม่สร้างซ้ำ', {
    tag: ['@regression', '@req-MR-004'],
  }, async () => {
    test.skip(!existingIdCard, 'ต้องการ existingIdCard จาก beforeAll');
    const patient = buildPatient({ idCardNo: existingIdCard });
    await steps.whenOpenCreateForm();
    await steps.whenFillFormComplete(toFormData(patient));
    await steps.whenClickSave();
    await steps.thenDuplicateWarningShown();
    await steps.thenPatientNotCreated();
  });
});
