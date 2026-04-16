import React, { memo } from 'react';
import { ServerContext } from '@/state/server';
import Can from '@/components/elements/Can';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import isEqual from 'react-fast-compare';
import Spinner from '@/components/elements/Spinner';
import Features from '@feature/Features';
import Console from '@/components/server/console/Console';
import StatGraphs from '@/components/server/console/StatGraphs';
import PowerButtons from '@/components/server/console/PowerButtons';
import tw from 'twin.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faServer, faCopy, faInfoCircle, faCodeBranch, faPuzzlePiece } from '@fortawesome/free-solid-svg-icons';
import { ip } from '@/lib/formatters';
import { Alert } from '@/components/elements/alert';

export type PowerAction = 'start' | 'stop' | 'restart' | 'kill';

const ServerConsoleContainer = () => {
    const name = ServerContext.useStoreState((state) => state.server.data!.name);
    const description = ServerContext.useStoreState((state) => state.server.data!.description);
    const isInstalling = ServerContext.useStoreState((state) => state.server.isInstalling);
    const isTransferring = ServerContext.useStoreState((state) => state.server.data!.isTransferring);
    const eggFeatures = ServerContext.useStoreState((state) => state.server.data!.eggFeatures, isEqual);
    const isNodeUnderMaintenance = ServerContext.useStoreState((state) => state.server.data!.isNodeUnderMaintenance);
    const nodeName = ServerContext.useStoreState((state) => state.server.data!.node);
    const allocations = ServerContext.useStoreState((state) => state.server.data!.allocations);
    const match = allocations.find((a) => a.isDefault);
    const ipAddress = !match ? 'n/a' : `${match.alias || ip(match.ip)}:${match.port}`;
    const status = ServerContext.useStoreState((state) => state.status.value);

    let serverImage = 'https://raw.githubusercontent.com/pterodactyl/panel/develop/public/favicons/apple-touch-icon.png';
    
    return (
        <ServerContentBlock title={'Console'}>
            {(isNodeUnderMaintenance || isInstalling || isTransferring) && (
                <Alert type={'warning'} className={'mb-4'}>
                    {isNodeUnderMaintenance
                        ? 'The node of this server is currently under maintenance and all actions are unavailable.'
                        : isInstalling
                        ? 'This server is currently running its installation process and most actions are unavailable.'
                        : 'This server is currently being transferred to another node and all actions are unavailable.'}
                </Alert>
            )}
            
            {/* Top Info Banner */}
            <div css={tw`bg-[#161821] rounded-2xl p-6 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between border border-[#1e202d]`}>
                <div css={tw`flex items-center gap-6 mb-4 md:mb-0`}>
                    <div css={tw`relative w-20 h-20 bg-green-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 overflow-hidden`}>
                        <FontAwesomeIcon icon={faServer} css={tw`text-3xl text-green-900 opacity-50`} />
                        <div css={tw`absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4`}>
                            <div css={[
                                tw`w-4 h-4 rounded-full border-2 border-[#161821]`,
                                status === 'running' ? tw`bg-green-500` : status === 'offline' ? tw`bg-red-500` : tw`bg-yellow-500`
                            ]} />
                        </div>
                    </div>
                    <div css={tw`flex flex-col gap-2`}>
                        <div css={tw`flex items-center gap-3`}>
                            <h1 css={tw`text-xl font-bold text-white tracking-tight`}>{name}</h1>
                            <div css={tw`flex items-center gap-1.5 text-xs text-neutral-400 bg-[#272a38] px-2 py-0.5 rounded-full`}>
                                <div css={[
                                    tw`w-2 h-2 rounded-full`,
                                    status === 'running' ? tw`bg-green-500` : status === 'offline' ? tw`bg-red-500` : tw`bg-yellow-500`
                                ]} />
                                {status || 'offline'}
                            </div>
                        </div>
                        
                        {/* Badges row */}
                        <div css={tw`flex flex-wrap items-center gap-2 mt-1`}>
                            {/* IP Badge */}
                            <div css={tw`flex items-center gap-2 bg-[#1e202d] border border-[#272a38] px-3 py-1.5 rounded-full text-xs text-neutral-300 font-mono cursor-pointer hover:bg-[#272a38] transition-colors`}
                                 onClick={() => navigator.clipboard.writeText(ipAddress)}
                            >
                                {ipAddress} <FontAwesomeIcon icon={faCopy} css={tw`text-neutral-500`} />
                            </div>
                            {/* Node Badge */}
                            <div css={tw`flex items-center gap-2 bg-[#1e202d] border border-[#272a38] px-3 py-1.5 rounded-full text-xs text-neutral-300`}>
                                {nodeName} <FontAwesomeIcon icon={faInfoCircle} css={tw`text-neutral-500`} />
                            </div>
                            {/* Framework Badge */}
                            <div css={tw`flex items-center gap-2 bg-[#1e202d] border border-[#272a38] px-3 py-1.5 rounded-full text-xs text-neutral-300 truncate max-w-[150px]`}>
                                Minecraft Server <FontAwesomeIcon icon={faCodeBranch} css={tw`text-neutral-500`} />
                            </div>
                            <button css={tw`bg-white text-black font-bold text-xs px-4 py-1.5 rounded-full hover:bg-neutral-200 transition-colors`}>
                                Join
                            </button>
                        </div>
                    </div>
                </div>
                
                <div css={tw`flex-shrink-0`}>
                    <Can action={['control.start', 'control.stop', 'control.restart']} matchAny>
                        <PowerButtons className={'flex space-x-2'} />
                    </Can>
                </div>
            </div>

            <div className={'grid grid-cols-4 gap-4 mb-4'}>
                {/* Console Section */}
                <div className={'col-span-4 lg:col-span-3'}>
                    <Spinner.Suspense>
                        <Console />
                    </Spinner.Suspense>
                </div>
                
                {/* Stats Section */}
                <div className={'col-span-4 lg:col-span-1 flex flex-col gap-4'}>
                    <Spinner.Suspense>
                        <StatGraphs />
                    </Spinner.Suspense>
                </div>
            </div>
            
            <Features enabled={eggFeatures} />
        </ServerContentBlock>
    );
};

export default memo(ServerConsoleContainer, isEqual);
