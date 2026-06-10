import { Page, test, expect } from '@playwright/test';
import { ClaimLocators } from '../../../locators/new-cortex/claim/claim.locators';

const CASHIER_BASE = 'https://dev-x.cortexcloud.co/cashier';

export class ClaimIcd9Steps {
  constructor(private page: Page) {}

  async whenOpenOPDCodingAndAddProcedure(visitId: string) {
    await test.step(`When open OPD coding and click Add Procedure for ${visitId}`, async () => {
      await this.page.goto(`${CASHIER_BASE}/opd/visits/${visitId}/coding`);
      await this.page.locator(ClaimLocators.btnAddProcedure).click();
      await this.page.waitForLoadState('domcontentloaded');
    });
  }

  async whenSearchByPrefix(prefix: string) {
    await test.step(`When search ICD9-CM by "${prefix}"`, async () => {
      await this.page.locator(ClaimLocators.inputIcd9Search).fill(prefix);
      await this.page.waitForTimeout(600);
    });
  }

  async thenAllResultsStartWithPrefix(prefix: string) {
    await test.step(`Then all results start with "${prefix}"`, async () => {
      const options = this.page.locator(ClaimLocators.icd9Option);
      await expect(options.first()).toBeVisible({ timeout: 5000 });
      const count = await options.count();
      expect(count).toBeGreaterThan(0);
      for (let i = 0; i < Math.min(count, 10); i++) {
        const text = await options.nth(i).textContent();
        expect(text?.trim()).toMatch(new RegExp(`^${prefix}`));
      }
    });
  }

  async thenResultsAreCodeMatchesOnly(prefix: string) {
    await test.step(`Then results are code matches only (no keyword mix) for "${prefix}"`, async () => {
      const options = this.page.locator(ClaimLocators.icd9Option);
      await expect(options.first()).toBeVisible({ timeout: 5000 });
      const count = await options.count();
      for (let i = 0; i < Math.min(count, 10); i++) {
        const text = await options.nth(i).textContent();
        expect(text?.trim()).toMatch(new RegExp(`^${prefix}`));
      }
    });
  }

  async thenResultsContainKeyword(keyword: string) {
    await test.step(`Then results contain keyword "${keyword}"`, async () => {
      const options = this.page.locator(ClaimLocators.icd9Option);
      await expect(options.first()).toBeVisible({ timeout: 5000 });
      const text = await options.first().textContent();
      expect(text?.toLowerCase()).toContain(keyword.toLowerCase());
    });
  }

  async thenExactCodeIsInResults(code: string) {
    await test.step(`Then exact code "${code}" appears in results`, async () => {
      const options = this.page.locator(ClaimLocators.icd9Option);
      await expect(options.first()).toBeVisible({ timeout: 5000 });
      await expect(options.first()).toContainText(code);
    });
  }
}
