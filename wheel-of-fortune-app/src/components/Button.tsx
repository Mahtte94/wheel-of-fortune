import React from "react";

type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
};

const Button = ({ onClick, children, className = "" }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
