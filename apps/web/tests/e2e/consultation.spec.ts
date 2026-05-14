import { test, expect } from '@playwright/test';

test('Submits consultation request successfully', async ({ page }) => {
  await page.goto('/consultation');

  // Fill the form fields
  await page.getByLabel(/Full Name/i).fill('Jane Doe');
  await page.getByLabel(/Email Address/i).fill('jane.doe@example.com');
  await page.getByLabel(/Phone Number/i).fill('+2348012345678');
  await page.getByLabel(/Case Type/i).selectOption('Corporate Law');
  await page.getByLabel(/Jurisdiction/i).fill('Lagos State');
  await page.getByLabel(/Case Brief/i).fill('This is an automated test for a corporate structuring case.');

  // Submit the form
  await page.getByRole('button', { name: /Submit Request/i }).click();

  // Wait for success message
  await expect(page.getByText(/Your consultation request has been securely received/i)).toBeVisible();
});
