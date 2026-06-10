import { defineConfig, devices } from '@playwright/test';

const isHeaded  = process.env.HEADED  === 'true';
const slowMo    = parseInt(process.env.SLOWMO  ?? '0', 10);

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  retries: 0,
  reporter: 'html',
  use: {
    baseURL: 'https://dev-x.cortexcloud.co/cortex/welcome',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    navigationTimeout: 30000,
    actionTimeout: 10000,
    headless: !isHeaded,
    launchOptions: {
      slowMo,   // SLOWMO=500 ทำให้แต่ละ action ช้าลง 500ms — เห็นชัดขึ้นตอน debug
    },
    // ใส่ storageState หลัง login ครั้งแรก:
    // storageState: './auth/session.json',
  },
  projects: [
    // login setup — uncomment เมื่อจะใช้ storageState
    // { name: 'setup', testMatch: /.*auth\.setup\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      // dependencies: ['setup'],
    },
  ],
});
