import React from "react";

type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

const Button = ({
  onClick,
  children,
  className = "",
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2 ${
        disabled
          ? "bg-gray-400 text-gray-200 opacity-70"
          : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
      } text-white rounded-lg transition-all duration-200 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
