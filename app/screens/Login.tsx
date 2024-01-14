import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { AUTH } from '../../firebaseConfig';
import { AuthContext } from '../../context/AuthContext';
import { LoadingContext } from '../../context/LoadingContext';
import { Button, IconButton, TextInput } from 'react-native-paper'
import { useTheme } from '../../context/ThemeContext';

const LoginScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('test@test.com');
    const [password, setPassword] = useState('123456');
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const authCtx = useContext(AuthContext)
    const loadingCtx = useContext(LoadingContext)
    const { theme } = useTheme()

    const handlePasswordVisibility = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    const handleLogin = async () => {
        loadingCtx.enableLoading()
        try {
            const userCredential = await signInWithEmailAndPassword(AUTH, email, password)
            const token = await userCredential.user.getIdToken();
            authCtx.authenticate(token, userCredential.user);
        } catch (error: any) {
            Alert.alert('Errore', error.code);
        } finally {
            loadingCtx.disableLoading()
        }
    };

    return (
        <View style={{ ...styles.container, backgroundColor: theme.colors.background }}>
            <Text style={{ ...styles.title, color: theme.colors.onBackground }}>Login</Text>
            <TextInput
                style={{ width: '90%' }}
                label="Inserisci l'email"
                value={email}
                onChangeText={text => setEmail(text)}
                mode="outlined"

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
                        onPress={handlePasswordVisibility}
                    />
                }
                style={{ width: '90%' }}
            />
            <Button mode='contained' onPress={handleLogin}>
                Login
            </Button>
        </View>
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