import React, { memo, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthernet, faHdd, faMemory, faMicrochip } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Server } from '@/api/server/getServer';
import getServerResourceUsage, { ServerPowerState, ServerStats } from '@/api/server/getServerResourceUsage';
import { bytesToString, ip, mbToBytes } from '@/lib/formatters';
import tw from 'twin.macro';
import Spinner from '@/components/elements/Spinner';
import styled from 'styled-components/macro';
import isEqual from 'react-fast-compare';

const isAlarmState = (current: number, limit: number): boolean => limit > 0 && current / (limit * 1024 * 1024) >= 0.9;

const Icon = memo(
    styled(FontAwesomeIcon)<{ $alarm: boolean }>`
        ${(props) => (props.$alarm ? tw`text-red-400` : tw`text-neutral-500`)};
    `,
    isEqual
);

const ProjectCard = styled(Link)<{ $status: ServerPowerState | undefined }>`
    ${tw`flex flex-col relative rounded-xl p-5 no-underline transition-all duration-200 bg-[#09090b] border border-neutral-800 hover:border-neutral-700`};
    
    &:hover {
        ${tw`shadow-subtle`};
        transform: translateY(-1px);
    }

    & .status-dot {
        ${tw`w-2.5 h-2.5 rounded-full transition-all duration-300`};

        ${({ $status }) =>
            !$status || $status === 'offline'
                ? tw`bg-neutral-600` // Offline is gray
                : $status === 'running'
                ? tw`bg-accent`      // Running is blue
                : tw`bg-yellow-500`}; // Starting is yellow
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

    return (
        <ProjectCard to={`/server/${server.id}`} className={className} $status={stats?.status}>
            <div css={tw`flex items-start justify-between mb-4`}>
                <div css={tw`flex items-center gap-3 overflow-hidden`}>
                    <div className={'status-dot shrink-0'} />
                    <p css={tw`text-base font-semibold text-neutral-100 truncate`}>{server.name}</p>
                </div>
            </div>

            <div css={tw`mt-auto`}>
                <div css={tw`mb-4`}>
                    <div css={tw`inline-flex items-center text-sm text-neutral-400 font-mono bg-neutral-900/50 px-2 py-1 rounded border border-neutral-800`}>
                        <FontAwesomeIcon icon={faEthernet} css={tw`text-neutral-500 mr-2`} />
                        {server.allocations
                            .filter((alloc) => alloc.isDefault)
                            .map((allocation) => (
                                <React.Fragment key={allocation.ip + allocation.port.toString()}>
                                    {allocation.alias || ip(allocation.ip)}:{allocation.port}
                                </React.Fragment>
                            ))}
                    </div>
                </div>

                <div css={tw`flex items-center gap-4`}>
                    {!stats || isSuspended ? (
                        <div css={tw`w-full flex items-center`}>
                            {isSuspended ? (
                                <span css={tw`text-xs font-medium text-red-400 bg-red-400/10 px-2 py-1 rounded`}>
                                    {server.status === 'suspended' ? 'Suspended' : 'Connection Error'}
                                </span>
                            ) : server.isTransferring || server.status ? (
                                <span css={tw`text-xs font-medium text-neutral-400 bg-neutral-800 px-2 py-1 rounded`}>
                                    {server.isTransferring
                                        ? 'Transferring'
                                        : server.status === 'installing'
                                        ? 'Installing'
                                        : server.status === 'restoring_backup'
                                        ? 'Restoring'
                                        : 'Unavailable'}
                                </span>
                            ) : (
                                <Spinner size={'small'} />
                            )}
                        </div>
                    ) : (
                        <React.Fragment>
                            <div css={tw`flex items-center gap-1.5 text-xs text-neutral-400`}>
                                <Icon icon={faMicrochip} $alarm={alarms.cpu} />
                                <span css={alarms.cpu ? tw`text-red-400` : tw`text-neutral-300`}>
                                    {stats.cpuUsagePercent.toFixed(1)}%
                                </span>
                            </div>
                            <div css={tw`flex items-center gap-1.5 text-xs text-neutral-400`}>
                                <Icon icon={faMemory} $alarm={alarms.memory} />
                                <span css={alarms.memory ? tw`text-red-400` : tw`text-neutral-300`}>
                                    {bytesToString(stats.memoryUsageInBytes)}
                                </span>
                            </div>
                            <div css={tw`flex items-center gap-1.5 text-xs text-neutral-400`}>
                                <Icon icon={faHdd} $alarm={alarms.disk} />
                                <span css={alarms.disk ? tw`text-red-400` : tw`text-neutral-300`}>
                                    {bytesToString(stats.diskUsageInBytes)}
                                </span>
                            </div>
                        </React.Fragment>
                    )}
                </div>
            </div>
        </ProjectCard>
    );
};
