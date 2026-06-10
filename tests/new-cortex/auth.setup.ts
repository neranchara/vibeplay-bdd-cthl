import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../../pages/new-cortex/login/login.page';
import { getUserByRole } from '../../helpers/utils/user-roles';
import { mkdirSync } from 'fs';

export const SESSION_FILE = '.auth/new-cortex-super.json';

setup('new-cortex: login as super user', async ({ page }) => {
  mkdirSync('.auth', { recursive: true });

  const user = getUserByRole('super', 'super', 'new-cortex');
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(user.username, user.password);
  await expect(page).toHaveURL(/\/cortex\/(?!auth|welcome)/, { timeout: 45000 });

  await page.context().storageState({ path: SESSION_FILE });
});
