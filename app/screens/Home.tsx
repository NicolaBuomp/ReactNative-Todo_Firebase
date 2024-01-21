import { StyleSheet, Text, View, Platform } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'react-native-paper'
import * as Notifications from 'expo-notifications'

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const Home = () => {
    function notificationHandler() {
        Notifications.scheduleNotificationAsync({
            content: {
                title: 'Look at that notification',
                body: "I'm so proud of myself!",
            },
            trigger: null,
        });
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Button mode='contained' onPress={notificationHandler}>Notifica</Button>
        </View>
    )
}

export default Home

const styles = StyleSheet.create({})