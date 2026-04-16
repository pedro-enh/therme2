import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faSearch, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
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
        ${tw`flex items-center h-full no-underline text-neutral-400 px-3 cursor-pointer transition-colors duration-200 relative`};

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
                background: '#0b0c13', 
                borderBottom: '1px solid transparent',
            }}
        >
            <SpinnerOverlay visible={isLoggingOut} />
            <div className={'mx-auto w-full flex items-center h-[5rem] max-w-[1400px] px-8'}>
                {showSidebar && !children && (
                    <button
                        className='navbar-button text-neutral-400 hover:text-white transition-colors duration-200 px-4 lg:hidden mr-4'
                        onClick={onTriggerNavButton}
                    >
                        <FontAwesomeIcon icon={faBars} size="lg" />
                    </button>
                )}

                {!children ? (
                    <div id={'logo'} className={'flex-1'}>
                        <Link
                            to={'/'}
                            className={
                                'text-2xl font-black tracking-tighter no-underline text-white transition-colors duration-300 flex items-center gap-1 hover:text-neutral-300'
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

                <RightNavigation className={'flex h-full items-center justify-end gap-5'}>
                    <div css={tw`text-neutral-400 hover:text-white transition-colors cursor-pointer`}>
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                    
                    <div css={tw`text-neutral-400 hover:text-white transition-colors cursor-pointer relative`}>
                        <FontAwesomeIcon icon={faBell} />
                        <div css={tw`absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0b0c13]`} />
                    </div>

                    <Tooltip placement={'bottom'} content={'Account Settings'}>
                        <NavLink to={'/account'}>
                            <div className={'flex items-center w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500/20 hover:border-blue-500 transition-all shadow-lg bg-neutral-800'}>
                                <Avatar.User />
                            </div>
                        </NavLink>
                    </Tooltip>

                    {rootAdmin && (
                        <div css={tw`h-8 w-[1px] bg-neutral-800 mx-2 hidden md:block`} />
                    )}

                    <Tooltip placement={'bottom'} content={'Sign Out'}>
                        <button onClick={onTriggerLogout} css={tw`text-neutral-500 hover:text-red-400 transition-colors ml-2`}>
                            <FontAwesomeIcon icon={faSignOutAlt} />
                        </button>
                    </Tooltip>
                </RightNavigation>
            </div>
        </div>
    );
};
