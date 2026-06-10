import { Page, Locator } from '@playwright/test';
import { AdvanceVisitsLocators } from '../../../locators/new-cortex/reception/advance-visits.locators';
import { BasePage } from '../../base.page';

export class AdvanceVisitsPage extends BasePage {
  readonly dateInput: Locator;
  readonly clinicSelect: Locator;
  readonly doctorSelect: Locator;
  readonly searchButton: Locator;
  readonly addButton: Locator;

  constructor(page: Page) {
    super(page);
    this.dateInput = page.locator(AdvanceVisitsLocators.appointmentDate);
    this.clinicSelect = page.locator(AdvanceVisitsLocators.clinicSelect);
    this.doctorSelect = page.locator(AdvanceVisitsLocators.doctorSelect);
    this.searchButton = page.locator(AdvanceVisitsLocators.searchButton);
    this.addButton = page.locator(AdvanceVisitsLocators.addAppointmentButton);
  }

  async goto() {
    await super.goto('/cortex/reception/advance-visits');
  }

  async searchWithFilters(date: string, clinic?: string, doctor?: string) {
    await this.fillInput(this.dateInput, date);
    if (clinic) {
      await this.selectOption(this.clinicSelect, clinic);
    }
    if (doctor) {
      await this.selectOption(this.doctorSelect, doctor);
    }
    await this.clickElement(this.searchButton);
  }
}
