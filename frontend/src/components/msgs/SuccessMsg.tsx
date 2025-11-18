import React from 'react';

const SuccessMsg: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  if (!children) return null;

  return (
    <div
      className="flex items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50"
      role="alert"
    >
      <svg
        className="flex-shrink-0 inline w-4 h-4 me-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 30 30"
      >
        <path d="M15,3C8.373,3,3,8.373,3,15c0,6.627,5.373,12,12,12s12-5.373,12-12C27,8.373,21.627,3,15,3z M21.707,12.707l-7.56,7.56 c-0.188,0.188-0.442,0.293-0.707,0.293s-0.52-0.105-0.707-0.293l-3.453-3.453c-0.391-0.391-0.391-1.023,0-1.414s1.023-0.391,1.414,0 l2.746,2.746l6.853-6.853c0.391-0.391,1.023-0.391,1.414,0S22.098,12.316,21.707,12.707z" />
      </svg>
      <span className="sr-only">Success</span>
      <div>
        <span className="font-medium">Success!</span> {children}
      </div>
    </div>
  );
};

export default SuccessMsg;