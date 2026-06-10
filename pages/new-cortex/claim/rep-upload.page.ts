import { Page, Locator } from '@playwright/test';
import { ClaimLocators } from '../../../locators/new-cortex/claim/claim.locators';

const CASHIER_BASE = 'https://dev-x.cortexcloud.co/cashier';

export class RepUploadPage {
  readonly inputFile: Locator;
  readonly btnUpload: Locator;
  readonly snackbarError: Locator;
  readonly snackbarSuccess: Locator;

  constructor(private page: Page) {
    this.inputFile = page.locator(ClaimLocators.inputFileUpload);
    this.btnUpload = page.locator(ClaimLocators.btnUpload);
    this.snackbarError = page.locator(ClaimLocators.snackbarError);
    this.snackbarSuccess = page.locator(ClaimLocators.snackbarSuccess);
  }

  async goto() {
    await this.page.goto(`${CASHIER_BASE}/claim/rep-upload`);
  }

  async uploadFile(filePath: string) {
    await this.inputFile.setInputFiles(filePath);
    await this.btnUpload.click();
  }

  async mockApiResponse(status: number, errorCode: string) {
    await this.page.route('**/api/rep/upload', route =>
      route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify({ error: errorCode }),
      })
    );
  }

  async mockApiSuccess() {
    await this.page.route('**/api/rep/upload', route =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    );
  }
}
