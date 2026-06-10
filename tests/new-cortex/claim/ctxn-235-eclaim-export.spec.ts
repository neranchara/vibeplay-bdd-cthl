import { test } from '@playwright/test';
import { ClaimEclaimExportSteps } from '../../../steps/new-cortex/claim/claim-eclaim-export.steps';
import { loginAs } from '../../../steps/new-cortex/shared/login-helper';

/**
 * CTXN-235: [Claim][E-Claim] Improve E-claim OPD — DRU / ADP / OOP / ORF
 *
 * ⚠️  แทนที่ REPLACE_ME:
 *   OPD_WITH_RX              = OPD Visit ที่มี Prescription (ยา)
 *   OPD_WITH_CODING          = OPD Visit ที่มี ICD9-CM OPD Coding บันทึกไว้แล้ว
 *   OPD_REFER_OUT            = OPD Visit ที่มีการ Refer Out
 *   OPD_NO_REFER             = OPD Visit ที่ไม่มี refer
 *   REFER_OUT_HOSPITAL_CODE  = รหัสโรงพยาบาลปลายทาง เช่น "10895"
 *   ICD9_CODES_IN_VISIT      = รายการ ICD9-CM codes ที่บันทึกใน OPD_WITH_CODING
 */
const TEST_DATA = {
  OPD_WITH_RX: 'REPLACE_ME',
  OPD_WITH_CODING: 'REPLACE_ME',
  OPD_REFER_OUT: 'REPLACE_ME',
  OPD_NO_REFER: 'REPLACE_ME',
  REFER_OUT_HOSPITAL_CODE: 'REPLACE_ME',
  ICD9_CODES_IN_VISIT: ['REPLACE_ME'],
};

test.describe('CTXN-235: E-Claim OPD Export — DRU, ADP, OOP, ORF', {
  tag: ['@claim', '@page-eclaim-export', '@req-CTXN-235'],
}, () => {
  let steps: ClaimEclaimExportSteps;

  test.beforeEach(async ({ page }) => {
    await loginAs(page);
    steps = new ClaimEclaimExportSteps(page);
  });

  test('TC-235-01: DRU Export — fields AMOUNT/DRUGPRICE/DRUGCOST/DIDSTD/UNIT ครบถ้วน', { tag: ['@regression', '@smoke'] }, async () => {
    await steps.whenOpenClaimExport(TEST_DATA.OPD_WITH_RX);
    const lines = await steps.whenDownloadDRU();
    await steps.thenDRUHasDataRows(lines);
    await steps.thenDRURequiredFieldsNotEmpty(lines);
  });

  test('TC-235-06: OOP Export — ICD9-CM codes ตรงกับที่บันทึกใน OPD Coding', { tag: ['@regression'] }, async () => {
    await steps.whenOpenClaimExport(TEST_DATA.OPD_WITH_CODING);
    const content = await steps.whenDownloadOOP();
    await steps.thenOOPContainsCodes(content, TEST_DATA.ICD9_CODES_IN_VISIT);
  });

  test('TC-235-07: ORF Export — Refer Out record มีรหัสโรงพยาบาลปลายทาง', { tag: ['@regression'] }, async () => {
    await steps.whenOpenClaimExport(TEST_DATA.OPD_REFER_OUT);
    const lines = await steps.whenDownloadORF();
    await steps.thenORFHasReferRecord(lines, TEST_DATA.REFER_OUT_HOSPITAL_CODE);
  });

  test('TC-235-09: ORF ว่างเปล่าเมื่อ Visit ไม่มี refer', { tag: ['@regression'] }, async () => {
    await steps.whenOpenClaimExport(TEST_DATA.OPD_NO_REFER);
    const lines = await steps.whenDownloadORF();
    await steps.thenORFIsEmpty(lines);
  });
});
