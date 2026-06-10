# สรุปทักษะและข้อกำหนดของโปรเจกต์ (Project Skills & Requirements)

ไฟล์นี้จัดทำขึ้นเพื่อบันทึกทักษะ เทคโนโลยี และข้อกำหนดต่างๆ ที่เราตกลงกันไว้สำหรับโปรเจกต์ vibeplay-bdd-cthl (Cortex - HLab Automation Test)

## 🛠 ทักษะและเทคโนโลยีที่ใช้ (Skills & Technologies)

- **Playwright**: เครื่องมือหลักสำหรับการทำ End-to-End (E2E) Testing
- **TypeScript**: ภาษาที่ใช้เขียนสคริปต์เพื่อให้โค้ดมีความปลอดภัยและจัดการง่าย
- **โครงสร้างโปรเจกต์แบบแยกส่วน (Modular Structure)**:
    - **Locators (`locators/`)**: แยกส่วนการเก็บ Selector (ID, CSS, XPath) ออกจากตัวโค้ดหลัก เพื่อให้ง่ายต่อการแก้ไขหากมีการเปลี่ยนแปลง UI
    - **Page Objects (`pages/`)**: เก็บฟังก์ชันการทำงาน (Actions) โดยเรียกใช้ Locators จากไฟล์ภายนอก
    - **Utilities (`utils/`)**: เก็บฟังก์ชันส่วนกลางที่ใช้ซ้ำได้บ่อยๆ เช่น การสุ่มเลขบัตรประชาชน หรือการจัดการวันที่
    - **Test Scripts (`tests/`)**: เขียนสคริปต์การทดสอบโดยเรียกใช้ Page Objects
    - **Test Data (`data/`)**: เก็บข้อมูลที่ใช้ในการทดสอบ เช่น รายชื่อผู้ใช้ ในรูปแบบ JSON

## 📋 ข้อกำหนดของโปรเจกต์ (Project Requirements)

### เว็บไซต์เป้าหมาย (Target Website)
- **Central**: `https://dev-x.cortexcloud.co/cortex/apps`
- **NUH**: `https://cortex-nuh-new.cortexcloud.co/cortex/apps`

### รายชื่อผู้ใช้สำหรับการทดสอบ (Test Credentials)
เรามีผู้ใช้ทั้งหมด 9 รายการ ดังนี้:

| ลำดับ | Username | Password | Permission |
| :--- | :--- | :--- | :--- |
| 1 | hlab-1 | 123456 | - |
| 2 | nurse-1 | 123456 | - |
| 3 | phy-1 | 123456 | - |
| 4 | reception-1 | 123456 | - |
| 5 | phar-1 | 123456 | - |
| 6 | cashier-1 | 123456 | - |
| 7 | coder-1 | 123456 | - |
| 8 | it-1 | 123456 | - |
| 9 | user1 | MyPassw0rd | Super User |

### รายการทดสอบ (Test Cases)
1. **Login Verification**: ผู้ใช้ทุกคนต้องสามารถเข้าสู่ระบบผ่าน Keycloak ได้สำเร็จ
2. **Medical Record Flow**: ทดสอบการเข้าสู่โมดูลเวชระเบียน และการเปิดฟอร์มสร้างประวัติผู้ป่วยใหม่ด้วยบัญชี Super User
3. **Role-Based Testing**: (แผนในอนาคต) ตรวจสอบสิทธิ์การเข้าถึงโมดูลต่างๆ ตามประเภทผู้ใช้
