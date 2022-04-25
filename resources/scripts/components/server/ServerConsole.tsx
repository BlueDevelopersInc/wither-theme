import React, {lazy, memo, useEffect, useState} from 'react';
import { ServerContext } from '@/state/server';
import tw, {TwStyle} from 'twin.macro';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import ServerDetailsBlock, { Stats } from '@/components/server/ServerDetailsBlock';
import isEqual from 'react-fast-compare';
import { EulaModalFeature, JavaVersionModalFeature, GSLTokenModalFeature, PIDLimitModalFeature, SteamDiskSpaceFeature } from '@feature/index';
import ErrorBoundary from '@/components/elements/ErrorBoundary';
import Spinner from '@/components/elements/Spinner';
import ServerInformationBoxes, {ServerInformationBox} from '@/components/elements/ServerInformationBoxes';
import {bytesToHuman, formatIp, megabytesToHuman} from '@/helpers';
import {SocketEvent, SocketRequest} from '@/components/server/events';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircle} from '@fortawesome/free-solid-svg-icons';

export type PowerAction = 'start' | 'stop' | 'restart' | 'kill';

const ChunkedConsole = lazy(() => import(/* webpackChunkName: "console" */'@/components/server/Console'));
const ChunkedStatGraphs = lazy(() => import(/* webpackChunkName: "graphs" */'@/components/server/StatGraphs'));

const ServerConsole = () => {
    const [ stats, setStats ] = useState<Stats>({ memory: 0, cpu: 0, disk: 0, uptime: 0 });

    const status = ServerContext.useStoreState(state => state.status.value);
    const connected = ServerContext.useStoreState(state => state.socket.connected);
    const instance = ServerContext.useStoreState(state => state.socket.instance);
    const isInstalling = ServerContext.useStoreState(state => state.server.data!.isInstalling);
    const isTransferring = ServerContext.useStoreState(state => state.server.data!.isTransferring);
    const eggFeatures = ServerContext.useStoreState(state => state.server.data!.eggFeatures, isEqual);
    const name = ServerContext.useStoreState(state => state.server.data!.name)
    const id = ServerContext.useStoreState(state => state.server.data!.id)
    const primaryAllocation = ServerContext.useStoreState(state => state.server.data!.allocations.filter(alloc => alloc.isDefault).map(
        allocation => (allocation.alias || formatIp(allocation.ip)) + ':' + allocation.port,
    )).toString();

    const limits = ServerContext.useStoreState(state => state.server.data!.limits);
    const diskLimit = limits.disk ? megabytesToHuman(limits.disk) : 'Unlimited';
    const memoryLimit = limits.memory ? megabytesToHuman(limits.memory) : 'Unlimited';
    const cpuLimit = limits.cpu ? limits.cpu + '%' : 'Unlimited';

    const statsListener = (data: string) => {
        let stats: any = {};
        try {
            stats = JSON.parse(data);
        } catch (e) {
            return;
        }

        setStats({
            memory: stats.memory_bytes,
            cpu: stats.cpu_absolute,
            disk: stats.disk_bytes,
            uptime: stats.uptime || 0,
        });
    };
    useEffect(() => {
        if (!connected || !instance) {
            return;
        }

        instance.addListener(SocketEvent.STATS, statsListener);

        return () => {
            instance.removeListener(SocketEvent.STATS, statsListener);
        };
    }, [ instance, connected ]);
    return (
        <ServerContentBlock title={'Console'} css={tw`flex flex-wrap`}>
            <div css={tw`w-full mt-4 lg:mt-0 lg:pl-4`}>

                <ServerInformationBoxes>
                    <ServerInformationBox text={"Server Name"} mobile>
                        {name}
                    </ServerInformationBox>
                    <ServerInformationBox text={"IP Address"} copy={primaryAllocation} mobile>
                        {primaryAllocation}
                    </ServerInformationBox>
                    <ServerInformationBox text={"Server ID"} copy={id}>{id}</ServerInformationBox>
                    <ServerInformationBox text={"Memory Usage"}>{bytesToHuman(stats.memory)} / {memoryLimit}</ServerInformationBox>
                    <ServerInformationBox text={"CPU Usage"}>{bytesToHuman(stats.cpu)} / {cpuLimit}</ServerInformationBox>
                    <ServerInformationBox text={"Server Status"} mobile>
                        <FontAwesomeIcon
                            icon={faCircle}
                            fixedWidth
                            css={
                                statusToColor(status, isInstalling || isTransferring)
                            }
                        />
                        &nbsp;{!status ? 'Connecting...' : (isInstalling ? 'Installing' : (isTransferring) ? 'Transferring' : capitalizeFirstLetter(status))}
                    </ServerInformationBox>
                </ServerInformationBoxes>

                <Spinner.Suspense>
                    <ErrorBoundary>
                        <ChunkedConsole/>
                    </ErrorBoundary>
                    <ChunkedStatGraphs renderCenter={<ServerDetailsBlock/>} renderFirst={<ServerDetailsBlock mobile/>}/>
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

function statusToColor(status: string | null, installing: boolean): TwStyle {
    if (installing) {
        status = '';
    }

    switch (status) {
        case 'offline':
            return tw`text-red-500`;
        case 'running':
            return tw`text-green-500`;
        default:
            return tw`text-yellow-500`;
    }
}

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


export default memo(ServerConsole, isEqual);
