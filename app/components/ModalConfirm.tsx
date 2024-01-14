import { Button, Modal, Portal } from 'react-native-paper';
import React, { useState } from 'react';
import { View, Text } from 'react-native';

const ModalConfirm = ({ visible, onDismiss, onConfirmDelete, text }: any) => {
    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss}>
                <View style={{ padding: 20, backgroundColor: 'white' }}>
                    <Text>{text}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
                        <Button mode="contained" onPress={onConfirmDelete} color="red">
                            Elimina
                        </Button>
                        <Button mode="outlined" onPress={onDismiss}>
                            Annulla
                        </Button>
                    </View>
                </View>
            </Modal>
        </Portal>
    )
}

export default ModalConfirm