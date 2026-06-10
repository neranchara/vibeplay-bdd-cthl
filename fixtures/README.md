# Test Fixtures

วางไฟล์ทดสอบสำหรับ REP upload tests (CTXN-249) ไว้ที่นี่

| ชื่อไฟล์ | ใช้ใน | หมายเหตุ |
|---|---|---|
| `rep-no-match.xlsx` | TC-249-01 | REP ที่ไม่มี C claims ตรงกับระบบ |
| `rep-invalid.xlsx` | TC-249-02 | REP Excel format ผิด |
| `rep-unsupported.csv` | TC-249-03 | ไฟล์ที่ไม่ใช่ Excel format |
| `rep-valid.xlsx` | TC-249-04, TC-249-05 | REP ถูกต้อง |

> Tests ใช้ `page.route()` mock API response
> ดังนั้นไฟล์เหล่านี้เป็นแค่ dummy file — ขนาดเล็กใดก็ได้
