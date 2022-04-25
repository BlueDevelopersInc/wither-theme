import React, { lazy, memo } from 'react';
import { ServerContext } from '@/state/server';
import Can from '@/components/elements/Can';
import ContentContainer from '@/components/elements/ContentContainer';
import tw from 'twin.macro';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import ServerDetailsBlock from '@/components/server/ServerDetailsBlock';
import isEqual from 'react-fast-compare';
import PowerControls from '@/components/server/PowerControls';
import { EulaModalFeature, JavaVersionModalFeature, GSLTokenModalFeature, PIDLimitModalFeature, SteamDiskSpaceFeature } from '@feature/index';
import ErrorBoundary from '@/components/elements/ErrorBoundary';
import Spinner from '@/components/elements/Spinner';

export type PowerAction = 'start' | 'stop' | 'restart' | 'kill';

const ChunkedConsole = lazy(() => import(/* webpackChunkName: "console" */'@/components/server/Console'));
const ChunkedStatGraphs = lazy(() => import(/* webpackChunkName: "graphs" */'@/components/server/StatGraphs'));

const ServerConsole = () => {
    const isInstalling = ServerContext.useStoreState(state => state.server.data!.isInstalling);
    const isTransferring = ServerContext.useStoreState(state => state.server.data!.isTransferring);
    const eggFeatures = ServerContext.useStoreState(state => state.server.data!.eggFeatures, isEqual);

    return (
        <ServerContentBlock title={'Console'} css={tw`flex flex-wrap`}>
            <div css={tw`w-full mt-4 lg:mt-0 lg:pl-4`}>
                <Spinner.Suspense>
                    <ErrorBoundary>
                        <ChunkedConsole/>
                    </ErrorBoundary>
                    <ChunkedStatGraphs renderCenter={<ServerDetailsBlock/>}/>
                </Spinner.Suspense>
                <React.Suspense fallback={null}>
                    {eggFeatures.includes('eula') && <EulaModalFeature/>}
                    {eggFeatures.includes('java_version') && <JavaVersionModalFeature/>}
                    {eggFeatures.includes('gsl_token') && <GSLTokenModalFeature/>}
                    {eggFeatures.includes('pid_limit') && <PIDLimitModalFeature/>}
                    {eggFeatures.includes('steam_disk_space') && <SteamDiskSpaceFeature/>}
                </React.Suspense>
            </div>
        </ServerContentBlock>
    );
};

export default memo(ServerConsole, isEqual);
