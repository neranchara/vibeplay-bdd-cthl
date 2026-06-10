import { Page, Locator } from '@playwright/test';
import { BasePage } from '../../base.page';
import { MedicationMasterLocators } from '../../../locators/new-cortex/medication/medication-master.locators';

export class MedicationMasterPage extends BasePage {
  readonly keywordInput: Locator;
  readonly statusSelect: Locator;
  readonly highAlertSelect: Locator;
  readonly filterButton: Locator;
  readonly resetButton: Locator;
  readonly createMedicationButton: Locator;

  constructor(page: Page) {
    super(page);
    this.keywordInput = page.locator(MedicationMasterLocators.keywordInput);
    this.statusSelect = page.locator(MedicationMasterLocators.statusSelect);
    this.highAlertSelect = page.locator(MedicationMasterLocators.highAlertSelect);
    this.filterButton = page.locator(MedicationMasterLocators.filterButton);
    this.resetButton = page.locator(MedicationMasterLocators.resetButton);
    this.createMedicationButton = page.locator(MedicationMasterLocators.createMedicationButton);
  }

  async navigateToApp() {
    await this.click(MedicationMasterLocators.pharmacyMenu);
    await this.click(MedicationMasterLocators.medicationMasterSubMenu);
    await this.page.waitForLoadState('networkidle');
  }

  async searchByKeyword(keyword: string) {
    await this.fill(MedicationMasterLocators.keywordInput, keyword);
  }

  async selectStatus(status: string) {
    await this.click(MedicationMasterLocators.statusSelect);
    // Assuming ant-select opens a dropdown with title="Active" or similar text
    await this.page.locator(`.ant-select-item-option-content:has-text("${status}")`).click();
  }

  async selectHighAlert(value: string) {
    await this.click(MedicationMasterLocators.highAlertSelect);
    await this.page.locator(`.ant-select-item-option-content:has-text("${value}")`).click();
  }

  async clickFilter() {
    await this.click(MedicationMasterLocators.filterButton);
    await this.page.waitForTimeout(2000); // Wait for table refresh
  }

  async clickReset() {
    await this.click(MedicationMasterLocators.resetButton);
    await this.page.waitForTimeout(2000); // Wait for table refresh
  }

  async clickCreateMedication() {
    await this.click(MedicationMasterLocators.createMedicationButton);
  }

  async getTableRowsCount() {
    return await this.page.locator(MedicationMasterLocators.tableRow).count();
  }

  async isKeywordEmpty() {
    const value = await this.keywordInput.inputValue();
    return value === '';
  }
}
