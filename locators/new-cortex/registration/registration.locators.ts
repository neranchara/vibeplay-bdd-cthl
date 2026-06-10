export const RegistrationLocators = {
  // ── Create patient form ───────────────────────────────────────────────────────
  // คำนำหน้า (Ant Design Select)
  namePrefixSelect: '[data-testid="name-prefix"], .ant-select:has-text("คำนำหน้า"), .ant-select:has-text("นาย")',
  namePrefixOption: (text: string) => `.ant-select-item-option:has-text("${text}")`,

  // ชื่อ / ชื่อกลาง / นามสกุล
  firstNameInput:  'input[placeholder="ชื่อ"]',
  middleNameInput: 'input[placeholder="ชื่อกลาง"]',
  lastNameInput:   'input[placeholder="นามสกุล"]',

  // เลขบัตร
  idCardInput: 'input[placeholder="รหัสบัตรประชาชน/Passport"]',

  // วันเกิด (Ant Design DatePicker)
  birthDateInput: 'input[placeholder="วว/ดด/ปปปป"], [data-testid="birth-date"] input',

  // เพศ (Radio)
  genderMaleRadio:   'input[value="male"],   [data-testid="gender-male"]',
  genderFemaleRadio: 'input[value="female"], [data-testid="gender-female"]',

  // ที่อยู่ / ติดต่อ
  mobilePhoneInput: 'input[placeholder="เบอร์โทรศัพท์มือถือ"], [data-testid="mobile-phone"]',

  // ── Buttons ───────────────────────────────────────────────────────────────────
  submitButton: 'button:has-text("บันทึก")',
  cancelButton: 'button:has-text("ยกเลิก")',

  // ── Feedback ──────────────────────────────────────────────────────────────────
  // Ant Design validation error (below each form item)
  validationError: '.ant-form-item-explain-error, .ant-form-item-explain-connected',
  // Global notification / alert
  successNotify: '.ant-notification-notice-success, .ant-message-success',
  // Duplicate ID warning
  duplicateWarning: '.ant-modal-confirm, .ant-notification-notice-error, [role="alert"]:has-text("มีอยู่"), [role="alert"]:has-text("ซ้ำ")',
};
