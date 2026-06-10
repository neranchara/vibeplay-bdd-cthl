import { Page, Locator } from '@playwright/test';
import { RegistrationLocators } from '../../../locators/new-cortex/registration/registration.locators';
import { PatientData } from '../../../helpers/utils/patient-factory';

export interface PatientFormData {
  prefix?:     string;
  firstName:   string;
  middleName?: string;
  lastName:    string;
  idCard:      string;
  birthDate?:  string;   // DD/MM/YYYY — UI format
  gender?:     'male' | 'female';
  phone?:      string;
}

/** แปลง PatientData (จาก factory) → PatientFormData (สำหรับ UI form) */
export function toFormData(p: PatientData): PatientFormData {
  return {
    prefix:     p.prefix,
    firstName:  p.firstName,
    middleName: p.middleName,
    lastName:   p.lastName,      // alias ของ familyName
    idCard:     p.idCardNo,
    birthDate:  p.birthDateUI,   // DD/MM/YYYY
    gender:     p.gender,
    phone:      p.phone,
  };
}

export class RegistrationPage {
  readonly firstNameInput:   Locator;
  readonly middleNameInput:  Locator;
  readonly lastNameInput:    Locator;
  readonly idCardInput:      Locator;
  readonly birthDateInput:   Locator;
  readonly mobilePhoneInput: Locator;
  readonly submitButton:     Locator;
  readonly cancelButton:     Locator;
  readonly validationErrors: Locator;
  readonly successNotify:    Locator;
  readonly duplicateWarning: Locator;

  constructor(private page: Page) {
    this.firstNameInput   = page.locator(RegistrationLocators.firstNameInput);
    this.middleNameInput  = page.locator(RegistrationLocators.middleNameInput);
    this.lastNameInput    = page.locator(RegistrationLocators.lastNameInput);
    this.idCardInput      = page.locator(RegistrationLocators.idCardInput);
    this.birthDateInput   = page.locator(RegistrationLocators.birthDateInput);
    this.mobilePhoneInput = page.locator(RegistrationLocators.mobilePhoneInput);
    this.submitButton     = page.locator(RegistrationLocators.submitButton);
    this.cancelButton     = page.locator(RegistrationLocators.cancelButton);
    this.validationErrors = page.locator(RegistrationLocators.validationError);
    this.successNotify    = page.locator(RegistrationLocators.successNotify);
    this.duplicateWarning = page.locator(RegistrationLocators.duplicateWarning);
  }

  async waitForFormReady() {
    await this.firstNameInput.waitFor({ state: 'visible', timeout: 15000 });
  }

  async selectNamePrefix(prefix: string) {
    const select = this.page.locator(RegistrationLocators.namePrefixSelect).first();
    await select.click();
    await this.page.locator(RegistrationLocators.namePrefixOption(prefix)).click();
  }

  async selectGender(gender: 'male' | 'female') {
    const loc = gender === 'male'
      ? RegistrationLocators.genderMaleRadio
      : RegistrationLocators.genderFemaleRadio;
    await this.page.locator(loc).first().click();
  }

  async fillForm(data: PatientFormData) {
    if (data.prefix)     await this.selectNamePrefix(data.prefix);
    if (data.firstName)  await this.firstNameInput.fill(data.firstName);
    if (data.middleName) await this.middleNameInput.fill(data.middleName);
    if (data.lastName)   await this.lastNameInput.fill(data.lastName);
    if (data.idCard)     await this.idCardInput.fill(data.idCard);
    if (data.birthDate)  await this.birthDateInput.fill(data.birthDate);
    if (data.gender)     await this.selectGender(data.gender);
    if (data.phone)      await this.mobilePhoneInput.fill(data.phone);
  }

  async submit() {
    await this.submitButton.click();
  }

  async getCreatedHN(): Promise<string> {
    await this.page.waitForURL(/\/patients\/\w+/, { timeout: 20000 });
    const match = this.page.url().match(/\/patients\/([^/?#]+)/);
    return match?.[1] ?? '';
  }
}
