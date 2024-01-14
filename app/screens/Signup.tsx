import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { Button, TextInput, IconButton } from 'react-native-paper'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { AUTH, DB } from '../../firebaseConfig'
import { addDoc, collection } from '@firebase/firestore'
import { LoadingContext } from '../../context/LoadingContext'
import { AuthContext } from '../../context/AuthContext'

const Signup = ({ navigation }: any) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [displayName, setDisplayName] = useState('')
    const [emailError, setEmailError] = useState('');

    const { theme } = useTheme()

    const authCtx = useContext(AuthContext)
    const loadingCtx = useContext(LoadingContext)

    const onRegisterPress = async () => {
        loadingCtx.enableLoading()

        try {
            const userCredential = await createUserWithEmailAndPassword(AUTH, email, password);
            const user = userCredential.user;
            await updateProfile(user, { displayName });

            await addDoc(collection(DB, 'users'), {
                id: user.uid,
                displayName,
                email,
            });
            handleLogin()
        } catch (error) {
            console.log(error);
        } finally {
            loadingCtx.disableLoading()
        }
    };

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(AUTH, email, password)
            const token = await userCredential.user.getIdToken();
            authCtx.authenticate(token, userCredential.user);
        } catch (error: any) {
        }
    };


    const validateEmail = (inputText: any) => {
        // Utilizza un'espressione regolare per la validazione dell'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(inputText);
        return isValid;
    };

    const handleEmailChange = (text: any) => {
        setEmail(text);
        // Validazione dell'email e impostazione di un eventuale messaggio di errore
        if (!validateEmail(text)) {
            setEmailError('Inserisci un indirizzo email valido');
        } else {
            setEmailError('');
        }
    };
    return (
        <View style={{ ...styles.container, backgroundColor: theme.colors.background }}>
            <TextInput
                style={{ width: '90%', marginTop: 150 }}
                label="Email"
                value={email}
                onChangeText={handleEmailChange}
                mode="outlined"
                error={emailError ? true : false}
            />
            <TextInput
                label="Password"
                value={password}
                onChangeText={text => setPassword(text)}
                mode="outlined"
                secureTextEntry={secureTextEntry}
                right={
                    <IconButton
                        icon={secureTextEntry ? 'eye' : 'eye-off'}
                        onPress={() => { }}
                    />
                }
                style={{ width: '90%' }}
            />
            <TextInput
                style={{ width: '90%' }}
                label="Nome Completo"
                value={displayName}
                onChangeText={text => setDisplayName(text)}
                mode="outlined"
            />
            <Button mode='contained' onPress={onRegisterPress}>
                Registrati
            </Button>
        </View>
    )
}

export default Signup

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        gap: 15,
    },
})