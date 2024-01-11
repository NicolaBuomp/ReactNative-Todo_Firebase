import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { LoadingContext } from '../../context/LoadingContext'

const Loading = () => {
    const loadingCtx = useContext(LoadingContext)

    if (!loadingCtx.isLoading) {
        return null
    }

    return (
        <View style={styles.overlay}>
            <ActivityIndicator size="large" color={Platform.OS === 'ios' ? '#FFF' : '#FFF'} />
        </View>
    )
}

export default Loading

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Platform.OS === 'ios' ? '#000000c5' : '#0000005b',
        position: 'absolute',
        height: '100%',
        width: '100%'
    },
})