import React, { createContext, useState, useEffect } from 'react';

export const SalarioMinimoContext = createContext();

export function SalarioMinimoProvider({ children }) {
  const SALARIO_KEY = 'salarioMinimoColombia';
  const salarioMinimoDefault = 1423500;
  const [salarioMinimo, setSalarioMinimo] = useState(() => {
    const saved = localStorage.getItem(SALARIO_KEY);
    return saved ? parseInt(saved, 10) : salarioMinimoDefault;
  });

  useEffect(() => {
    localStorage.setItem(SALARIO_KEY, salarioMinimo);
  }, [salarioMinimo]);

  return (
    <SalarioMinimoContext.Provider value={{ salarioMinimo, setSalarioMinimo }}>
      {children}
    </SalarioMinimoContext.Provider>
  );
} 