import { Page, test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/new-cortex/login/login.page';
import { getUserByRole } from '../../../helpers/utils/user-roles';

export class CheckAppsSteps {
  private loginPage: LoginPage;

  constructor(private page: Page) {
    this.loginPage = new LoginPage(page);
  }

  async givenUserIsLoggedInAsSuperUser() {
    await test.step('Given the user is logged in as a super user', async () => {
      const centralUser = getUserByRole(undefined, 'super', 'new-cortex');
      await this.loginPage.goto();
      await this.loginPage.login(centralUser.username, centralUser.password);
    });
  }

  async whenUserNavigatesToAppsPage() {
    await test.step('When the user navigates to the apps page', async () => {
      await expect(this.page).toHaveURL(/.*cortex\/apps/, { timeout: 60000 });
    });
  }

  async andOpensNutritionModule() {
    await test.step('And opens the Nutrition (โภชนาการ) module', async () => {
      await this.page.click('text="โภชนาการ"');
      await this.page.waitForTimeout(3000);
    });
  }

  async thenShouldTakeFullPageScreenshot() {
    await test.step('Then they should take a full page screenshot for validation', async () => {
      await this.page.screenshot({ path: 'internal_nutrition.png', fullPage: true });
    });
  }
}
