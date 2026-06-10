export const CreateMedicationLocators = {
  // Navigation
  pharmacyMenu: 'text="ห้องยา"',
  medicationMasterSubMenu: 'text="Medication master"',
  createMedicationButton: 'button:has-text("Create medication")',

  // Tabs
  tabProduct: '.ant-tabs-tab-btn:has-text("Product")',
  tabPrice: '.ant-tabs-tab-btn:has-text("Price")',
  tabDrug: '.ant-tabs-tab-btn:has-text("Drug")',
  tabClinical: '.ant-tabs-tab-btn:has-text("Clinical / CDSS")',
  tabPrescription: '.ant-tabs-tab-btn:has-text("Prescription / Workflow")',
  tabUsage: '.ant-tabs-tab-btn:has-text("Usage")',
  tabWarehouse: '.ant-tabs-tab-btn:has-text("Warehouse")',

  // --- PRODUCT TAB ---
  sourceTypeSelect: '#sourceType',
  medicationCodeInput: '#code',
  rankInput: '#rank',
  tmtTpuInput: '#tmtTPU',
  tmtGpInput: '#tmtGP',
  erpCodeInput: '#erpCode',
  barcodeInput: '#barcode',
  thaiNameInput: '#infoTHName',
  englishNameInput: '#infoENName',
  genericNameThInput: '#genericNameTH',
  genericNameEnInput: '#genericName',
  medicationCategorySelect: '#medicationCategoryId',
  manufacturerSelect: '#manufacturerId',
  formularySourceSelect: '#formularySource',

  // --- PRICE TAB ---
  defaultUnitPriceInput: '#defaultUnitPrice',
  packageQuantityInput: '#packageQuantity',
  packageUnitSelect: '#packageUnitId',

  // --- DRUG TAB ---
  strengthInput: '#strength',
  contentInput: '#content',
  dosageFormSelect: '#dosageFormId',
  administrativeRouteSelect: '#administrativeRouteId',
  dispenseUnitSelect: '#dispenseUnitId',
  prescribeUnitSelect: '#prescribeUnitId',

  // --- CLINICAL / CDSS TAB ---
  isHighAlertDrugSwitch: 'button.ant-switch:has(#isHighAlertDrug), label:has(#isHighAlertDrug) .ant-switch',
  isChemotherapySwitch: 'button.ant-switch:has(#isChemotherapy), label:has(#isChemotherapy) .ant-switch',
  isAddictiveSwitch: 'button.ant-switch:has(#isAddictive), label:has(#isAddictive) .ant-switch',
  isPsychotropicSubstanceSwitch: 'button.ant-switch:has(#isPsychotropicSubstance), label:has(#isPsychotropicSubstance) .ant-switch',
  isWarfarinSwitch: 'button.ant-switch:has(#isWarfarin), label:has(#isWarfarin) .ant-switch',

  // --- PRESCRIPTION / WORKFLOW TAB ---
  maxDispenseInput: '#maxDispensePerVisit',

  // --- USAGE TAB ---
  minDayInput: '#minDay',
  maxDayInput: '#maxDay',
  maxUsageDurationInput: '#maxUsageDuration',
  syntaxInput: '#syntaxSuggestions_0_syntax',
  instructionInput: '#syntaxSuggestions_0_instruction',

  // --- WAREHOUSE TAB ---
  allowOrderWithoutStockSwitch: 'button.ant-switch:has(#allowOrderWithoutStock), label:has(#allowOrderWithoutStock) .ant-switch',

  // Buttons inside form
  saveButton: 'button.ant-btn-primary:has-text("Save"):not(:has-text("draft"))',
  cancelButton: 'button:has-text("Back")',
  
  // Validation messages
  errorMessage: '.ant-form-item-explain-error, .ant-alert, .ant-message-notice, .ant-notification-notice',
};
