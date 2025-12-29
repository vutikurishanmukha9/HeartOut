/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [react()],

        // Build configuration
        build: {
            outDir: 'dist',
            sourcemap: mode !== 'production',
            minify: 'esbuild',  // Use built-in esbuild minifier (no extra install needed)
        },

        // Test configuration
        test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: ['./src/test/setup.js'],
            include: ['src/**/*.{test,spec}.{js,jsx}'],
            coverage: {
                reporter: ['text', 'html'],
                exclude: ['node_modules/', 'src/test/'],
            },
        },

        // Development server
        server: {
            port: 5173,
            proxy: {
                '/api': {
                    target: env.VITE_API_URL || 'http://localhost:8000',
                    changeOrigin: true,
                },
            },
        },

        // Preview server (for testing production build)
        preview: {
            port: 4173,
        },

        // Define environment variables
        define: {
            __APP_VERSION__: JSON.stringify('2.4.0'),
        },
    };
});
