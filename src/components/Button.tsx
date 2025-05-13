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
      className={`px-6 py-3 ${
        disabled
          ? "bg-gray-400 text-gray-200 opacity-70"
          : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 active:scale-95"
      } text-white rounded-lg transition-all duration-200 touch-manipulation ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;