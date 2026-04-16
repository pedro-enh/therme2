import React, { memo, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthernet, faFolder, faTerminal, faDatabase, faCog, faPlay, faSync, faExclamationTriangle, faServer } from '@fortawesome/free-solid-svg-icons';
import { Link, useHistory } from 'react-router-dom';
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

const ProjectCard = styled.div<{ $status: ServerPowerState | undefined }>`
    ${tw`flex flex-row items-center justify-between relative rounded-2xl p-4 transition-all duration-300 bg-[#1e202d] border border-transparent hover:border-neutral-700 cursor-pointer`};
    
    &:hover {
        ${tw`shadow-subtle`};
        transform: translateY(-2px);
    }

    & .status-dot {
        ${tw`w-3 h-3 rounded-full transition-all duration-300 border-2 border-[#1e202d]`};

        ${({ $status }) =>
            !$status || $status === 'offline'
                ? tw`bg-red-500`
                : $status === 'running'
                ? tw`bg-green-500`
                : tw`bg-yellow-500`};
    }
`;

const QuickActionNode = styled(Link)`
    ${tw`flex items-center justify-center w-10 h-10 rounded-full bg-[#272a38] text-neutral-400 transition-colors duration-200`};
    
    &:hover {
        ${tw`bg-neutral-600 text-white`};
    }
`;

type Timer = ReturnType<typeof setInterval>;

export default ({ server, className }: { server: Server; className?: string }) => {
    const history = useHistory();
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

    let serverImage = 'https://raw.githubusercontent.com/pterodactyl/panel/develop/public/favicons/apple-touch-icon.png';
    if (server.name.toLowerCase().includes('mine')) {
        serverImage = 'https://raw.githubusercontent.com/pterodactyl/panel/develop/public/favicons/apple-touch-icon.png'; // default grass block
    }

    const isRunning = stats?.status === 'running';

    return (
        <ProjectCard 
            className={className} 
            $status={stats?.status}
            onClick={(e) => {
                history.push(`/server/${server.id}`);
            }}
        >
            <div css={tw`flex items-center gap-8`}>
                <div css={tw`relative w-24 h-24 bg-[#1e202d] rounded-2xl flex items-center justify-center shadow-inner flex-shrink-0 overflow-hidden border border-[#272a38]`}>
                    <img 
                        src={serverImage} 
                        css={tw`w-16 h-16 object-contain z-10`}
                        style={{ filter: !isRunning ? 'grayscale(1) opacity(0.5)' : 'none' }}
                    />
                    <div css={tw`absolute inset-0 bg-green-500 opacity-10 z-0`} />
                    <div css={tw`absolute bottom-2 right-2`}>
                        <div className={'status-dot'} css={tw`w-4 h-4 shadow-glow`} />
                    </div>
                </div>

                <div css={tw`flex flex-col`}>
                    <div css={tw`flex items-center gap-4 mb-2`}>
                        <p css={tw`text-xl font-black text-white truncate tracking-tight`}>{server.name}</p>
                        <div css={tw`flex items-center gap-2 px-3 py-1 bg-black/20 rounded-full border border-white/5`}>
                            <div className={'status-dot'} css={tw`w-2 h-2 border-none`} />
                            <span css={tw`text-[10px] uppercase font-bold text-neutral-400 tracking-widest`}>
                                {!stats || isSuspended 
                                    ? (isSuspended ? 'Suspended' : server.status || 'Offline')
                                    : stats.status}
                            </span>
                        </div>
                    </div>
                    
                    <div css={tw`flex items-center gap-6 text-xs text-neutral-400 mt-1`}>
                        <div css={tw`font-mono bg-black/20 px-4 py-2 rounded-xl text-blue-400 font-bold border border-blue-500/10`}>
                            {server.allocations
                                .filter((alloc) => alloc.isDefault)
                                .map((allocation) => (
                                    <React.Fragment key={allocation.ip + allocation.port.toString()}>
                                        {allocation.alias || ip(allocation.ip)}
                                    </React.Fragment>
                                ))}
                        </div>

                        {!stats || isSuspended ? (
                            <span css={tw`text-neutral-500 font-medium`}>Shared with standard support</span>
                        ) : (
                            <div css={tw`flex items-center gap-4`}>
                                <div css={tw`flex items-center gap-2`}>
                                    <FontAwesomeIcon icon={faExclamationTriangle} css={tw`text-yellow-500/50`} />
                                    <span css={tw`text-neutral-400 font-medium`}>
                                        {stats.cpuUsagePercent.toFixed(0)}% RAM, {stats.cpuUsagePercent.toFixed(0)}% CPU
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div css={tw`flex items-center gap-4 ml-4`} onClick={(e) => e.stopPropagation()}>
                <Link 
                    to={`/server/${server.id}`}
                    css={[
                        tw`flex items-center justify-center w-12 h-12 rounded-full text-white transition-all shadow-glow hover:scale-110 active:scale-95`,
                        isRunning ? tw`bg-orange-500 shadow-xl` : tw`bg-blue-500 shadow-xl`
                    ]}
                >
                    <FontAwesomeIcon icon={isRunning ? faSync : faPlay} css={tw`text-lg`} />
                </Link>
                <div css={tw`flex items-center bg-black/20 p-1.5 rounded-full border border-white/5 gap-2`}>
                    <QuickActionNode to={`/server/${server.id}/files`} css={tw`w-9 h-9`}>
                        <FontAwesomeIcon icon={faFolder} size="sm" />
                    </QuickActionNode>
                    <QuickActionNode to={`/server/${server.id}/console`} css={tw`w-9 h-9`}>
                        <FontAwesomeIcon icon={faTerminal} size="sm" />
                    </QuickActionNode>
                    <QuickActionNode to={`/server/${server.id}/databases`} css={tw`w-9 h-9`}>
                        <FontAwesomeIcon icon={faDatabase} size="sm" />
                    </QuickActionNode>
                    <QuickActionNode to={`/server/${server.id}/settings`} css={tw`w-9 h-9`}>
                        <FontAwesomeIcon icon={faCog} size="sm" />
                    </QuickActionNode>
                </div>
            </div>
        </ProjectCard>
    );
};
