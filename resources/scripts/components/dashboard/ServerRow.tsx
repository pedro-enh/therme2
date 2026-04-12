import React, { memo, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthernet, faHdd, faMemory, faMicrochip, faServer } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Server } from '@/api/server/getServer';
import getServerResourceUsage, { ServerPowerState, ServerStats } from '@/api/server/getServerResourceUsage';
import { bytesToString, ip, mbToBytes } from '@/lib/formatters';
import tw from 'twin.macro';
import Spinner from '@/components/elements/Spinner';
import styled from 'styled-components/macro';
import isEqual from 'react-fast-compare';

// Determines if the current value is in an alarm threshold so we can show it in red rather
// than the more faded default style.
const isAlarmState = (current: number, limit: number): boolean => limit > 0 && current / (limit * 1024 * 1024) >= 0.9;

const Icon = memo(
    styled(FontAwesomeIcon)<{ $alarm: boolean }>`
        ${(props) => (props.$alarm ? tw`text-red-400` : tw`text-neutral-400`)};
    `,
    isEqual
);

const IconDescription = styled.p<{ $alarm: boolean }>`
    ${tw`text-sm ml-2 font-medium`};
    ${(props) => (props.$alarm ? tw`text-white` : tw`text-neutral-300`)};
`;

const StatusIndicatorBox = styled(Link)<{ $status: ServerPowerState | undefined }>`
    ${tw`grid grid-cols-12 gap-4 relative rounded-xl p-4 transition-all duration-300 no-underline text-neutral-200 mb-4 shadow-glass`};
    background: rgba(15, 23, 42, 0.4);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.05);

    &:hover {
        background: rgba(15, 23, 42, 0.7);
        border-color: rgba(0, 255, 136, 0.3);
        box-shadow: 0 0 20px rgba(0, 255, 136, 0.15);
        transform: translateY(-2px);
    }

    & .status-bar {
        ${tw`w-2 absolute z-20 rounded-full m-2 transition-all duration-300`};
        right: 0;
        top: 0;
        bottom: 0;
        box-shadow: 0 0 10px currentColor;

        ${({ $status }) =>
            !$status || $status === 'offline'
                ? tw`bg-red-500 text-red-500`
                : $status === 'running'
                ? tw`bg-accent text-accent`
                : tw`bg-yellow-500 text-yellow-500`};
    }

    &:hover .status-bar {
        box-shadow: 0 0 15px currentColor;
    }
`;

type Timer = ReturnType<typeof setInterval>;

