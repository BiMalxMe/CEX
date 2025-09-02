"use client";
import React from "react";

export const PrimaryButton = ({
  children,
  onClick,
  disabled,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) => {
  return (
    <div>
      <button
      {...disabled && {disabled}}
        type="button"
        onClick={onClick}
        className={`text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${className}`}
      >
        {children}
      </button>
    </div>
  );
};

export const SecondaryButton = ({
  children,
  onClick,
  prefix,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  prefix?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        className={`text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg  px-5 py-2.5 me-2 mb-2 mt-3 ${className}`}
      >
        <div>{prefix}</div>
        <div>{children}</div>
      </button>
    </div>
  );
};

export const TabButton = ({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`${
        active
          ? "text-white bg-blue-600"
          : "text-gray-900 bg-blue-200 hover:bg-blue-300"
      } font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 mt-6 w-full flex items-center justify-center`}
    >
      {children}
    </button>
  );
};
