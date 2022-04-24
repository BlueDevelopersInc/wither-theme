import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faServer} from '@fortawesome/free-solid-svg-icons';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import tw from 'twin.macro';
import styled from 'styled-components/macro';
import {IconProp} from "@fortawesome/fontawesome-svg-core";

const Navigation = styled.div`
    ${tw`bg-neutral-600 shadow-md overflow-y-auto overflow-x-hidden left-0 top-0 fixed h-full z-20`};
    width: 250px;

    @media (max-width: 1000px) {
        width: 50px;
        padding-top: 0.5rem;
        & #logo {
            display: none;
        }
    }

    & > div {
        ${tw`mx-auto w-full flex items-center`};
    }

    & #logo {
        ${tw`flex-1`};

        & > a {
            ${tw`text-3xl font-header break-words no-underline text-neutral-200 hover:text-neutral-100 transition-colors duration-150 w-full block my-4 text-center`};
        }
    }
    & .component {
        margin-left: 10px;
        padding: 8px;
        ${tw`w-full rounded-l-lg active:bg-primary-300 hover:bg-primary-300 flex justify-between transition-all duration-300`}
        &.active {
            ${tw`bg-primary-300`}
        }
        &.onclick:not(:hover) {
            background: transparent;
        }
        & span span {
            @media (max-width: 1000px) {
                display: none;
            }
        }
        @media (max-width: 1000px) {
            padding: 10px;
            ${tw`rounded-lg mx-1 w-auto justify-center`}
        }
    }
`;
export function NavigationComponent(props: { name: string, icon: IconProp, react?: boolean, link: string, exact?: boolean, onclick?: () => void }) {
    return props.react ?? true ? (
    <NavLink to={props.link} exact={props.exact ?? false} className={"component " + (props.onclick !== undefined ? "onclick" : "")} onClick={props.onclick !== undefined ? props.onclick : () => {}}>
        <span>
            <FontAwesomeIcon icon={props.icon}/>
            <span css={tw`ml-1`}>{props.name}</span>
        </span>
    </NavLink>
    ) : (
        <a href={props.link} rel={"noreferrer"} className={"component"}>
        <span>
            <FontAwesomeIcon icon={props.icon}/>
            <span css={tw`ml-1`}>{props.name}</span>
        </span>
        </a>
    )
};

export default (props: {children?: React.ReactNode}) => {
    const name = useStoreState((state: ApplicationStore) => state.settings.data!.name);

    return (
        <Navigation id={'sidepanel'}>
            <div css={tw`mx-auto w-full flex items-center`}>
                <div id={'logo'}>
                    <Link to={'/'} >
                        {name}
                    </Link>
                </div>
            </div>
            <NavigationComponent name={'Servers'} icon={faServer} link={'/'} exact/>
            {props.children}
        </Navigation>
    );
};
