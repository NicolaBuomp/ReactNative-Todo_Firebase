import { Platform, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { LoadingContext } from '../../context/LoadingContext'
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';

const Loading = () => {
    const { theme } = useTheme()
    const loadingCtx = useContext(LoadingContext)

    if (!loadingCtx.isLoading) {
        return null
    }

    return (
        <View style={{ ...styles.overlay, backgroundColor: theme.colors.background }}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
    )
}

export default Loading

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        position: 'absolute',
        height: '100%',
        width: '100%'
    },
})