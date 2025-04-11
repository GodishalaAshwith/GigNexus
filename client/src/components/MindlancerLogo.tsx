
import React from "react";

export const MindlancerLogo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="40" height="40" rx="8" fill="#2272EB" />
      <path
        d="M29 11L25.5 15L22 11L11 11L11 29H15L15 17L18.5 21L22 17L22 29H29V11Z"
        fill="white"
      />
    </svg>
  );
};
