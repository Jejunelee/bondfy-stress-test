// contexts/BondContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface BondContextType {
  bondSize: number;
  tenor: number;
  couponRate: number;
  setBondSize: (value: number) => void;
  setTenor: (value: number) => void;
  setCouponRate: (value: number) => void;
}

const BondContext = createContext<BondContextType | undefined>(undefined);

export const BondProvider = ({ children }: { children: ReactNode }) => {
  const [bondSize, setBondSize] = useState(400_000_000);
  const [tenor, setTenor] = useState(7);
  const [couponRate, setCouponRate] = useState(0.06);

  return (
    <BondContext.Provider
      value={{
        bondSize,
        tenor,
        couponRate,
        setBondSize,
        setTenor,
        setCouponRate,
      }}
    >
      {children}
    </BondContext.Provider>
  );
};

export const useBondContext = () => {
  const context = useContext(BondContext);
  if (context === undefined) {
    throw new Error("useBondContext must be used within a BondProvider");
  }
  return context;
};