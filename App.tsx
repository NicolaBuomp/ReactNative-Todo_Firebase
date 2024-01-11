import { StyleSheet, StatusBar } from 'react-native';
import { I18nManager } from 'react-native';
import moment from 'moment';
import 'moment/min/locales';
import LoadingContextProvider from './context/LoadingContext';
import AuthContextProvider from './context/AuthContext';
import Navigation from './app/layout/Navigation';
import { it, registerTranslation } from 'react-native-paper-dates'
registerTranslation('it', it)
// Imposta il locale per l'intera app
I18nManager.allowRTL(false);
moment.locale('it');

export default function App() {
  return (
    <LoadingContextProvider style={{ flex: 1 }}>
      <StatusBar />
      <AuthContextProvider>
        <Navigation />
      </AuthContextProvider>
    </LoadingContextProvider>
  );
}

const styles = StyleSheet.create({});



