import React from 'react';
import tw from 'twin.macro';
import { ServerContext } from '@/state/server';
import styled from 'styled-components/macro';
import Input from '@/components/elements/Input';

export const FileActionCheckbox = styled(Input)`
    && {
        ${tw`border-primary-300 bg-transparent focus:ring-0 focus:ring-offset-0`};
    }
`;

export default ({ name }: { name: string }) => {
    const isChecked = ServerContext.useStoreState(state => state.files.selectedFiles.indexOf(name) >= 0);
    const appendSelectedFile = ServerContext.useStoreActions(actions => actions.files.appendSelectedFile);
    const removeSelectedFile = ServerContext.useStoreActions(actions => actions.files.removeSelectedFile);

    return (
        <label css={tw`flex-none p-4 absolute self-center z-30 cursor-pointer`}>
            <FileActionCheckbox
                name={'selectedFiles'}
                value={name}
                checked={isChecked}
                type={'checkbox'}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.currentTarget.checked) {
                        appendSelectedFile(name);
                    } else {
                        removeSelectedFile(name);
                    }
                }}
            />
        </label>
    );
};
