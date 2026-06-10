import { test } from '@playwright/test';
import { ClaimPricingSteps } from '../../../steps/new-cortex/claim/claim-pricing.steps';

/**
 * CTXN-2083: [Cashier][Pricing] คำนวณราคา / credit / เบิกได้ / เบิกไม่ได้ IPD, ครูเอกชน
 *
 * ⚠️  แทนที่ REPLACE_ME ด้วย visit IDs จริงใน dev environment:
 *   IPD_DRG_VISIT_ID     = IPD visit สปสช/ข้าราชการ (ipd_benefit_type=DRG, ไม่มี per-unit config)
 *   IPD_TARIFF_VISIT_ID  = IPD visit สกส ที่มี per-unit benefit config
 *   IPD_FORCE_TARIFF_ID  = IPD visit ที่มี force_tariff=true ใน benefit item
 *   OPD_VISIT_ID         = OPD visit ใดก็ได้ (negative test)
 *   IPD_KRUEKACHON_ID    = IPD visit ครูเอกชน: budget=10, ItemA(price=100,limit=50), ItemB(price=20,limit=10)
 */
const TEST_DATA = {
  IPD_DRG_VISIT_ID: 'REPLACE_ME',
  IPD_TARIFF_VISIT_ID: 'REPLACE_ME',
  IPD_FORCE_TARIFF_ID: 'REPLACE_ME',
  OPD_VISIT_ID: 'REPLACE_ME',
  IPD_KRUEKACHON_ID: 'REPLACE_ME',
};

test.describe('CTXN-2083: IPD Pricing — claim_category, force_tariff, ครูเอกชน Budget', {
  tag: ['@claim', '@page-ipd-pricing', '@req-CTXN-2083'],
}, () => {
  let steps: ClaimPricingSteps;

  test.beforeEach(async ({ page }) => {
    steps = new ClaimPricingSteps(page);
  });

  test('TC-2083-03: claim_category = D เมื่อใช้ DRG fallback', { tag: ['@regression'] }, async () => {
    await steps.whenOpenIPDAccountTamSitti(TEST_DATA.IPD_DRG_VISIT_ID);
    await steps.thenClaimCategoryShouldBe('D');
  });

  test('TC-2083-04: claim_category = T เมื่อมี per-unit benefit config', { tag: ['@regression'] }, async () => {
    await steps.whenOpenIPDAccountTamSitti(TEST_DATA.IPD_TARIFF_VISIT_ID);
    await steps.thenClaimCategoryShouldBe('T');
  });

  test('TC-2083-05: claim_category column แสดงใน IPD เท่านั้น ไม่แสดงใน OPD', { tag: ['@regression'] }, async () => {
    const accountPage = (steps as any).accountPage;

    await steps.whenOpenIPDAccountTamSitti(TEST_DATA.IPD_DRG_VISIT_ID);
    await steps.thenClaimCategoryColumnIsVisible();

    await accountPage.gotoOPDAccount(TEST_DATA.OPD_VISIT_ID);
    await accountPage.tabTamSitti.click();
    await steps.thenClaimCategoryColumnIsHidden();
  });

  test('TC-2083-06: force_tariff = true → info icon + tooltip "นอกการประกาศ Tariff"', { tag: ['@regression'] }, async () => {
    await steps.whenOpenIPDAccountTamSitti(TEST_DATA.IPD_FORCE_TARIFF_ID);
    await steps.thenClaimCategoryShouldBe('T');
    await steps.thenForceTariffIconAndTooltipVisible();
  });

  test('TC-2083-09: ครูเอกชน shared budget — Item A credit=10, Item B credit=0', { tag: ['@regression'] }, async () => {
    await steps.whenOpenIPDAccountTamSitti(TEST_DATA.IPD_KRUEKACHON_ID);
    await steps.thenKruekachonBudgetAllocatedCorrectly('10', '90', '0');
  });

  test('TC-2083-12: claim_category snapshot คงอยู่หลัง page reload', { tag: ['@regression'] }, async () => {
    await steps.whenOpenIPDAccountTamSitti(TEST_DATA.IPD_DRG_VISIT_ID);
    await steps.thenClaimCategoryPersistsAfterReload();
  });
});
