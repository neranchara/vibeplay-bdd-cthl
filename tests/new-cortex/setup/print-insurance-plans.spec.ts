import { test } from '@playwright/test';
import { getAuthToken } from '../../../helpers/api/claim-api-setup';
import { getInsurancePlans } from '../../../helpers/api/insurance-plan.api';

/**
 * รันครั้งเดียวเพื่อดู Insurance Plan IDs จริงในระบบ
 * แล้วนำไปแก้ PLAN_IDS ใน helpers/api/claim-api-setup.ts
 *
 * คำสั่ง: npm run test:new-cortex:setup
 */
test('Print all Insurance Plan IDs', async ({ browser }) => {
  const page = await browser.newPage();
  const token = await getAuthToken(page);
  const plans = await getInsurancePlans(page, token);
  await page.close();

  console.log('\n═══ Insurance Plans in dev environment ═══');
  for (const p of plans) {
    const typeInfo = [p.patientType, p.type, p.category].filter(Boolean).join('/') || '-';
    console.log(`  id=${String(p.id).padEnd(6)} code=${String(p.code ?? '').padEnd(12)} type=${typeInfo.padEnd(8)} name=${p.info?.th?.name ?? '-'}`);
  }
  console.log('══════════════════════════════════════════');
  console.log('→ ดู field "type" แล้วนำไปใช้ใน resolvePlanIds()');
});
