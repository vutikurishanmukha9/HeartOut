/**
 * Utility and Helper Function Tests
 */
import { describe, it, expect } from 'vitest';

// Test reading time calculation
describe('Reading Time Calculation', () => {
    const calculateReadingTime = (content) => {
        const wordsPerMinute = 200;
        const words = content.trim().split(/\s+/).length;
        return Math.ceil(words / wordsPerMinute);
    };

    it('calculates short content as 1 minute', () => {
        const content = 'Hello world this is a test.';
        expect(calculateReadingTime(content)).toBe(1);
    });

    it('calculates longer content correctly', () => {
        const content = Array(400).fill('word').join(' '); // 400 words = 2 minutes
        expect(calculateReadingTime(content)).toBe(2);
    });

    it('handles empty content', () => {
        const content = '';
        expect(calculateReadingTime(content)).toBe(1);
    });
});

// Test story type utilities
describe('Story Type Utilities', () => {
    const storyTypeLabels = {
        achievement: 'Achievements',
        regret: 'Regrets',
        unsent_letter: 'Unsent Letters',
        sacrifice: 'Sacrifices',
        life_story: 'Life Stories',
        other: 'Others'
    };

    it('maps story type IDs to labels', () => {
        expect(storyTypeLabels.achievement).toBe('Achievements');
        expect(storyTypeLabels.regret).toBe('Regrets');
        expect(storyTypeLabels.unsent_letter).toBe('Unsent Letters');
    });

    it('has all expected story types', () => {
        const expectedTypes = ['achievement', 'regret', 'unsent_letter', 'sacrifice', 'life_story', 'other'];
        expectedTypes.forEach(type => {
            expect(storyTypeLabels[type]).toBeDefined();
        });
    });
});

// Test date formatting
describe('Date Formatting', () => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    it('formats dates correctly', () => {
        const result = formatDate('2024-01-15T10:30:00Z');
        expect(result).toContain('Jan');
        expect(result).toContain('15');
        expect(result).toContain('2024');
    });
});

// Test validation utilities
describe('Validation Utilities', () => {
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /[0-9]/.test(password);
    };

    const validateUsername = (username) => {
        return /^[a-zA-Z0-9_]{3,20}$/.test(username);
    };

    describe('Email validation', () => {
        it('accepts valid emails', () => {
            expect(validateEmail('test@example.com')).toBe(true);
            expect(validateEmail('user.name@domain.co.in')).toBe(true);
        });

        it('rejects invalid emails', () => {
            expect(validateEmail('invalid')).toBe(false);
            expect(validateEmail('no@domain')).toBe(false);
            expect(validateEmail('@nodomain.com')).toBe(false);
        });
    });

    describe('Password validation', () => {
        it('accepts strong passwords', () => {
            expect(validatePassword('StrongPass123')).toBe(true);
            expect(validatePassword('MyP@ssw0rd')).toBe(true);
        });

        it('rejects weak passwords', () => {
            expect(validatePassword('short')).toBe(false);
            expect(validatePassword('alllowercase123')).toBe(false);
            expect(validatePassword('ALLUPPERCASE123')).toBe(false);
            expect(validatePassword('NoNumbers')).toBe(false);
        });
    });

    describe('Username validation', () => {
        it('accepts valid usernames', () => {
            expect(validateUsername('johndoe')).toBe(true);
            expect(validateUsername('user_123')).toBe(true);
            expect(validateUsername('ABC123')).toBe(true);
        });

        it('rejects invalid usernames', () => {
            expect(validateUsername('ab')).toBe(false); // too short
            expect(validateUsername('user@name')).toBe(false); // special char
            expect(validateUsername('user name')).toBe(false); // space
        });
    });
});

// Test API error handling
describe('API Error Handling', () => {
    const getErrorMessage = (error) => {
        if (error.response) {
            const status = error.response.status;
            if (status === 401) return 'Please log in to continue';
            if (status === 403) return 'You do not have permission';
            if (status === 404) return 'Resource not found';
            if (status === 429) return 'Too many requests, please slow down';
            if (status >= 500) return 'Server error, please try again later';
            return error.response.data?.error || 'An error occurred';
        }
        return 'Network error, please check your connection';
    };

    it('handles 401 errors', () => {
        expect(getErrorMessage({ response: { status: 401 } })).toBe('Please log in to continue');
    });

    it('handles 403 errors', () => {
        expect(getErrorMessage({ response: { status: 403 } })).toBe('You do not have permission');
    });

    it('handles 404 errors', () => {
        expect(getErrorMessage({ response: { status: 404 } })).toBe('Resource not found');
    });

    it('handles 429 rate limit errors', () => {
        expect(getErrorMessage({ response: { status: 429 } })).toBe('Too many requests, please slow down');
    });

    it('handles network errors', () => {
        expect(getErrorMessage({})).toBe('Network error, please check your connection');
    });
});
