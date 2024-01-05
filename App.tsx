
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import List from './app/screens/List';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, SafeAreaView, Platform, StatusBar, View } from 'react-native';
import { I18nManager } from 'react-native';
import moment from 'moment';
import 'moment/min/locales';
import HomeScreen from './app/screens/Home';

// Imposta il locale per l'intera app
I18nManager.allowRTL(false);
moment.locale('it');
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: 5 }}>
      <StatusBar />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer >
          <Stack.Navigator initialRouteName='Home' >
            <Stack.Screen name="Home" component={HomeScreen} options={{
              headerShown: false
            }} />
            <Stack.Screen name="List" component={List} options={{
              headerTitle: 'Promemoria'
            }} />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});



