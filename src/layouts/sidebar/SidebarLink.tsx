import React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';
import { baseLinkClasses, activeLinkClasses } from './sidebarConstants';
import clsx from 'clsx';

interface SidebarLinkProps extends NavLinkProps {
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
  // Allow all data-* attributes (like data-tooltip-id)
  [key: `data-${string}`]: string | boolean | number | undefined | string;
}

export const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, isCollapsed, ...rest }) => {
  return (
    <NavLink
      to={to}
      aria-label={label}
      data-tooltip-id={isCollapsed ? "sidebar-tooltip" : undefined}
      data-tooltip-content={label}
      data-tooltip-disabled={!isCollapsed}
      className={({ isActive }) => clsx(
        baseLinkClasses,
        isActive && activeLinkClasses,
        isCollapsed && 'justify-center'
      )}
      {...rest}>
      <div className="flex items-center">
        {/* Icon wrapped in a div with fixed width for consistent layout */}
        <div className="flex-shrink-0" aria-hidden="true">
          {icon}
        </div>
        <span 
          className={`overflow-hidden transition-all duration-200 whitespace-nowrap ${isCollapsed ? 'w-0' : 'w-auto ml-3'}`}
          aria-label={label}
        >
          {label}
        </span>
      </div>
    </NavLink>
  );
};