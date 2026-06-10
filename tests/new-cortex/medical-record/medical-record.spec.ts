import { test } from '@playwright/test';
import { MedicalRecordSteps } from '../../../steps/new-cortex/medical-record/medical-record.steps';

test.describe('Medical Record Module BDD Tests', () => {
  test('Create a new patient with random ID', {
    tag: ['@functional', '@medical-record', '@new-cortex', '@regression']
  }, async ({ page }) => {
    const steps = new MedicalRecordSteps(page);

    await steps.givenUserIsLoggedInAsSuperUser();
    await steps.whenUserNavigatesToMedicalRecordApp();
    await steps.andUserStartsCreatingNewPatient();
    await steps.andFillsPatientInformation();
    await steps.thenPatientInformationShouldBeCorrect();
  });
});
