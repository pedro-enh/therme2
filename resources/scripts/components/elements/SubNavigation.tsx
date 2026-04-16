import styled from 'styled-components/macro';
import tw, { theme } from 'twin.macro';

const SubNavigation = styled.div`
    ${tw`w-full bg-[#161821] border-b border-[#1e202d] overflow-x-auto mb-4`};

    & > div {
        ${tw`flex items-center text-sm mx-auto px-4`};
        max-width: 1400px;

        & > a,
        & > div {
            ${tw`inline-block py-4 px-5 text-neutral-400 no-underline whitespace-nowrap transition-all duration-200 relative`};

            &:hover {
                ${tw`text-white`};
            }

            &.active {
                ${tw`text-white font-bold`};
                
                &:after {
                    content: "";
                    ${tw`absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-t-full`};
                }
            }
        }
    }
`;

export default SubNavigation;
