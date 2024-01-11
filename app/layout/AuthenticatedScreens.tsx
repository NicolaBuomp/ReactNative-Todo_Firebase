import { Alert, StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import { getAuth } from 'firebase/auth'
import { List, CreateTodoScreen } from '../screens'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthContext } from '../../context/AuthContext'
import { LoadingContext } from '../../context/LoadingContext'
import { IconButton } from 'react-native-paper'

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

    const LogoutRender = () => <IconButton 
        icon='exit-to-app'
        onPress={logout}
        mode='contained'
        animated
        />
    
    return (
        <Stack.Navigator initialRouteName='Home' >
            <Stack.Screen name="list" component={List} options={{
                headerRight: () => <LogoutRender />,
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