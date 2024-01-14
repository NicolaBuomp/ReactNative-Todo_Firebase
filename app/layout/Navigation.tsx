import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { NavigationContainer } from '@react-navigation/native'
import AuthScreens from './AuthScreens'
import AuthenticatedScreens from './AuthenticatedScreens'
import Loading from '../components/Loading'
import { ThemeProvider } from '../../context/ThemeContext'

function Navigation() {
    const authCtx = useContext(AuthContext);
    return (
        <NavigationContainer>
            <ThemeProvider>
                {(!authCtx.isAuthenticated ? <AuthScreens /> : <AuthenticatedScreens />)}
                <Loading />
            </ThemeProvider>
        </NavigationContainer>
    );
}


export default Navigation