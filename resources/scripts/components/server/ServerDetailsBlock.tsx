import React, {useEffect, useState} from 'react';
import tw from 'twin.macro';
import {
    faClock,
    faHdd,
    faInfoCircle,
    faMapMarkerAlt,
    faMemory,
    faMicrochip
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {bytesToHuman, megabytesToHuman} from '@/helpers';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import {ServerContext} from '@/state/server';
import {SocketEvent, SocketRequest} from '@/components/server/events';
import UptimeDuration from '@/components/server/UptimeDuration';
import ContentContainer from '@/components/elements/ContentContainer';
import Can from '@/components/elements/Can';
import PowerControls from '@/components/server/PowerControls';

export interface Stats {
    memory: number;
    cpu: number;
    disk: number;
    uptime: number;
}

const ServerDetailsBlock = (props: {mobile?: boolean}) => {
    const [ stats, setStats ] = useState<Stats>({ memory: 0, cpu: 0, disk: 0, uptime: 0 });

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
        if (!props.mobile)
        instance.send(SocketRequest.SEND_STATS);

        return () => {
            instance.removeListener(SocketEvent.STATS, statsListener);
        };
    }, [ instance, connected ]);

    const isInstalling = ServerContext.useStoreState(state => state.server.data!.isInstalling);
    const isTransferring = ServerContext.useStoreState(state => state.server.data!.isTransferring);
    const limits = ServerContext.useStoreState(state => state.server.data!.limits);
    const node = ServerContext.useStoreState(state => state.server.data!.node);

    const diskLimit = limits.disk ? megabytesToHuman(limits.disk) : 'Unlimited';
    const memoryLimit = limits.memory ? megabytesToHuman(limits.memory) : 'Unlimited';
    const cpuLimit = limits.cpu ? limits.cpu + '%' : 'Unlimited';

    return (
        <TitledGreyBox css={[tw`break-words w-full sm:w-1/3`, props.mobile ? tw`block sm:hidden mb-4` : tw`hidden sm:block`] } title={'SERVER INFORMATION'} icon={faInfoCircle}>
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

            </p>
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
            {props.mobile && <>
            <p css={tw`text-xs mt-2`}>
                <FontAwesomeIcon icon={faMicrochip} fixedWidth css={tw`mr-1`}/> {stats.cpu.toFixed(2)}% / {cpuLimit}
            </p>
            <p css={tw`text-xs mt-2`}>
                <FontAwesomeIcon icon={faMemory} fixedWidth css={tw`mr-1`}/> {bytesToHuman(stats.memory)} / {memoryLimit}
            </p>
            </>
            }
            <p css={tw`text-xs mt-2`}>
                <FontAwesomeIcon icon={faHdd} fixedWidth css={tw`mr-1`}/>&nbsp;{bytesToHuman(stats.disk)} / {diskLimit}
            </p>
        </TitledGreyBox>
    );
};

export default ServerDetailsBlock;
