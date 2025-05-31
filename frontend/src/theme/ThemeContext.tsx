// src/theme/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // =======================================================================================
  // ¡¡¡ CAMBIO CRÍTICO AQUÍ: Aseguramos que body SIEMPRE tenga la clase del tema y el data-theme !!!
  // =======================================================================================
  useEffect(() => {
    // Elimina cualquier clase de tema previa
    document.body.classList.remove('light', 'dark');
    // Añade la clase del tema actual
    document.body.classList.add(theme);
    // Y también el atributo data-theme para tu CSS
    document.body.setAttribute('data-theme', theme);

    // Opcional: Asegúrate de que Ionic también reconozca el tema globalmente si es necesario
    // if (document.body.classList.contains('ion-color-scheme-light')) {
    //   document.body.classList.remove('ion-color-scheme-light');
    // }
    // if (document.body.classList.contains('ion-color-scheme-dark')) {
    //   document.body.classList.remove('ion-color-scheme-dark');
    // }
    // document.body.classList.add(`ion-color-scheme-${theme}`); // Esto asegura que Ionic sepa el tema

  }, [theme]);

  // Efecto para escuchar CAMBIOS en la preferencia del sistema operativo en tiempo real.
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };
    prefersDark.addEventListener('change', handleChange);
    return () => {
      prefersDark.removeEventListener('change', handleChange);
    };
  }, []);

  const contextValue: ThemeContextType = {
    theme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider');
  }
  return context;
};