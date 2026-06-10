import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { setupTokenListener } from './auth.api';
import { createPatientViaAPI } from './patient.api';
import { assignPatientCoverageViaAPI } from './coverage.api';
import { getInsurancePlans, InsurancePlan } from './insurance-plan.api';
import { LoginPage } from '../../pages/new-cortex/login/login.page';
import { getUserByRole } from '../utils/user-roles';

// ── ไฟล์ที่ใช้เก็บข้อมูลคนไข้ที่สร้างจาก API ──────────────────────────────
const SEEDED_DATA_PATH = path.join(__dirname, '../../data/new-cortex/seeded-patients.json');

// ── Dynamic plan ID resolution ────────────────────────────────────────────────
// หา plan ID จริงจาก environment แทนการ hardcode ป้องกัน FK constraint error
async function resolvePlanIds(page: Page, token: string) {
  const plans = await getInsurancePlans(page, token);
  if (plans.length === 0) throw new Error('[API Setup] No insurance plans found in this environment');

  console.log('[API Setup] Available insurance plans:');
  plans.forEach(p =>
    console.log(`  id=${String(p.id).padEnd(6)} code=${String(p.code ?? '').padEnd(12)} name=${p.info?.th?.name ?? '-'}`)
  );

  const find = (...keywords: string[]): InsurancePlan | undefined =>
    plans.find(p =>
      keywords.some(kw =>
        (p.code ?? '').toLowerCase().includes(kw.toLowerCase()) ||
        (p.info?.th?.name ?? '').includes(kw)
      )
    );

  const nhso    = find('NHSO', 'สปสช', 'H99', '30บาท');
  const nhsoIpd = find('NHSO_IPD', 'สปสช.IPD') ?? find('IPD', 'ผู้ป่วยใน') ?? nhso;

  if (!nhso) {
    const list = plans.map(p => `  id=${p.id} code=${p.code} name=${p.info?.th?.name}`).join('\n');
    throw new Error(
      `[API Setup] ไม่พบ NHSO/สปสช plan ใน environment นี้\nPlans ที่มี:\n${list}\n` +
      `→ แก้ keyword ใน resolvePlanIds() ให้ตรงกับ code/name จริง`
    );
  }

  const resolved = {
    NHSO_OPD:    nhso.id,
    NHSO_IPD:    (nhsoIpd ?? nhso).id,
    CIVIL:       (find('ข้าราชการ', 'CIVIL', 'CIV') ?? nhso).id,
    KRUEKACHON:  (find('ครูเอกชน', 'ครู', 'KRUEKACHON') ?? nhso).id,
  };

  console.log(`[API Setup] Resolved plan IDs: NHSO_OPD=${resolved.NHSO_OPD} NHSO_IPD=${resolved.NHSO_IPD} CIVIL=${resolved.CIVIL} KRUEKACHON=${resolved.KRUEKACHON}`);
  return resolved;
}

export interface SeededPatient {
  hn: string;
  name: string;       // firstName ที่ใช้ค้นหา
  idCardNo: string;
  role: string;       // เช่น 'zero_budget_opd', 'nhso_opd' ฯลฯ
  createdAt: string;
}

export interface SeededPatientsFile {
  lastUpdated: string;
  patients: SeededPatient[];
}

// ── Load seeded data จากไฟล์ (ถ้ามี) ────────────────────────────────────────
export function loadSeededPatients(): SeededPatientsFile | null {
  try {
    if (fs.existsSync(SEEDED_DATA_PATH)) {
      return JSON.parse(fs.readFileSync(SEEDED_DATA_PATH, 'utf-8'));
    }
  } catch {
    // ignore
  }
  return null;
}

// ── Save seeded data ลงไฟล์ ──────────────────────────────────────────────────
function saveSeededPatients(data: SeededPatientsFile) {
  const dir = path.dirname(SEEDED_DATA_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(SEEDED_DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`[API Setup] Saved patient data → ${SEEDED_DATA_PATH}`);
}

// ── Get token ด้วยการ login ──────────────────────────────────────────────────
export async function getAuthToken(page: Page): Promise<string> {
  const tokenHelper = setupTokenListener(page);
  const user = getUserByRole('super', 'super', 'new-cortex');
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(user.username, user.password);

  let token = tokenHelper.getBearerToken();
  if (!token) {
    await page.waitForTimeout(3000);
    token = tokenHelper.getBearerToken();
  }
  if (!token) throw new Error('[API Setup] Cannot capture Bearer token after login');
  return token;
}

// ── สร้างคนไข้ + assign coverage แล้ว save HN ────────────────────────────────
export async function seedPatientWithCoverage(
  page: Page,
  token: string,
  role: string,
  planId: number,
  coverageValue = '123',
  runningNumber = Date.now() % 100000
): Promise<SeededPatient> {
  const patient = await createPatientViaAPI(page, token, runningNumber);
  await assignPatientCoverageViaAPI(page, token, patient.hn, planId, coverageValue);

  const seeded: SeededPatient = {
    hn: patient.hn,
    name: patient.firstName,
    idCardNo: patient.idCardNo,
    role,
    createdAt: new Date().toISOString(),
  };

  console.log(`[API Setup] Created patient | role=${role} | HN=${patient.hn} | name=${patient.firstName}`);
  return seeded;
}

// ── Setup ครบวงจรสำหรับ CTXN-2081 ───────────────────────────────────────────
export interface Ctxn2081Context {
  patientZeroBudget: SeededPatient;
  patientWithBudget: SeededPatient;
  patientZeroIPD:    SeededPatient;
  patientNhsoIPD:    SeededPatient;
}

export async function setupCtxn2081(page: Page, token: string): Promise<Ctxn2081Context> {
  const planIds = await resolvePlanIds(page, token);
  const base = Date.now() % 100000;

  // Sequential เพราะ Demographic API ไม่รองรับ concurrent requests
  const zeroBudget = await seedPatientWithCoverage(page, token, 'zero_budget_opd', planIds.NHSO_OPD, '0',   base + 1);
  const withBudget = await seedPatientWithCoverage(page, token, 'with_budget_opd', planIds.NHSO_OPD, '123', base + 2);
  const zeroIPD    = await seedPatientWithCoverage(page, token, 'zero_budget_ipd', planIds.NHSO_IPD, '0',   base + 3);
  const nhsoIPD    = await seedPatientWithCoverage(page, token, 'nhso_ipd',        planIds.NHSO_IPD, '123', base + 4);

  // Save ลงไฟล์
  const existing = loadSeededPatients() ?? { lastUpdated: '', patients: [] };
  const newPatients = [zeroBudget, withBudget, zeroIPD, nhsoIPD];
  const updated: SeededPatientsFile = {
    lastUpdated: new Date().toISOString(),
    patients: [...existing.patients, ...newPatients],
  };
  saveSeededPatients(updated);

  return {
    patientZeroBudget: zeroBudget,
    patientWithBudget: withBudget,
    patientZeroIPD:    zeroIPD,
    patientNhsoIPD:    nhsoIPD,
  };
}
