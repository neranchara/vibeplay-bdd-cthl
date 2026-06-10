import { Page, Locator } from '@playwright/test';
import { BasePage } from '../../base.page';
import { CreateMedicationLocators } from '../../../locators/new-cortex/medication/create-medication.locators';

export class CreateMedicationPage extends BasePage {
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.saveButton = page.locator(CreateMedicationLocators.saveButton);
    this.cancelButton = page.locator(CreateMedicationLocators.cancelButton);
  }

  async navigateToCreatePage() {
    await this.click(CreateMedicationLocators.pharmacyMenu);
    await this.click(CreateMedicationLocators.medicationMasterSubMenu);
    await this.page.waitForLoadState('networkidle');
    await this.click(CreateMedicationLocators.createMedicationButton);
    await this.page.waitForLoadState('networkidle');
  }

  async clickTab(tabName: 'Product' | 'Price' | 'Drug' | 'Clinical / CDSS' | 'Prescription / Workflow' | 'Usage' | 'Warehouse') {
    // Simply match by tabName substring - extremely robust and ignores whitespace/Edited suffixes!
    const tabLocator = this.page.locator('[role="tab"], .ant-tabs-tab, .ant-tabs-tab-btn').filter({ 
      hasText: tabName 
    }).first();
    
    await tabLocator.waitFor({ state: 'visible', timeout: 8000 });
    await tabLocator.click();
    await this.page.waitForTimeout(1000); // Wait for tab animation/loading
  }

  // --- PRODUCT TAB METHODS ---
  async fillProductTab(data: {
    source: string;
    code: string;
    rank: string;
    tmt: string;
    thaiName: string;
    genericName: string;
    englishName?: string;
    barcode?: string;
  }) {
    // Select Source
    await this.click(CreateMedicationLocators.sourceTypeSelect);
    await this.page.locator(`.ant-select-item-option-content:has-text("${data.source}")`).first().click();
    await this.page.waitForTimeout(500);

    // Text inputs
    await this.fill(CreateMedicationLocators.medicationCodeInput, data.code);
    await this.fill(CreateMedicationLocators.rankInput, data.rank);
    await this.fill(CreateMedicationLocators.tmtTpuInput, data.tmt);
    await this.fill(CreateMedicationLocators.thaiNameInput, data.thaiName);
    await this.fill(CreateMedicationLocators.genericNameThInput, data.genericName);
    
    if (data.englishName) {
      await this.fill(CreateMedicationLocators.englishNameInput, data.englishName);
    }
    if (data.barcode) {
      await this.fill(CreateMedicationLocators.barcodeInput, data.barcode);
    }

    // Fill Medication category (Required Select)
    try {
      const catSelect = this.page.locator(CreateMedicationLocators.medicationCategorySelect).first();
      await catSelect.click({ force: true });
      await this.page.waitForTimeout(800);
      const firstOption = this.page.locator('.ant-select-item-option-content').first();
      await firstOption.waitFor({ state: 'visible', timeout: 5000 });
      await firstOption.click();
      await this.page.waitForTimeout(500);
    } catch (e: any) {
      console.log('Filling Medication Category dropdown skipped/failed:', e.message);
    }

    // Fill NLEM (Required Select when Formulary Source is NLEM)
    try {
      const nlemSelect = this.page.locator('#nlemId').first();
      if (await nlemSelect.isVisible()) {
        await nlemSelect.click({ force: true });
        await this.page.waitForTimeout(800);
        const firstOption = this.page.locator('.ant-select-item-option-content').first();
        await firstOption.waitFor({ state: 'visible', timeout: 5000 });
        await firstOption.click();
        await this.page.waitForTimeout(500);
      }
    } catch (e: any) {
      console.log('Filling NLEM dropdown skipped/failed:', e.message);
    }
  }

  // --- PRICE TAB METHODS ---
  async fillPriceTab(data: {
    unitPrice: string;
    packageQty: string;
    packageUnit?: string;
  }) {
    await this.fill(CreateMedicationLocators.defaultUnitPriceInput, data.unitPrice);
    await this.fill(CreateMedicationLocators.packageQuantityInput, data.packageQty);
    
    if (data.packageUnit) {
      await this.click(CreateMedicationLocators.packageUnitSelect);
      await this.page.locator(`.ant-select-item-option-content:has-text("${data.packageUnit}")`).first().click();
    }
  }

  // --- DRUG TAB METHODS ---
  async fillDrugTab(data: {
    strength: string;
    content: string;
    dosageForm?: string;
    route?: string;
    dispenseUnit?: string;
  }) {
    await this.fill(CreateMedicationLocators.strengthInput, data.strength);
    await this.fill(CreateMedicationLocators.contentInput, data.content);
    
    if (data.dosageForm) {
      await this.click(CreateMedicationLocators.dosageFormSelect);
      await this.page.locator(`.ant-select-item-option-content:has-text("${data.dosageForm}")`).first().click();
    }
    if (data.route) {
      await this.click(CreateMedicationLocators.administrativeRouteSelect);
      await this.page.locator(`.ant-select-item-option-content:has-text("${data.route}")`).first().click();
    }
    if (data.dispenseUnit) {
      await this.click(CreateMedicationLocators.dispenseUnitSelect);
      await this.page.locator(`.ant-select-item-option-content:has-text("${data.dispenseUnit}")`).first().click();
    }
  }

  // --- CLINICAL TAB METHODS ---
  async fillClinicalTab(data: {
    isHighAlert?: boolean;
    isChemotherapy?: boolean;
    isAddictive?: boolean;
    isWarfarin?: boolean;
  }) {
    // Switch to Drug tab where these switches are located in this UI version
    await this.clickTab('Drug');
    await this.page.waitForTimeout(500);

    const handleSwitch = async (id: string, label: string, value: boolean) => {
      const selectors = [
        this.page.getByRole('switch', { name: label, exact: true }),
        this.page.locator(`button.ant-switch:has(#${id})`),
        this.page.locator(`label[for="${id}"]`).locator('xpath=following-sibling::button[@role="switch"] | xpath=ancestor::div[contains(@class, "ant-form-item")]//button[@role="switch"]'),
        this.page.locator(`#${id}`)
      ];
      
      let el = selectors[0];
      for (const sel of selectors) {
        try {
          if (await sel.first().isVisible({ timeout: 1000 })) {
            el = sel.first();
            break;
          }
        } catch (e) {}
      }

      try {
        const isChecked = await el.getAttribute('aria-checked') === 'true' || await el.isChecked();
        if (isChecked !== value) {
          await el.click({ force: true });
        }
      } catch (e) {
        // Fallback: just click it
        await el.click({ force: true });
      }
    };

    if (data.isHighAlert !== undefined) {
      await handleSwitch('isHighAlertDrug', 'High alert drug', data.isHighAlert);
    }
    if (data.isChemotherapy !== undefined) {
      await handleSwitch('isChemotherapy', 'Chemotherapy', data.isChemotherapy);
    }
    if (data.isAddictive !== undefined) {
      await handleSwitch('isAddictive', 'Addictive', data.isAddictive);
    }
    if (data.isWarfarin !== undefined) {
      await handleSwitch('isWarfarin', 'Warfarin', data.isWarfarin);
    }

    // Switch back to Clinical / CDSS tab to continue expected flow
    await this.clickTab('Clinical / CDSS');
    await this.page.waitForTimeout(500);
  }

  // --- PRESCRIPTION TAB METHODS ---
  async fillPrescriptionTab(data: {
    maxDispense: string;
  }) {
    await this.fill(CreateMedicationLocators.maxDispenseInput, data.maxDispense);
  }

  // --- USAGE TAB METHODS ---
  async fillUsageTab(data: {
    minDay?: string;
    maxDay?: string;
    maxUsageDuration?: string;
    syntax?: string;
    instruction?: string;
  }) {
    if (data.minDay) {
      await this.fill(CreateMedicationLocators.minDayInput, data.minDay);
    }
    if (data.maxDay) {
      await this.fill(CreateMedicationLocators.maxDayInput, data.maxDay);
    }
    if (data.maxUsageDuration) {
      await this.fill(CreateMedicationLocators.maxUsageDurationInput, data.maxUsageDuration);
    }
    if (data.syntax) {
      await this.fill(CreateMedicationLocators.syntaxInput, data.syntax);
    }
    if (data.instruction) {
      await this.fill(CreateMedicationLocators.instructionInput, data.instruction);
    }
  }

  // --- WAREHOUSE TAB METHODS ---
  async fillWarehouseTab(data: {
    allowOrderWithoutStock?: boolean;
  }) {
    if (data.allowOrderWithoutStock !== undefined) {
      const el = this.page.locator(CreateMedicationLocators.allowOrderWithoutStockSwitch).first();
      try {
        const isChecked = await el.getAttribute('aria-checked') === 'true';
        if (isChecked !== data.allowOrderWithoutStock) {
          await el.click({ force: true });
        }
      } catch (e) {
        await el.click({ force: true });
      }
    }
  }

  async clickSave() {
    await this.saveButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
    await this.page.waitForTimeout(1000);
    // Handle discard confirmation modal if it appears (either modal or popconfirm)
    try {
      const confirmBtn = this.page.locator('.ant-modal-confirm-btns button.ant-btn-primary, .ant-popover button:has-text("Yes"), .ant-popconfirm button:has-text("ตกลง"), button:has-text("Yes"), button:has-text("ตกลง"), button:has-text("OK")').first();
      if (await confirmBtn.isVisible({ timeout: 3000 })) {
        console.log('Discard confirmation modal detected, clicking confirm...');
        await confirmBtn.click();
        await this.page.waitForTimeout(1000);
      }
    } catch (e: any) {
      console.log('No confirmation modal appeared, proceeding...', e.message);
    }
  }

  async getErrorMessagesCount() {
    try {
      await this.page.locator(CreateMedicationLocators.errorMessage).first().waitFor({ state: 'visible', timeout: 5000 });
    } catch (e) {
      console.log('No error messages became visible within 5s');
    }
    return await this.page.locator(CreateMedicationLocators.errorMessage).count();
  }
}
