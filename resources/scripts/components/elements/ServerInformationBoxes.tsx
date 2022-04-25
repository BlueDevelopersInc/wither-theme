import styled from 'styled-components/macro';
import React from 'react';
import tw from 'twin.macro';
import CopyOnClick from '@/components/elements/CopyOnClick';

const ServerInformationBoxes = styled.div`
    & {
        width: 100%;
        display: grid;
        gap: 0.75rem;
        grid-template-columns: repeat(6, minmax(0px, 1fr));
        margin-bottom: 1rem;
        @media (max-width: 1256px) {
            grid-template-columns: repeat(2, minmax(0px, 1fr));
        }

        & > .mobile {
            display: none;
        }

        @media (max-width: 700px) {
            & {
                grid-template-columns: repeat(1, minmax(0px, 1fr));
            }

            & > .desktop {
                display: none;
            }

            & > .mobile {
                display: inline-block;
            }
        }

    }
`;
export default ServerInformationBoxes;

export function ServerInformationBox(props: { mobile?: boolean, children?: React.ReactNode, text: string, copy?: string }) {
    return (
        <>
            <div className={'desktop'} css={tw`flex p-3 bg-neutral-700 rounded`}>

                    {props.copy === undefined ?
                        <div css={tw`flex-col flex select-none my-2`}>
                            <span css={tw`text-sm`}>{props.text}</span>
                            <span>{props.children}</span>
                        </div>
                        :
                        <CopyOnClick text={props.copy}>
                            <div css={tw`flex-col flex select-none my-2`}>
                            <span css={tw`text-sm`}>{props.text}</span>
                            <span>{props.children}</span>
                            </div>
                        </CopyOnClick>}
                </div>
            {props.mobile &&
            <div className={'mobile'} css={tw`flex p-3 bg-neutral-700 rounded`}>
                <div css={tw`flex-col flex select-none my-2`}>
                    {props.copy === undefined ?
                        <span>{props.text}: {props.children}</span> :
                        <CopyOnClick text={props.copy}><span>{props.text}: {props.children}</span></CopyOnClick>}
                </div>
            </div>
            }
        </>
    );
}
