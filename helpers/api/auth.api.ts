import { Page } from '@playwright/test';

/**
 * ดัก Bearer token จาก request headers ระหว่าง login
 * ต้อง call ก่อน login เสมอ
 */
export function setupTokenListener(page: Page) {
  let token = '';

  page.on('request', (request) => {
    const auth = request.headers()['authorization'];
    if (auth?.toLowerCase().startsWith('bearer ')) {
      const extracted = auth.substring(7).trim();
      if (extracted) token = extracted;
    }
  });

  return {
    getBearerToken: () => token,
  };
}
