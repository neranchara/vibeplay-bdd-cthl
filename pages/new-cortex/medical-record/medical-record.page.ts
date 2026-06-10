import { Page, Locator, FrameLocator } from '@playwright/test';
import { MedicalRecordLocators } from '../../../locators/new-cortex/medical-record/medical-record.locators';

export class MedicalRecordPage {
  readonly page: Page;
  readonly iframe: FrameLocator;

  // ── Search fields (inside iframe) ────────────────────────────────────────────
  readonly searchHNInput:     Locator;
  readonly searchNameInput:   Locator;
  readonly searchIDCardInput: Locator;
  readonly searchPhoneInput:  Locator;
  readonly searchVNInput:     Locator;
  readonly searchANInput:     Locator;
  readonly searchButton:      Locator;
  readonly clearButton:       Locator;
  readonly searchResultTable: Locator;

  // ── Navigation buttons (inside iframe) ───────────────────────────────────────
  readonly createNewPatientButton: Locator;
  readonly sidebarCollapseBtn:     Locator;

  constructor(page: Page) {
    this.page  = page;
    this.iframe = page.frameLocator(MedicalRecordLocators.iframe);

    this.searchHNInput     = this.iframe.locator(MedicalRecordLocators.searchHN);
    this.searchNameInput   = this.iframe.locator(MedicalRecordLocators.searchName);
    this.searchIDCardInput = this.iframe.locator(MedicalRecordLocators.searchIDCard);
    this.searchPhoneInput  = this.iframe.locator(MedicalRecordLocators.searchPhone);
    this.searchVNInput     = this.iframe.locator(MedicalRecordLocators.searchVN);
    this.searchANInput     = this.iframe.locator(MedicalRecordLocators.searchAN);
    this.searchButton      = this.iframe.locator(MedicalRecordLocators.searchButton);
    this.clearButton       = this.iframe.locator(MedicalRecordLocators.clearButton);
    this.searchResultTable = this.iframe.locator(MedicalRecordLocators.searchResultTable);

    this.createNewPatientButton = this.iframe.locator(MedicalRecordLocators.createNewPatientButton);
    this.sidebarCollapseBtn     = this.iframe.locator(MedicalRecordLocators.sidebarCollapseBtn);
  }

  // ── Search ────────────────────────────────────────────────────────────────────
  async searchByHN(hn: string) {
    await this.searchHNInput.fill(hn);
    await this.searchButton.click();
  }

  async searchByName(name: string) {
    await this.searchNameInput.fill(name);
    await this.searchButton.click();
  }

  async searchByIDCard(idCard: string) {
    await this.searchIDCardInput.fill(idCard);
    await this.searchButton.click();
  }

  async searchByPhone(phone: string) {
    await this.searchPhoneInput.fill(phone);
    await this.searchButton.click();
  }

  async clearSearch() {
    await this.clearButton.click();
  }

  // ── Navigation ────────────────────────────────────────────────────────────────
  async clickCreateNewPatient() {
    await this.createNewPatientButton.click();
  }

  async clickSidebarCollapse() {
    await this.sidebarCollapseBtn.click();
  }
}
