import React, { createContext, useContext, FC, ReactNode } from 'react';
import { DefaultTheme, MD3DarkTheme, Provider as PaperProvider } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeProviderProps {
    children: ReactNode;
}

interface ThemeContextProps {
    theme: typeof DefaultTheme | typeof MD3DarkTheme;
    isDarkMode: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
    const deviceColorScheme = useColorScheme();
    const isDarkMode = deviceColorScheme === 'dark';

    const [theme, setTheme] = React.useState<typeof DefaultTheme | typeof MD3DarkTheme>(
        isDarkMode ? MD3DarkTheme : DefaultTheme
    );

    const toggleTheme = () => {
        const newTheme = theme === DefaultTheme ? MD3DarkTheme : DefaultTheme;
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
            <PaperProvider theme={theme}>{children}</PaperProvider>
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