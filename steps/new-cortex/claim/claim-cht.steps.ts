import { Page, test, expect } from '@playwright/test';
import { ClaimLocators } from '../../../locators/new-cortex/claim/claim.locators';

const CASHIER_BASE = 'https://dev-x.cortexcloud.co/cashier';

export class ClaimChtSteps {
  constructor(private page: Page) {}

  async whenOpenClaimPreview(visitId: string) {
    await test.step(`When open claim preview for visit ${visitId}`, async () => {
      await this.page.goto(`${CASHIER_BASE}/ipd/visits/${visitId}/claim/preview`);
      await this.page.waitForLoadState('networkidle');
    });
  }

  async thenInvoiceNoEqualsApprovalCode() {
    await test.step('Then CHT.INVOICE_NO = approval code', async () => {
      const invoiceNo = this.page.locator(ClaimLocators.chtInvoiceNo);
      const approvalCodes = this.page.locator(ClaimLocators.approvalCodesDisplay);
      await expect(invoiceNo).toBeVisible();
      const approvalText = await approvalCodes.textContent();
      await expect(invoiceNo).toHaveText(approvalText!.trim());
    });
  }

  async thenInvoiceNoEqualsVN() {
    await test.step('Then CHT.INVOICE_NO = VN', async () => {
      const invoiceNo = this.page.locator(ClaimLocators.chtInvoiceNo);
      const vn = this.page.locator(ClaimLocators.visitVN);
      await expect(invoiceNo).toBeVisible();
      const vnText = await vn.textContent();
      await expect(invoiceNo).toHaveText(vnText!.trim());
    });
  }
}
