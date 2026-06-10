import { test, expect } from '@playwright/test';
import { LoginSteps } from '../../steps/new-cortex/login/login.steps';
import { getUsersForRole } from '../../helpers/utils/user-roles';
import * as fs from 'fs';

test('Robust Scrape Medication Master DOM', async ({ page }) => {
  test.setTimeout(300000); // 5 minutes timeout

  const users = getUsersForRole(undefined, 'new-cortex');
  const user = users.find((u: any) => u.username === 'user1') || users[0];
  
  const steps = new LoginSteps(page);
  await steps.givenUserIsOnLoginPage();
  
  // Wait longer for keycloak
  await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});
  
  await steps.whenUserLogsIn(user.username, user.password);
  await steps.thenShouldBeRedirectedToDashboard();

  console.log('Logged in. Waiting for dashboard apps to load...');
  await page.waitForTimeout(10000);

  // 1. Click ห้องยา card
  console.log('Clicking ห้องยา card');
  try {
    const pharmacyCard = page.locator('div').filter({ hasText: /^ห้องยา$/ }).first();
    await pharmacyCard.waitFor({ state: 'visible', timeout: 30000 });
    await pharmacyCard.click();
  } catch (e: any) {
    console.log('Could not click ห้องยา card', e.message);
  }
  
  await page.waitForTimeout(5000);

  // 1.5 Handle "เลือกห้องยา" (Select Location) dialog
  console.log('Checking for location selection dialog...');
  try {
    // Look for the "เลือกห้องยา" header or dropdown
    const locationDialog = page.locator('text="เลือกห้องยา"').first();
    if (await locationDialog.isVisible({ timeout: 5000 })) {
        console.log('Location dialog found. Selecting "ห้อง A ชั้น 1"...');
        
        // Click the dropdown input directly with force: true
        const selectBox = page.locator('input.ant-select-input').first();
        await selectBox.click({ force: true });
        await page.waitForTimeout(2000);
        
        // Log all options found in dropdown to see what's actually there
        console.log('Scanning for dropdown options...');
        const options = page.locator('.ant-select-item, .ant-select-item-option, [role="option"]');
        const count = await options.count();
        console.log(`Found ${count} options in dropdown`);
        for (let i = 0; i < count; i++) {
            try {
                const text = await options.nth(i).innerText();
                console.log(`Option ${i}: "${text}"`);
            } catch (err: any) {
                console.log(`Option ${i} error:`, err.message);
            }
        }
        
        // Let's try filling "ห้องยา A"
        console.log('Filling room name "ห้องยา A"...');
        await selectBox.fill('ห้องยา A');
        await page.waitForTimeout(2000);
        
        let selectedOption = false;
        try {
            const roomOption = page.locator('.ant-select-item-option, [role="option"], .ant-select-item-option-content').filter({ hasText: 'ห้องยา A' }).first();
            await roomOption.waitFor({ state: 'visible', timeout: 3000 });
            await roomOption.click();
            console.log('Selected "ห้องยา A" successfully.');
            selectedOption = true;
         } catch (errOption: any) {
            console.log('Could not select "ห้องยา A", trying "ห้องยาชั้น 1"...', errOption.message);
         }

        if (!selectedOption) {
            try {
                await selectBox.fill('ห้องยาชั้น 1');
                await page.waitForTimeout(2000);
                const roomOption = page.locator('.ant-select-item-option, [role="option"], .ant-select-item-option-content').filter({ hasText: 'ห้องยาชั้น 1' }).first();
                await roomOption.waitFor({ state: 'visible', timeout: 3000 });
                await roomOption.click();
                console.log('Selected "ห้องยาชั้น 1" successfully.');
                selectedOption = true;
            } catch (errOption2: any) {
                console.log('Could not select "ห้องยาชั้น 1", trying to press Enter...', errOption2.message);
                await selectBox.press('Enter');
            }
        }
        await page.waitForTimeout(1000);
        
        // Click Submit (ส่ง) button using testid or text
        const submitBtn = page.locator('[data-testid="submit-select-location"], button:has-text("ส่ง")').first();
        await submitBtn.click();
        console.log('Submitted location selection.');
        await page.waitForTimeout(5000); // Wait for navigation after selection
    } else {
        console.log('No location dialog found, proceeding...');
    }
  } catch (e: any) {
    console.log('Error handling location dialog:', e.message);
  }

  // 2. Click the hamburger menu button based on user's hint
  console.log('Clicking hamburger menu (menu-fold)...');
  try {
    const hamburgerBtn = page.locator('button:has(.anticon-menu-fold), button:has(.anticon-menu-unfold), button[aria-label="menu-fold"], ._collapse-trigger-button_ljzrg_69').first();
    await hamburgerBtn.click({ timeout: 10000 });
    console.log('Clicked hamburger menu!');
    await page.waitForTimeout(3000); // Wait for menu animation
  } catch (e: any) {
    console.log('Could not click hamburger menu.', e.message);
  }

  // 3. Logic to find Medication Master
  console.log('Looking for Medication Master menu...');
  try {
    const medMasterMenu = page.locator('.ant-menu-title-content', { hasText: /Medication master/i }).first();
    
    // Check if it's visible within 5 seconds
    const isMedMasterVisible = await medMasterMenu.isVisible();
    
    if (!isMedMasterVisible) {
       console.log('Medication Master is not visible yet, clicking ห้องยา menu first...');
       const pharmacyMenu = page.locator('.ant-menu-title-content').filter({ hasText: /^ห้องยา$/ }).first();
       await pharmacyMenu.click({ timeout: 10000 });
       await page.waitForTimeout(2000);
    }
    
    // Now click Medication Master
    console.log('Clicking Medication master menu item');
    await medMasterMenu.waitFor({ state: 'visible', timeout: 15000 });
    await medMasterMenu.click();
    
  } catch (e: any) {
    console.log('Could not navigate to Medication master', e.message);
  }

  await page.waitForTimeout(10000);

  // 4. Click on "Create medication" or similar.
  console.log('Looking for create button');
  try {
    // Try multiple possible texts for the create button
    const createBtn = page.locator('button').filter({ hasText: /(Create|เพิ่ม|Create medication master)/i }).first();
    await createBtn.waitFor({ state: 'visible', timeout: 30000 });
    await createBtn.click();
  } catch (e: any) {
    console.log("Could not find create button.", e.message);
  }
  
  await page.waitForTimeout(10000);

  console.log('Looking for tabs to click...');
  // Based on HTML, tabs are .ant-tabs-tab
  const tabs = page.locator('.ant-tabs-tab');
  const count = await tabs.count();
  console.log(`Found ${count} tabs`);
  
  for (let i = 0; i < count; i++) {
    try {
      console.log(`Clicking tab ${i}`);
      await tabs.nth(i).click({ timeout: 5000 });
      await page.waitForTimeout(2000); // Wait for tab content to render
    } catch (err) {
      console.log(`Failed to click tab ${i}`);
    }
  }

  // Dump the DOM
  console.log('Dumping DOM...');
  const html = await page.content();
  fs.writeFileSync('/Users/neranchara/.gemini/antigravity-ide/brain/e812a6c5-5412-4893-b280-d2d93f795f1e/scratch/medication-full-tabs-dom.html', html);
  await page.screenshot({ path: '/Users/neranchara/.gemini/antigravity-ide/brain/e812a6c5-5412-4893-b280-d2d93f795f1e/scratch/medication-full.png', fullPage: true });
});
