const colors = require('tailwindcss/colors');

module.exports = {
    content: [
        './resources/scripts/**/*.{js,ts,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                header: ['"Inter"', '"Roboto"', 'system-ui', 'sans-serif'],
                sans: ['"Inter"', 'system-ui', 'sans-serif'],
            },
            colors: {
                black: '#000000',
                primary: colors.blue,
                accent: '#3b82f6', // Bright modern blue
                orange: colors.orange,
                gray: colors.zinc, // Replace gray entirely with zinc
                neutral: colors.zinc, // Modern slate-like grays (zinc)
                cyan: colors.cyan,
            },
            fontSize: {
                '2xs': '0.625rem',
            },
            transitionDuration: {
                250: '250ms',
            },
            borderColor: theme => ({
                default: theme('colors.neutral.800', 'currentColor'),
            }),
            boxShadow: {
                'subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.4)',
                'glow': '0 0 15px rgba(59, 130, 246, 0.3)'
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
