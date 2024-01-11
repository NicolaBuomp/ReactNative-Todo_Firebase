import { StyleSheet, Text, View, Switch, Pressable, Alert } from 'react-native'
import React, { useContext, useState } from 'react'
import { addDoc, collection } from 'firebase/firestore'
import { DB } from '../../firebaseConfig'
import { LoadingContext } from '../../context/LoadingContext'
import moment from 'moment'
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates'
import { Button, TextInput } from 'react-native-paper'

const CreateTodoScreen = ({ navigation }: any) => {
    const [todo, setTodo] = useState('')
    const [modeDatePicker, setModeDatePicker] = useState<any>();
    const [isEnabledDate, setIsEnabledDate] = useState(false);
    const [isEnabledDateHours, setIsEnabledDateHours] = useState(false);
    const [todoDate, setTodoDate] = useState<any>();
    const [todoTime, setTodoTime] = useState<any>(false);

    const loadingCtx = useContext(LoadingContext)

    const onDismissSingle = React.useCallback(() => {
        setIsEnabledDate(false);
    }, [setIsEnabledDate]);

    const onConfirmSingle = React.useCallback(
        (params: any) => {
            setIsEnabledDate(false);
            setTodoDate(params.date);
        },
        [setIsEnabledDate, setTodoDate]
    );

    const onDismissTime = React.useCallback(() => {
        setIsEnabledDateHours(false);
    }, [setIsEnabledDateHours]);

    const onConfirmTime = React.useCallback(
        (params: any) => {
            setIsEnabledDateHours(false);
            setTodoTime(params);
        },
        [setIsEnabledDateHours, setTodoTime]
    );

    const addTodo = async () => {
        loadingCtx.enableLoading()
        let date = todoDate ? todoTime ? moment(todoDate).set({ 'hour': todoTime.hours, 'minute': todoTime.minutes }).format() : moment(todoDate).format() : null

        const data = {
            title: todo,
            done: false,
            showTime: todoTime ? true : false,
            endDate: date
        }
        await addDoc(collection(DB, 'todos'), data).then(() => {
            navigation.navigate('list')
        }).catch((err) => {
            Alert.alert(err.code);
            console.log(err);
        }).finally(() => loadingCtx.disableLoading())
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                label='Aggiungi un promemoria'
                value={todo}
                onChangeText={(text) => setTodo(text)}
                mode='outlined'
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Button onPress={() => setIsEnabledDate(true)} mode='contained' >Data</Button>
                    <Text></Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Button disabled={!todoDate} onPress={() => setIsEnabledDateHours(true)} mode='contained'>Ora</Button>
                </View>
            </View>
            {isEnabledDate &&
                <DatePickerModal
                    locale="it"
                    mode="single"
                    visible={isEnabledDate}
                    onDismiss={onDismissSingle}
                    date={new Date()}
                    onConfirm={onConfirmSingle}
                    presentationStyle='pageSheet'
                    inputEnabled={false}
                    startYear={2024}
                    validRange={{ startDate: new Date() }}
                />
            }
            {isEnabledDateHours &&
                <TimePickerModal
                    visible={isEnabledDateHours}
                    onDismiss={onDismissTime}
                    onConfirm={onConfirmTime}
                />}
            <View style={styles.buttonContainer}>
                <Button onPress={addTodo} mode='contained-tonal'>Aggiungi</Button>
            </View>
        </View>
    )
}

export default CreateTodoScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 8,
        marginTop: 20
    },
    input: {
        marginBottom: 15
    },
    buttonContainer: {
        marginTop: 10,
    }
})