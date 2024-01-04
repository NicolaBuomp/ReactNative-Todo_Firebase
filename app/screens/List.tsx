import { View, Text, Button, StyleSheet, TextInput, ActivityIndicator, FlatList, TouchableOpacity, Alert, Keyboard, Pressable } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { FIREBASE_DB } from '../../firebaseConfig'
import { Entypo, MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

export interface TODO {
    title: string,
    done: boolean,
    id: string
}

const List = ({ navigation }: any) => {
    const [todos, setTodos] = useState<TODO[]>([])
    const [isModalVisible, setModalVisible] = useState(false);
    const [todo, setTodo] = useState('')
    const [loading, setLoading] = useState(false)
    const [update, setUpdate] = useState(false)
    const [selectedItem, setSelectedItem] = useState('')
    const [todoType, setTodoType] = useState('Tutti')

    const textInputRef = useRef<TextInput>(null);
    const bottomSheetModalRef = useRef<BottomSheet>(null);

    // variables
    const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);

    const openKeyboard = () => {
        if (textInputRef.current) {
            textInputRef.current.focus();
        }
    };
    useEffect(() => {
        const todoRef = collection(FIREBASE_DB, 'todos')

        const subscriber = onSnapshot(todoRef, {

            next: (snapshot) => {
                const todos: TODO[] = []
                snapshot.docs.forEach(doc => {
                    todos.push({
                        id: doc.id,
                        ...doc.data()
                    } as TODO)
                })
                setTodos(todos)
            }
        })


        return () => subscriber()
    }, [])

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
                    bottomSheetModalRef.current?.expand()
                    setUpdate(true)
                    setTodo(item.title)
                    setSelectedItem(item.id)
                    openKeyboard()
                    break;

                default:
                    break;
            }

        }

        return (
            <View style={styles.listItem}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Pressable onPress={() => onPress(item, 'done')}>
                        {item.done ? <MaterialIcons name="done" size={30} color="#38b338" /> : <Entypo name="circle" size={30} color="black" />}
                    </Pressable>
                    <Text style={{ fontSize: 18 }}>
                        {item.title}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Pressable onPress={() => onPress(item, 'edit')}><MaterialIcons name="edit" size={30} color="#4848ce" /></Pressable>
                    <Pressable onPress={() => onPress(item, 'delete')}><MaterialCommunityIcons name="delete-outline" size={30} color="#e43a3a" /></Pressable>
                </View>
            </View>)
    }


    const addTodo = async () => {
        setLoading(true)
        if (update && selectedItem) {
            let itemRef = doc(FIREBASE_DB, 'todos', selectedItem)
            await updateDoc(itemRef, { title: todo, done: false }).then(() => {
                setTodo('')
                Keyboard.dismiss()
                setLoading(false)
                setUpdate(false)
                bottomSheetModalRef.current?.collapse()
            })
        } else {
            await addDoc(collection(FIREBASE_DB, 'todos'), { title: todo, done: false }).then(() => {
                setTodo('')
                setLoading(false)
                Keyboard.dismiss()
                bottomSheetModalRef.current?.collapse()
            })
        }

    }

    return (
        <View style={styles.container}>
            <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', }}>Promemoria</Text>
                <Pressable><Ionicons name="settings-outline" size={24} color="black" /></Pressable>
            </View>

            <Text style={{ marginLeft: 3, fontSize: 16 }}>{todoType}</Text>
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
                index={0}
                backdropComponent={renderBackdrop}
                snapPoints={snapPoints}>
                <View style={styles.form}>
                    <TextInput ref={textInputRef} style={styles.input} placeholder='Aggiungi un promemoria' value={todo} onChangeText={(text: string) => setTodo(text)} />
                    {loading ? <ActivityIndicator /> : <Button onPress={addTodo} title={update ? 'Aggiorna' : 'Aggiungi'} />}
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
        marginTop: 30,
        margin: 10,
        flexDirection: 'row'
    },
    input: {
        flex: 1,
        marginRight: 10,
        padding: 10,
        height: 40,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#cccccc',
        backgroundColor: '#ccccc1'
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