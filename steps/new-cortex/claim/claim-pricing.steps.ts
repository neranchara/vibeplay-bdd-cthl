import { Page, test, expect } from '@playwright/test';
import { ClaimAccountPage } from '../../../pages/new-cortex/claim/claim-account.page';
import { ClaimLocators } from '../../../locators/new-cortex/claim/claim.locators';

export class ClaimPricingSteps {
  private accountPage: ClaimAccountPage;

  constructor(private page: Page) {
    this.accountPage = new ClaimAccountPage(page);
  }

  // TC-2083-03 / TC-2083-04
  async whenOpenIPDAccountTamSitti(visitId: string) {
    await test.step(`When open IPD account ตามสิทธิ tab for visit ${visitId}`, async () => {
      await this.accountPage.gotoIPDAccount(visitId);
      await this.accountPage.tabTamSitti.click();
      await this.page.waitForLoadState('networkidle');
    });
  }

  async thenClaimCategoryShouldBe(expected: 'D' | 'T', rowIndex = 0) {
    await test.step(`Then claim_category = "${expected}"`, async () => {
      const cell = this.page.locator(ClaimLocators.tdClaimCategory).nth(rowIndex);
      await expect(cell).toBeVisible({ timeout: 10000 });
      await expect(cell).toContainText(expected);
    });
  }

  // TC-2083-05
  async thenClaimCategoryColumnIsVisible() {
    await test.step('Then claim_category column visible (IPD)', async () => {
      await expect(this.page.locator(ClaimLocators.thWitKanBik)).toBeVisible();
    });
  }

  async thenClaimCategoryColumnIsHidden() {
    await test.step('Then claim_category column NOT visible (OPD)', async () => {
      await expect(this.page.locator(ClaimLocators.thWitKanBik)).not.toBeVisible();
    });
  }

  // TC-2083-06
  async thenForceTariffIconAndTooltipVisible() {
    await test.step('Then force_tariff info icon + tooltip visible', async () => {
      const icon = this.page.locator(ClaimLocators.infoIconForceTargiff).first();
      await expect(icon).toBeVisible();
      await icon.hover();
      await expect(this.page.locator(ClaimLocators.tooltipContent))
        .toContainText('นอกการประกาศ Tariff');
    });
  }

  // TC-2083-09
  async thenKruekachonBudgetAllocatedCorrectly(
    itemACredit: string,
    itemANonBenefit: string,
    itemBCredit: string
  ) {
    await test.step('Then ครูเอกชน budget allocated: A first, B second', async () => {
      const credits = this.page.locator(ClaimLocators.tdCredit);
      const nonBenefits = this.page.locator(ClaimLocators.tdNonBenefit);
      await expect(credits.nth(0)).toContainText(itemACredit);
      await expect(nonBenefits.nth(0)).toContainText(itemANonBenefit);
      await expect(credits.nth(1)).toContainText(itemBCredit);
    });
  }

  // TC-2083-12
  async thenClaimCategoryPersistsAfterReload() {
    await test.step('Then claim_category persists after reload', async () => {
      const before = await this.page.locator(ClaimLocators.tdClaimCategory).first().textContent();
      await this.page.reload();
      await this.accountPage.tabTamSitti.click();
      await this.page.waitForLoadState('networkidle');
      const after = await this.page.locator(ClaimLocators.tdClaimCategory).first().textContent();
      expect(before).toBe(after);
    });
  }
}
