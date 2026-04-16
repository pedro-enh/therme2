import styled from 'styled-components/macro';
import tw from 'twin.macro';

export default styled.div<{ $hoverable?: boolean }>`
    ${tw`flex rounded-2xl no-underline text-neutral-200 items-center bg-[#161821] p-5 border border-[#1e202d] transition-all duration-200 overflow-hidden`};

    ${(props) => props.$hoverable !== false && tw`hover:border-neutral-500 hover:bg-[#1e202d]`};

    & .icon {
        ${tw`rounded-xl w-14 h-14 flex items-center justify-center bg-[#1e202d] p-3 flex-shrink-0 mr-4 text-blue-400`};
    }
`;
