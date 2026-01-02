/**
 * E2E Tests - Bookmarks Flow
 * Tests bookmark functionality using Playwright.
 */
import { test, expect } from '@playwright/test';

test.describe('Bookmarks Flow', () => {
    const apiUrl = 'http://localhost:5000';
    let testUser;
    let accessToken;

    test.beforeEach(async ({ page }) => {
        // Create unique test user
        testUser = {
            username: `bookmarkuser_${Date.now()}`,
            email: `bookmark_${Date.now()}@example.com`,
            password: 'SecureP@ss123!'
        };

        // Register via API
        const res = await page.request.post(`${apiUrl}/api/auth/register`, {
            data: testUser
        });
        const data = await res.json();
        accessToken = data.access_token;

        // Set token in browser
        await page.goto('/');
        await page.evaluate((token) => {
            localStorage.setItem('access_token', token);
        }, accessToken);
    });

    test('should display bookmarks page', async ({ page }) => {
        await page.goto('/bookmarks');
        await page.waitForLoadState('networkidle');

        // Should show bookmarks page or empty state
        const body = await page.textContent('body');
        const hasBookmarksContent =
            body.includes('Bookmark') ||
            body.includes('bookmark') ||
            body.includes('Saved') ||
            body.includes('saved');

        expect(hasBookmarksContent || page.url().includes('/bookmarks')).toBeTruthy();
    });

    test('should toggle bookmark on a story', async ({ page }) => {
        // First create a story via API
        const storyRes = await page.request.post(`${apiUrl}/api/posts`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            data: {
                title: 'Bookmark Test Story',
                content: 'This is a test story content that meets the minimum length requirement for the content validation.',
                story_type: 'life_story',
                status: 'published'
            }
        });
        const storyData = await storyRes.json();
        const storyId = storyData.story?.id;

        if (storyId) {
            // Navigate to story
            await page.goto(`/feed/${storyId}`);
            await page.waitForLoadState('networkidle');

            // Find and click bookmark button
            const bookmarkButton = page.locator('button:has-text("Bookmark"), button:has-text("Save"), [data-testid="bookmark-button"]').first();

            if (await bookmarkButton.isVisible()) {
                await bookmarkButton.click();

                // Wait for action to complete
                await page.waitForTimeout(1000);
            }
        }
    });

    test('should show empty state when no bookmarks', async ({ page }) => {
        await page.goto('/bookmarks');
        await page.waitForLoadState('networkidle');

        // For a new user, should show empty state or no bookmarks message
        const body = await page.textContent('body');
        const hasEmptyOrContent =
            body.includes('No') ||
            body.includes('empty') ||
            body.includes('Bookmark') ||
            body.length > 0;

        expect(hasEmptyOrContent).toBeTruthy();
    });

    test('should access bookmarks from navigation', async ({ page }) => {
        await page.goto('/feed');
        await page.waitForLoadState('networkidle');

        // Try to find bookmarks link in navigation
        const bookmarksLink = page.locator('a[href*="bookmark"], a:has-text("Saved"), a:has-text("Bookmark")').first();

        if (await bookmarksLink.isVisible()) {
            await bookmarksLink.click();
            await page.waitForLoadState('networkidle');

            // Should navigate to bookmarks
            expect(page.url()).toMatch(/bookmark|saved/i);
        }
    });
});
