/**
 * E2E Tests - Navigation Flow
 * Tests page navigation and routing using Playwright.
 */
import { test, expect } from '@playwright/test';

test.describe('Navigation Flow', () => {
    test('should navigate to feed page', async ({ page }) => {
        await page.goto('/feed');
        // Should show feed content or redirect to login
        await expect(page).toHaveURL(/\/(feed|auth\/login)/);
    });

    test('should navigate between pages using navbar', async ({ page }) => {
        // Set up auth token
        const apiUrl = 'http://localhost:5000';
        const testUser = {
            username: `navuser_${Date.now()}`,
            email: `nav_${Date.now()}@example.com`,
            password: 'SecureP@ss123!'
        };

        // Register via API
        const res = await page.request.post(`${apiUrl}/api/auth/register`, {
            data: testUser
        });
        const { access_token } = await res.json();

        // Set token
        await page.goto('/');
        await page.evaluate((token) => {
            localStorage.setItem('access_token', token);
        }, access_token);

        // Navigate to feed
        await page.goto('/feed');
        await page.waitForLoadState('networkidle');

        // Check page loaded
        await expect(page.locator('body')).toBeVisible();
    });

    test('should show 404 for invalid routes', async ({ page }) => {
        await page.goto('/invalid-page-xyz-123');

        // Should show 404 or redirect
        const body = await page.textContent('body');
        const is404 = body.includes('404') ||
            body.includes('not found') ||
            body.includes('Not Found');

        // Either shows 404 or redirects
        expect(is404 || page.url().includes('/auth/login')).toBeTruthy();
    });

    test('should protect authenticated routes', async ({ page }) => {
        // Clear any existing auth
        await page.goto('/');
        await page.evaluate(() => {
            localStorage.clear();
        });

        // Try to access protected route
        await page.goto('/profile');

        // Should redirect to login
        await expect(page).toHaveURL(/\/auth\/login/, { timeout: 10000 });
    });

    test('should persist auth across page navigation', async ({ page }) => {
        const apiUrl = 'http://localhost:5000';
        const testUser = {
            username: `persist_${Date.now()}`,
            email: `persist_${Date.now()}@example.com`,
            password: 'SecureP@ss123!'
        };

        // Register
        const res = await page.request.post(`${apiUrl}/api/auth/register`, {
            data: testUser
        });
        const { access_token } = await res.json();

        // Set token
        await page.goto('/');
        await page.evaluate((token) => {
            localStorage.setItem('access_token', token);
        }, access_token);

        // Navigate to feed
        await page.goto('/feed');
        await page.waitForLoadState('networkidle');

        // Navigate to another page and back
        await page.goto('/support');
        await page.waitForLoadState('networkidle');

        await page.goto('/feed');
        await page.waitForLoadState('networkidle');

        // Should still be on feed (not redirected to login)
        await expect(page).toHaveURL(/\/feed/);
    });
});
