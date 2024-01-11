import { Alert, KeyboardAvoidingView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { AUTH } from '../../firebaseConfig';
import { AuthContext } from '../../context/AuthContext';
import { LoadingContext } from '../../context/LoadingContext';

const LoginScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('test@test.com');
    const [password, setPassword] = useState('123456');

    const authCtx = useContext(AuthContext)
    const loadingCtx = useContext(LoadingContext)

    const handleLogin = async () => {
        loadingCtx.enableLoading()
        try {
            const userCredential = await signInWithEmailAndPassword(AUTH, email, password);
            const token = await userCredential.user.getIdToken();
            authCtx.authenticate(token, userCredential.user);
        } catch (error) {
            Alert.alert('Errore', 'Riprova');
            console.log(error);
        } finally {
            loadingCtx.disableLoading()
        }
    };

    return (
        // <KeyboardAvoidingView behavior='padding'>
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Inserisci l'email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={text => setEmail(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                onChangeText={text => setPassword(text)}
                value={password}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
        // </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        width: '80%',
        borderWidth: 1,
        borderColor: 'grey',
        padding: 10,
        marginBottom: 10,
    },
    button: {
        width: '80%',
        backgroundColor: 'blue',
        padding: 10,
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
    },
});

export default LoginScreen;