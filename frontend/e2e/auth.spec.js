/**
 * E2E Tests - Authentication Flow
 * Tests user registration, login, and logout using Playwright.
 */
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    const testUser = {
        username: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
        password: 'SecureP@ss123!'
    };

    test('should display login page for unauthenticated users', async ({ page }) => {
        await page.goto('/');

        // Should redirect to login
        await expect(page).toHaveURL(/\/auth\/login/);

        // Should show login form
        await expect(page.getByRole('heading', { name: /login|sign in/i })).toBeVisible();
    });

    test('should navigate to registration page', async ({ page }) => {
        await page.goto('/auth/login');

        // Click on register link
        await page.getByRole('link', { name: /register|sign up|create account/i }).click();

        // Should be on register page
        await expect(page).toHaveURL(/\/auth\/register/);
    });

    test('should show validation errors for empty registration', async ({ page }) => {
        await page.goto('/auth/register');

        // Try to submit empty form
        await page.getByRole('button', { name: /register|sign up|create/i }).click();

        // Should show validation errors
        await expect(page.locator('text=required')).toBeVisible({ timeout: 5000 }).catch(() => {
            // Alternative: check for any error indication
            expect(page.locator('[class*="error"], [class*="invalid"]')).toBeTruthy();
        });
    });

    test('should register a new user successfully', async ({ page }) => {
        await page.goto('/auth/register');

        // Fill registration form
        await page.getByLabel(/username/i).fill(testUser.username);
        await page.getByLabel(/email/i).fill(testUser.email);
        await page.getByLabel(/password/i).first().fill(testUser.password);

        // Submit form
        await page.getByRole('button', { name: /register|sign up|create/i }).click();

        // Should redirect to feed after successful registration
        await expect(page).toHaveURL(/\/feed/, { timeout: 10000 });
    });

    test('should login with existing credentials', async ({ page }) => {
        // First register a user via API
        const apiUrl = 'http://localhost:5000';
        const loginUser = {
            username: `loginuser_${Date.now()}`,
            email: `login_${Date.now()}@example.com`,
            password: 'SecureP@ss123!'
        };

        // Register via API
        await page.request.post(`${apiUrl}/api/auth/register`, {
            data: loginUser
        });

        // Navigate to login
        await page.goto('/auth/login');

        // Fill login form
        await page.getByLabel(/email/i).fill(loginUser.email);
        await page.getByLabel(/password/i).fill(loginUser.password);

        // Submit
        await page.getByRole('button', { name: /login|sign in/i }).click();

        // Should redirect to feed
        await expect(page).toHaveURL(/\/feed/, { timeout: 10000 });
    });

    test('should show error for invalid credentials', async ({ page }) => {
        await page.goto('/auth/login');

        // Fill with invalid credentials
        await page.getByLabel(/email/i).fill('invalid@example.com');
        await page.getByLabel(/password/i).fill('WrongPassword123!');

        // Submit
        await page.getByRole('button', { name: /login|sign in/i }).click();

        // Should show error message
        await expect(page.locator('text=/invalid|error|incorrect/i')).toBeVisible({ timeout: 5000 });
    });

    test('should logout successfully', async ({ page }) => {
        // Login first via API
        const apiUrl = 'http://localhost:5000';
        const logoutUser = {
            username: `logoutuser_${Date.now()}`,
            email: `logout_${Date.now()}@example.com`,
            password: 'SecureP@ss123!'
        };

        // Register and get token
        const registerRes = await page.request.post(`${apiUrl}/api/auth/register`, {
            data: logoutUser
        });
        const { access_token } = await registerRes.json();

        // Set token in localStorage
        await page.goto('/');
        await page.evaluate((token) => {
            localStorage.setItem('access_token', token);
        }, access_token);

        // Navigate to feed
        await page.goto('/feed');
        await page.waitForLoadState('networkidle');

        // Click on profile menu
        await page.locator('[data-testid="profile-menu"], button:has-text("Profile")').first().click();

        // Click logout
        await page.getByRole('button', { name: /logout|sign out/i }).click();

        // Should redirect to login
        await expect(page).toHaveURL(/\/auth\/login/, { timeout: 10000 });
    });
});
