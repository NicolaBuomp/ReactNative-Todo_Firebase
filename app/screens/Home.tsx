import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CustomPressable from '../../components/Pressable';

const HomeScreen = ({ navigation }: any) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>HOME</Text>
            <View style={styles.row}>
                <CustomPressable onPress={() => navigation.navigate('List')} style={styles.customPressable}>
                    Tutti
                </CustomPressable>
                <CustomPressable onPress={() => console.log('Pressable is pressed')} style={styles.customPressable}>
                    Oggi
                </CustomPressable>
                <CustomPressable onPress={() => console.log('Pressable is pressed')} style={styles.customPressable}>
                    In Programma
                </CustomPressable>
            </View>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
    },
    row: {
        gap: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between', // Allinea gli elementi con spaziatura uniforme
    },
    customPressable: {

    },
});
