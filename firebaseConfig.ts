import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAsQtp8TLnRNbtEuLK17I16v1K0uYss08g",
    authDomain: "rn-todofireapp.firebaseapp.com",
    projectId: "rn-todofireapp",
    storageBucket: "rn-todofireapp.appspot.com",
    messagingSenderId: "547436192907",
    appId: "1:547436192907:web:bdd47dcfb47dac93a7a08e"
};


const APP = initializeApp(firebaseConfig);
const AUTH = getAuth(APP);
const DB = getFirestore(APP);

export { APP, AUTH, DB };


