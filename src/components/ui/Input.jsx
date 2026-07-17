'use client'

import React from 'react'
import Image from 'next/image'
import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';

const Input = ({
    id,
    label,
    type = "text",
    disabled,
    placeholder = "",
    required = false,
    onChange,
    value,
    className = "",
    icon = false,
    imgSrc,
    variant = "default",
    bare = false,
    ...rest
  }) => {

  const baseStyles =
    "w-full text-sm outline-none transition disabled:opacity-70 disabled:cursor-not-allowed";

  const variantStyles = {
    default:
      "px-4 py-2 h-10 font-light mt-2 bg-white border rounded pl-4 border-grey focus:border-primary text-blackDark placeholder:text-gray-400 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-primary",
    ghost:
      "bg-transparent placeholder:text-muted-foreground text-foreground dark:text-foreground dark:placeholder:text-muted-foreground",
  };

  return (
    <div className={variant === "ghost" || bare ? "flex-1 min-w-0" : ""}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm text-blackDark font-medium dark:text-gray-200"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...rest}
        className={cn(
          baseStyles,
          !bare && variantStyles[variant],
          className
        )}
      />
      {icon && (
        <Image
          src={imgSrc}
          alt="icon"
          className="absolute right-3 bottom-2 w-6 h-6"
        />
      )}
    </div>
  )
}

Input.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  icon: PropTypes.bool,
  imgSrc: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  variant: PropTypes.oneOf(["default", "ghost"]),
  bare: PropTypes.bool,
}

export default Input