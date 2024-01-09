import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAsQtp8TLnRNbtEuLK17I16v1K0uYss08g",
    authDomain: "rn-todofireapp.firebaseapp.com",
    projectId: "rn-todofireapp",
    storageBucket: "rn-todofireapp.appspot.com",
    messagingSenderId: "547436192907",
    appId: "1:547436192907:web:bdd47dcfb47dac93a7a08e"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const AUTH = getAuth(FIREBASE_APP);
