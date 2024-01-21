import { StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { Todos, FormTodo, Home } from '../screens'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useTheme } from '../../context/ThemeContext'
import MyMenu from '../components/Menu'

const Stack = createNativeStackNavigator();



const AuthenticatedScreens = () => {
    const { theme } = useTheme();

    return (
        <Stack.Navigator initialRouteName='home' >
            <Stack.Screen name="home" component={Home} options={{
                headerRight: () => <MyMenu />,
                headerTitle: 'Home',
                headerTintColor: theme.colors.primary,
                headerStyle: { backgroundColor: theme.colors.background }
            }} />
            <Stack.Screen name="todos" component={Todos} options={{
                headerRight: () => <MyMenu />,
                headerTitle: 'Promemoria',
                headerTintColor: theme.colors.primary,
                headerStyle: { backgroundColor: theme.colors.background }
            }} />
            <Stack.Screen name="formTodo" component={FormTodo} options={{
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