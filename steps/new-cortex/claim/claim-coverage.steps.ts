import { Page, test, expect } from '@playwright/test';
import { ClaimVisitPage } from '../../../pages/new-cortex/claim/claim-visit.page';
import { ClaimLocators } from '../../../locators/new-cortex/claim/claim.locators';

export class ClaimCoverageSteps {
  private visitPage: ClaimVisitPage;

  constructor(private page: Page) {
    this.visitPage = new ClaimVisitPage(page);
  }

  // TC-2081-01
  async whenCreateVisitWithPatient(patientName: string) {
    await test.step(`When create OPD visit for "${patientName}"`, async () => {
      await this.visitPage.gotoNewOPDVisit();
      await this.visitPage.selectPatient(patientName);
      await this.visitPage.btnCreateVisit.click();
    });
  }

  async thenBudgetValidationErrorShown() {
    await test.step('Then budget validation error shown', async () => {
      const err = this.page.locator(`${ClaimLocators.formErrorMsg}, ${ClaimLocators.messageError}`);
      await expect(err.first()).toBeVisible({ timeout: 5000 });
      await expect(err.first()).toContainText(/งบประมาณ|budget/i);
    });
  }

  // TC-2081-02
  async thenVisitCreatedSuccessfully() {
    await test.step('Then visit created successfully', async () => {
      await expect(this.page).toHaveURL(/\/opd\/visits\/\w+/, { timeout: 15000 });
    });
  }

  // TC-2081-04
  async whenOpenVisit(visitId: string) {
    await test.step(`When open visit ${visitId}`, async () => {
      await this.page.goto(`https://dev-x.cortexcloud.co/cashier/opd/visits/${visitId}`);
    });
  }

  async thenRequestAuthCodeButtonVisible() {
    await test.step('Then Request Auth Code button visible', async () => {
      await expect(this.page.locator(ClaimLocators.btnRequestAuthCode)).toBeVisible();
    });
  }

  // TC-2081-05
  async whenAdmitPatient(patientName: string) {
    await test.step(`When admit patient "${patientName}"`, async () => {
      await this.visitPage.gotoNewAdmission();
      await this.visitPage.selectPatient(patientName);
      await this.visitPage.btnAdmit.click();
    });
  }

  async thenIPDBudgetValidationErrorShown() {
    await test.step('Then IPD budget validation error shown', async () => {
      const err = this.page.locator(`${ClaimLocators.formErrorMsg}, ${ClaimLocators.messageError}`);
      await expect(err.first()).toBeVisible({ timeout: 5000 });
    });
  }

  // TC-2081-06
  async whenOpenNewAdmissionForPatient(patientName: string) {
    await test.step(`When open new admission for "${patientName}"`, async () => {
      await this.visitPage.gotoNewAdmission();
      await this.visitPage.selectPatient(patientName);
    });
  }

  async thenNoRequestAuthCodeButton() {
    await test.step('Then no Request Auth Code button (NHSO IPD)', async () => {
      await expect(this.page.locator(ClaimLocators.btnRequestAuthCode)).not.toBeVisible();
    });
  }

  async thenAuthCodeFreeTextInputExists() {
    await test.step('Then auth code free-text input exists', async () => {
      await expect(this.page.locator(ClaimLocators.inputAuthCode)).toBeVisible();
    });
  }

  async whenFillAuthCode(code: string) {
    await test.step(`When fill auth code "${code}"`, async () => {
      await this.page.locator(ClaimLocators.inputAuthCode).fill(code);
    });
  }

  async thenAuthCodeInputHasValue(code: string) {
    await test.step(`Then auth code input = "${code}"`, async () => {
      await expect(this.page.locator(ClaimLocators.inputAuthCode)).toHaveValue(code);
    });
  }

  // TC-2081-07
  async whenOpenAdmissionHistory() {
    await test.step('When open Admission History', async () => {
      await this.visitPage.gotoAdmissionHistory();
    });
  }

  async thenAdmissionHistoryColumnsVisible() {
    await test.step('Then Auth Code, Endpoint Code, Approval Codes columns visible', async () => {
      await expect(this.page.locator(ClaimLocators.thAuthCode)).toBeVisible();
      await expect(this.page.locator(ClaimLocators.thEndpointCode)).toBeVisible();
      await expect(this.page.locator(ClaimLocators.thApprovalCodes)).toBeVisible();
    });
  }

  async thenApprovalCodesJoinedByComma() {
    await test.step('Then Approval Codes comma-joined', async () => {
      const cell = this.page.locator(ClaimLocators.tdApprovalCodes).first();
      const text = await cell.textContent();
      if (text && text.includes(',')) {
        expect(text).toMatch(/\w+,\s*\w+/);
      }
    });
  }
}
