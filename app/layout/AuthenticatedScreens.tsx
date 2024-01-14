import { Alert, StyleSheet } from 'react-native'
import React, { useContext, useState } from 'react'
import { getAuth } from 'firebase/auth'
import { List, CreateTodoScreen } from '../screens'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthContext } from '../../context/AuthContext'
import { LoadingContext } from '../../context/LoadingContext'
import { IconButton } from 'react-native-paper'
import { useTheme } from '../../context/ThemeContext'
import MyMenu from '../components/Menu'

const Stack = createNativeStackNavigator();

const AuthenticatedScreens = () => {
    const { theme } = useTheme();

    return (
        <Stack.Navigator initialRouteName='Home' >
            <Stack.Screen name="list" component={List} options={{
                headerRight: () => <MyMenu />,
                headerTitle: 'Promemoria',
                headerTintColor: theme.colors.primary,
                headerStyle: { backgroundColor: theme.colors.background }
            }} />
            <Stack.Screen name="formTodo" component={CreateTodoScreen} options={{
                headerRight: () => <MyMenu />,
                headerTitle: 'Crea Promemoria',
                headerBackTitle: 'Annulla',
                headerTintColor: theme.colors.primary,
                headerStyle: { backgroundColor: theme.colors.background }
            }} />
        </Stack.Navigator>
    )
}

export default AuthenticatedScreens

const styles = StyleSheet.create({})