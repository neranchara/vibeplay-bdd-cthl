import { test } from '@playwright/test';
import { MedicationMasterSteps } from '../../../steps/new-cortex/medication/medication-master.steps';

test.describe('Medication Master Search BDD Tests', () => {
  let steps: MedicationMasterSteps;

  test.beforeEach(async ({ page }) => {
    steps = new MedicationMasterSteps(page);
    await steps.givenUserIsLoggedInAndNavigatesToMedicationMaster();
  });

  test('Search medication by Keyword', {
    tag: ['@functional', '@medication-master', '@new-cortex', '@regression', '@search']
  }, async () => {
    await steps.whenUserEntersKeyword('Para');
    await steps.whenUserClicksFilterButton();
    await steps.thenTableShouldDisplayMatchingRecords();
  });

  test('Filter medications by Status and Attributes', {
    tag: ['@functional', '@medication-master', '@new-cortex', '@regression', '@filter']
  }, async () => {
    await steps.whenUserSelectsStatus('Active');
    await steps.whenUserSelectsHighAlert('Yes');
    await steps.whenUserClicksFilterButton();
    await steps.thenTableShouldDisplayOnlyActiveHighAlertRecords();
  });

  test('Reset search filters', {
    tag: ['@functional', '@medication-master', '@new-cortex', '@regression', '@reset']
  }, async () => {
    await steps.givenUserHasFilteredMedications();
    await steps.whenUserClicksResetButton();
    await steps.thenSearchFieldsShouldBeCleared();
    await steps.thenTableShouldDisplayAllMedicationsByDefault();
  });

  test('Navigate to Create Medication page', {
    tag: ['@ui', '@medication-master', '@new-cortex', '@regression', '@navigation']
  }, async () => {
    await steps.whenUserClicksCreateMedicationButton();
    await steps.thenCreateMedicationFormShouldBeDisplayed();
  });
});
