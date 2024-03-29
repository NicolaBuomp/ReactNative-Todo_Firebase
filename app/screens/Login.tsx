import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { AuthContext } from '../../context/AuthContext';
import { LoadingContext } from '../../context/LoadingContext';
import { Button, IconButton, TextInput } from 'react-native-paper'
import { useTheme } from '../../context/ThemeContext';
import { auth } from '../../firebaseConfig';

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
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
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
            <TextInput
                style={{ width: '90%', marginTop: 150 }}
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
            <View style={{ flexDirection: 'row', gap: 20 }}>
                <Button mode='outlined' onPress={() => navigation.navigate('signup')} style={{ width: 150 }}>
                    Registrati
                </Button>
                <Button mode='contained' onPress={handleLogin} style={{ width: 150 }}>
                    Login
                </Button>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        gap: 15,
    },
});

export default LoginScreen;