import { Page } from '@playwright/test';
import { buildPatient, PatientData, PatientOptions } from '../utils/patient-factory';

export type PatientOverrides = PatientOptions;

const DEMOGRAPHIC_API = 'https://dev-x.cortexcloud.co/new-demographic-api/patients';

export interface CreatedPatient {
  hn:         string;
  idCardNo:   string;
  firstName:  string;
  familyName: string;
  data:       PatientData;  // ข้อมูลทั้งหมดที่ใช้สร้าง (สำหรับ UI search ในภายหลัง)
}

/**
 * สร้างคนไข้ 1 คนผ่าน Demographic API
 * รับ PatientOptions (เหมือนกับ buildPatient) หรือ PatientData โดยตรง
 */
export async function createPatientViaAPI(
  page:    Page,
  token:   string,
  input:   PatientOptions | PatientData | number = {},
): Promise<CreatedPatient> {

  // รองรับทั้งการส่ง running number (backward compat), options object, หรือ PatientData สำเร็จ
  let data: PatientData;
  if (typeof input === 'number') {
    data = buildPatient({ runningNumber: input });
  } else if ('birthDate' in input && 'birthDateUI' in input) {
    data = input as PatientData;
  } else {
    data = buildPatient(input as PatientOptions);
  }

  const payload = {
    mode: data.mode,
    identityVerificationModeExpire: '',
    isCreateVVIP: data.isCreateVVIP ?? false,
    gender: data.gender,
    namePrefixCode: data.namePrefixCode,
    birthDate: data.birthDate,
    officialAddress:          { name: '', line: '', stateCode: '', districtCode: '', cityCode: '', postalCode: '' },
    currentAddress:           { name: '', line: '', stateCode: '', districtCode: '', cityCode: '', postalCode: '' },
    workAddress:              { name: '', line: '', stateCode: '', districtCode: '', cityCode: '', postalCode: '' },
    informationGiverContact:  { categoryCode: '1' },
    firstName:    data.firstName,  firstNameEN:  '',
    middleName:   data.middleName, middleNameEN: '',
    familyName:   data.familyName, familyNameEN: '',
    deceased:     false,
    lineId: '', email: '',
    mobilePhone:  data.phone ?? '',
    homePhone:    '',
    primaryLanguage: 'TH',
    birthPlace: { name: '', line: '', stateCode: '', districtCode: '', cityCode: '', postalCode: '' },
    idCardNo: data.idCardNo,
  };

  // Demographic API รับ multipart/form-data โดยส่ง JSON เป็น field ชื่อ "data"
  const response = await page.request.post(DEMOGRAPHIC_API, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
    multipart: { data: JSON.stringify(payload) },
  });

  if (!response.ok()) {
    const body = await response.text();
    throw new Error(`createPatientViaAPI failed [${response.status()}]: ${body}`);
  }

  const json = await response.json();
  const hn   = json.data?.hn || json.data?.patientId || json.hn || json.id;
  if (!hn) throw new Error(`Cannot extract HN from response: ${JSON.stringify(json)}`);

  return { hn, idCardNo: data.idCardNo, firstName: data.firstName, familyName: data.familyName, data };
}

/**
 * สร้างคนไข้หลายคน sequential (Demographic API ไม่รองรับ concurrent)
 */
export async function seedMultiplePatients(
  page:    Page,
  token:   string,
  count = 5,
  options: PatientOptions = {},
): Promise<CreatedPatient[]> {
  const base = Math.floor(Date.now() / 1000) % 100000;
  const results: CreatedPatient[] = [];
  for (let i = 1; i <= count; i++) {
    results.push(await createPatientViaAPI(page, token, { ...options, runningNumber: base + i }));
  }
  return results;
}
