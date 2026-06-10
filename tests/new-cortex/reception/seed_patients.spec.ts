import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/new-cortex/login/login.page';
import { getUserByRole } from '../../../helpers/utils/user-roles';
import { setupTokenListener } from '../../../helpers/api/auth.api';
import { seedMultiplePatients, PatientOverrides } from '../../../helpers/api/patient.api';
import { assignPatientCoverageViaAPI } from '../../../helpers/api/coverage.api';

interface PatientTestCase {
  name: string;
  count: number;
  overrides?: PatientOverrides;
  assert?: (patients: any[]) => void;
}

const TEST_CASES: PatientTestCase[] = [
  {
    name: 'TC-SEED-01: Seed 5 standard male patients (Age 20-60, Prefix นาย)',
    count: 5,
    overrides: {
      gender: 'male',
      namePrefixCode: { code: '003' }
    },
    assert: (patients) => {
      expect(patients).toHaveLength(5);
      for (const p of patients) {
        expect(p.firstName).toContain('automate f');
        expect(p.familyName).toContain('automate l');
      }
    }
  },
  {
    name: 'TC-SEED-02: Seed 1 custom female VVIP patient (Age 45, Custom Name)',
    count: 1,
    overrides: {
      gender: 'female',
      namePrefixCode: { code: '004' },
      isCreateVVIP: true,
      age: 45,
      firstName: 'automate vvip-f',
      familyName: 'automate vvip-l'
    },
    assert: (patients) => {
      expect(patients).toHaveLength(1);
      const patient = patients[0];
      expect(patient.firstName).toBe('automate vvip-f');
      expect(patient.familyName).toBe('automate vvip-l');
    }
  }
];

