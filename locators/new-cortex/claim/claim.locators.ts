export const ClaimLocators = {
  // Account Console tabs
  tabTamSitti: '[role="tab"]:has-text("ตามสิทธิ")',
  tabRaikan: '[role="tab"]:has-text("รายการ")',

  // claim_category column
  thWitKanBik: 'th:has-text("วิธีการเบิก")',
  tdClaimCategory: 'td[data-col="claim_category"], [data-testid="claim-category-cell"]',
  infoIconForceTargiff: '.anticon-info-circle',
  tooltipContent: '.ant-tooltip-inner',

  // Add Item Modal
  btnAddItem: 'button:has-text("เพิ่มรายการ"), button:has-text("Add Item")',
  modalAddItem: '.ant-modal:has-text("เพิ่มรายการ"), [data-testid="add-item-modal"]',
  thClaimCategoryModal: '.ant-modal th:has-text("วิธีการเบิก")',

  // Coverage / credit columns
  tdCredit: 'td[data-col="credit"], [data-testid="credit-cell"]',
  tdNonBenefit: 'td[data-col="non_benefit"], [data-testid="non-benefit-cell"]',

  // Admission History
  thAuthCode: 'th:has-text("Auth Code")',
  thEndpointCode: 'th:has-text("Endpoint Code")',
  thApprovalCodes: 'th:has-text("Approval Codes")',
  tdApprovalCodes: 'td[data-col="approval_codes"]',

  // Visit / Admission forms
  btnCreateVisit: 'button:has-text("สร้าง Visit"), button:has-text("Create Visit")',
  btnAdmit: 'button:has-text("Admit"), button:has-text("รับผู้ป่วย")',
  btnSave: 'button:has-text("บันทึก"), button:has-text("Save")',
  inputPatientSearch: 'input[placeholder*="ค้นหาผู้ป่วย"], input[placeholder*="patient"]',
  btnRequestAuthCode: 'button:has-text("ขอ Auth Code"), button:has-text("Request Auth")',
  inputAuthCode: 'input[data-testid="auth-code-input"], input[placeholder*="Auth Code"]',
  formErrorMsg: '.ant-form-item-explain-error',
  messageError: '.ant-message-error',
  messageSuccess: '.ant-message-success',

  // CHT INVOICE_NO
  chtInvoiceNo: '[data-testid="cht-invoice-no"], [data-field="CHT_INVOICE_NO"]',
  visitVN: '[data-testid="visit-vn"]',
  approvalCodesDisplay: '[data-testid="approval-codes"]',

  // ICD9-CM Search
  inputIcd9Search: 'input[placeholder*="ICD9"], input[placeholder*="ค้นหา"]',
  icd9Option: '[data-testid="icd9-option"], .ant-select-item-option',
  btnAddProcedure: 'button:has-text("เพิ่ม Procedure"), button:has-text("Add ICD9")',

  // REP Upload
  inputFileUpload: 'input[type="file"]',
  btnUpload: 'button:has-text("Upload"), button:has-text("นำเข้า")',
  snackbarError: '.ant-message-error .ant-message-custom-content, .ant-notification-notice-message',
  snackbarSuccess: '.ant-message-success .ant-message-custom-content',

  // E-Claim Export buttons
  btnExportDRU: 'button:has-text("DRU"), [data-testid="export-dru"]',
  btnExportADP: 'button:has-text("ADP"), [data-testid="export-adp"]',
  btnExportOOP: 'button:has-text("OOP"), [data-testid="export-oop"]',
  btnExportORF: 'button:has-text("ORF"), [data-testid="export-orf"]',
};
