import React, {useEffect, useState} from 'react';
import tw, {TwStyle} from 'twin.macro';
import {
    faCircle,
    faClock,
    faEthernet,
    faHdd,
    faInfoCircle,
    faMapMarkerAlt,
    faMemory,
    faMicrochip
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {bytesToHuman, formatIp, megabytesToHuman} from '@/helpers';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import {ServerContext} from '@/state/server';
import CopyOnClick from '@/components/elements/CopyOnClick';
import {SocketEvent, SocketRequest} from '@/components/server/events';
import UptimeDuration from '@/components/server/UptimeDuration';
import ContentContainer from '@/components/elements/ContentContainer';
import Can from '@/components/elements/Can';
import PowerControls from '@/components/server/PowerControls';

interface Stats {
    memory: number;
    cpu: number;
    disk: number;
    uptime: number;
}

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

const ServerDetailsBlock = () => {
    const [ stats, setStats ] = useState<Stats>({ memory: 0, cpu: 0, disk: 0, uptime: 0 });

    const status = ServerContext.useStoreState(state => state.status.value);
    const connected = ServerContext.useStoreState(state => state.socket.connected);
    const instance = ServerContext.useStoreState(state => state.socket.instance);

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
        instance.send(SocketRequest.SEND_STATS);

        return () => {
            instance.removeListener(SocketEvent.STATS, statsListener);
        };
    }, [ instance, connected ]);

    const name = ServerContext.useStoreState(state => state.server.data!.name);
    const isInstalling = ServerContext.useStoreState(state => state.server.data!.isInstalling);
    const isTransferring = ServerContext.useStoreState(state => state.server.data!.isTransferring);
    const limits = ServerContext.useStoreState(state => state.server.data!.limits);
    const primaryAllocation = ServerContext.useStoreState(state => state.server.data!.allocations.filter(alloc => alloc.isDefault).map(
        allocation => (allocation.alias || formatIp(allocation.ip)) + ':' + allocation.port,
    )).toString();
    const node = ServerContext.useStoreState(state => state.server.data!.node);

    const diskLimit = limits.disk ? megabytesToHuman(limits.disk) : 'Unlimited';
    const memoryLimit = limits.memory ? megabytesToHuman(limits.memory) : 'Unlimited';
    const cpuLimit = limits.cpu ? limits.cpu + '%' : 'Unlimited';

    return (
        <TitledGreyBox css={tw`break-words mt-2`} title={'SERVER INFORMATION'} icon={faInfoCircle}>
            {isInstalling ?
                <div css={tw`mb-4 rounded bg-yellow-500 p-3`}>
                    <ContentContainer>
                        <p css={tw`text-sm text-yellow-900`}>
                            This server is currently running its installation process and most actions are
                            unavailable.
                        </p>
                    </ContentContainer>
                </div>
                :
                isTransferring ?
                    <div css={tw`mb-4 rounded bg-yellow-500 p-3`}>
                        <ContentContainer>
                            <p css={tw`text-sm text-yellow-900`}>
                                This server is currently being transferred to another node and all actions
                                are unavailable.
                            </p>
                        </ContentContainer>
                    </div>
                    :
                    <Can action={['control.start', 'control.stop', 'control.restart']} matchAny>
                        <div css={tw`mb-4 justify-center flex`}>
                            <PowerControls/>
                        </div>
                    </Can>
            }
            <p css={tw`text-xs uppercase`}>
                <FontAwesomeIcon
                    icon={faCircle}
                    fixedWidth
                    css={[
                        tw`mr-1`,
                        statusToColor(status, isInstalling || isTransferring),
                    ]}
                />
                &nbsp;{!status ? 'Connecting...' : (isInstalling ? 'Installing' : (isTransferring) ? 'Transferring' : status)}
            </p>
            <CopyOnClick text={primaryAllocation}>
                <p css={tw`text-xs mt-2`}>
                    <FontAwesomeIcon icon={faEthernet} fixedWidth css={tw`mr-1`}/>
                    <code css={tw`ml-1`}>{primaryAllocation}</code>
                </p>
            </CopyOnClick>
            <p css={tw`text-xs mt-2`}>
                <FontAwesomeIcon icon={faMapMarkerAlt} fixedWidth css={tw`mr-1`}/>
                <code css={tw`ml-1`}>{node}</code>
            </p>
            {stats.uptime > 0 &&
            <p css={tw`text-xs mt-2`}>
                <FontAwesomeIcon icon={faClock} fixedWidth css={tw`mr-1`}/>
                <code css={tw`ml-1`}>(<UptimeDuration uptime={stats.uptime / 1000}/>)</code>
            </p>
            }
            <p css={tw`text-xs mt-2`}>
                <FontAwesomeIcon icon={faMicrochip} fixedWidth css={tw`mr-1`}/> {stats.cpu.toFixed(2)}%
                <span css={tw`text-neutral-500`}> / {cpuLimit}</span>
            </p>
            <p css={tw`text-xs mt-2`}>
                <FontAwesomeIcon icon={faMemory} fixedWidth css={tw`mr-1`}/> {bytesToHuman(stats.memory)}
                <span css={tw`text-neutral-500`}> / {memoryLimit}</span>
            </p>
            <p css={tw`text-xs mt-2`}>
                <FontAwesomeIcon icon={faHdd} fixedWidth css={tw`mr-1`}/>&nbsp;{bytesToHuman(stats.disk)}
                <span css={tw`text-neutral-500`}> / {diskLimit}</span>
            </p>
        </TitledGreyBox>
    );
};

export default ServerDetailsBlock;
