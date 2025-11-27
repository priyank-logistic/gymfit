"use client";

import React from "react";

export default function Button({
  children,
  type = "button",
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
  className = "",
  ...props
}) {
  const baseStyles =
    "w-full px-6 py-3 rounded-lg font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-[#f2b705] text-black hover:bg-[#d4a004] focus:ring-[#f2b705] active:bg-[#d4a004]",
    secondary:
      "bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-500 active:bg-gray-600 border border-[#f2b705]/20",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
