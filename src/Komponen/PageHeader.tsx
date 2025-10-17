import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode; // Untuk menampung tombol atau elemen lain
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, children }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-slate-600">
            {subtitle}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center flex-shrink-0 space-x-3">
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
