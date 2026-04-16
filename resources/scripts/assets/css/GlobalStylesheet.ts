import tw from 'twin.macro';
import { createGlobalStyle } from 'styled-components/macro';

export default createGlobalStyle`
    body {
        ${tw`font-sans text-neutral-300`};
        letter-spacing: 0.015em;
        background-color: #0b0c13;
        background-attachment: fixed;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    h1, h2, h3, h4, h5, h6 {
        ${tw`font-medium tracking-normal font-header text-white`};
    }

    p {
        ${tw`text-neutral-400 leading-snug font-sans`};
    }

    form {
        ${tw`m-0`};
    }

    textarea, select, input, button, button:focus, button:focus-visible {
        ${tw`outline-none`};
    }

    input[type=number]::-webkit-outer-spin-button,
    input[type=number]::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
        margin: 0;
    }

    input[type=number] {
        -moz-appearance: textfield !important;
    }

    /* Scroll Bar Style */
    ::-webkit-scrollbar {
        background: transparent;
        width: 8px;
        height: 8px;
    }

    ::-webkit-scrollbar-thumb {
        background: #27272a;
        border-radius: 4px;
        transition: background 0.2s;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background: #3f3f46;
    }

    ::-webkit-scrollbar-track-piece {
        margin: 4px 0;
        background: transparent;
    }

    ::-webkit-scrollbar-corner {
        background: transparent;
    }
`;
