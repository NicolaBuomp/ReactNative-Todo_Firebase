import { createContext, useState } from 'react';

export const AuthContext = createContext({
    token: '',
    isAuthenticated: false,
    authenticate: (token: any) => { },
    logout: () => { },
});

function AuthContextProvider({ children }: any) {
    const [authToken, setAuthToken] = useState('');

    function authenticate(token: string) {
        setAuthToken(token);
    }

    function logout() {
        setAuthToken('');
    }

    const value = {
        token: authToken,
        isAuthenticated: !!authToken,
        authenticate: authenticate,
        logout: logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
