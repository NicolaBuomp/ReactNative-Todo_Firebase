import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { LoadingContext } from '../store/LoadingContext'

const Loading = () => {

    const loadingCtx = useContext(LoadingContext)

    if (!loadingCtx.isLoading) {
        return null
    }

    return (
        <View style={styles.overlay}>
            <ActivityIndicator size="large" />
        </View>
    )
}

export default Loading

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#0000005b',
        position: 'absolute',
        height: '100%',
        width: '100%'
    }
})