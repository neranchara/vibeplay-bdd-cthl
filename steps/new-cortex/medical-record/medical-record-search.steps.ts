import { Page, test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/new-cortex/login/login.page';
import { AppsPage } from '../../../pages/new-cortex/reception/apps.page';
import { MedicalRecordPage } from '../../../pages/new-cortex/medical-record/medical-record.page';
import { getUserByRole } from '../../../helpers/utils/user-roles';

export class MedicalRecordSearchSteps {
  private loginPage: LoginPage;
  private appsPage: AppsPage;
  private medicalRecordPage: MedicalRecordPage;

  constructor(private page: Page) {
    this.loginPage = new LoginPage(page);
    this.appsPage = new AppsPage(page);
    this.medicalRecordPage = new MedicalRecordPage(page);
  }

  async givenUserIsLoggedInAndNavigatesToMedicalRecord() {
    await test.step('Given the user is logged in and navigates to the Medical Record app', async () => {
      const adminUser = getUserByRole(undefined, 'super', 'new-cortex');
      await this.loginPage.goto();
      await this.loginPage.login(adminUser.username, adminUser.password);
      await this.appsPage.openMedicalRecord();
    });
  }

  async thenShouldSeeAllSearchFields() {
    await test.step('Then they should see all core search input fields and query buttons', async () => {
      await expect(this.medicalRecordPage.searchHNInput).toBeVisible();
      await expect(this.medicalRecordPage.searchNameInput).toBeVisible();
      await expect(this.medicalRecordPage.searchButton).toBeVisible();
      await expect(this.medicalRecordPage.clearButton).toBeVisible();
    });
  }

  async whenUserSearchesByHN(testHN: string) {
    await test.step(`When they search for a patient using HN "${testHN}"`, async () => {
      await this.medicalRecordPage.searchByHN(testHN);
    });
  }

  async whenUserFillsSearchHN(hn: string) {
    await test.step(`When they input a query into the HN search field`, async () => {
      await this.medicalRecordPage.searchHNInput.fill(hn);
    });
  }

  async andClicksClearSearch() {
    await test.step('And click the Clear search button', async () => {
      await this.medicalRecordPage.clearSearch();
    });
  }

  async thenSearchHNShouldBeEmpty() {
    await test.step('Then the HN input field should be completely empty', async () => {
      await expect(this.medicalRecordPage.searchHNInput).toHaveValue('');
    });
  }
}
