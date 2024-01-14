
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen, Signup } from '../screens';
import { useTheme } from '../../context/ThemeContext';
import { IconButton, MD3DarkTheme } from 'react-native-paper';

const Stack = createNativeStackNavigator();




const AuthScreens = () => {
    const { toggleTheme, theme } = useTheme();
    const darkMode = theme === MD3DarkTheme;

    const SwitchThemeRender = () => <IconButton
        icon={darkMode ? 'white-balance-sunny' : 'moon-waxing-crescent'}
        onPress={toggleTheme}
        mode='contained'
        animated
    />
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} options={{
                headerRight: () => <SwitchThemeRender />,
                headerTintColor: theme.colors.primary,
                headerStyle: { backgroundColor: theme.colors.background }
            }} />
            <Stack.Screen name="signup" component={Signup} options={{
                headerRight: () => <SwitchThemeRender />,
                headerTintColor: theme.colors.primary,
                headerStyle: { backgroundColor: theme.colors.background }
            }} />
        </Stack.Navigator >
    )
}

export default AuthScreens