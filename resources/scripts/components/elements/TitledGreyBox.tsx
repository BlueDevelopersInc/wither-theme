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
    <div css={tw`rounded shadow-md bg-neutral-700`} className={className}>
        <div css={tw`p-3`}>
            {typeof title === 'string' ?
                <p css={tw`text-sm uppercase pb-4`}>
                    {icon && <FontAwesomeIcon icon={icon} css={tw`mr-2 text-neutral-300`}/>}{title}
                </p>
                :
                title
            }
            {children}
        </div>
    </div>
);

export default memo(TitledGreyBox, isEqual);
