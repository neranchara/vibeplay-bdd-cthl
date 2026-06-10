import { test } from '@playwright/test';
import { CreateMedicationSteps } from '../../../steps/new-cortex/medication/create-medication.steps';

test.describe('Create Medication BDD Tests', () => {
  test.setTimeout(120000); // 2 minutes per test for navigation-heavy flows
  let steps: CreateMedicationSteps;

  test.beforeEach(async ({ page }) => {
    steps = new CreateMedicationSteps(page);
    await steps.givenUserIsLoggedInAndNavigatesToCreateMedication();
  });

  test('Validate required fields when creating medication', {
    tag: ['@validation', '@medication-master', '@create-medication', '@new-cortex', '@regression']
  }, async () => {
    await steps.whenUserClicksSaveButtonWithoutFillingData();
    await steps.thenSystemShouldDisplayErrorMessagesForRequiredFields();
    await steps.thenMedicationDataShouldNotBeSaved();
  });

  test('Create a medication by filling minimum required fields', {
    tag: ['@functional', '@medication-master', '@create-medication', '@new-cortex', '@smoke', '@regression']
  }, async () => {
    await steps.whenUserSelectsSource('Local');
    await steps.whenUserFillsRequiredFields(
      'M-PARA-500', // Code
      '1',          // Rank
      '1234567890', // TMT
      'พาราเซตามอล 500 มก.', // Thai Name
      'พาราเซตามอล' // Generic Name
    );
    // Warehouse tab setting (required by system backend to allow save)
    await steps.whenUserClicksOnTab('Warehouse');
    await steps.whenUserFillsWarehouseTab(true);

    await steps.whenUserClicksSaveButton();
    await steps.thenSystemShouldSaveDataSuccessfully();
    await steps.thenUserShouldBeRedirectedBackToMedicationMasterList();
  });

  test('Create a medication with comprehensive details across all tabs', {
    tag: ['@functional', '@medication-master', '@create-medication', '@new-cortex', '@regression']
  }, async () => {
    // Tab 1: Product
    await steps.whenUserSelectsSource('Local');
    await steps.whenUserFillsRequiredFields(
      'M-PARA-1000', // Code
      '1',           // Rank
      '1234567890',  // TMT
      'พาราเซตามอล 1000 มก.', // Thai Name
      'พาราเซตามอล'  // Generic Name
    );

    // Tab 2: Price
    await steps.whenUserClicksOnTab('Price');
    await steps.whenUserFillsPriceTab('10.5', '10');

    // Tab 3: Drug
    await steps.whenUserClicksOnTab('Drug');
    await steps.whenUserFillsDrugTab('1000 mg', 'Paracetamol 1000mg');

    // Tab 4: Clinical / CDSS
    await steps.whenUserClicksOnTab('Clinical / CDSS');
    await steps.whenUserFillsClinicalTab(true, false);

    // Tab 5: Prescription / Workflow
    await steps.whenUserClicksOnTab('Prescription / Workflow');
    await steps.whenUserFillsPrescriptionTab('100');

    // Tab 6: Usage
    await steps.whenUserClicksOnTab('Usage');
    await steps.whenUserFillsUsageTab('1', '30', '1 tab oral daily', 'รับประทานครั้งละ 1 เม็ด วันละครั้ง');

    // Tab 7: Warehouse
    await steps.whenUserClicksOnTab('Warehouse');
    await steps.whenUserFillsWarehouseTab(true);

    // Save & Verify
    await steps.whenUserClicksSaveButton();
    await steps.thenSystemShouldSaveDataSuccessfully();
    await steps.thenUserShouldBeRedirectedBackToMedicationMasterList();
  });

  test('Cancel medication creation', {
    tag: ['@ui', '@medication-master', '@create-medication', '@new-cortex', '@regression']
  }, async () => {
    await steps.whenUserFillsSomeData();
    await steps.whenUserClicksCancelButton();
    await steps.thenUserShouldBeRedirectedBackToMedicationMasterList();
  });
});
