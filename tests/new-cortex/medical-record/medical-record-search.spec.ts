import { test } from '@playwright/test';
import { MedicalRecordSearchSteps } from '../../../steps/new-cortex/medical-record/medical-record-search.steps';

test.describe('Medical Record Search BDD Tests', () => {
  let steps: MedicalRecordSearchSteps;

  test.beforeEach(async ({ page }) => {
    steps = new MedicalRecordSearchSteps(page);
    await steps.givenUserIsLoggedInAndNavigatesToMedicalRecord();
  });

  test('Verify search fields presence from UI', {
    tag: ['@ui', '@medical-record-search', '@new-cortex', '@regression']
  }, async () => {
    await steps.thenShouldSeeAllSearchFields();
  });

  test('Perform search by HN', {
    tag: ['@functional', '@medical-record-search', '@new-cortex', '@regression']
  }, async () => {
    const testHN = '1234567';
    await steps.whenUserSearchesByHN(testHN);
  });

  test('Clear search results', {
    tag: ['@functional', '@medical-record-search', '@new-cortex', '@regression']
  }, async () => {
    await steps.whenUserFillsSearchHN('9999999');
    await steps.andClicksClearSearch();
    await steps.thenSearchHNShouldBeEmpty();
  });
});
