import { StyleSheet, Text, View, Platform, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { AUTH, DB } from '../../firebaseConfig'
import { LoadingContext } from '../../context/LoadingContext'
import moment from 'moment'
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates'
import { Button, TextInput } from 'react-native-paper'
import { useRoute } from '@react-navigation/native'
import { parseDate } from '../../util/functions'
import { useTheme } from '../../context/ThemeContext'
import { FirebaseService } from '../service/firebase.service'




const FormTodo = ({ navigation }: any) => {
    const [todo, setTodo] = useState('')
    const [isEnabledDate, setIsEnabledDate] = useState(false);
    const [isEnabledDateHours, setIsEnabledDateHours] = useState(false);
    const [todoDate, setTodoDate] = useState<any>(null);
    const [todoTime, setTodoTime] = useState<any>(false);
    const [itemForUpdate, setItemForUpdate] = useState<any>();

    const { theme } = useTheme()
    const route: any = useRoute()

    const firebaseService = FirebaseService()

    useEffect(() => {
        if (route.params?.item) {
            let item = route.params?.item
            setItemForUpdate(item)
            setTodo(item.title)
            item.endDate ? setTodoDate(new Date(item.endDate)) : null
            item.showTime ? setTodoTime(parseDate(item.endDate)) : null
        }
    }, [])


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
        let date = todoDate ? todoTime ? moment(todoDate).set({ 'hour': todoTime.hours, 'minute': todoTime.minutes }).format() : moment(todoDate).format() : null

        const data = {
            title: todo,
            done: false,
            showTime: todoTime ? true : false,
            endDate: date,
            userId: AUTH.currentUser?.uid
        }

        if (!itemForUpdate) {
            await firebaseService.postData('todos', data)
            // await addDoc(collection(DB, 'todos'), data);
        } else {

        }

    }

    return (
        <View style={{ ...styles.container, backgroundColor: theme.colors.background }}>
            <View style={{ ...styles.container, backgroundColor: theme.colors.background }}>
                <TextInput
                    style={styles.input}
                    label='Aggiungi un promemoria'
                    value={todo}
                    onChangeText={(text) => setTodo(text)}
                    mode='outlined'
                />
                <View style={{ gap: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Button onPress={() => setIsEnabledDate(true)} mode='contained' >Data</Button>
                        {
                            todoDate ? <Text style={{ color: theme.colors.onBackground }}>{moment(itemForUpdate ? itemForUpdate.endDate : todoDate).format('LLLL')}</Text> : null
                        }

                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Button disabled={!todoDate} onPress={() => setIsEnabledDateHours(true)} mode='contained'>Ora</Button>
                        {
                            todoTime ? <Text style={{ color: theme.colors.onBackground }}>{`Alle ${todoTime.hours}:${todoTime.minutes}`}</Text> : null
                        }
                    </View>
                </View>
                {isEnabledDate &&
                    <DatePickerModal
                        locale="it"
                        mode="single"
                        visible={isEnabledDate}
                        onDismiss={onDismissSingle}
                        date={todoDate ? todoDate : new Date()}
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
                        hours={todoTime ? todoTime.hours : null}
                        minutes={todoTime ? todoTime.minutes : null}
                    />}

            </View>
            <View style={styles.buttonContainer}>
                <Button onPress={addTodo} mode='contained'>{itemForUpdate ? 'Aggiorna' : 'Aggiungi'}</Button>
            </View>
        </View>
    )
}

export default FormTodo

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 8,
        paddingTop: 20
    },
    input: {
        marginBottom: 15
    },
    buttonContainer: {
        paddingBottom: Platform.OS === 'ios' ? 50 : 20,
    }
})