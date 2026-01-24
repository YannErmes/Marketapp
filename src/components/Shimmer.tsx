import React from "react";

interface ShimmerProps {
  className?: string;
}

const Shimmer = ({ className = "" }: ShimmerProps) => {
  return (
    <div
      aria-hidden
      className={`overflow-hidden bg-gray-100/60 dark:bg-slate-800/40 ${className}`}
    >
      <div className="w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
    </div>
  );
};

export default Shimmer;
