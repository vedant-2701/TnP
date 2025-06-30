import React from 'react';
import { SearchX, FileSearch, Briefcase, ArrowRight } from 'lucide-react';


const NoCompaniesFound= ({
  onAction,
  actionLabel = 'Browse Companies',
  message = 'You haven\'t applied to any companies yet.',
  type = 'application',
}) => {
  // Different icons based on context type
  const icons = {
    application: Briefcase,
    search: SearchX,
    general: FileSearch,
  };
  
  const Icon = icons[type];
  
  return (
    <div className="w-full flex flex-col items-center justify-center px-4 py-12 bg-white rounded-lg shadow-sm">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-blue-50 rounded-full scale-150 opacity-30 animate-pulse"></div>
        <Icon className="relative w-16 h-16 text-blue-500" strokeWidth={1.5} />
      </div>
      
      <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 text-center">
        No Companies Found
      </h3>
      
      <p className="text-gray-600 mb-8 text-center max-w-md">
        {message}
      </p>
    </div>
  );
};

export default NoCompaniesFound;