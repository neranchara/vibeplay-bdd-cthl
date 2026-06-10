import { Page, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/new-cortex/login/login.page';
import { getUserByRole } from '../../../helpers/utils/user-roles';

/**
 * Login helper สำหรับ claim/cashier tests
 * ใช้ใน beforeEach ของ spec ที่ต้องการ session ก่อนเข้าหน้า /cashier/...
 */
export async function loginAs(page: Page, role = 'super', site = 'new-cortex') {
  const user = getUserByRole(role, 'super', site);
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(user.username, user.password);
  await expect(page).toHaveURL(/\/cortex\/(?!auth|welcome)/, { timeout: 45000 });
}
