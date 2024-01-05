import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const CustomPressable = ({ children, onPress }: any) => {
    return (
        <Pressable style={styles.pressable} onPress={onPress}>
            <Text>{children}</Text>
        </Pressable>
    )
}

export default CustomPressable

const styles = StyleSheet.create({
    pressable: {
        flexBasis: '48%',
        paddingHorizontal: 40,
        paddingVertical: 40,
        borderWidth: 0.4,
        borderRadius: 12,
        alignItems: 'center'
    }
})