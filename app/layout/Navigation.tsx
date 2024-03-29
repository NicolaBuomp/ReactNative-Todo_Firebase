import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { NavigationContainer } from '@react-navigation/native'
import AuthScreens from './AuthScreens'
import AuthenticatedScreens from './AuthenticatedScreens'
import Loading from '../components/Loading'
import { ThemeProvider } from '../../context/ThemeContext'
import { useAuth } from '../hook/useAuth'

function Navigation() {
    const { user } = useAuth();

    console.log(user);
    
    
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