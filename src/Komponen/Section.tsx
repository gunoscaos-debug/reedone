
import React from 'react';

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, icon, children }) => {
  return (
    <div>
      <div className="flex items-center mb-2">
        {icon}
        <h3 className="ml-2 text-lg font-semibold text-slate-800">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Section;
