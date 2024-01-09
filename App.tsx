
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import List from './app/screens/List';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, SafeAreaView, Platform, StatusBar, View } from 'react-native';
import { I18nManager } from 'react-native';
import moment from 'moment';
import 'moment/min/locales';
import HomeScreen from './app/screens/Home';
import Loading from './components/Loading';
import LoadingContextProvider, { LoadingContext } from './store/LoadingContext';
import LoginScreen from './app/screens/Login';
import AuthContextProvider, { AuthContext } from './store/AuthContext';
import { useContext } from 'react';

// Imposta il locale per l'intera app
I18nManager.allowRTL(false);
moment.locale('it');

const Stack = createNativeStackNavigator();


function AuthenticatedScreens() {
  return (
    <Stack.Navigator initialRouteName='Home' >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="List" component={List} options={{
        headerTitle: 'Promemoria'
      }} />
    </Stack.Navigator>
  )
}

function AuthScreens() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator >
  )

}

function Navigation() {
  const authCtx = useContext(AuthContext)

  return (
    <NavigationContainer >
      {!authCtx.isAuthenticated ? <AuthScreens /> :
        <AuthenticatedScreens />}
      <Loading />
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <LoadingContextProvider>
          <AuthContextProvider>
            <Navigation />
          </AuthContextProvider>
        </LoadingContextProvider>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});



