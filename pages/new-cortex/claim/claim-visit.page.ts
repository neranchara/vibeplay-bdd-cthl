import { Page, Locator } from '@playwright/test';
import { ClaimLocators } from '../../../locators/new-cortex/claim/claim.locators';

const CASHIER_BASE = 'https://dev-x.cortexcloud.co/cashier';

export class ClaimVisitPage {
  readonly btnCreateVisit: Locator;
  readonly btnAdmit: Locator;
  readonly btnSave: Locator;
  readonly inputPatientSearch: Locator;
  readonly btnRequestAuthCode: Locator;
  readonly inputAuthCode: Locator;
  readonly formErrorMsg: Locator;
  readonly messageError: Locator;

  constructor(private page: Page) {
    this.btnCreateVisit = page.locator(ClaimLocators.btnCreateVisit);
    this.btnAdmit = page.locator(ClaimLocators.btnAdmit);
    this.btnSave = page.locator(ClaimLocators.btnSave);
    this.inputPatientSearch = page.locator(ClaimLocators.inputPatientSearch);
    this.btnRequestAuthCode = page.locator(ClaimLocators.btnRequestAuthCode);
    this.inputAuthCode = page.locator(ClaimLocators.inputAuthCode);
    this.formErrorMsg = page.locator(ClaimLocators.formErrorMsg);
    this.messageError = page.locator(ClaimLocators.messageError);
  }

  async gotoNewOPDVisit() {
    await this.page.goto(`${CASHIER_BASE}/opd/visits/new`);
  }

  async gotoEditOPDVisit(visitId: string) {
    await this.page.goto(`${CASHIER_BASE}/opd/visits/${visitId}/edit`);
  }

  async gotoNewAdmission() {
    await this.page.goto(`${CASHIER_BASE}/ipd/admissions/new`);
  }

  async gotoAdmissionHistory() {
    await this.page.goto(`${CASHIER_BASE}/ipd/admissions/history`);
  }

  async selectPatient(patientName: string) {
    await this.inputPatientSearch.fill(patientName);
    await this.page.locator('.ant-select-item-option').first().click();
  }

  async hasRequestAuthCodeButton(): Promise<boolean> {
    return this.btnRequestAuthCode.isVisible();
  }
}
