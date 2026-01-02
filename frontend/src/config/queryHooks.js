/**
 * React Query Hooks for API Calls
 * Reusable data fetching hooks with caching
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiUrl } from './api';

// Helper to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Generic fetch wrapper
const apiFetch = async (endpoint, options = {}) => {
    const response = await fetch(getApiUrl(endpoint), {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'API request failed');
    }

    return response.json();
};

// ============================================================================
// STORIES HOOKS
// ============================================================================

/**
 * Fetch published stories with pagination
 */
export function useStories({ page = 1, perPage = 20, sortBy = 'smart', storyType } = {}) {
    return useQuery({
        queryKey: ['stories', { page, perPage, sortBy, storyType }],
        queryFn: () => {
            const params = new URLSearchParams({
                page: page.toString(),
                per_page: perPage.toString(),
                sort_by: sortBy,
            });
            if (storyType) params.append('story_type', storyType);
            return apiFetch(`/posts?${params}`);
        },
    });
}

/**
 * Fetch a single story by ID
 */
export function useStory(storyId) {
    return useQuery({
        queryKey: ['story', storyId],
        queryFn: () => apiFetch(`/posts/${storyId}`),
        enabled: !!storyId,
    });
}

/**
 * Fetch featured stories
 */
export function useFeaturedStories() {
    return useQuery({
        queryKey: ['featuredStories'],
        queryFn: () => apiFetch('/posts/featured'),
    });
}

/**
 * Search stories
 */
export function useSearchStories(query, page = 1) {
    return useQuery({
        queryKey: ['searchStories', query, page],
        queryFn: () => apiFetch(`/posts/search?q=${encodeURIComponent(query)}&page=${page}`),
        enabled: query?.length >= 2,
    });
}

/**
 * Fetch user's drafts
 */
export function useDrafts() {
    return useQuery({
        queryKey: ['drafts'],
        queryFn: () => apiFetch('/posts/drafts'),
    });
}

/**
 * Create a new story
 */
export function useCreateStory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (storyData) => apiFetch('/posts', {
            method: 'POST',
            body: JSON.stringify(storyData),
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stories'] });
            queryClient.invalidateQueries({ queryKey: ['drafts'] });
        },
    });
}

/**
 * Update a story
 */
export function useUpdateStory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ storyId, data }) => apiFetch(`/posts/${storyId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
        onSuccess: (_, { storyId }) => {
            queryClient.invalidateQueries({ queryKey: ['story', storyId] });
            queryClient.invalidateQueries({ queryKey: ['stories'] });
            queryClient.invalidateQueries({ queryKey: ['drafts'] });
        },
    });
}

/**
 * Delete a story
 */
export function useDeleteStory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (storyId) => apiFetch(`/posts/${storyId}`, {
            method: 'DELETE',
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stories'] });
            queryClient.invalidateQueries({ queryKey: ['drafts'] });
        },
    });
}

// ============================================================================
// BOOKMARKS HOOKS
// ============================================================================

/**
 * Fetch user's bookmarks
 */
export function useBookmarks() {
    return useQuery({
        queryKey: ['bookmarks'],
        queryFn: () => apiFetch('/posts/bookmarks'),
    });
}

/**
 * Toggle bookmark
 */
export function useToggleBookmark() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (storyId) => apiFetch(`/posts/${storyId}/bookmark`, {
            method: 'POST',
        }),
        onSuccess: (_, storyId) => {
            queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
            queryClient.invalidateQueries({ queryKey: ['story', storyId] });
        },
    });
}

// ============================================================================
// REACTIONS HOOKS
// ============================================================================

/**
 * Toggle reaction on a story
 */
export function useToggleReaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ storyId, supportType }) => apiFetch(`/posts/${storyId}/toggle-react`, {
            method: 'POST',
            body: JSON.stringify({ support_type: supportType }),
        }),
        onSuccess: (_, { storyId }) => {
            queryClient.invalidateQueries({ queryKey: ['story', storyId] });
        },
    });
}

/**
 * Get user's reaction on a story
 */
export function useMyReaction(storyId) {
    return useQuery({
        queryKey: ['myReaction', storyId],
        queryFn: () => apiFetch(`/posts/${storyId}/my-reaction`),
        enabled: !!storyId,
    });
}

// ============================================================================
// COMMENTS HOOKS
// ============================================================================

/**
 * Fetch comments for a story
 */
export function useComments(storyId) {
    return useQuery({
        queryKey: ['comments', storyId],
        queryFn: () => apiFetch(`/posts/${storyId}/comments`),
        enabled: !!storyId,
    });
}

/**
 * Add a comment
 */
export function useAddComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ storyId, content, isAnonymous = true }) => apiFetch(`/posts/${storyId}/comments`, {
            method: 'POST',
            body: JSON.stringify({ content, is_anonymous: isAnonymous }),
        }),
        onSuccess: (_, { storyId }) => {
            queryClient.invalidateQueries({ queryKey: ['comments', storyId] });
            queryClient.invalidateQueries({ queryKey: ['story', storyId] });
        },
    });
}

// ============================================================================
// USER HOOKS
// ============================================================================

/**
 * Get current user profile
 */
export function useCurrentUser() {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: () => apiFetch('/auth/profile'),
        retry: false,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}

/**
 * Get user stats
 */
export function useUserStats() {
    return useQuery({
        queryKey: ['userStats'],
        queryFn: () => apiFetch('/auth/stats'),
    });
}

/**
 * Update user profile
 */
export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (profileData) => apiFetch('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        },
    });
}
