import React, { createContext, useState, useContext, useEffect } from 'react';
import { StatusBar } from 'react-native';

// Create the context
const ThemeContext = createContext();

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Update status bar when theme changes
  useEffect(() => {
    StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(isDarkMode ? '#1A1A1A' : '#FFFFFF');
    }
  }, [isDarkMode]);

  // Theme values
  const theme = {
    isDarkMode,
    toggleDarkMode,
    colors: isDarkMode 
      ? {
          // Dark theme colors
          primary: '#2D5F7C',
          background: '#1A1A1A',
          card: '#2A2A2A',
          surface: '#333333',
          text: '#FFFFFF',
          textSecondary: '#AAAAAA',
          border: '#444444',
          accent: '#FF6B6B',
        }
      : {
          // Light theme colors
          primary: '#2D5F7C',
          background: '#FFFFFF',
          card: '#FFFFFF',
          surface: '#F8F9FA',
          text: '#333333',
          textSecondary: '#666666',
          border: '#E0E0E0',
          accent: '#FF6B6B',
        }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}; 