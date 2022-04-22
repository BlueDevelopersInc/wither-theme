import styled, { css } from 'styled-components/macro';
import tw from 'twin.macro';

export interface Props {
    isLight?: boolean;
    hasError?: boolean;
}

const light = css<Props>`
    ${tw`bg-white`};
    &:disabled {
        ${tw`bg-neutral-100`};
    }
`;

const checkboxStyle = css<Props>`
    ${tw`bg-neutral-500 cursor-pointer appearance-none inline-block align-middle select-none flex-shrink-0 w-4 h-4 text-primary-400 rounded-sm`};
    color-adjust: exact;
    background-origin: border-box;
    transition: all 75ms linear, box-shadow 25ms linear;

    &:checked {
        ${tw`bg-no-repeat bg-center`};
        background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
        background-color: currentColor;
        background-size: 100% 100%;
    }

    &:focus {
        ${tw`outline-none`};
    }
`;

const inputStyle = css<Props>`
    // Reset to normal styling.
    resize: none;
    ${tw`border-transparent appearance-none outline-none w-full min-w-0`};
    ${tw`p-3 rounded text-sm transition-all duration-150`};
    ${tw`bg-neutral-600 text-neutral-200 shadow-none`};

    & + .input-help {
        ${tw`mt-1 text-xs`};
        ${tw`text-neutral-200`};
    }

    &:required, &:invalid {
        ${tw`shadow-none`};
    }

    &:focus {
        box-shadow: none;
        border-color: transparent;
    }

    &:disabled {
        ${tw`opacity-75`};
    }

    ${props => props.isLight && light};
`;

const Input = styled.input<Props>`
    &:not([type="checkbox"]):not([type="radio"]) {
        ${inputStyle};
    }

    &[type="checkbox"], &[type="radio"] {
        ${checkboxStyle};

        &[type="radio"] {
            ${tw`rounded-full`};
        }
    }
`;
const Textarea = styled.textarea<Props>`${inputStyle}`;

export { Textarea };
export default Input;
