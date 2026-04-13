/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#fff7ed',
                    100: '#ffedd5',
                    200: '#fed7aa',
                    300: '#fdba74',
                    400: '#fb923c',
                    500: '#f97316',
                    600: '#ea580c',
                    700: '#c2410c',
                    800: '#9a3412',
                    900: '#7c2d12',
                },
                secondary: {
                    50: '#faf8f7',
                    100: '#f0edeb',
                    200: '#e2ddd9',
                    300: '#cfc7c1',
                    400: '#b8ada4',
                    500: '#9c8e83',
                    600: '#847569',
                    700: '#6d6058',
                    800: '#5a504a',
                    900: '#4c4440',
                },
                accent: {
                    50: '#faf7f6',
                    100: '#f5edeb',
                    200: '#ead9d5',
                    300: '#dbbfb8',
                    400: '#c79d94',
                    500: '#b07d73',
                    600: '#976560',
                    700: '#7d534f',
                    800: '#684645',
                    900: '#583d3c',
                },
            },
        },
    },
    plugins: [],
}
