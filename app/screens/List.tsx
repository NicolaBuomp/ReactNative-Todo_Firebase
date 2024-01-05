import { View, Text, Button, StyleSheet, TextInput, ActivityIndicator, FlatList, TouchableOpacity, Alert, Keyboard, Pressable, Switch } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore'
import { FIREBASE_DB } from '../../firebaseConfig'
import { Entypo, MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import DateTimePicker from 'react-native-ui-datepicker';
import moment from 'moment';

export interface TODO {
    title: string,
    done: boolean,
    id: string,
    date: any
}

const List = ({ navigation }: any) => {
    const [todos, setTodos] = useState<TODO[]>([])
    const [todo, setTodo] = useState('')
    const [todoDate, setTodoDate] = useState<any>(new Date());
    const [modeDatePicker, setModeDatePicker] = useState<any>();
    const [loading, setLoading] = useState(false)
    const [update, setUpdate] = useState(false)
    const [selectedItem, setSelectedItem] = useState('')
    const [todoType, setTodoType] = useState('Tutti')
    const [isEnabledDate, setIsEnabledDate] = useState(false);
    const [isEnabledDateHours, setIsEnabledDateHours] = useState(false);

    const toggleSwitch = (toggle: boolean, type: any) => {
        if (type === 'date') {
            if (toggle === false && isEnabledDateHours === true) {
                setIsEnabledDate(toggle)
                setIsEnabledDateHours(toggle)
            }
            if (toggle === true) {
                setModeDatePicker('date')
            }
            setIsEnabledDate(toggle)
        }
        if (type === 'hours' && toggle === true) {
            setIsEnabledDate(toggle)
            setIsEnabledDateHours(toggle)
            setModeDatePicker('datetime')

        } else if (type === 'hours' && !toggle) {
            setModeDatePicker('date')
            setIsEnabledDateHours(toggle)
        }
    };

    const formatMomentData = (dateInput: any) => {
        const momentDate = moment(dateInput);
        const today = moment().startOf('day');
        const tomorrow = moment().startOf('day').add(1, 'day');

        if (momentDate.isSame(today, 'day') || momentDate.isSame(tomorrow, 'day')) {
            // Data uguale a oggi o domani
            return (
                <Text style={{ fontSize: 14 }}>
                    {momentDate.calendar()}
                </Text>
            );
        } else if (momentDate.isBefore(today, 'day')) {
            // Data inferiore a oggi
            return (
                <Text style={{ fontSize: 14, color: '#fc4040' }}>
                    {momentDate.format('LLLL')}
                </Text>
            );
        } else {
            // Altrimenti, usa il formato di default
            return (
                <Text style={{ fontSize: 14 }}>
                    {momentDate.format('LLLL')}
                </Text>
            );
        }
    };

    const textInputRef = useRef<TextInput>(null);
    const bottomSheetModalRef = useRef<BottomSheet>(null);

    const snapPoints = useMemo(() => ['50%', '75%', '100%'], []);

    const resetForm = () => {
        Keyboard.dismiss()
        bottomSheetModalRef.current?.close()
        setLoading(false)
        setUpdate(false)
        setTodo('')
        setTodoDate(moment())
        toggleSwitch(false, 'date')
        setSelectedItem('')
    }

    useEffect(() => {
        const todoRef = collection(FIREBASE_DB, 'todos');

        const querys = query(
            todoRef,
            orderBy('date')  // Ordina per data crescente
        );

        const subscriber = onSnapshot(querys, {
            next: (snapshot) => {
                const todos: TODO[] = [];
                snapshot.docs.forEach(doc => {
                    todos.push({
                        id: doc.id,
                        ...doc.data()
                    } as TODO);
                });
                setTodos(todos);
            }
        });

        return () => subscriber();
    }, []);

    const renderBackdrop = useCallback((props: any) => <BottomSheetBackdrop apparsOnIndex={0} disappearsOnIndex={-1} {...props} />, [])

    const renderTodo = ({ item }: any) => {
        const onPress = async (item: any, typeAction: string) => {
            let itemRef = doc(FIREBASE_DB, 'todos', item.id)
            switch (typeAction) {
                case 'done':
                    await updateDoc(itemRef, { done: !item.done }).then(() => {
                        setLoading(false)
                    }).catch((err) => {
                        console.log(err);
                        setLoading(false)
                    })
                    break;

                case 'delete':
                    await deleteDoc(itemRef).then(() => {
                        setLoading(false)
                    }).catch((err) => {
                        console.log(err);
                        setLoading(false)
                    })
                    break;

                case 'edit':
                    if (item.date) {
                        setTodoDate(item.date)
                        toggleSwitch(true, 'date')
                        bottomSheetModalRef.current?.expand()
                    }
                    if (!item.date) {
                        bottomSheetModalRef.current?.snapToIndex(1)
                    }
                    setUpdate(true)
                    setTodo(item.title)
                    setSelectedItem(item.id)
                    break;

                default:
                    break;
            }

        }

        return (
            <View style={styles.listItem}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Pressable onPress={() => onPress(item, 'done')}>
                        {item.done ? <MaterialIcons name="done" size={30} color="#38b338" /> : <Entypo name="circle" size={30} color="black" />}
                    </Pressable>
                    <View>
                        <Text style={{ fontSize: 18 }}>
                            {item.title}
                        </Text>
                        {item.date &&
                            formatMomentData(item.date)
                        }
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Pressable onPress={() => onPress(item, 'edit')}><MaterialIcons name="edit" size={30} color="#4848ce" /></Pressable>
                    <Pressable onPress={() => onPress(item, 'delete')}><MaterialCommunityIcons name="delete-outline" size={30} color="#e43a3a" /></Pressable>
                </View>
            </View>)
    }

    const addTodo = () => {
        if (update && selectedItem) {
            let itemRef = doc(FIREBASE_DB, 'todos', selectedItem)
            updateDoc(itemRef, { title: todo, done: false, date: isEnabledDate ? moment(todoDate).format() : null }).then(() => {
                resetForm()
            })
        } else {
            addDoc(collection(FIREBASE_DB, 'todos'), { title: todo, done: false, date: isEnabledDate ? moment(todoDate).format() : null }).then(() => {
                resetForm()
            })
        }
    }

    return (
        <View style={styles.container}>
            {todos.length > 0 &&
                <FlatList
                    style={styles.list}
                    data={todos}
                    renderItem={renderTodo}
                    keyExtractor={(todo: TODO) => todo.id}
                />
            }

            <View style={{ marginBottom: 25 }}>
                <Button title='Aggiungi Promemoria' onPress={() => bottomSheetModalRef.current?.snapToIndex(1)} />
            </View>

            <BottomSheet
                ref={bottomSheetModalRef}
                enablePanDownToClose={true}
                index={-1}
                backdropComponent={renderBackdrop}
                snapPoints={snapPoints}
                onChange={(index) => {
                    if (index === 0) {
                        resetForm()
                    }
                }}>
                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder='Aggiungi un promemoria'
                        value={todo}
                        onChangeText={(text) => setTodo(text)}
                    />
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text>Data:</Text>
                            <Switch
                                trackColor={{ false: '#767577', true: '#81b0ff' }}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={(toggle) => toggleSwitch(toggle, 'date')}
                                value={isEnabledDate}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text>Data e Ora:</Text>
                            <Switch
                                trackColor={{ false: '#767577', true: '#81b0ff' }}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={(toggle) => toggleSwitch(toggle, 'hours')}
                                value={isEnabledDateHours}
                            />
                        </View>
                    </View>
                    {isEnabledDate &&
                        <DateTimePicker
                            value={todoDate}
                            onValueChange={(date) => setTodoDate(date)}
                            mode={modeDatePicker}
                        />
                    }
                    <Button onPress={addTodo} title={update ? 'Aggiorna' : 'Aggiungi'} />
                </View>
            </BottomSheet>
        </View>
    )
}

export default List

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 8,
        justifyContent: 'center',
    },
    form: {
        flex: 1,
        alignItems: 'center',
        margin: 10,
    },
    input: {
        width: '100%',
        padding: 10,
        height: 40,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#cccccc',
        backgroundColor: '#ccccc1',
        marginBottom: 15
    },
    list: {
        marginVertical: 10,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 7,
        paddingVertical: 15,
        marginVertical: 5,
        marginHorizontal: 2,
        borderRadius: 4,
        backgroundColor: '#e3e3e3'
    },
    itemText: {},
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});