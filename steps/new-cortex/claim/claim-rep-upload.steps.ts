import { Page, test, expect } from '@playwright/test';
import * as path from 'path';
import { RepUploadPage } from '../../../pages/new-cortex/claim/rep-upload.page';
import { ClaimLocators } from '../../../locators/new-cortex/claim/claim.locators';

export class ClaimRepUploadSteps {
  private repUploadPage: RepUploadPage;

  constructor(private page: Page) {
    this.repUploadPage = new RepUploadPage(page);
  }

  async whenOpenRepUploadPage() {
    await test.step('When navigate to REP Upload page', async () => {
      await this.repUploadPage.goto();
    });
  }

  async whenUploadWithMockedError(filename: string, httpStatus: number, errorCode: string) {
    await test.step(`When upload "${filename}" mocked as "${errorCode}"`, async () => {
      await this.repUploadPage.mockApiResponse(httpStatus, errorCode);
      await this.repUploadPage.uploadFile(
        path.join(__dirname, '../../../fixtures', filename)
      );
    });
  }

  async whenUploadWithMockedSuccess(filename: string) {
    await test.step(`When upload "${filename}" mocked as success`, async () => {
      await this.repUploadPage.mockApiSuccess();
      await this.repUploadPage.uploadFile(
        path.join(__dirname, '../../../fixtures', filename)
      );
    });
  }

  async thenSnackbarShowsNoClaimsMessage() {
    await test.step('Then snackbar: ไม่พบรายการเบิกใน REP ที่ตรงกับในระบบ', async () => {
      await expect(this.page.locator(ClaimLocators.snackbarError))
        .toContainText('ไม่พบรายการเบิกใน REP ที่ตรงกับในระบบ', { timeout: 8000 });
    });
  }

  async thenSnackbarShowsInvalidFormatMessage() {
    await test.step('Then snackbar: REP excel format ไม่ถูกต้อง', async () => {
      await expect(this.page.locator(ClaimLocators.snackbarError))
        .toContainText('REP excel format ไม่ถูกต้อง', { timeout: 8000 });
    });
  }

  async thenSnackbarShowsContactAdminMessage() {
    await test.step('Then snackbar: ไม่สามารถนำเข้า REP ได้ กรุณาติดต่อ Administrator', async () => {
      await expect(this.page.locator(ClaimLocators.snackbarError))
        .toContainText('ไม่สามารถนำเข้า REP ได้ กรุณาติดต่อ Administrator', { timeout: 8000 });
    });
  }

  async thenSnackbarShowsSuccess() {
    await test.step('Then success snackbar shown', async () => {
      await expect(this.page.locator(ClaimLocators.snackbarSuccess)).toBeVisible({ timeout: 8000 });
    });
  }
}
