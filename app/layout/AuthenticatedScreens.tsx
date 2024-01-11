import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { getAuth } from 'firebase/auth'
import { List, CreateTodoScreen } from '../screens'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthContext } from '../../context/AuthContext'
import { LoadingContext } from '../../context/LoadingContext'
import { MaterialIcons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();

const AuthenticatedScreens = () => {
    const authCtx = useContext(AuthContext)
    const loadingCtx = useContext(LoadingContext)
    function logout() {
        loadingCtx.enableLoading()
        getAuth().signOut().then(() => {
            authCtx.logout()
        }).catch((error) => {
            Alert.alert(error.code, '')
        }).finally(() => loadingCtx.disableLoading())
    }
    return (
        <Stack.Navigator initialRouteName='Home' >
            <Stack.Screen name="list" component={List} options={{
                headerRight: () => <Pressable onPress={logout}><MaterialIcons name="logout" size={24} color="black" /></Pressable>,
                headerTitle: 'Promemoria'
            }} />
            <Stack.Screen name="CreateToto" component={CreateTodoScreen} options={{
                headerTitle: 'Crea Promemoria',
                headerBackTitle: 'Annulla'
            }} />
        </Stack.Navigator>
    )
}

export default AuthenticatedScreens

const styles = StyleSheet.create({})