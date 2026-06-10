import { test } from '@playwright/test';
import { RegSearchPatientSteps } from '../../../steps/new-cortex/registration/reg-search-patient.steps';
import { loginAs } from '../../../steps/new-cortex/shared/login-helper';
import { getAuthToken } from '../../../helpers/api/claim-api-setup';
import { createPatientViaAPI } from '../../../helpers/api/patient.api';
import { buildPatient } from '../../../helpers/utils/patient-factory';

/**
 * Registration: Search Patient
 * TC-REG-MR013  ตรวจสอบ search fields ครบถ้วน
 * TC-REG-MR006  ค้นหาด้วย HN     → พบผู้ป่วย
 * TC-REG-MR007  ค้นหาด้วย ชื่อ   → พบผู้ป่วย
 * TC-REG-MR008  ค้นหาด้วย เลขบัตร → พบผู้ป่วย
 * TC-REG-MR015  กด Clear         → fields ว่าง
 *
 * Pattern: API Setup (beforeAll) → UI Assert (each test)
 */

let patient = { hn: '', firstName: '', idCard: '' };

test.describe('Registration: Search Patient', {
  tag: ['@registration', '@page-search-patient'],
}, () => {
  let steps: RegSearchPatientSteps;

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    try {
      const token   = await getAuthToken(page);
      const created = await createPatientViaAPI(page, token, buildPatient());
      patient = { hn: created.hn, firstName: created.firstName, idCard: created.idCardNo };
      console.log(`[REG-Search] API created: HN=${patient.hn} name="${patient.firstName}"`);
    } finally {
      await page.close();
    }
  });

  test.beforeEach(async ({ page }) => {
    await loginAs(page);
    steps = new RegSearchPatientSteps(page);
    await steps.givenOnMedicalRecordSearchPage();
  });

  test('TC-REG-MR013: Search page — UI fields และปุ่มครบถ้วน', {
    tag: ['@regression', '@req-MR-013'],
  }, async () => {
    await steps.thenAllSearchFieldsVisible();
  });

  test('TC-REG-MR006: ค้นหาด้วย HN → พบผู้ป่วย', {
    tag: ['@regression', '@smoke', '@req-MR-006'],
  }, async () => {
    await steps.whenSearchByHN(patient.hn);
    await steps.thenPatientFoundInResults(patient.firstName);
  });

  test('TC-REG-MR007: ค้นหาด้วย ชื่อ → พบผู้ป่วย', {
    tag: ['@regression', '@req-MR-007'],
  }, async () => {
    await steps.whenSearchByName(patient.firstName);
    await steps.thenPatientFoundInResults(patient.firstName);
  });

  test('TC-REG-MR008: ค้นหาด้วย เลขบัตรประชาชน → พบผู้ป่วย', {
    tag: ['@regression', '@req-MR-008'],
  }, async () => {
    await steps.whenSearchByIDCard(patient.idCard);
    await steps.thenPatientFoundInResults(patient.firstName);
  });

  test('TC-REG-MR015: กด Clear → search fields ว่าง', {
    tag: ['@regression', '@req-MR-015'],
  }, async () => {
    await steps.whenFillHNAndClear(patient.hn);
    await steps.thenSearchFieldsCleared();
  });
});
