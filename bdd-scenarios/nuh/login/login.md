# BDD Scenarios: Login (NUH)

พื้นที่สำหรับทีม QA ในการดูตัวอย่าง ออกแบบ และบันทึกเคสทดสอบรูปแบบ Given-When-Then ของระบบเข้าสู่ระบบหลักไซต์ NUH โดยมีการใช้ตัวแปรพารามิเตอร์ (Parameters) ในการทดสอบแบบหลากหลายสิทธิ์ (Roles)

---

## 1. เคสทดสอบที่ผ่านการเขียนสคริปต์อัตโนมัติแล้ว (Automated Scenarios)

### 🚩 Scenario Outline: การเข้าสู่ระบบของไซต์ NUH ด้วยผู้ใช้งานสิทธิ์ต่างๆ (Dynamic Login)
*คำอธิบาย:* ตรวจสอบการเข้าสู่ระบบสำเร็จตามแต่ละสิทธิ์ที่มีในระบบ โดยดึงข้อมูลชุดบัญชีผู้ใช้และรหัสผ่านตามพารามิเตอร์ที่กำหนด

* **Given** ผู้ใช้งานเปิดหน้าเว็บไซต์เข้าสู่ระบบของ NUH (`Given the user is on the NUH login page`)
* **When** ผู้ใช้งานกรอกชื่อผู้ใช้และรหัสผ่านเพื่อเข้าสู่ระบบเป็น **"<username>"** (`When the user enters credentials and logs in as "<username>"`)
* **Then** หน้าจอระบบจะต้องนำทางไปยังหน้ารวมแอปพลิเคชันโดยอัตโนมัติ และแถบเมนูหลักของระบบจะต้องปรากฏขึ้นอย่างชัดเจน (`Then they should be redirected to the applications page and the dashboard should be visible`)

### 📊 ตารางการตรวจสอบพารามิเตอร์ (Parameter Reference Table)

| ชื่อพารามิเตอร์ | ประเภทข้อมูล | แหล่งที่มาของข้อมูล | ตัวอย่างค่าในการรันระบบ | คำอธิบายการทำงานในโค้ด |
| :--- | :--- | :--- | :--- | :--- |
| **`<username>`** | String (อีเมล/ชื่อผู้ใช้) | ไฟล์คอนฟิก [users.nuh.json](file:///Users/neranchara/Jobs/Vibe%20code%20Automate%20Test/data/users.nuh.json) | `super_nuh@cortex.com`, `admin_nuh@cortex.com` | ถูกแมปไปยังฟังก์ชัน `loginPage.login(username, password)` ในสเต็ป |
| **`<password>`** | String (รหัสผ่าน) | ไฟล์คอนฟิก [users.nuh.json](file:///Users/neranchara/Jobs/Vibe%20code%20Automate%20Test/data/users.nuh.json) | *(ตามข้อมูลในไฟล์ผู้ใช้)* | ถูกป้อนเข้าฟิลด์รหัสผ่านและกดคลิกเข้าสู่ระบบอัตโนมัติ |

> [!NOTE]
> **การควบคุมสิทธิ์ผ่านสคริปต์การรัน:** 
> ทีม QA สามารถเลือกทดสอบสิทธิ์เฉพาะเจาะจงผ่าน Command Line ได้ เช่น:
> - `npm run site:module nuh login -- --role super` (สิทธิ์ Super Admin)
> - `npm run site:module nuh login -- --role admin` (สิทธิ์ Admin ทั่วไป)

---

## 2. พื้นที่สำหรับ QA ออกแบบเคสทดสอบใหม่ (QA Backlog / Draft Scenarios)

> [!TIP]
> ทีม QA สามารถคัดลอกโครงสร้างตัวอย่างด้านล่างนี้ เพื่อเพิ่มเคสทดสอบใหม่ในโมดูล Login ได้ทันที

### Scenario: [ระบุรหัสเคส - เช่น LG-NUH-002] [ระบุชื่อเคสทดสอบ เช่น การแจ้งเตือนเมื่อรหัสผ่านผิด]
* **Given** ผู้ใช้งานเปิดหน้าเว็บไซต์เข้าสู่ระบบของ NUH
* **When** ผู้ใช้งานกรอกชื่อผู้ใช้เป็น **"<invalid_username>"** และรหัสผ่านเป็น **"<invalid_password>"**
* **And** คลิกปุ่มเข้าสู่ระบบ (Sign In Button)
* **Then** ระบบจะต้องแสดงข้อความแจ้งเตือนข้อผิดพลาด **"<error_message>"** สีแดงบนหน้าจอ
* **And** ระบบจะต้องไม่อนุญาตให้ผู้ใช้งานผ่านเข้าไปยังหน้าแอปพลิเคชันได้

