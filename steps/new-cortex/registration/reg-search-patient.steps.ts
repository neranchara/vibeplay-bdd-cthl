import { Page, test, expect } from '@playwright/test';
import { AppsPage } from '../../../pages/new-cortex/reception/apps.page';
import { MedicalRecordPage } from '../../../pages/new-cortex/medical-record/medical-record.page';

export class RegSearchPatientSteps {
  private appsPage: AppsPage;
  private mrPage:   MedicalRecordPage;

  constructor(private page: Page) {
    this.appsPage = new AppsPage(page);
    this.mrPage   = new MedicalRecordPage(page);
  }

  // ── Given ─────────────────────────────────────────────────────────────────────

  async givenOnMedicalRecordSearchPage() {
    await test.step('Given user is on Medical Record search page', async () => {
      await this.appsPage.openMedicalRecord();
      await this.mrPage.searchButton.waitFor({ state: 'visible', timeout: 15000 });
    });
  }

  // ── When: Search ──────────────────────────────────────────────────────────────

  async whenSearchByHN(hn: string) {
    await test.step(`When search by HN="${hn}"`, async () => {
      await this.mrPage.searchByHN(hn);
    });
  }

  async whenSearchByName(name: string) {
    await test.step(`When search by name="${name}"`, async () => {
      await this.mrPage.searchByName(name);
    });
  }

  async whenSearchByIDCard(idCard: string) {
    await test.step(`When search by ID card="${idCard}"`, async () => {
      await this.mrPage.searchByIDCard(idCard);
    });
  }

  async whenSearchByPhone(phone: string) {
    await test.step(`When search by phone="${phone}"`, async () => {
      await this.mrPage.searchByPhone(phone);
    });
  }

  async whenFillHNAndClear(hn: string) {
    await test.step(`When fill HN="${hn}" then click clear`, async () => {
      await this.mrPage.searchHNInput.fill(hn);
      await this.mrPage.clearSearch();
    });
  }

  // ── Then ──────────────────────────────────────────────────────────────────────

  // MR-013: All search fields present
  async thenAllSearchFieldsVisible() {
    await test.step('Then all search input fields and buttons should be visible', async () => {
      await expect(this.mrPage.searchHNInput).toBeVisible();
      await expect(this.mrPage.searchNameInput).toBeVisible();
      await expect(this.mrPage.searchIDCardInput).toBeVisible();
      await expect(this.mrPage.searchPhoneInput).toBeVisible();
      await expect(this.mrPage.searchVNInput).toBeVisible();
      await expect(this.mrPage.searchANInput).toBeVisible();
      await expect(this.mrPage.searchButton).toBeVisible();
      await expect(this.mrPage.clearButton).toBeVisible();
    });
  }

  // MR-006, MR-007, MR-008: Patient found in results
  async thenPatientFoundInResults(expectedText: string) {
    await test.step(`Then patient "${expectedText}" should appear in results`, async () => {
      await expect(this.mrPage.searchResultTable).toBeVisible({ timeout: 10000 });
      const rows = this.mrPage.iframe.locator('.ant-table-row');
      await expect(rows.first()).toBeVisible({ timeout: 10000 });
      const tableText = await this.mrPage.searchResultTable.textContent();
      expect(tableText).toContain(expectedText);
    });
  }

  // MR-015: Clear search
  async thenSearchFieldsCleared() {
    await test.step('Then HN search field should be empty after clear', async () => {
      await expect(this.mrPage.searchHNInput).toHaveValue('');
    });
  }
}
