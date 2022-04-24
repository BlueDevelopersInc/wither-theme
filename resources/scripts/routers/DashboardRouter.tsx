import React, {useState} from 'react';
import { NavLink, Route, RouteComponentProps, Switch } from 'react-router-dom';
import AccountOverviewContainer from '@/components/dashboard/AccountOverviewContainer';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import AccountApiContainer from '@/components/dashboard/AccountApiContainer';
import { NotFound } from '@/components/elements/ScreenBlock';
import TransitionRouter from '@/TransitionRouter';
import NavigationBar, {NavigationComponent} from '@/components/NavigationBar';
import {faCogs, faLaptopCode, faSearch, faSignOutAlt, faUser} from '@fortawesome/free-solid-svg-icons';
import http from "@/api/http";
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import {useStoreState} from 'easy-peasy';
import {ApplicationStore} from '@/state';
import MainContainer from '@/components/elements/MainContainer';
import useEventListener from "@/plugins/useEventListener";
import SearchModal from "@/components/dashboard/search/SearchModal";

export default ({ location }: RouteComponentProps) => {
    const rootAdmin = useStoreState((state : ApplicationStore) => state.user.data?.rootAdmin);
    const [ isLoggingOut, setIsLoggingOut ] = useState(false);
    const [ searchVisible, setSearchVisible ] = useState(false);

    useEventListener('keydown', (e: KeyboardEvent) => {
        if ([ 'input', 'textarea' ].indexOf(((e.target as HTMLElement).tagName || 'input').toLowerCase()) < 0) {
            if (!searchVisible && e.metaKey && e.key.toLowerCase() === '/') {
                setSearchVisible(true);
            }
        }
    });
    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            // @ts-ignore
            window.location = '/';
        });
    };
    return (
    <>
        {searchVisible &&
        <SearchModal
            appear
            visible={searchVisible}
            onDismissed={() => setSearchVisible(false)}
        />
        }
        <SpinnerOverlay visible={isLoggingOut} />
        <MainContainer>
            <NavigationBar>
                <NavigationComponent link={'/account' } name={'Account'} icon={faUser} exact/>
                <NavigationComponent link={'/account/api'} name={'API'} icon={faLaptopCode}/>
                <NavigationComponent link='#' exact name='Search' icon={faSearch} onclick={() => setSearchVisible(true)}/>
                <NavigationComponent link={'#'} name={"Logout"} icon={faSignOutAlt} onclick={onTriggerLogout}/>
                {rootAdmin &&
                <NavigationComponent link={'/admin'} exact name={'Admin'} icon={faCogs} react={false}/>
                }
            </NavigationBar>
            <TransitionRouter>
                <Switch location={location}>
                    <Route path={'/'} exact>
                        <DashboardContainer/>
                    </Route>
                    <Route path={'/account'} exact>
                        <AccountOverviewContainer/>
                    </Route>
                    <Route path={'/account/api'} exact>
                        <AccountApiContainer/>
                    </Route>
                    <Route path={'*'}>
                        <NotFound/>
                    </Route>
                </Switch>
            </TransitionRouter>
        </MainContainer>
    </>
)};
