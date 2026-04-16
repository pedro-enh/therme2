import React, { forwardRef } from 'react';
import { Form } from 'formik';
import styled from 'styled-components/macro';
import { breakpoint } from '@/theme';
import FlashMessageRender from '@/components/FlashMessageRender';
import tw from 'twin.macro';

type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    title?: string;
};

const Container = styled.div`
    ${breakpoint('sm')`
        ${tw`w-4/5 mx-auto`}
    `};

    ${breakpoint('md')`
        ${tw`p-10`}
    `};

    ${breakpoint('lg')`
        ${tw`w-3/5`}
    `};

    ${breakpoint('xl')`
        ${tw`w-full`}
        max-width: 700px;
    `};
`;

export default forwardRef<HTMLFormElement, Props>(({ title, ...props }, ref) => (
    <Container>
        {title && <h2 css={tw`text-4xl text-center text-white font-bold py-8 tracking-tight`}>{title}</h2>}
        <FlashMessageRender css={tw`mb-6 px-1`} />
        <Form {...props} ref={ref}>
            <div css={tw`md:flex w-full bg-[#161821] shadow-2xl rounded-3xl p-8 border border-[#1e202d] relative overflow-hidden transition-all duration-300`}>
                <div css={tw`flex-none select-none mb-8 md:mb-0 md:mr-10 self-center`}>
                    <img src={'https://raw.githubusercontent.com/pterodactyl/panel/develop/public/favicons/apple-touch-icon.png'} css={tw`block w-40 md:w-56 mx-auto rounded-3xl shadow-lg border-2 border-[#1e202d]`} />
                </div>
                <div css={tw`flex-1 flex flex-col justify-center`}>{props.children}</div>
            </div>
        </Form>
        <p css={tw`text-center text-neutral-500 text-xs mt-10 tracking-widest uppercase`}>
            &copy; 2015 - {new Date().getFullYear()}&nbsp;
            <a
                rel={'noopener nofollow noreferrer'}
                href={'https://pterodactyl.io'}
                target={'_blank'}
                css={tw`no-underline text-neutral-500 hover:text-white transition-colors duration-200`}
            >
                ROCKETNODE
            </a>
        </p>
    </Container>
));
