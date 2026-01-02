/**
 * React Query Client Configuration
 * Centralized query client with default options
 */
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Stale time - how long data is considered fresh (5 minutes)
            staleTime: 5 * 60 * 1000,
            // Cache time - how long unused data stays in cache (10 minutes)
            gcTime: 10 * 60 * 1000,
            // Retry failed requests 2 times
            retry: 2,
            // Don't refetch on window focus by default
            refetchOnWindowFocus: false,
            // Refetch on mount if data is stale
            refetchOnMount: true,
        },
        mutations: {
            // Retry mutations once on failure
            retry: 1,
        },
    },
});

export default queryClient;
