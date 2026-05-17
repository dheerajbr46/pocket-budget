import { createContext, useContext } from 'react';

const CurrencyContext = createContext('USD');

export function CurrencyProvider({ children, currency }) {
  return (
    <CurrencyContext.Provider value={currency}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