test.describe('Dynamic API Seeding Verification', () => {
  test('Execute Seeding and Visit Registration Flow', async ({ page }) => {
    test.setTimeout(120000);
    // 1. Setup listener to grab the Bearer token during login
    const tokenHelper = setupTokenListener(page);

    const loginPage = new LoginPage(page);
    const adminUser = getUserByRole(undefined, 'super', 'new-cortex');
    
    console.log('Logging in to Cortex...');
    await loginPage.goto();
    await loginPage.login(adminUser.username, adminUser.password);
    await expect(page).toHaveURL(/.*cortex/);

    // 2. Retrieve and verify Bearer token
    let token = tokenHelper.getBearerToken();
    if (!token) {
      await page.waitForTimeout(3000);
      token = tokenHelper.getBearerToken();
    }
    expect(token).toBeTruthy();
    console.log('Successfully captured Bearer token!');

    // 3. Loop through and execute each patient seeding test case object dynamically
    for (const tc of TEST_CASES) {
      console.log(`\n--- Running test case: ${tc.name} ---`);
      const patients = await seedMultiplePatients(page, token, tc.count, tc.overrides);
      console.log(`Successfully seeded ${patients.length} patient(s) via API`);
      
      for (const patient of patients) {
        expect(patient.hn).toBeTruthy();
        expect(patient.idCardNo).toHaveLength(13);
        console.log(`  Seeded: HN=${patient.hn}, Name=${patient.firstName} ${patient.familyName}, ID=${patient.idCardNo}`);
      }

      if (tc.assert) {
        tc.assert(patients);
      }
    }

    // 4. Run the Visit Registration verification using the active session
    console.log('\n--- Running test case: Seed patient, assign coverage, and register visit ---');
    
    // Seed 1 patient
    const patients = await seedMultiplePatients(page, token, 1);
    const patient = patients[0];
    console.log(`Seeded Patient for Visit: HN=${patient.hn}, Name=${patient.firstName}`);

    // Assign coverage via GraphQL (H99 - 368 with code 123)
    console.log(`Assigning coverage H99 (368) code 123 to HN=${patient.hn}...`);
    await assignPatientCoverageViaAPI(page, token, patient.hn, 368, '123');
    console.log(`Coverage successfully assigned via API!`);

    // Navigate to Reception
    console.log('Navigating to Reception search page shell...');
    await page.goto('https://dev-x.cortexcloud.co/cortex/reception/search-patient');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Resilience: Reload page up to 3 times if React/Vite preload, routing, or gateway error occurs
    for (let attempt = 1; attempt <= 3; attempt++) {
      const hasError = await page.evaluate(() => {
        const text = document.body.innerText;
        return text.includes('Unexpected Application Error') || 
               text.includes('Unable to preload CSS') ||
               text.includes('no available server') ||
               text.includes('502 Bad Gateway') ||
               text.includes('503 Service') ||
               text.includes('Service Unavailable');
      });
      if (hasError) {
        console.log(`Detected application/server error (attempt ${attempt}/3). Waiting 5s before reload...`);
        await page.waitForTimeout(5000);
        await page.reload();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);
      } else {
        break;
      }
    }

    // Use global patient search bar in the header to search patient
    console.log('Searching patient by HN using the global search bar in the header...');
    const globalSearchInput = page.locator('input[placeholder*="ค้นหาผู้ป่วย"], input[placeholder*="ค้นหา"]');
    await globalSearchInput.waitFor({ state: 'visible', timeout: 15000 });
    await globalSearchInput.click();
    await globalSearchInput.fill(patient.hn);
    await page.waitForTimeout(1000);

    // Wait for the dropdown option matching the HN and click it to execute the search reliably
    const searchOption = page.locator(`.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option-content:has-text("${patient.hn}"), .ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option:has-text("${patient.hn}")`).first();
    try {
      await searchOption.waitFor({ state: 'visible', timeout: 5000 });
      await searchOption.click();
      console.log('Clicked patient search option in dropdown.');
    } catch (e) {
      console.log('Patient search option not visible in dropdown, pressing Enter...');
      await globalSearchInput.press('Enter');
      await page.waitForTimeout(1000);
      await page.keyboard.press('Escape');
      await page.locator('body').click({ position: { x: 0, y: 0 } }).catch(() => {});
    }
    await page.waitForTimeout(2000);

    // Wait for the patient profile tab to load in the parent shell header (scoped to main to avoid matching search input or dropdowns)
    console.log(`Waiting for patient profile ${patient.hn} to load...`);
    const hnParentLabel = page.locator(`main div:has-text("HN ${patient.hn}"), main span:has-text("HN ${patient.hn}"), .ant-layout-content div:has-text("HN ${patient.hn}")`).first();
    await hnParentLabel.waitFor({ state: 'visible', timeout: 25000 });
    console.log('Patient profile loaded in the parent shell header.');

    // Switch to the "ทะเบียนผู้ป่วย" tab if it is not active
    console.log('Switching to "ทะเบียนผู้ป่วย" tab...');
    const tabReg = page.locator('[role="menuitem"]:has-text("ทะเบียนผู้ป่วย"), [role="tab"]:has-text("ทะเบียนผู้ป่วย"), .ant-tabs-tab:has-text("ทะเบียนผู้ป่วย")').first();
    await tabReg.waitFor({ state: 'visible', timeout: 15000 });
    await tabReg.click();
    await page.waitForTimeout(2000);

    const frame = page.frameLocator('iframe:first-of-type');

    // Click "+ Visit ใหม่" inside the iframe
    console.log('Clicking "+ Visit ใหม่" inside iframe...');
    const btnVisit = frame.locator('button:has-text("Visit ใหม่"), button:has-text("+ Visit")');
    await btnVisit.waitFor({ state: 'visible', timeout: 15000 });
    await btnVisit.click();

    // Wait for the visit creation page (parent page) to load
    console.log('Waiting for visit registration form on the parent page...');
    
    // 1. Select Clinic (MED - ห้องตรวจโรคอายุรกรรมทั่วไป)
    const clinicInput = page.locator('.ant-select').filter({ hasText: 'คลินิก' }).locator('input, [role="combobox"]').first();
    await clinicInput.waitFor({ state: 'visible', timeout: 20000 });
    await clinicInput.click();
    await page.waitForTimeout(1000);
    try {
      await clinicInput.fill('MED');
      await page.waitForTimeout(1000);
    } catch (e) {
      console.log('Could not fill clinic input, proceeding to select option...');
    }
    
    // Target only option inside the active/visible select dropdown, case-sensitively starting with MED
    const medOption = page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option-content, .ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option, .ant-select-dropdown:not(.ant-select-dropdown-hidden) [role="option"]').filter({ hasText: /^MED/ }).first();
    await medOption.waitFor({ state: 'visible', timeout: 15000 });
    await medOption.click();
    console.log('Selected MED Clinic');

    // 2. Click "ตรวจสอบสิทธิ์" (Check Coverage) button
    const checkCoverageBtn = page.locator('button:has-text("ตรวจสอบสิทธิ"), button:has-text("ตรวจสอบสิทธิ์"), .ant-btn:has-text("ตรวจสอบสิทธิ"), .ant-btn:has-text("ตรวจสอบสิทธิ์")');
    await checkCoverageBtn.waitFor({ state: 'visible', timeout: 10000 });
    await checkCoverageBtn.click();
    console.log('Clicked ตรวจสอบสิทธิ์');
    await page.waitForTimeout(3000); // Wait for validation to resolve

    // 3. Click "สร้าง" (Save) button to create the visit
    const createBtn = page.locator('button:has-text("สร้าง"), .ant-btn-primary:has-text("สร้าง")');
    await createBtn.waitFor({ state: 'visible', timeout: 10000 });
    await createBtn.click();
    console.log('Clicked สร้าง to create Visit!');

    // 4. Verify in the Walk-in Request List page
    console.log('Navigating to Walk-in Request List page to verify visit...');
    await page.waitForTimeout(3000);
    await page.goto('https://dev-x.cortexcloud.co/cortex/opd/walk-in-request-list');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    console.log(`Checking if patient HN ${patient.hn} is present in the list...`);
    const walkInRow = page.locator(`td:has-text("${patient.hn}")`);
    await expect(walkInRow.first()).toBeVisible({ timeout: 15000 });
    console.log('Successfully verified patient in Walk-in Request List!');

    await page.screenshot({ path: 'C:\\Users\\USER\\.gemini\\antigravity-ide\\brain\\d47127fa-685e-4922-9374-dbf0e72df687\\visit_created_success.png' });
  });
});
