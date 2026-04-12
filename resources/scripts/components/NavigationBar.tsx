import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCogs, faLayerGroup, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import tw, { theme } from 'twin.macro';
import styled from 'styled-components/macro';
import http from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import Avatar from '@/components/Avatar';

const RightNavigation = styled.div`
    & > a,
    & > button,
    & > .navigation-link {
        ${tw`flex items-center h-full no-underline text-neutral-400 px-6 cursor-pointer transition-all duration-300 relative`};

        &:active,
        &:hover {
            ${tw`text-white`};
            background: rgba(0, 255, 136, 0.05);
        }

        &:active,
        &:hover,
        &.active {
            box-shadow: inset 0 -3px ${theme`colors.cyan.600`.toString()};
            color: #00ff88;
            text-shadow: 0 0 10px rgba(0, 255, 136, 0.4);
        }
    }
`;

const onTriggerNavButton = () => {
    const sidebar = document.getElementById('sidebar');

    if (sidebar) {
        sidebar.classList.toggle('active-nav');
    }
};

export default () => {
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
                background: 'rgba(5, 5, 5, 0.65)', 
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(0, 255, 136, 0.1)',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)'
            }}
        >
            <SpinnerOverlay visible={isLoggingOut} />
            <div className={'mx-auto w-full flex items-center h-[4rem] max-w-[1200px]'}>
                {showSidebar && (
                    <button
                        className='navbar-button text-neutral-400 hover:text-white transition-colors duration-200 px-4'
                        onClick={onTriggerNavButton}
                    >
                        <FontAwesomeIcon icon={faBars} size="lg" />
                    </button>
                )}

                <div id={'logo'} className={'flex-1 px-4'}>
                    <Link
                        to={'/'}
                        className={
                            'text-2xl font-header font-bold no-underline text-white transition-all duration-300 flex items-center gap-2'
                        }
                    >
                        <span style={{ 
                            background: 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)', 
                            WebkitBackgroundClip: 'text', 
                            WebkitTextFillColor: 'transparent',
                            textShadow: '0 0 20px rgba(0, 255, 136, 0.3)'
                        }}>
                            {name}
                        </span>
                    </Link>
                </div>

                <RightNavigation className={'flex h-full items-center justify-center'}>
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
                            <span className={'flex items-center w-6 h-6 rounded-full overflow-hidden border border-neutral-700 hover:border-accent transition-colors shadow-none hover:shadow-neon'}>
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
