import { test } from '@playwright/test';
import { CheckAppsSteps } from '../../../steps/new-cortex/reception/check_apps.steps';

test('Check Nutrition module', {
  tag: ['@functional', '@check-apps', '@new-cortex', '@regression']
}, async ({ page }) => {
  const steps = new CheckAppsSteps(page);

  await steps.givenUserIsLoggedInAsSuperUser();
  await steps.whenUserNavigatesToAppsPage();
  await steps.andOpensNutritionModule();
  await steps.thenShouldTakeFullPageScreenshot();
});
