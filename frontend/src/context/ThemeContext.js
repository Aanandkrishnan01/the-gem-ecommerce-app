import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ThemeContext = createContext();

const themeReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return {
        ...state,
        isDarkMode: !state.isDarkMode
      };
    case 'SET_THEME':
      return {
        ...state,
        isDarkMode: action.payload
      };
    case 'SET_SYSTEM_PREFERENCE':
      return {
        ...state,
        systemPreference: action.payload
      };
    default:
      return state;
  }
};

const initialState = {
  isDarkMode: false,
  systemPreference: 'light'
};

export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Check for saved theme preference or default to system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      dispatch({ type: 'SET_THEME', payload: savedTheme === 'dark' });
    } else {
      dispatch({ type: 'SET_THEME', payload: systemPrefersDark });
    }
    
    dispatch({ type: 'SET_SYSTEM_PREFERENCE', payload: systemPrefersDark ? 'dark' : 'light' });
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (state.isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    
    // Save theme preference
    localStorage.setItem('theme', state.isDarkMode ? 'dark' : 'light');
  }, [state.isDarkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      dispatch({ type: 'SET_SYSTEM_PREFERENCE', payload: e.matches ? 'dark' : 'light' });
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const setTheme = (isDark) => {
    dispatch({ type: 'SET_THEME', payload: isDark });
  };

  const value = {
    isDarkMode: state.isDarkMode,
    systemPreference: state.systemPreference,
    toggleTheme,
    setTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;