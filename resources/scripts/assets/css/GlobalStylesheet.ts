import tw from 'twin.macro';
import { createGlobalStyle } from 'styled-components/macro';

export default createGlobalStyle`
    body {
        ${tw`font-sans text-neutral-200`};
        letter-spacing: 0.015em;
        background-color: #050505;
        background-image: 
            radial-gradient(circle at 15% 50%, rgba(0, 255, 136, 0.03), transparent 25%),
            radial-gradient(circle at 85% 30%, rgba(0, 255, 136, 0.04), transparent 25%);
        background-attachment: fixed;
    }

    h1, h2, h3, h4, h5, h6 {
        ${tw`font-medium tracking-normal font-header text-white`};
    }

    p {
        ${tw`text-neutral-300 leading-snug font-sans`};
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
        background: rgba(0,0,0,0.2);
        width: 10px;
        height: 10px;
    }

    ::-webkit-scrollbar-thumb {
        background: #1e293b;
        border-radius: 5px;
        transition: background 0.3s;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background: #00ff88;
    }

    ::-webkit-scrollbar-track-piece {
        margin: 4px 0;
        background: transparent;
    }

    ::-webkit-scrollbar-corner {
        background: transparent;
    }
`;
