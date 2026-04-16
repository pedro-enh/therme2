import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCogs, faLayerGroup, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import tw from 'twin.macro';
import styled from 'styled-components/macro';
import http from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import Avatar from '@/components/Avatar';

const RightNavigation = styled.div`
    & > a,
    & > button,
    & > .navigation-link {
        ${tw`flex items-center h-full no-underline text-neutral-400 px-4 cursor-pointer transition-colors duration-200 relative`};

        &:active,
        &:hover {
            ${tw`text-white`};
        }

        &.active {
            ${tw`text-white`};
        }
    }
`;

const onTriggerNavButton = () => {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.toggle('active-nav');
};

interface Props {
    children?: React.ReactNode;
}

export default ({ children }: Props) => {
    const name = useStoreState((state: ApplicationStore) => state.settings.data!.name);
    const rootAdmin = useStoreState((state: ApplicationStore) => state.user.data!.rootAdmin);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const location = useLocation();
    const [showSidebar, setShowSidebar] = useState(false);

    useEffect(() => {
        if (location.pathname.startsWith('/server') || location.pathname.startsWith('/account')) {
            setShowSidebar(true);
            return;
        }
        setShowSidebar(false);
    }, [location.pathname]);

    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            // @ts-expect-error this is valid
            window.location = '/';
        });
    };

    return (
        <div 
            className={'topbar sticky top-0 z-50'} 
            style={{ 
                background: '#161821', 
                borderBottom: '1px solid #1e202d',
            }}
        >
            <SpinnerOverlay visible={isLoggingOut} />
            <div className={'mx-auto w-full flex items-center h-[4.5rem] max-w-[1400px] px-4'}>
                {showSidebar && !children && (
                    <button
                        className='navbar-button text-neutral-400 hover:text-white transition-colors duration-200 px-4 lg:hidden'
                        onClick={onTriggerNavButton}
                    >
                        <FontAwesomeIcon icon={faBars} size="lg" />
                    </button>
                )}

                {!children ? (
                    <div id={'logo'} className={'flex-1 px-4'}>
                        <Link
                            to={'/'}
                            className={
                                'text-xl font-bold tracking-tight no-underline text-white transition-colors duration-300 flex items-center gap-2 hover:text-neutral-300'
                            }
                            style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                        >
                            ROCKET<span css={tw`text-blue-500`}>NODE</span>
                        </Link>
                    </div>
                ) : (
                    <div css={tw`flex-1 flex items-center h-full`}>
                        {children}
                    </div>
                )}

                <RightNavigation className={'flex h-full items-center justify-end px-2 gap-2'}>
                    <SearchContainer />
                    <Tooltip placement={'bottom'} content={'Dashboard'}>
                        <NavLink to={'/'} exact>
                            <FontAwesomeIcon icon={faLayerGroup} />
                        </NavLink>
                    </Tooltip>
                    {rootAdmin && (
                        <Tooltip placement={'bottom'} content={'Admin'}>
                            <a href={'/admin'} rel={'noreferrer'}>
                                <FontAwesomeIcon icon={faCogs} />
                            </a>
                        </Tooltip>
                    )}
                    <Tooltip placement={'bottom'} content={'Account Settings'}>
                        <NavLink to={'/account'}>
                            <span className={'flex items-center w-7 h-7 rounded-full overflow-hidden border border-neutral-700 hover:border-neutral-500 transition-colors'}>
                                <Avatar.User />
                            </span>
                        </NavLink>
                    </Tooltip>
                    <Tooltip placement={'bottom'} content={'Sign Out'}>
                        <button onClick={onTriggerLogout}>
                            <FontAwesomeIcon icon={faSignOutAlt} />
                        </button>
                    </Tooltip>
                </RightNavigation>
            </div>
        </div>
    );
};
