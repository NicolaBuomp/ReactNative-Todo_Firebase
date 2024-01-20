import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAsQtp8TLnRNbtEuLK17I16v1K0uYss08g",
  authDomain: "rn-todofireapp.firebaseapp.com",
  projectId: "rn-todofireapp",
  storageBucket: "rn-todofireapp.appspot.com",
  messagingSenderId: "547436192907",
  appId: "1:547436192907:web:bdd47dcfb47dac93a7a08e",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);

// Imposta la persistenza su AsyncStorage


export { app, auth, db };
