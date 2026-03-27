"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { type Currency, currencies, getSavedCurrency, saveCurrency } from "./currency";

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (code: string) => void;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: currencies[0],
  setCurrency: () => {},
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(currencies[0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCurrencyState(getSavedCurrency());
    setMounted(true);
  }, []);

  function setCurrency(code: string) {
    const c = currencies.find((cur) => cur.code === code) ?? currencies[0];
    setCurrencyState(c);
    saveCurrency(code);
  }

  if (!mounted) return null;

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
