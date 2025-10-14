import React from 'react';
import { baseLinkClasses } from './sidebarConstants'; // Reuse styles for consistency
import clsx from 'clsx';

interface SidebarActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
}

export const SidebarAction: React.FC<SidebarActionProps> = ({ icon, label, isCollapsed, className, ...rest }) => {
  return (
    <button
      data-tooltip-id={isCollapsed ? "sidebar-tooltip" : undefined}
      data-tooltip-content={label}
      className={clsx(
        baseLinkClasses,
        'w-full',
        { 'justify-center': isCollapsed },
        className
      )}
      {...rest}
    >
      {icon}
      <span className={`overflow-hidden transition-all duration-200 whitespace-nowrap ${isCollapsed ? 'w-0' : 'w-auto ml-3'}`}>
        {label}
      </span>
    </button>
  );
};