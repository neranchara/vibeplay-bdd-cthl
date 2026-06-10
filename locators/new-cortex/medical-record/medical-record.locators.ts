export const MedicalRecordLocators = {
  // ── iframe ────────────────────────────────────────────────────────────────────
  iframe: 'iframe',

  // ── Search fields (inside iframe) ────────────────────────────────────────────
  searchHN:     '[data-testid="hn"]',
  searchName:   '[data-testid="name"]',
  searchIDCard: '[data-testid="cid"]',
  searchPhone:  '[data-testid="phoneNumber"]',
  searchVN:     '[data-testid="vn"]',
  searchAN:     '[data-testid="an"]',
  searchWard:   '.ant-select:has-text("วอร์ด")',
  searchDoctor: '.ant-select:has-text("แพทย์")',
  searchZipCode:'[data-testid="postalCode"]',

  // ── Search action buttons (inside iframe) ─────────────────────────────────────
  searchButton:           '[data-testid="search-button"]',
  clearButton:            '[data-testid="clear-button"]',
  readCardButton:         'button:has-text("อ่านบัตร")',
  createNewPatientButton: '[data-testid="create-patient-button"]',

  // ── Search results (inside iframe) ────────────────────────────────────────────
  searchResultTable:  '.ant-table',
  searchResultRow:    '.ant-table-row',
  emptyResult:        '.ant-empty, [data-testid="empty-state"]',

  // ── Sidebar navigation (inside iframe) ───────────────────────────────────────
  sidebarCollapseBtn: 'button:has([aria-label="menu-fold"]), button:has([aria-label="menu-unfold"])',

  // ── Tabs / States (inside iframe) ────────────────────────────────────────────
  activeTab:           '[data-testid="tab-trigger-activated"]',
  deactivatedTab:      '[data-testid="tab-trigger-deactivated"]',
  idleState:           '[data-testid="idle-state"]',
  patientSearchActive: '[data-testid="patient-search-activate"]',
};
