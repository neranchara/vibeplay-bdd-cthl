export const AppsLocators = {
  // card อาจใช้ div/span ธรรมดา ไม่ใช่ ant-card-meta-title — ใช้ text match แทน
  medicalRecordCard: '[class*="card"]:has-text("เวชระเบียน"), .ant-card:has-text("เวชระเบียน"), span:has-text("เวชระเบียน")',
  layoutContent: '.ant-layout-content',
};
