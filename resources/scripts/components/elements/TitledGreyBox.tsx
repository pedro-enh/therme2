import React, { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import tw from 'twin.macro';
import isEqual from 'react-fast-compare';

interface Props {
    icon?: IconProp;
    title: string | React.ReactNode;
    className?: string;
    children: React.ReactNode;
}

const TitledGreyBox = ({ icon, title, children, className }: Props) => (
    <div css={tw`rounded-2xl shadow-lg bg-[#161821] border border-[#1e202d] overflow-hidden`} className={className}>
        <div css={tw`bg-[#1e202d]/50 p-4 border-b border-[#272a38]`}>
            {typeof title === 'string' ? (
                <p css={tw`text-sm font-bold text-white uppercase tracking-wider`}>
                    {icon && <FontAwesomeIcon icon={icon} css={tw`mr-2 text-blue-500`} />}
                    {title}
                </p>
            ) : (
                title
            )}
        </div>
        <div css={tw`p-4 text-neutral-300`}>{children}</div>
    </div>
);


export default memo(TitledGreyBox, isEqual);
