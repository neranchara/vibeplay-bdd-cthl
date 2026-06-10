import { getUsersForRole } from '../helpers/utils/user-roles';

// This setup can be used to generate storage states for different users
// To use this, you would configure it in playwright.config.ts dependencies

/*
const setupUsers = process.env.USER_ROLE
  ? getUsersForRole(process.env.USER_ROLE, process.env.SITE)
  : getUsersForRole(undefined, process.env.SITE);

for (const user of setupUsers) {
  const authFile = path.join(__dirname, `../.auth/${user.username}.json`);

  setup(`authenticate as ${user.username}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(user.username, user.password);
    await expect(page).toHaveURL(/.*cortex\/apps/);
    await page.context().storageState({ path: authFile });
  });
}
*/
