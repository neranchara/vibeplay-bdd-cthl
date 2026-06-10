import { Page, test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/new-cortex/login/login.page';

export class LoginSteps {
  private loginPage: LoginPage;

  constructor(private page: Page) {
    this.loginPage = new LoginPage(page);
  }

  async givenUserIsOnLoginPage() {
    await test.step('Given the user is on the Cortex login page', async () => {
      await this.loginPage.goto();
    });
  }

  async whenUserLogsIn(username: string, password: string) {
    await test.step(`When the user enters credentials and logs in as "${username}"`, async () => {
      await this.loginPage.login(username, password);
    });
  }

  async thenShouldBeRedirectedToDashboard() {
    await test.step('Then they should be redirected to the applications page and the dashboard should be visible', async () => {
      // ต้องไม่อยู่ที่ /cortex/auth/ (Keycloak) หรือ /cortex/welcome อีกต่อไป
      // แต่ละ role redirect ต่างกัน: cashier→/apps, physician→/opd, nurse→/ward ฯลฯ
      await expect(this.page).toHaveURL(/\/cortex\/(?!auth|welcome)/, { timeout: 45000 });
      await expect(this.page.locator('.ant-layout-content, .ant-layout-header').first()).toBeVisible({ timeout: 30000 });
    });
  }
}
