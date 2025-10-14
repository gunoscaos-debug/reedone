import React, { useState, useEffect } from 'react';
import { SidebarLink } from './SidebarLink';
import { useNavigate } from 'react-router-dom';
import { SidebarAction } from './SidebarAction';
import { Tooltip } from 'react-tooltip';
import { Home, BookUser, Users, School, ClipboardEdit, BarChart3, HelpCircle, Settings, Sun, Moon, ChevronsLeft, ChevronsRight, LogOut } from 'lucide-react';

// Custom hook for theme management
const useTheme = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        const newTheme = isDarkMode ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode(prevMode => !prevMode);

    return { isDarkMode, toggleTheme };
};

const navItems = [
    { to: '/dashboard', icon: <Home />, label: 'Dashboard' },
    { to: '/dashboard/guru', icon: <BookUser />, label: 'Data Guru' },
    { to: '/dashboard/manajemen-siswa', icon: <Users />, label: 'Data Siswa' },
    { to: '/dashboard/manajemen-kelas', icon: <School />, label: 'Manajemen Kelas' },
    { to: '/dashboard/penilaian', icon: <ClipboardEdit />, label: 'Penilaian' },
    { to: '/dashboard/raport-ai', icon: <BarChart3 />, label: 'Raport AI' },
];

const bottomNavItems = [
    { to: '/dashboard/bantuan', icon: <HelpCircle />, label: 'Bantuan' },
    { to: '/dashboard/pengaturan', icon: <Settings />, label: 'Pengaturan' },
];

interface SidebarProps {
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false, onToggleCollapse }) => {
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();

    const handleLogout = () => {
        // Remove login status from localStorage
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        // Redirect user to login page
        navigate('/login');
    };

    return (
        <aside className={`flex flex-col h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
            {/* Sidebar Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-700">
                <div className={`flex items-center gap-2 overflow-hidden transition-opacity ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                    <School className="h-6 w-6 text-primary-600" />
                    <span className="font-bold text-lg text-slate-800 dark:text-white whitespace-nowrap">
                        App Sekolah
                    </span>
                </div>
                <div className="flex items-center space-x-1">
                    <button onClick={toggleTheme} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">
                        {isDarkMode ? <Sun /> : <Moon />}
                    </button>
                </div>
                {/* Collapse button only on desktop */}
                {onToggleCollapse && (
                    <button
                        onClick={onToggleCollapse}
                        className="hidden md:block p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
                    </button>
                )}
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <SidebarLink
                        key={item.to}
                        to={item.to}
                        icon={item.icon}
                        label={item.label}
                        isCollapsed={isCollapsed}
                    />
                ))}
            </nav>

            {/* Bottom Navigation & Logout */}
            <div className="border-t border-slate-200 dark:border-slate-700">
                <div className="p-2 space-y-1">
                    {bottomNavItems.map((item) => (
                        <SidebarLink
                            key={item.to}
                            to={item.to}
                            icon={item.icon}
                            label={item.label}
                            isCollapsed={isCollapsed}
                        />
                    ))}
                </div>
                <div className="p-2 border-t border-slate-200 dark:border-slate-700">
                    <SidebarAction
                        icon={<LogOut />}
                        label="Logout"
                        onClick={handleLogout}
                        isCollapsed={isCollapsed}
                        className="!text-red-500 hover:!bg-red-50 dark:hover:!bg-red-900/50"
                    />
                </div>
            </div>

            {/* Tooltip for collapsed mode */}
            {isCollapsed && <Tooltip id="sidebar-tooltip" place="right" effect="solid" />}
        </aside>
    );
};

export default Sidebar;