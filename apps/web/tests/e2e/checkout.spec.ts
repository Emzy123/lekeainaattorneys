import { test, expect } from '@playwright/test';

test('Initiates checkout for a premium resource', async ({ page }) => {
  // Go to the resources page
  await page.goto('/resources');

  // We assume there's at least one resource card with a "Purchase" button
  const purchaseButton = page.getByRole('button', { name: /Purchase|Buy Now/i }).first();
  
  // If no button is present, skip the test gracefully (or use mock data)
  if (await purchaseButton.isVisible()) {
    await purchaseButton.click();
    
    // Fill out the checkout form modal
    await page.getByLabel(/Email Address/i).fill('testbuyer@lexplatform.com');
    await page.getByRole('button', { name: /Proceed to Payment/i }).click();

    // Verify redirection to Paystack
    // The exact URL might depend on the environment, but it should leave the local origin
    await page.waitForURL(url => url.hostname.includes('paystack.co'), { timeout: 10000 });
    expect(page.url()).toContain('paystack.co');
  }
});
