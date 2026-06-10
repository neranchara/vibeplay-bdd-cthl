import { test } from '../../../helpers/utils/fixtures';
import { AdvanceVisitsTestData } from '../../../data/advance-visits.data';

test.describe('Advance Visits (เปิด Visit ผู้ป่วยนัด) BDD Tests', () => {
  
  test.beforeEach(async ({ advanceVisitsSteps }) => {
    await advanceVisitsSteps.givenUserIsLoggedInToCortex();
  });

  test('Verify UI elements on Advance Visits page', {
    tag: ['@ui', '@advance-visits', '@new-cortex', '@regression']
  }, async ({ advanceVisitsSteps }) => {
    await advanceVisitsSteps.whenUserNavigatesToAdvanceVisits();
    await advanceVisitsSteps.thenShouldSeeActionButtons();
  });

  test('Check Filter inputs visibility', {
    tag: ['@ui', '@advance-visits', '@new-cortex', '@regression']
  }, async ({ advanceVisitsSteps }) => {
    await advanceVisitsSteps.whenUserNavigatesToAdvanceVisits();
    await advanceVisitsSteps.thenShouldSeeFilterOptions();
  });

  // Data-Driven Testing Loop
  for (const data of AdvanceVisitsTestData) {
    test(`Data-Driven Filter: ${data.testName}`, {
      tag: ['@functional', '@advance-visits', '@new-cortex', '@regression']
    }, async ({ advanceVisitsSteps }) => {
      await advanceVisitsSteps.whenUserNavigatesToAdvanceVisits();
      await advanceVisitsSteps.whenUserFillsFilters(data.targetDate, data.clinicName, data.doctorName);
      
      // Example verification if we had an expected patient name in data:
      // await advanceVisitsSteps.thenShouldSeePatientInList(data.expectedPatientName);
    });
  }
});
