import React from 'react';
import styled, { css } from 'styled-components/macro';
import tw from 'twin.macro';
import Spinner from '@/components/elements/Spinner';

interface Props {
    isLoading?: boolean;
    size?: 'xsmall' | 'small' | 'large' | 'xlarge';
    color?: 'green' | 'red' | 'primary' | 'grey' | 'yellow';
    isSecondary?: boolean;
}

const ButtonStyle = styled.button<Omit<Props, 'isLoading'>>`
    ${tw`relative inline-block rounded p-2 uppercase tracking-wide text-sm transition-all duration-150 border`};

    ${props => ((!props.isSecondary && !props.color) || props.color === 'primary') && css<Props>`
        ${props => !props.isSecondary && tw`bg-primary-500 border-primary-600 border text-primary-50`};

        &:hover:not(:disabled) {
            ${tw`border-primary-700`};
        }
    `};

    ${props => props.color === 'grey' && css`
        ${tw`border-neutral-600 bg-neutral-500 text-neutral-50`};

        &:hover:not(:disabled) {
            ${tw`border-neutral-700`};
        }
    `};

    ${props => props.color === 'yellow' && css<Props>`
        ${tw`border-yellow-600 bg-yellow-500 text-yellow-50`};

        &:hover:not(:disabled) {
            ${tw`border-yellow-700`};
        }

        ${props => props.isSecondary && css`
            &:active:not(:disabled) {
                ${tw`border-yellow-700`};
            }
        `};
    `};

    ${props => props.color === 'green' && css<Props>`
        ${tw`border-green-600 bg-green-500 text-green-50`};

        &:hover:not(:disabled) {
            ${tw`border-green-700`};
        }

        ${props => props.isSecondary && css`
            &:active:not(:disabled) {
                ${tw`border-green-700`};
            }
        `};
    `};

    ${props => props.color === 'red' && css<Props>`
        ${tw`border-red-600 bg-red-500 text-red-50`};
    `};

    ${props => props.size === 'xsmall' && tw`px-2 py-1 text-xs`};
    ${props => (!props.size || props.size === 'small') && tw`px-4 py-2`};
    ${props => props.size === 'large' && tw`p-4 text-sm`};
    ${props => props.size === 'xlarge' && tw`p-4 w-full`};

    ${props => props.isSecondary && css<Props>`
        ${tw`border-primary-700 bg-transparent text-neutral-200`};

        &:hover:not(:disabled) {
            ${tw`text-neutral-100`};
        }
    `};

    &:hover:not(:disabled) {
        transform: translateY(-1px);
    }
    &:disabled { opacity: 0.55; cursor: default }
`;

type ComponentProps = Omit<JSX.IntrinsicElements['button'], 'ref' | keyof Props> & Props;

const Button: React.FC<ComponentProps> = ({ children, isLoading, ...props }) => (
    <ButtonStyle {...props}>
        {isLoading &&
        <div css={tw`flex absolute justify-center items-center w-full h-full left-0 top-0`}>
            <Spinner size={'small'}/>
        </div>
        }
        <span css={isLoading ? tw`text-transparent` : undefined}>
            {children}
        </span>
    </ButtonStyle>
);

type LinkProps = Omit<JSX.IntrinsicElements['a'], 'ref' | keyof Props> & Props;

const LinkButton: React.FC<LinkProps> = props => <ButtonStyle as={'a'} {...props}/>;

export { LinkButton, ButtonStyle };
export default Button;
