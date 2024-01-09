import { createContext, useState } from "react";

export const LoadingContext = createContext({
    isLoading: false,
    enableLoading: () => { },
    disableLoading: () => { }
});

function LoadingContextProvider({ children }: any) {
    const [loading, setLoading] = useState(false)

    function enableLoading() {
        setLoading(true)
    }

    function disableLoading() {
        setLoading(false)
    }

    const value = {
        isLoading: !!loading,
        disableLoading: disableLoading,
        enableLoading: enableLoading
    }

    return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
}

export default LoadingContextProvider