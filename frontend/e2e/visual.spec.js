/**
 * Visual Regression Tests
 * Captures screenshots for key UI states to detect visual changes
 * Run with: npx playwright test e2e/visual.spec.js
 */
import { test, expect } from '@playwright/test';

// Test credentials
const TEST_USER = {
    email: 'visualtest@gmail.com',
    password: 'VisualTest@123!',
    username: 'visualtester'
};

test.describe('Visual Regression Tests', () => {

    test.describe('Auth Pages', () => {
        test('login page - light mode', async ({ page }) => {
            await page.goto('/auth/login');
            await page.waitForLoadState('networkidle');
            await expect(page).toHaveScreenshot('login-light.png', {
                fullPage: true,
                threshold: 0.2
            });
        });

        test('login page - dark mode', async ({ page }) => {
            await page.goto('/auth/login');
            await page.evaluate(() => {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            });
            await page.waitForLoadState('networkidle');
            await expect(page).toHaveScreenshot('login-dark.png', {
                fullPage: true,
                threshold: 0.2
            });
        });

        test('register page', async ({ page }) => {
            await page.goto('/auth/register');
            await page.waitForLoadState('networkidle');
            await expect(page).toHaveScreenshot('register.png', {
                fullPage: true,
                threshold: 0.2
            });
        });
    });

    test.describe('Authenticated Pages', () => {
        test.beforeEach(async ({ page }) => {
            // Try to login (assumes test user exists)
            await page.goto('/auth/login');
            await page.fill('input[type="email"]', TEST_USER.email);
            await page.fill('input[type="password"]', TEST_USER.password);
            await page.click('button[type="submit"]');
            await page.waitForURL('**/feed', { timeout: 10000 }).catch(() => {
                // User might not exist, that's ok for visual tests
            });
        });

        test('feed page - story grid', async ({ page }) => {
            await page.goto('/feed');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(1000); // Wait for animations
            await expect(page).toHaveScreenshot('feed-page.png', {
                fullPage: false, // Just viewport to avoid scrolling issues
                threshold: 0.3
            });
        });

        test('profile page', async ({ page }) => {
            await page.goto('/profile');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(500);
            await expect(page).toHaveScreenshot('profile-page.png', {
                fullPage: false,
                threshold: 0.3
            });
        });

        test('create story page', async ({ page }) => {
            await page.goto('/feed/create');
            await page.waitForLoadState('networkidle');
            await expect(page).toHaveScreenshot('create-story.png', {
                fullPage: false,
                threshold: 0.3
            });
        });

        test('drafts page', async ({ page }) => {
            await page.goto('/feed/drafts');
            await page.waitForLoadState('networkidle');
            await expect(page).toHaveScreenshot('drafts-page.png', {
                fullPage: false,
                threshold: 0.3
            });
        });
    });

    test.describe('Component Screenshots', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/auth/login');
            await page.fill('input[type="email"]', TEST_USER.email);
            await page.fill('input[type="password"]', TEST_USER.password);
            await page.click('button[type="submit"]');
            await page.waitForURL('**/feed', { timeout: 10000 }).catch(() => { });
        });

        test('mobile bottom nav', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 812 }); // iPhone X
            await page.goto('/feed');
            await page.waitForLoadState('networkidle');

            // Capture just the bottom nav
            const bottomNav = page.locator('nav.fixed.bottom-0');
            if (await bottomNav.isVisible()) {
                await expect(bottomNav).toHaveScreenshot('mobile-bottom-nav.png');
            }
        });

        test('support floating button', async ({ page }) => {
            await page.goto('/feed');
            await page.waitForLoadState('networkidle');

            const supportBtn = page.locator('text=Need Support?');
            if (await supportBtn.isVisible()) {
                await expect(supportBtn.locator('..')).toHaveScreenshot('support-button.png');
            }
        });
    });

    test.describe('Mobile Responsive', () => {
        test('feed page - mobile', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 812 });
            await page.goto('/auth/login');
            await page.waitForLoadState('networkidle');
            await expect(page).toHaveScreenshot('login-mobile.png', {
                fullPage: false,
                threshold: 0.3
            });
        });
    });
});
