import { Page, Locator } from '@playwright/test';
import { AppsLocators } from '../../../locators/new-cortex/reception/apps.locators';

const MEDICAL_RECORD_URL = 'https://dev-x.cortexcloud.co/cortex/medical-record';

export class AppsPage {
  readonly page: Page;
  readonly medicalRecordCard: Locator;

  constructor(page: Page) {
    this.page = page;
    this.medicalRecordCard = page.locator(AppsLocators.medicalRecordCard);
  }

  async openMedicalRecord() {
    await this.page.goto(MEDICAL_RECORD_URL);
    await this.page.waitForURL(/.*cortex\/medical-record/, { timeout: 15000 });
  }
}
