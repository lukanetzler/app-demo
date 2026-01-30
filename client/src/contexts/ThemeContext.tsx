import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  mode: 'dark' | 'light';
  toggleMode: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

const MODE_STORAGE_KEY = 'calmandments-mode';

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Load mode from localStorage or default to 'light'
  const [mode, setMode] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(MODE_STORAGE_KEY) as 'dark' | 'light') || 'light';
    }
    return 'light';
  });

  // Apply dark class to document root
  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Save mode to localStorage
    localStorage.setItem(MODE_STORAGE_KEY, mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{
      mode,
      toggleMode
    }}>
      {children}
    </ThemeContext.Provider>
  );
}
