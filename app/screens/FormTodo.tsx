import { StyleSheet, Text, View, Platform, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates'
import { Button, TextInput } from 'react-native-paper'
import { useRoute } from '@react-navigation/native'
import { formatDateForDisplay, parseDate } from '../../util/functions'
import { useTheme } from '../../context/ThemeContext'
import { FirebaseService } from '../service/firebase.service'
import { useAuth } from '../hook/useAuth'




const FormTodo = ({ navigation }: any) => {
    const [todo, setTodo] = useState('')
    const [isEnabledDate, setIsEnabledDate] = useState(false);
    const [isEnabledDateHours, setIsEnabledDateHours] = useState(false);
    const [todoDate, setTodoDate] = useState<any>(null);
    const [todoTime, setTodoTime] = useState<any>(false);
    const [itemForUpdate, setItemForUpdate] = useState<any>();

    const { theme } = useTheme()
    const route: any = useRoute()

    const { user } = useAuth();

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
        let date = null;

        if (todoDate) {
            if (todoTime) {
                const updatedTodoDate = new Date(todoDate);
                updatedTodoDate.setHours(todoTime.hours);
                updatedTodoDate.setMinutes(todoTime.minutes);
                date = updatedTodoDate.toISOString();
            } else {
                date = new Date(todoDate).toISOString();
            }
        }

        const data = {
            title: todo,
            done: false,
            showTime: !!todoTime,
            endDate: date,
            userId: user?.uid
        };

        try {
            if (!itemForUpdate) {
                await firebaseService.postData('todos', data);
            } else {
                await firebaseService.putData('todos', itemForUpdate.id, data);
            }
        } catch (error: any) {
            Alert.alert('Errore', error.message || 'Si è verificato un errore durante l\'operazione.');
        } finally {
            navigation.navigate('todos');
        }
    };


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
                            todoDate ? (
                                <Text style={{ color: theme.colors.onBackground }}>
                                    {formatDateForDisplay(itemForUpdate ? itemForUpdate.endDate : todoDate)}
                                </Text>
                            ) : null
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