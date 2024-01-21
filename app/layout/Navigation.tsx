import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import AuthScreens from './AuthScreens'
import AuthenticatedScreens from './AuthenticatedScreens'
import Loading from '../components/Loading'
import { ThemeProvider } from '../../context/ThemeContext'
import { useAuth } from '../hook/useAuth'

function Navigation() {
    const { user } = useAuth();

    return (
        <NavigationContainer>
            <ThemeProvider>
                {(!user ? <AuthScreens /> : <AuthenticatedScreens />)}
                <Loading />
            </ThemeProvider>
        </NavigationContainer>
    );
}


export default Navigation