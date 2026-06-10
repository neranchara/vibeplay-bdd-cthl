export const AdvanceVisitsLocators = {
  // Filters
  appointmentDate: 'input[placeholder="เลือกวันที่"]',
  clinicSelect: '.ant-select:has-text("เลือกคลินิก")',
  doctorSelect: '.ant-select:has-text("เลือกแพทย์")',
  
  // Buttons
  searchButton: 'button:has-text("ค้นหา")',
  clearButton: 'button:has-text("Clear")',
  addAppointmentButton: 'button:has-text("เพิ่มนัดหมาย")',
  
  // Page Title (for verification)
  pageTitle: 'h1:has-text("เปิด Visit ผู้ป่วยนัด")',

  // Dynamic Locators
  patientRow: (patientName: string) => `tr:has-text("${patientName}")`,
  tableCell: (text: string) => `td:has-text("${text}")`,
};
