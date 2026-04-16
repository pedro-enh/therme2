import React, { useEffect, useState } from 'react';
import { Server } from '@/api/server/getServer';
import getServers from '@/api/getServers';
import ServerRow from '@/components/dashboard/ServerRow';
import Spinner from '@/components/elements/Spinner';
import PageContentBlock from '@/components/elements/PageContentBlock';
import useFlash from '@/plugins/useFlash';
import { useStoreState } from 'easy-peasy';
import { usePersistedState } from '@/plugins/usePersistedState';
import Switch from '@/components/elements/Switch';
import tw from 'twin.macro';
import useSWR from 'swr';
import { PaginatedResult } from '@/api/http';
import Pagination from '@/components/elements/Pagination';
import { useLocation } from 'react-router-dom';

export default () => {
    const { search } = useLocation();
    const defaultPage = Number(new URLSearchParams(search).get('page') || '1');

    const [page, setPage] = useState(!isNaN(defaultPage) && defaultPage > 0 ? defaultPage : 1);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const uuid = useStoreState((state) => state.user.data!.uuid);
    const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);
    const [showOnlyAdmin, setShowOnlyAdmin] = usePersistedState(`${uuid}:show_all_servers`, false);

    const username = useStoreState((state) => state.user.data!.username);

    const { data: servers, error } = useSWR<PaginatedResult<Server>>(
        ['/api/client/servers', showOnlyAdmin && rootAdmin, page],
        () => getServers({ page, type: showOnlyAdmin && rootAdmin ? 'admin' : undefined })
    );

    useEffect(() => {
        if (!servers) return;
        if (servers.pagination.currentPage > 1 && !servers.items.length) {
            setPage(1);
        }
    }, [servers?.pagination.currentPage]);

    useEffect(() => {
        // Don't use react-router to handle changing this part of the URL, otherwise it
        // triggers a needless re-render. We just want to track this in the URL incase the
        // user refreshes the page.
        window.history.replaceState(null, document.title, `/${page <= 1 ? '' : `?page=${page}`}`);
    }, [page]);

    useEffect(() => {
        if (error) clearAndAddHttpError({ key: 'dashboard', error });
        if (!error) clearFlashes('dashboard');
    }, [error]);

    const formattedUsername = username.charAt(0).toUpperCase() + username.slice(1);

    return (
        <PageContentBlock className='content-dashboard' title={'Dashboard'} showFlashKey={'dashboard'}>
            <div css={tw`mb-10 mt-8 flex justify-between items-end`}>
                <div>
                    <h1 css={tw`text-4xl font-bold tracking-tight text-white m-0`} style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
                        Hi, <span css={tw`text-blue-100`}>{formattedUsername}</span>
                    </h1>
                </div>
                {rootAdmin && (
                    <div css={tw`flex items-center bg-neutral-900 border border-neutral-800 rounded-lg py-2 px-3`}>
                        <p css={tw`text-sm font-medium text-neutral-300 mr-3`}>
                            Show Admin
                        </p>
                        <Switch
                            name={'show_all_servers'}
                            defaultChecked={showOnlyAdmin}
                            onChange={() => setShowOnlyAdmin((s) => !s)}
                        />
                    </div>
                )}
            </div>
            
            <div css={tw`flex flex-col lg:flex-row gap-8`}>
                <div css={tw`flex-1`}>
                    {!servers ? (
                        <div css={tw`mt-20`}>
                            <Spinner centered size={'large'} />
                        </div>
                    ) : (
                        <Pagination data={servers} onPageSelect={setPage}>
                            {({ items }) =>
                                items.length > 0 ? (
                                    <div css={tw`flex flex-col gap-4`}>
                                        {items.map((server) => (
                                            <ServerRow key={server.uuid} server={server} />
                                        ))}
                                    </div>
                                ) : (
                                    <div css={tw`mt-12 flex flex-col items-center justify-center p-12 rounded-xl border border-neutral-800 border-dashed bg-neutral-900/20`}>
                                        <p css={tw`text-lg font-medium text-neutral-300`}>
                                            {showOnlyAdmin
                                                ? 'No other servers found.'
                                                : 'You do not have any servers yet.'}
                                        </p>
                                    </div>
                                )
                            }
                        </Pagination>
                    )}
                    
                    <div css={tw`mt-6`}>
                        <p css={tw`text-sm font-semibold text-neutral-400 mb-1`}>Not finding your server?</p>
                        <p css={tw`text-xs text-neutral-500`}>
                            You can try searching for it using the top search icon or checking if<br/>
                            it's still paid for in the Account -{'>'} Billing menu.
                        </p>
                    </div>
                </div>

                <div css={tw`w-full lg:w-80 shrink-0 hidden lg:block`}>
                    <div css={tw`bg-[#161821] rounded-xl p-6 relative overflow-hidden h-[300px] shadow-lg`} style={{ border: '1px solid #232736' }}>
                        <h2 css={tw`text-xl font-bold text-white mb-4 relative z-10 leading-snug tracking-tight`}>
                            All game servers now<br/>come with free DDoS<br/>Protection
                        </h2>
                        <p css={tw`text-sm text-neutral-400 relative z-10 leading-relaxed`}>
                            Elevate your Minecraft Hosting<br/>experience on our robust network,<br/>with seamless support and instant<br/>server deployment.
                        </p>
                        <img 
                            src="https://raw.githubusercontent.com/pterodactyl/panel/develop/public/favicons/apple-touch-icon.png" 
                            style={{ filter: 'brightness(0.8) contrast(1.2)' }}
                            css={tw`absolute -bottom-10 -right-10 w-64 opacity-50 z-0 select-none scale-[1.3] transform rotate-[20deg]`}
                            alt="Minecraft Block"
                        />
                    </div>
                </div>
            </div>
        </PageContentBlock>
    );
};
