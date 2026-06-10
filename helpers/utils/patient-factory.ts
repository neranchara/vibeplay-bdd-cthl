import { generateThaiID } from './test-helpers';

// ── Name prefix mapping ───────────────────────────────────────────────────────
const PREFIX_MAP: Record<string, { code: string; display: string }> = {
  male:   { code: '003', display: 'นาย' },
  female: { code: '002', display: 'นาง' },
};

// ── Output type ───────────────────────────────────────────────────────────────
export interface PatientData {
  runningNumber: number;

  // Identity
  mode:    string;    // 'cid'
  idCardNo: string;   // 13-digit Thai ID (checksum valid)

  // Name — API uses namePrefixCode + familyName, UI uses prefix + lastName
  namePrefixCode:    { code: string };  // API: { code: '003' }
  prefix:            string;            // UI:  'นาย'
  firstName:         string;            // 'automate f{n}'
  middleName:        string;            // 'automate m{n}'
  familyName:        string;            // API field name
  lastName:          string;            // UI field name (same value)

  // Demographics
  gender:      'male' | 'female';
  age:         number;
  birthDate:   string;   // YYYY-MM-DD  ← API format
  birthDateUI: string;   // DD/MM/YYYY  ← UI placeholder "วว/ดด/ปปปป"

  // Contact (optional)
  phone?: string;
}

export interface PatientOptions {
  runningNumber?: number;
  idCardNo?:      string;
  gender?:        'male' | 'female';
  prefix?:        string;
  firstName?:     string;
  middleName?:    string;
  familyName?:    string;
  age?:           number;         // ถ้าระบุ birthDate จะถูกคำนวณจาก age นี้
  birthDate?:     string;         // YYYY-MM-DD ถ้าระบุตรงนี้ age จะถูก override
  phone?:         string;
}

/**
 * สร้างข้อมูลคนไข้จำลอง 1 ชุด
 * ใช้ได้ทั้ง API (createPatientViaAPI) และ UI form (fillForm)
 *
 * @example
 * const p = buildPatient();
 * await createPatientViaAPI(page, token, p);       // ใช้ p โดยตรง
 * await regPage.fillForm(p);                        // ใช้ p โดยตรง
 *
 * @example override บางส่วน
 * const p = buildPatient({ gender: 'female', age: 30 });
 */
export function buildPatient(options: PatientOptions = {}): PatientData {
  const n      = options.runningNumber ?? Math.floor(Date.now() / 1000) % 100000;
  const gender = options.gender ?? 'male';
  const meta   = PREFIX_MAP[gender];

  // ── Birth date ──────────────────────────────────────────────────────────────
  let birthDate: string;
  let age:       number;

  if (options.birthDate) {
    birthDate = options.birthDate;
    const birthYear = parseInt(birthDate.split('-')[0], 10);
    age = new Date().getFullYear() - birthYear;
  } else {
    age = options.age ?? (Math.floor(Math.random() * 41) + 20); // 20-60
    const birthYear = new Date().getFullYear() - age;
    birthDate = `${birthYear}-01-01`;
  }

  // DD/MM/YYYY สำหรับ UI input placeholder "วว/ดด/ปปปป"
  const [y, m, d] = birthDate.split('-');
  const birthDateUI = `${d}/${m}/${y}`;

  // ── Names ───────────────────────────────────────────────────────────────────
  const firstName  = options.firstName  ?? `automate f${n}`;
  const middleName = options.middleName ?? `automate m${n}`;
  const familyName = options.familyName ?? `automate l${n}`;

  return {
    runningNumber:  n,
    mode:           'cid',
    idCardNo:       options.idCardNo ?? generateThaiID(),
    namePrefixCode: { code: options.prefix ? '' : meta.code },
    prefix:         options.prefix ?? meta.display,
    firstName,
    middleName,
    familyName,
    lastName:       familyName,
    gender,
    age,
    birthDate,
    birthDateUI,
    phone: options.phone,
  };
}

/**
 * สร้างคนไข้หลายคนพร้อมกัน — runningNumber เพิ่มทีละ 1
 */
export function buildPatients(count: number, baseOptions: PatientOptions = {}): PatientData[] {
  const base = baseOptions.runningNumber ?? Math.floor(Date.now() / 1000) % 100000;
  return Array.from({ length: count }, (_, i) =>
    buildPatient({ ...baseOptions, runningNumber: base + i + 1 })
  );
}
