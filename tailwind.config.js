const colors = require('tailwindcss/colors');

const gray = {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#0f172a',
    900: '#020617',
};

module.exports = {
    content: [
        './resources/scripts/**/*.{js,ts,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                header: ['"Outfit"', '"Inter"', '"Roboto"', 'system-ui', 'sans-serif'],
                sans: ['"Inter"', 'system-ui', 'sans-serif'],
            },
            colors: {
                black: '#050505',
                primary: {
                    DEFAULT: '#00ff88',
                    50: '#ecfdf3',
                    100: '#d1fae1',
                    200: '#a7f3c9',
                    300: '#6ee7ab',
                    400: '#34d399',
                    500: '#10b981',
                    600: '#059669',
                    700: '#047857',
                    800: '#065f46',
                    900: '#064e3b',
                },
                accent: '#00ff88',
                orange: colors.orange,
                gray: gray,
                neutral: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#1e293b',
                    800: '#0f172a',
                    900: '#020617',
                },
                cyan: {
                    ...colors.cyan,
                    600: '#00ff88', // re-map to our neon green to override active shadows
                },
            },
            fontSize: {
                '2xs': '0.625rem',
            },
            transitionDuration: {
                250: '250ms',
            },
            borderColor: theme => ({
                default: theme('colors.neutral.700', 'currentColor'),
            }),
            boxShadow: {
                'neon': '0 0 15px rgba(0, 255, 136, 0.4)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
            }
        },
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
    ]
};
