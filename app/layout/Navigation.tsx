import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { NavigationContainer } from '@react-navigation/native'
import AuthScreens from './AuthScreens'
import AuthenticatedScreens from './AuthenticatedScreens'
import Loading from '../components/Loading'

const Navigation = () => {
    const authCtx = useContext(AuthContext)
    return (
        <NavigationContainer>
            {!authCtx.isAuthenticated ? <AuthScreens /> :
                <AuthenticatedScreens />}
            <Loading />
        </NavigationContainer>
    )
}

export default Navigation

const styles = StyleSheet.create({})