import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext({
    token: '',
    isAuthenticated: false,
    authenticate: (token: any, user: any) => { },
    logout: () => { },
    user: {} as any
});

function AuthContextProvider({ children }: any) {
    const [authToken, setAuthToken] = useState('');
    const [user, setUser] = useState<any>();

    useEffect(() => {
        async function fetchToken() {
            const storedToken = await AsyncStorage.getItem('token')

            if (storedToken) {
                setAuthToken(storedToken)
            }
        }
        fetchToken()
    }, [])

    function authenticate(token: string, user: any) {
        setAuthToken(token);
        setUser(user)
        AsyncStorage.setItem('token', token)
    }

    function logout() {
        setAuthToken('');
        setUser({})
        AsyncStorage.removeItem('token')
    }

    const value = {
        token: authToken,
        user: user,
        isAuthenticated: !!authToken,
        authenticate: authenticate,
        logout: logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
