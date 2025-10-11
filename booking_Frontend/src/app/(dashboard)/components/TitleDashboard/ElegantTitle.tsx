import React from "react";

interface TitleProps {
  title: string;
  className?: string;
}

const ElegantTitle: React.FC<TitleProps> = ({ title, className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 titleFont">
        {title}
      </h2>
      <div className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-black to-white rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-24 h-1 bg-gradient-to-r  from-black/40 to-white/50 rounded-full opacity-30"></div>
    </div>
  );
};

export default ElegantTitle;
