import { test, expect } from '@playwright/test';
import assert from 'assert';
import { getTestConfig } from './getTestConfig';

const { WEB_BASE_URL } = getTestConfig();

test.describe('when navigate to the base URL', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(WEB_BASE_URL);
  });

  test('should have the correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Login/);
  });

  test('should have the correct version text', async ({ page }) => {
    const version = page.locator('[data-test-id=version]');
    assert(process.env.GIT_SHA, 'GIT_SHA is missing');
    await expect(version).toHaveText(process.env.GIT_SHA);
  });
});
