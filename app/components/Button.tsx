"use client";
import React from "react";

export const PrimaryButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 "
      >
      {children}
      </button>
    </div>
  );
};


export const SecondaryButton = ({
    children , onClick , prefix
} : {
    children : React.ReactNode
    onClick : () => void
    prefix? : React.ReactNode
}) => {
    return (
        <div>
          <button
            type="button"
            onClick={onClick}
            className="text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg  px-5 py-2.5 me-2 mb-2 mt-3 "
          >
            <div>
                {prefix}
            </div>
            <div>
                {children}
            </div>
          </button>
        </div>
      );
}