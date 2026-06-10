import { Page, Locator } from '@playwright/test';
import { LoginLocators } from '../../../locators/new-cortex/login/login.locators';

export class LoginPage {
  readonly page: Page;
  readonly welcomeLoginButton: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeLoginButton = page.locator(LoginLocators.welcomeLoginButton);
    this.usernameInput = page.locator(LoginLocators.usernameInput);
    this.passwordInput = page.locator(LoginLocators.passwordInput);
    this.loginButton = page.locator(LoginLocators.loginButton);
  }

  async goto() {
    await this.page.goto('/cortex/welcome');
  }

  async login(username: string, password: string) {
    // 1. Wait for page to be ready
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});

    // 2. Handle Welcome Page — ลอง click ปุ่ม "ลงชื่อเข้าใช้" ถ้ามี
    //    ถ้าไม่มี (ไปถึง Keycloak โดยตรง) ก็ข้ามไป
    //    ไม่ใช้ Promise.race() เพราะ losing promise ยังคง run ค้างอยู่
    const welcomeBtn = this.page.locator('button:has-text("ลงชื่อเข้าใช้")');
    try {
      await welcomeBtn.waitFor({ state: 'visible', timeout: 10000 });
      console.log('Welcome page detected, clicking login button...');
      await welcomeBtn.click();
    } catch {
      console.log('No welcome button — already on Keycloak login page.');
    }

    // 3. รอ Keycloak login form (single waitFor — ไม่ซ้อน)
    await this.usernameInput.waitFor({ state: 'visible', timeout: 30000 });

    // 4. Login
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();

    // 5. รอ redirect — รับทุก path ภายใต้ /cortex/ เพราะแต่ละ role อาจถูก redirect ไปต่างกัน
    await this.page.waitForURL(/\/cortex\//, { timeout: 45000 }).catch(() => {});
  }

  async isVisible() {
    return await this.usernameInput.isVisible();
  }
}
