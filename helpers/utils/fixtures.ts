import { test as baseTest } from '@playwright/test';
import { AdvanceVisitsSteps } from '../../steps/new-cortex/reception/advance-visits.steps';

type MyFixtures = {
  advanceVisitsSteps: AdvanceVisitsSteps;
};

export const test = baseTest.extend<MyFixtures>({
  advanceVisitsSteps: async ({ page }, use) => {
    await use(new AdvanceVisitsSteps(page));
  },
});

export { expect } from '@playwright/test';
