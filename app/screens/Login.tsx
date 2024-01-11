import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { AUTH } from '../../firebaseConfig';
import { AuthContext } from '../../context/AuthContext';
import { LoadingContext } from '../../context/LoadingContext';
import { Button, TextInput } from 'react-native-paper'

const LoginScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('test@test.com');
    const [password, setPassword] = useState('123456');

    const authCtx = useContext(AuthContext)
    const loadingCtx = useContext(LoadingContext)

    const handleLogin = async () => {
        loadingCtx.enableLoading()
        try {
            const userCredential = await signInWithEmailAndPassword(AUTH, email, password)
            const token = await userCredential.user.getIdToken();
            authCtx.authenticate(token, userCredential.user);
        } catch (error:any) {
            Alert.alert('Errore', error.code);
        } finally {
            loadingCtx.disableLoading()
        }
    };

    return (
        // <KeyboardAvoidingView behavior='padding'>
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                label="Inserisci l'email"
                value={email}
                onChangeText={text => setEmail(text)}
                mode="outlined"
            />
            <TextInput
                label="Password"
                onChangeText={text => setPassword(text)}
                value={password}
                mode="outlined"
                right={<TextInput.Affix text="/100" />}
            />
            <Button mode='contained' onPress={handleLogin}>
                Login
            </Button>
        </View>
        // </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
    },
});

export default LoginScreen;