export default ({ server, className }: { server: Server; className?: string }) => {
    const interval = useRef<Timer>(null) as React.MutableRefObject<Timer>;
    const [isSuspended, setIsSuspended] = useState(server.status === 'suspended');
    const [stats, setStats] = useState<ServerStats | null>(null);

    const getStats = () =>
        getServerResourceUsage(server.uuid)
            .then((data) => setStats(data))
            .catch((error) => console.error(error));

    useEffect(() => {
        setIsSuspended(stats?.isSuspended || server.status === 'suspended');
    }, [stats?.isSuspended, server.status]);

    useEffect(() => {
        // Don't waste a HTTP request if there is nothing important to show to the user because
        // the server is suspended.
        if (isSuspended) return;

        getStats().then(() => {
            interval.current = setInterval(() => getStats(), 30000);
        });

        return () => {
            interval.current && clearInterval(interval.current);
        };
    }, [isSuspended]);

    const alarms = { cpu: false, memory: false, disk: false };
    if (stats) {
        alarms.cpu = server.limits.cpu === 0 ? false : stats.cpuUsagePercent >= server.limits.cpu * 0.9;
        alarms.memory = isAlarmState(stats.memoryUsageInBytes, server.limits.memory);
        alarms.disk = server.limits.disk === 0 ? false : isAlarmState(stats.diskUsageInBytes, server.limits.disk);
    }

    const diskLimit = server.limits.disk !== 0 ? bytesToString(mbToBytes(server.limits.disk)) : 'Unlimited';
    const memoryLimit = server.limits.memory !== 0 ? bytesToString(mbToBytes(server.limits.memory)) : 'Unlimited';
    const cpuLimit = server.limits.cpu !== 0 ? server.limits.cpu + ' %' : 'Unlimited';

    return (
        <StatusIndicatorBox to={`/server/${server.id}`} className={className} $status={stats?.status}>
            <div css={tw`flex items-center col-span-12 sm:col-span-5 lg:col-span-6`}>
                <div className={'icon mr-4'} css={tw`bg-black/30 p-3 rounded-lg border border-neutral-700/50 shadow-inner`}>
                    <FontAwesomeIcon icon={faServer} css={tw`text-accent text-xl`} />
                </div>
                <div>
                    <p css={tw`text-lg font-semibold text-white break-words`}>{server.name}</p>
                    {!!server.description && (
                        <p css={tw`text-sm text-neutral-400 break-words line-clamp-2 mt-1`}>{server.description}</p>
                    )}
                </div>
            </div>
            <div css={tw`flex-1 ml-4 lg:block lg:col-span-2 hidden`}>
                <div css={tw`flex justify-center bg-black/20 rounded-md py-1 px-3 border border-neutral-800/50`}>
                    <FontAwesomeIcon icon={faEthernet} css={tw`text-neutral-500`} />
                    <p css={tw`text-sm text-neutral-300 ml-2 font-mono`}>
                        {server.allocations
                            .filter((alloc) => alloc.isDefault)
                            .map((allocation) => (
                                <React.Fragment key={allocation.ip + allocation.port.toString()}>
                                    {allocation.alias || ip(allocation.ip)}:{allocation.port}
                                </React.Fragment>
                            ))}
                    </p>
                </div>
            </div>
            <div css={tw`hidden col-span-7 lg:col-span-4 sm:flex items-center justify-center`}>
                {!stats || isSuspended ? (
                    isSuspended ? (
                        <div css={tw`flex-1 text-center`}>
                            <span css={tw`bg-red-500/20 border border-red-500/50 rounded-lg px-3 py-1 text-red-400 text-sm font-semibold tracking-wide shadow-none`}>
                                {server.status === 'suspended' ? 'SUSPENDED' : 'CONNECTION ERROR'}
                            </span>
                        </div>
                    ) : server.isTransferring || server.status ? (
                        <div css={tw`flex-1 text-center`}>
                            <span css={tw`bg-neutral-500/20 border border-neutral-500/50 rounded-lg px-3 py-1 text-neutral-300 text-sm font-semibold tracking-wide`}>
                                {server.isTransferring
                                    ? 'TRANSFERRING'
                                    : server.status === 'installing'
                                    ? 'INSTALLING'
                                    : server.status === 'restoring_backup'
                                    ? 'RESTORING BACKUP'
                                    : 'UNAVAILABLE'}
                            </span>
                        </div>
                    ) : (
                        <Spinner size={'small'} />
                    )
                ) : (
                    <React.Fragment>
                        <div css={tw`flex-1 sm:block hidden`}>
                            <div css={tw`flex justify-center items-center`}>
                                <Icon icon={faMicrochip} $alarm={alarms.cpu} />
                                <IconDescription $alarm={alarms.cpu}>
                                    {stats.cpuUsagePercent.toFixed(2)} %
                                </IconDescription>
                            </div>
                            <p css={tw`text-[10px] text-neutral-500 uppercase tracking-wider text-center mt-1`}>/ {cpuLimit}</p>
                        </div>
                        <div css={tw`flex-1 sm:block hidden border-l border-neutral-700/50 pl-2`}>
                            <div css={tw`flex justify-center items-center`}>
                                <Icon icon={faMemory} $alarm={alarms.memory} />
                                <IconDescription $alarm={alarms.memory}>
                                    {bytesToString(stats.memoryUsageInBytes)}
                                </IconDescription>
                            </div>
                            <p css={tw`text-[10px] text-neutral-500 uppercase tracking-wider text-center mt-1`}>/ {memoryLimit}</p>
                        </div>
                        <div css={tw`flex-1 sm:block hidden border-l border-neutral-700/50 pl-2`}>
                            <div css={tw`flex justify-center items-center`}>
                                <Icon icon={faHdd} $alarm={alarms.disk} />
                                <IconDescription $alarm={alarms.disk}>
                                    {bytesToString(stats.diskUsageInBytes)}
                                </IconDescription>
                            </div>
                            <p css={tw`text-[10px] text-neutral-500 uppercase tracking-wider text-center mt-1`}>/ {diskLimit}</p>
                        </div>
                    </React.Fragment>
                )}
            </div>
            <div className={'status-bar'} />
        </StatusIndicatorBox>
    );
};
