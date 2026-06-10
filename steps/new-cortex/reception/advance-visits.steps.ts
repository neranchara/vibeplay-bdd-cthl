import { Page, test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/new-cortex/login/login.page';
import { AdvanceVisitsPage } from '../../../pages/new-cortex/reception/advance-visits.page';
import { getUserByRole } from '../../../helpers/utils/user-roles';

export class AdvanceVisitsSteps {
  private loginPage: LoginPage;
  private advanceVisitsPage: AdvanceVisitsPage;

  constructor(private page: Page) {
    this.loginPage = new LoginPage(page);
    this.advanceVisitsPage = new AdvanceVisitsPage(page);
  }

  async givenUserIsLoggedInToCortex() {
    await test.step('Given the user is logged in to Cortex Cloud', async () => {
      const adminUser = getUserByRole(undefined, 'super', 'new-cortex');
      await this.loginPage.goto();
      await this.loginPage.login(adminUser.username, adminUser.password);
    });
  }

  async whenUserNavigatesToAdvanceVisits() {
    await test.step('When they navigate to the Advance Visits page', async () => {
      await this.advanceVisitsPage.goto();
    });
  }

  async thenShouldSeeActionButtons() {
    await test.step('Then they should see the active URL and the action buttons', async () => {
      await expect(this.page).toHaveURL(/.*advance-visits/);
      await expect(this.advanceVisitsPage.addButton).toBeVisible();
      await expect(this.advanceVisitsPage.searchButton).toBeVisible();
    });
  }

  async thenShouldSeeFilterOptions() {
    await test.step('Then they should see filter options for Date, Clinic, and Doctor', async () => {
      await expect(this.advanceVisitsPage.dateInput).toBeVisible();
      await expect(this.advanceVisitsPage.clinicSelect).toBeVisible();
      await expect(this.advanceVisitsPage.doctorSelect).toBeVisible();
    });
  }

  async whenUserFillsFilters(date: string, clinic?: string, doctor?: string) {
    await test.step(`When user fills filters: Date=${date}, Clinic=${clinic}, Doctor=${doctor}`, async () => {
      await this.advanceVisitsPage.searchWithFilters(date, clinic, doctor);
    });
  }

  async thenShouldSeePatientInList(patientName: string) {
    await test.step(`Then they should see patient "${patientName}" in the result list`, async () => {
      const { AdvanceVisitsLocators } = await import('../../../locators/new-cortex/reception/advance-visits.locators');
      const row = this.page.locator(AdvanceVisitsLocators.patientRow(patientName));
      await expect(row).toBeVisible();
    });
  }
}
