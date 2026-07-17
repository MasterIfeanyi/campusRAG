"use client";
import React from "react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

const Button = ({
  className = "",
  onClick,
  disabled,
  type = "button",
  loading,
  variant = "primary",
  size = "",
  icon,
  children,
  bare = false,
}) => {
  const baseStyles =
    "relative transition font-semibold focus:outline-none flex gap-2 justify-center items-center";

  const variantStyles = {
    primary:
      "bg-primary hover:bg-primary-dark text-white dark:bg-primary dark:hover:bg-primary-dark",
    danger:
      "bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-700",
    secondary:
      "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100",
    neutral:
      "bg-white hover:bg-gray-50 text-coolGrey border border-btnInactive dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
    other:
      "bg-transparent hover:bg-gray-100 text-coolGrey border border-gray-300 dark:hover:bg-gray-800 dark:text-gray-300 dark:border-gray-600",
    ghost:
      "bg-transparent hover:opacity-80 text-primary dark:text-primary",
  };

  const sizeStyles = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-base w-full",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      className={cn(
        baseStyles,
        !bare && variantStyles[variant],
        !bare && sizeStyles[size],
        (disabled || loading) && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {icon && icon}
      {children}
      {loading && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 rounded-full border-b-2 border-white animate-spin"></div>
        </div>
      )}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "danger",
    "neutral",
    "other",
    "ghost",
  ]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  className: PropTypes.string,
  bare: PropTypes.bool,
};

export default Button;