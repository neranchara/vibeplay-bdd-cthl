import { Page, test, expect } from '@playwright/test';
import { AppsPage } from '../../../pages/new-cortex/reception/apps.page';
import { MedicalRecordPage } from '../../../pages/new-cortex/medical-record/medical-record.page';
import { RegistrationPage, PatientFormData } from '../../../pages/new-cortex/registration/registration.page';
import { RegistrationLocators } from '../../../locators/new-cortex/registration/registration.locators';

export class RegCreatePatientSteps {
  private appsPage:   AppsPage;
  private mrPage:     MedicalRecordPage;
  private regPage:    RegistrationPage;

  constructor(private page: Page) {
    this.appsPage = new AppsPage(page);
    this.mrPage   = new MedicalRecordPage(page);
    this.regPage  = new RegistrationPage(page);
  }

  // ── Given ─────────────────────────────────────────────────────────────────────

  async givenOnMedicalRecordPage() {
    await test.step('Given user is on Medical Record app', async () => {
      await this.appsPage.openMedicalRecord();
      await this.mrPage.createNewPatientButton.waitFor({ state: 'visible', timeout: 15000 });
    });
  }

  // ── When ──────────────────────────────────────────────────────────────────────

  async whenOpenCreateForm() {
    await test.step('When user clicks สร้างผู้ป่วยใหม่', async () => {
      await this.mrPage.clickCreateNewPatient();
      await this.regPage.waitForFormReady();
    });
  }

  async whenFillFormPartial(data: Partial<PatientFormData>) {
    await test.step(`When user fills partial form (${JSON.stringify(data)})`, async () => {
      await this.regPage.fillForm(data as PatientFormData);
    });
  }

  async whenFillFormComplete(data: PatientFormData) {
    await test.step(`When user fills complete form (name="${data.firstName} ${data.lastName}")`, async () => {
      await this.regPage.fillForm(data);
    });
  }

  async whenClickSave() {
    await test.step('When user clicks บันทึก', async () => {
      await this.regPage.submit();
    });
  }

  // ── Then ──────────────────────────────────────────────────────────────────────

  // MR-001: UI elements visible
  async thenCreateFormElementsVisible() {
    await test.step('Then create patient form elements should be visible', async () => {
      await expect(this.regPage.firstNameInput).toBeVisible();
      await expect(this.regPage.lastNameInput).toBeVisible();
      await expect(this.regPage.idCardInput).toBeVisible();
      await expect(this.regPage.submitButton).toBeVisible();
      await expect(this.regPage.cancelButton).toBeVisible();
    });
  }

  // MR-002: Validation error
  async thenValidationErrorsShown() {
    await test.step('Then validation error(s) should appear for required fields', async () => {
      await expect(this.regPage.validationErrors.first()).toBeVisible({ timeout: 5000 });
    });
  }

  async thenFormStillOpen() {
    await test.step('Then form was NOT submitted (still on create page)', async () => {
      await expect(this.regPage.firstNameInput).toBeVisible();
    });
  }

  // MR-003: Success
  async thenPatientCreatedSuccessfully(): Promise<string> {
    let hn = '';
    await test.step('Then patient created — page redirects to patient profile', async () => {
      hn = await this.regPage.getCreatedHN();
      expect(hn).toBeTruthy();
      console.log(`[REG] Created patient HN: ${hn}`);
    });
    return hn;
  }

  // MR-004: Duplicate ID card
  async thenDuplicateWarningShown() {
    await test.step('Then duplicate ID card warning should appear', async () => {
      await expect(this.page.locator(RegistrationLocators.duplicateWarning)).toBeVisible({ timeout: 5000 });
    });
  }

  async thenPatientNotCreated() {
    await test.step('Then patient was NOT created (warning or still on form)', async () => {
      const isDuplicate = await this.page.locator(RegistrationLocators.duplicateWarning).isVisible();
      const isStillOnForm = await this.regPage.firstNameInput.isVisible();
      expect(isDuplicate || isStillOnForm).toBeTruthy();
    });
  }
}
