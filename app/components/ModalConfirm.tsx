import { Button, Modal, Portal } from 'react-native-paper';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const ModalConfirm = ({ visible, onDismiss, onConfirmDelete, text }: any) => {
    const { theme } = useTheme()
    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={{ marginHorizontal: 20, borderRadius: 6, backgroundColor: theme.colors.background, height: 120 }}>
                <View style={{ flex: 1, justifyContent: 'space-between', marginVertical: 15, marginLeft: 10 }}>
                    <Text style={{ fontSize: 18, color: theme.colors.onBackground }}>{text}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 15, marginRight: 10 }}>
                        <Button mode="outlined" onPress={onDismiss} elevation={0}>
                            Annulla
                        </Button>
                        <Button buttonColor='red' mode="contained" onPress={onConfirmDelete} elevation={0} textColor='#FFF'>
                            Elimina
                        </Button>
                    </View>
                </View>
            </Modal>
        </Portal>
    )
}

export default ModalConfirm