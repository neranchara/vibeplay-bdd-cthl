import { Page, Locator } from '@playwright/test';
import { AppsLocators } from '../../../locators/new-cortex/reception/apps.locators';

const APPS_URL = 'https://dev-x.cortexcloud.co/cortex/apps';

export class AppsPage {
  readonly page: Page;
  readonly medicalRecordCard: Locator;

  constructor(page: Page) {
    this.page = page;
    this.medicalRecordCard = page.locator(AppsLocators.medicalRecordCard);
  }

  async openMedicalRecord() {
    // navigate to apps launcher ก่อนเสมอ — loginAs() อาจ land ที่ URL อื่น
    if (!this.page.url().includes('/cortex/apps')) {
      await this.page.goto(APPS_URL);
    }
    await this.medicalRecordCard.waitFor({ state: 'visible', timeout: 15000 });
    await this.medicalRecordCard.click();
    await this.page.waitForURL(/.*cortex\/medical-record/, { timeout: 15000 });
  }
}
