import { Page, test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/new-cortex/login/login.page';
import { AppsPage } from '../../../pages/new-cortex/reception/apps.page';
import { MedicalRecordPage } from '../../../pages/new-cortex/medical-record/medical-record.page';
import { generateThaiID } from '../../../helpers/utils/test-helpers';
import { getUserByRole } from '../../../helpers/utils/user-roles';

export class MedicalRecordSteps {
  private loginPage: LoginPage;
  private appsPage: AppsPage;
  private medicalRecordPage: MedicalRecordPage;

  constructor(private page: Page) {
    this.loginPage = new LoginPage(page);
    this.appsPage = new AppsPage(page);
    this.medicalRecordPage = new MedicalRecordPage(page);
  }

  async givenUserIsLoggedInAsSuperUser() {
    await test.step('Given the user is logged in to Cortex Cloud as a super user', async () => {
      const adminUser = getUserByRole(undefined, 'super', 'new-cortex');
      await this.loginPage.goto();
      await this.loginPage.login(adminUser.username, adminUser.password);
      await expect(this.page).toHaveURL(/.*cortex\/apps/);
    });
  }

  async whenUserNavigatesToMedicalRecordApp() {
    await test.step('When the user navigates to the Medical Record application', async () => {
      await this.appsPage.openMedicalRecord();
    });
  }

  async andUserStartsCreatingNewPatient() {
    await test.step('And the user starts creating a new patient record', async () => {
      await this.medicalRecordPage.clickCreateNewPatient();
    });
  }

  async andFillsPatientInformation() {
    await test.step('And fills in the patient name, last name, and a generated ID card number', async () => {
      const randomID = generateThaiID();
      await this.medicalRecordPage.fillPatientInfo('TestName', 'TestLastName', randomID);
    });
  }

  async thenPatientInformationShouldBeCorrect() {
    await test.step('Then the input fields should display the entered patient information correctly', async () => {
      await expect(this.medicalRecordPage.firstNameInput).toHaveValue('TestName');
      const filledID = await this.medicalRecordPage.idCardInput.inputValue();
      expect(filledID.length).toBe(13);
    });
  }
}
