import { Page, Locator } from '@playwright/test';
import { ClaimLocators } from '../../../locators/new-cortex/claim/claim.locators';

const CASHIER_BASE = 'https://dev-x.cortexcloud.co/cashier';

export class ClaimAccountPage {
  readonly tabTamSitti: Locator;
  readonly tabRaikan: Locator;
  readonly btnAddItem: Locator;
  readonly btnExportDRU: Locator;
  readonly btnExportADP: Locator;
  readonly btnExportOOP: Locator;
  readonly btnExportORF: Locator;

  constructor(private page: Page) {
    this.tabTamSitti = page.locator(ClaimLocators.tabTamSitti);
    this.tabRaikan = page.locator(ClaimLocators.tabRaikan);
    this.btnAddItem = page.locator(ClaimLocators.btnAddItem);
    this.btnExportDRU = page.locator(ClaimLocators.btnExportDRU);
    this.btnExportADP = page.locator(ClaimLocators.btnExportADP);
    this.btnExportOOP = page.locator(ClaimLocators.btnExportOOP);
    this.btnExportORF = page.locator(ClaimLocators.btnExportORF);
  }

  async gotoIPDAccount(visitId: string) {
    await this.page.goto(`${CASHIER_BASE}/ipd/visits/${visitId}/account`);
  }

  async gotoOPDAccount(visitId: string) {
    await this.page.goto(`${CASHIER_BASE}/opd/visits/${visitId}/account`);
  }

  async gotoClaimExport(visitId: string, visitType: 'opd' | 'ipd' = 'opd') {
    await this.page.goto(`${CASHIER_BASE}/${visitType}/visits/${visitId}/claim`);
  }

  async getClaimCategoryForRow(rowIndex = 0): Promise<string | null> {
    const cells = this.page.locator(ClaimLocators.tdClaimCategory);
    return cells.nth(rowIndex).textContent();
  }

  async hasClaimCategoryColumn(): Promise<boolean> {
    return this.page.locator(ClaimLocators.thWitKanBik).isVisible();
  }

  async getCreditForRow(rowIndex = 0): Promise<string | null> {
    const cells = this.page.locator(ClaimLocators.tdCredit);
    return cells.nth(rowIndex).textContent();
  }

  async getNonBenefitForRow(rowIndex = 0): Promise<string | null> {
    const cells = this.page.locator(ClaimLocators.tdNonBenefit);
    return cells.nth(rowIndex).textContent();
  }
}
