import { Page, test, expect } from '@playwright/test';
import * as fs from 'fs';
import { ClaimAccountPage } from '../../../pages/new-cortex/claim/claim-account.page';

export class ClaimEclaimExportSteps {
  private accountPage: ClaimAccountPage;

  constructor(private page: Page) {
    this.accountPage = new ClaimAccountPage(page);
  }

  async whenOpenClaimExport(visitId: string) {
    await test.step(`When open E-Claim export for OPD visit ${visitId}`, async () => {
      await this.accountPage.gotoClaimExport(visitId, 'opd');
    });
  }

  async whenDownloadDRU(): Promise<string[]> {
    let lines: string[] = [];
    await test.step('When download DRU file', async () => {
      const [download] = await Promise.all([
        this.page.waitForEvent('download'),
        this.accountPage.btnExportDRU.click(),
      ]);
      const content = fs.readFileSync((await download.path())!, 'utf-8');
      lines = content.split('\n').filter(l => l.trim());
    });
    return lines;
  }

  async thenDRUHasDataRows(lines: string[]) {
    await test.step('Then DRU has data rows', async () => {
      expect(lines.length).toBeGreaterThan(1);
    });
  }

  async thenDRURequiredFieldsNotEmpty(lines: string[]) {
    await test.step('Then DRU fields AMOUNT/DRUGPRICE/DRUGCOST/DIDSTD/UNIT not empty', async () => {
      const d = lines[1];
      expect(d.substring(0, 12).trim()).toBeTruthy();   // AMOUNT 12B
      expect(d.substring(12, 26).trim()).toBeTruthy();  // DRUGPRICE 14B
      expect(d.substring(26, 40).trim()).toBeTruthy();  // DRUGCOST 14B
      expect(d.substring(40, 64).trim()).toBeTruthy();  // DIDSTD 24B
      expect(d.substring(64, 84).trim()).toBeTruthy();  // UNIT 20B
    });
  }

  async whenDownloadOOP(): Promise<string> {
    let content = '';
    await test.step('When download OOP file', async () => {
      const [download] = await Promise.all([
        this.page.waitForEvent('download'),
        this.accountPage.btnExportOOP.click(),
      ]);
      content = fs.readFileSync((await download.path())!, 'utf-8');
    });
    return content;
  }

  async thenOOPContainsCodes(content: string, codes: string[]) {
    await test.step('Then OOP contains all expected ICD9-CM codes', async () => {
      for (const code of codes) {
        expect(content).toContain(code);
      }
    });
  }

  async whenDownloadORF(): Promise<string[]> {
    let lines: string[] = [];
    await test.step('When download ORF file', async () => {
      const [download] = await Promise.all([
        this.page.waitForEvent('download'),
        this.accountPage.btnExportORF.click(),
      ]);
      const content = fs.readFileSync((await download.path())!, 'utf-8');
      lines = content.split('\n').filter(l => l.trim());
    });
    return lines;
  }

  async thenORFHasReferRecord(lines: string[], hospitalCode: string) {
    await test.step(`Then ORF has refer record with hospital code "${hospitalCode}"`, async () => {
      expect(lines.length).toBeGreaterThan(1);
      expect(lines[1]).toContain(hospitalCode);
    });
  }

  async thenORFIsEmpty(lines: string[]) {
    await test.step('Then ORF is empty (no data rows)', async () => {
      expect(lines.length).toBeLessThanOrEqual(1);
    });
  }
}
