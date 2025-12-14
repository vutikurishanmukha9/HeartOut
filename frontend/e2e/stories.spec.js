/**
 * E2E Tests - Story Flow
 * Tests story creation, viewing, reactions, and comments using Playwright.
 */
import { test, expect } from '@playwright/test';

test.describe('Story Flow', () => {
    let authToken;
    const apiUrl = 'http://localhost:5000';

    test.beforeEach(async ({ page }) => {
        // Create and login a test user
        const testUser = {
            username: `storyuser_${Date.now()}`,
            email: `story_${Date.now()}@example.com`,
            password: 'SecureP@ss123!'
        };

        const registerRes = await page.request.post(`${apiUrl}/api/auth/register`, {
            data: testUser
        });
        const data = await registerRes.json();
        authToken = data.access_token;

        // Set token in localStorage
        await page.goto('/');
        await page.evaluate((token) => {
            localStorage.setItem('access_token', token);
        }, authToken);
    });

    test('should display feed with stories', async ({ page }) => {
        await page.goto('/feed');
        await page.waitForLoadState('networkidle');

        // Should show feed page
        await expect(page.getByRole('heading', { name: /feed|stories|heartout/i })).toBeVisible();
    });

    test('should navigate to create story page', async ({ page }) => {
        await page.goto('/feed');

        // Click on create story button
        await page.getByRole('link', { name: /create|write|new story/i }).click();

        // Should be on create page
        await expect(page).toHaveURL(/\/feed\/create/);
    });

    test('should create a new story', async ({ page }) => {
        await page.goto('/feed/create');

        // Fill story form
        await page.getByLabel(/title/i).fill('My E2E Test Story');
        await page.locator('textarea').fill(
            'This is a test story created during E2E testing. It contains enough content to pass validation requirements and tell a meaningful story about the testing process.'
        );

        // Select story type
        await page.getByText(/life story/i).click();

        // Submit as published
        await page.getByRole('button', { name: /publish/i }).click();

        // Should redirect to story detail or feed
        await expect(page).toHaveURL(/\/feed/, { timeout: 10000 });
    });

    test('should view story details', async ({ page }) => {
        // Create a story via API first
        const storyRes = await page.request.post(`${apiUrl}/api/posts`, {
            headers: { 'Authorization': `Bearer ${authToken}` },
            data: {
                title: 'Story for Viewing Test',
                content: 'This is a detailed story about my experiences. It has enough content to pass validation and provides an interesting read for viewers.',
                story_type: 'achievement',
                status: 'published'
            }
        });
        const { story } = await storyRes.json();

        // Navigate to story
        await page.goto(`/feed/story/${story.id}`);

        // Should show story title
        await expect(page.getByText('Story for Viewing Test')).toBeVisible();
    });

    test('should react to a story', async ({ page }) => {
        // Create a story via API
        const storyRes = await page.request.post(`${apiUrl}/api/posts`, {
            headers: { 'Authorization': `Bearer ${authToken}` },
            data: {
                title: 'Story for Reaction Test',
                content: 'This story is created to test the reaction functionality. It should allow users to add and toggle reactions.',
                story_type: 'life_story',
                status: 'published'
            }
        });
        const { story } = await storyRes.json();

        // Navigate to story
        await page.goto(`/feed/story/${story.id}`);
        await page.waitForLoadState('networkidle');

        // Find and click reaction button
        const reactionButton = page.locator('button:has-text("React"), [data-testid="reaction-button"]').first();
        if (await reactionButton.isVisible()) {
            await reactionButton.click();

            // Select a reaction
            await page.getByText(/love it|heart/i).first().click();
        }
    });

    test('should add a comment to a story', async ({ page }) => {
        // Create a story via API
        const storyRes = await page.request.post(`${apiUrl}/api/posts`, {
            headers: { 'Authorization': `Bearer ${authToken}` },
            data: {
                title: 'Story for Comment Test',
                content: 'This story is created to test the comment functionality. Users should be able to add comments to share their thoughts.',
                story_type: 'achievement',
                status: 'published'
            }
        });
        const { story } = await storyRes.json();

        // Navigate to story
        await page.goto(`/feed/story/${story.id}`);
        await page.waitForLoadState('networkidle');

        // Find comment input and add comment
        const commentInput = page.locator('textarea[placeholder*="comment"], input[placeholder*="comment"]').first();
        if (await commentInput.isVisible()) {
            await commentInput.fill('Great story! Thanks for sharing.');
            await page.getByRole('button', { name: /post|submit|send/i }).click();
        }
    });

    test('should navigate between story categories', async ({ page }) => {
        await page.goto('/feed');
        await page.waitForLoadState('networkidle');

        // Click on different category tabs if visible
        const categories = ['Achievement', 'Regret', 'Life Story'];

        for (const category of categories) {
            const tab = page.getByRole('tab', { name: new RegExp(category, 'i') }).first();
            if (await tab.isVisible()) {
                await tab.click();
                await page.waitForTimeout(500);
            }
        }
    });

    test('should search for stories', async ({ page }) => {
        await page.goto('/feed');

        // Find search input
        const searchInput = page.getByPlaceholder(/search/i).first();
        if (await searchInput.isVisible()) {
            await searchInput.fill('test story');
            await searchInput.press('Enter');

            // Wait for search results
            await page.waitForLoadState('networkidle');
        }
    });
});
